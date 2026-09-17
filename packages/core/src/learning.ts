import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type LearningStatus = "CANDIDATE" | "TESTING" | "VALIDATED" | "STALE" | "DEPRECATED";
export type LearningScope =
  | "ARTIST_GLOBAL"
  | "PLATFORM"
  | "SONG"
  | "PILLAR"
  | "FORMAT"
  | "AUDIENCE"
  | "CAMPAIGN"
  | "AUDIO_SEGMENT"
  | "NARRATIVE"
  | "MARKET"
  | "BUSINESS"
  | "IDENTITY";
export type LearningConfidence = "LOW" | "MEDIUM" | "HIGH";
export type LearningReferenceRelation = "SUPPORTS" | "CONTRADICTS" | "SUBJECT" | "CONTEXT" | "DERIVED_FROM";

export interface LearningReferenceInput {
  refType: string;
  refId: string;
  relation: LearningReferenceRelation;
  note?: string;
}

export interface CreateLearningCommand {
  statement: string;
  scope: LearningScope;
  confidence: LearningConfidence;
  confidenceRationale: string;
  references: LearningReferenceInput[];
  freshUntil?: string;
}

export interface TransitionLearningCommand {
  learningId: string;
  rationale?: string;
}

export interface LearningResult {
  learningId: string;
  status: LearningStatus;
  version: number;
}

export type LearningPersistenceCode =
  | "LEARNING_NOT_FOUND"
  | "LEARNING_VERSION_CONFLICT"
  | "LEARNING_INVALID_TRANSITION"
  | "IDEMPOTENCY_IN_PROGRESS";

export class LearningPersistenceError extends Error {
  constructor(public readonly code: LearningPersistenceCode) {
    super(code);
    this.name = "LearningPersistenceError";
  }
}

export interface LearningWritePort {
  createLearning(request: {
    artistId: string;
    learningId: string;
    command: CreateLearningCommand;
    evidence: FoundationEvidence;
  }): Promise<LearningResult>;
  transitionLearning(request: {
    artistId: string;
    learningId: string;
    toStatus: LearningStatus;
    rationale?: string;
    expectedVersion?: number;
    evidence: FoundationEvidence;
  }): Promise<LearningResult>;
}

const referenceSchema = z.object({
  refType: z.string().trim().min(1).max(120),
  refId: z.string().trim().min(1).max(240),
  relation: z.enum(["SUPPORTS", "CONTRADICTS", "SUBJECT", "CONTEXT", "DERIVED_FROM"]),
  note: z.string().trim().min(1).max(2000).optional()
});

const createSchema = z.object({
  statement: z.string().trim().min(1).max(6000),
  scope: z.enum(["ARTIST_GLOBAL", "PLATFORM", "SONG", "PILLAR", "FORMAT", "AUDIENCE", "CAMPAIGN", "AUDIO_SEGMENT", "NARRATIVE", "MARKET", "BUSINESS", "IDENTITY"]),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
  confidenceRationale: z.string().trim().min(1).max(4000),
  references: z.array(referenceSchema).min(1, "At least one provenance reference is required.").max(100),
  freshUntil: z.string().datetime({ offset: true }).optional()
}).superRefine((value, ctx) => {
  if (!value.references.some((reference) => reference.relation === "SUPPORTS" || reference.relation === "DERIVED_FROM")) {
    ctx.addIssue({ code: "custom", path: ["references"], message: "At least one supporting or derived-from reference is required." });
  }
});

const transitionSchema = z.object({
  learningId: z.string().uuid(),
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

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof LearningPersistenceError) {
    if (error.code === "LEARNING_NOT_FOUND") return { status: "NOT_FOUND", code: error.code, message: "Learning was not found." };
    return { status: "CONFLICT", code: error.code, message: "Learning conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "LEARNING_PERSISTENCE_FAILED", message: "Learning could not be persisted.", retryable: true };
};

export class CreateLearningService {
  constructor(private readonly writer: LearningWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}

  async execute(command: CreateLearningCommand, context: CommandContext): Promise<CommandResult<LearningResult>> {
    const parsed = createSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "LEARNING_INVALID", message: "Learning is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    const normalized: CreateLearningCommand = {
      statement: parsed.data.statement,
      scope: parsed.data.scope,
      confidence: parsed.data.confidence,
      confidenceRationale: parsed.data.confidenceRationale,
      references: parsed.data.references,
      ...(parsed.data.freshUntil ? { freshUntil: parsed.data.freshUntil } : {})
    };
    try {
      return { status: "SUCCESS", data: await this.writer.createLearning({ artistId: context.artistId, learningId: this.idFactory(), command: normalized, evidence: evidenceFrom(context) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

abstract class TransitionLearningService {
  protected abstract readonly targetStatus: LearningStatus;
  protected readonly rationaleRequired: boolean = false;
  protected readonly userRequired: boolean = false;

  constructor(protected readonly writer: LearningWritePort) {}

  async execute(command: TransitionLearningCommand, context: CommandContext): Promise<CommandResult<LearningResult>> {
    const parsed = transitionSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "LEARNING_TRANSITION_INVALID", message: "Learning transition is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    if (this.userRequired && (context.actor.type !== "USER" || !context.actor.id)) {
      return { status: "FORBIDDEN", code: "LEARNING_HUMAN_APPROVAL_REQUIRED", message: "This Learning transition requires explicit human approval." };
    }
    if (this.rationaleRequired && !parsed.data.rationale) {
      return { status: "VALIDATION_ERROR", code: "LEARNING_RATIONALE_REQUIRED", message: "A rationale is required for this Learning transition.", fieldErrors: { rationale: "Rationale is required." } };
    }
    try {
      return {
        status: "SUCCESS",
        data: await this.writer.transitionLearning({
          artistId: context.artistId,
          learningId: parsed.data.learningId,
          toStatus: this.targetStatus,
          ...(parsed.data.rationale ? { rationale: parsed.data.rationale } : {}),
          ...(context.expectedVersion !== undefined ? { expectedVersion: context.expectedVersion } : {}),
          evidence: evidenceFrom(context)
        })
      };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class StartLearningTestService extends TransitionLearningService {
  protected readonly targetStatus = "TESTING" as const;
}

export class ValidateLearningService extends TransitionLearningService {
  protected readonly targetStatus = "VALIDATED" as const;
  protected override readonly userRequired = true;
  protected override readonly rationaleRequired = true;
}

export class MarkLearningStaleService extends TransitionLearningService {
  protected readonly targetStatus = "STALE" as const;
  protected override readonly rationaleRequired = true;
}

export class DeprecateLearningService extends TransitionLearningService {
  protected readonly targetStatus = "DEPRECATED" as const;
  protected override readonly userRequired = true;
  protected override readonly rationaleRequired = true;
}
