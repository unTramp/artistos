import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type DecisionStatus = "ACTIVE" | "UNDER_REVIEW" | "REVERSED" | "EXPIRED";

export interface CreateDecisionCommand {
  title: string;
  decision: string;
  reason: string;
  evidenceIds?: string[];
  experimentIds?: string[];
  scope: string;
  reviewAt?: string;
}

export interface DecisionTransitionCommand {
  decisionId: string;
  rationale?: string;
}

export interface DecisionResult {
  decisionId: string;
  status: DecisionStatus;
  version: number;
}

export interface DecisionReferenceValidationPort {
  validateReferences(input: {
    artistId: string;
    evidenceIds: string[];
    experimentIds: string[];
  }): Promise<{ missingEvidenceIds: string[]; missingExperimentIds: string[] }>;
}

export type DecisionPersistenceCode =
  | "DECISION_NOT_FOUND"
  | "DECISION_VERSION_CONFLICT"
  | "DECISION_INVALID_TRANSITION"
  | "IDEMPOTENCY_IN_PROGRESS";

export class DecisionPersistenceError extends Error {
  constructor(public readonly code: DecisionPersistenceCode) {
    super(code);
    this.name = "DecisionPersistenceError";
  }
}

export interface DecisionWritePort {
  createDecision(request: {
    artistId: string;
    decisionId: string;
    command: CreateDecisionCommand;
    evidence: FoundationEvidence;
  }): Promise<DecisionResult>;
  transitionDecision(request: {
    artistId: string;
    decisionId: string;
    toStatus: DecisionStatus;
    rationale?: string;
    expectedVersion?: number;
    evidence: FoundationEvidence;
  }): Promise<DecisionResult>;
}

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  decision: z.string().trim().min(1).max(4000),
  reason: z.string().trim().min(1).max(6000),
  evidenceIds: z.array(z.string().uuid()).max(50).optional(),
  experimentIds: z.array(z.string().uuid()).max(50).optional(),
  scope: z.string().trim().min(1).max(120),
  reviewAt: z.string().datetime({ offset: true }).optional()
});

const transitionSchema = z.object({
  decisionId: z.string().uuid(),
  rationale: z.string().trim().min(1).max(4000).optional()
});

const fieldErrors = (issues: z.ZodIssue[]) => Object.fromEntries(issues.map((issue) => [issue.path.join(".") || "form", issue.message]));

const evidenceFrom = (context: CommandContext): FoundationEvidence => ({
  actorType: context.actor.type,
  ...(context.actor.id ? { actorId: context.actor.id } : {}),
  commandId: context.commandId,
  traceId: context.traceId,
  occurredAt: context.requestedAt,
  ...(context.idempotencyKey ? { idempotencyKey: context.idempotencyKey } : {})
});

const requireUser = <T>(context: CommandContext): CommandResult<T> | null => {
  if (context.actor.type === "USER" && context.actor.id) return null;
  return { status: "FORBIDDEN", code: "DECISION_USER_REQUIRED", message: "An authenticated user is required for Decision Memory mutations." };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof DecisionPersistenceError) {
    if (error.code === "DECISION_NOT_FOUND") return { status: "NOT_FOUND", code: error.code, message: "Decision was not found." };
    return { status: "CONFLICT", code: error.code, message: "Decision conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "DECISION_PERSISTENCE_FAILED", message: "Decision could not be persisted.", retryable: true };
};

export class CreateDecisionService {
  constructor(
    private readonly writer: DecisionWritePort,
    private readonly referenceValidator?: DecisionReferenceValidationPort,
    private readonly idFactory = () => globalThis.crypto.randomUUID()
  ) {}

  async execute(command: CreateDecisionCommand, context: CommandContext): Promise<CommandResult<DecisionResult>> {
    const denied = requireUser<DecisionResult>(context); if (denied) return denied;
    const parsed = createSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "DECISION_INVALID", message: "Decision is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };

    const evidenceIds = parsed.data.evidenceIds ?? [];
    const experimentIds = parsed.data.experimentIds ?? [];
    if ((evidenceIds.length > 0 || experimentIds.length > 0) && !this.referenceValidator) {
      return {
        status: "BLOCKED",
        code: "DECISION_REFERENCE_VALIDATION_UNAVAILABLE",
        message: "Decision evidence/experiment links cannot be accepted until their canonical reference validator is available."
      };
    }
    if (this.referenceValidator) {
      const missing = await this.referenceValidator.validateReferences({ artistId: context.artistId, evidenceIds, experimentIds });
      if (missing.missingEvidenceIds.length > 0 || missing.missingExperimentIds.length > 0) {
        return {
          status: "VALIDATION_ERROR",
          code: "DECISION_REFERENCE_NOT_FOUND",
          message: "One or more Decision evidence/experiment links do not exist in the artist scope.",
          fieldErrors: {
            ...(missing.missingEvidenceIds.length ? { evidenceIds: `Unknown evidence ids: ${missing.missingEvidenceIds.join(", ")}` } : {}),
            ...(missing.missingExperimentIds.length ? { experimentIds: `Unknown experiment ids: ${missing.missingExperimentIds.join(", ")}` } : {})
          }
        };
      }
    }

    const normalized: CreateDecisionCommand = {
      title: parsed.data.title,
      decision: parsed.data.decision,
      reason: parsed.data.reason,
      scope: parsed.data.scope,
      ...(evidenceIds.length ? { evidenceIds } : {}),
      ...(experimentIds.length ? { experimentIds } : {}),
      ...(parsed.data.reviewAt ? { reviewAt: parsed.data.reviewAt } : {})
    };

    try {
      return { status: "SUCCESS", data: await this.writer.createDecision({ artistId: context.artistId, decisionId: this.idFactory(), command: normalized, evidence: evidenceFrom(context) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

abstract class TransitionDecisionService {
  protected abstract readonly targetStatus: DecisionStatus;
  protected readonly rationaleRequired = false;

  constructor(protected readonly writer: DecisionWritePort) {}

  async execute(command: DecisionTransitionCommand, context: CommandContext): Promise<CommandResult<DecisionResult>> {
    const denied = requireUser<DecisionResult>(context); if (denied) return denied;
    const parsed = transitionSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "DECISION_TRANSITION_INVALID", message: "Decision transition is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    if (this.rationaleRequired && !parsed.data.rationale) {
      return { status: "VALIDATION_ERROR", code: "DECISION_RATIONALE_REQUIRED", message: "A rationale is required for this Decision transition.", fieldErrors: { rationale: "Rationale is required." } };
    }
    try {
      return {
        status: "SUCCESS",
        data: await this.writer.transitionDecision({
          artistId: context.artistId,
          decisionId: parsed.data.decisionId,
          toStatus: this.targetStatus,
          ...(parsed.data.rationale ? { rationale: parsed.data.rationale } : {}),
          ...(context.expectedVersion !== undefined ? { expectedVersion: context.expectedVersion } : {}),
          evidence: evidenceFrom(context)
        })
      };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class MarkDecisionUnderReviewService extends TransitionDecisionService {
  protected readonly targetStatus = "UNDER_REVIEW" as const;
}

export class ReactivateDecisionService extends TransitionDecisionService {
  protected readonly targetStatus = "ACTIVE" as const;
}

export class ReverseDecisionService extends TransitionDecisionService {
  protected readonly targetStatus = "REVERSED" as const;
  protected override readonly rationaleRequired = true;
}

export class ExpireDecisionService extends TransitionDecisionService {
  protected readonly targetStatus = "EXPIRED" as const;
  protected override readonly rationaleRequired = true;
}
