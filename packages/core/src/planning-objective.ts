import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type PlanningObjectiveScope = "ARTIST" | "CAMPAIGN" | "RELEASE" | "EVERGREEN" | "CUSTOM";
export type PlanningObjectivePriority = "PRIMARY" | "SECONDARY";
export type PlanningObjectiveStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ARCHIVED";

export interface PlanningObjectiveReference {
  refType: string;
  refId: string;
}

export interface CreatePlanningObjectiveCommand {
  title: string;
  statement: string;
  periodStart: string;
  periodEnd: string;
  scope: PlanningObjectiveScope;
  campaignId?: string;
  releaseId?: string;
  priority: PlanningObjectivePriority;
  status?: "DRAFT" | "ACTIVE";
  successCriteria?: string[];
  relatedRefs?: PlanningObjectiveReference[];
}

export interface TransitionPlanningObjectiveCommand {
  objectiveId: string;
}

export type CompletePlanningObjectiveCommand = TransitionPlanningObjectiveCommand;
export type ActivatePlanningObjectiveCommand = TransitionPlanningObjectiveCommand;
export type CancelPlanningObjectiveCommand = TransitionPlanningObjectiveCommand;
export type ArchivePlanningObjectiveCommand = TransitionPlanningObjectiveCommand;

export interface PlanningObjectiveResult {
  objectiveId: string;
  status: PlanningObjectiveStatus;
  version: number;
  completedAt: Date | null;
}

export type PlanningObjectivePersistenceCode =
  | "PLANNING_OBJECTIVE_NOT_FOUND"
  | "PLANNING_OBJECTIVE_VERSION_CONFLICT"
  | "PLANNING_OBJECTIVE_PRIMARY_OVERLAP"
  | "PLANNING_OBJECTIVE_INVALID_TRANSITION"
  | "IDEMPOTENCY_IN_PROGRESS";

export class PlanningObjectivePersistenceError extends Error {
  constructor(public readonly code: PlanningObjectivePersistenceCode) {
    super(code);
    this.name = "PlanningObjectivePersistenceError";
  }
}

export interface PlanningObjectiveWritePort {
  createObjective(request: {
    artistId: string;
    objectiveId: string;
    command: CreatePlanningObjectiveCommand & { status: "DRAFT" | "ACTIVE"; successCriteria: string[]; relatedRefs: PlanningObjectiveReference[] };
    evidence: FoundationEvidence;
  }): Promise<PlanningObjectiveResult>;
  transitionObjective(request: {
    artistId: string;
    objectiveId: string;
    toStatus: PlanningObjectiveStatus;
    evidence: FoundationEvidence;
    expectedVersion?: number;
  }): Promise<PlanningObjectiveResult>;
}

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
const referenceSchema = z.object({
  refType: z.string().trim().min(1).max(120),
  refId: z.string().trim().min(1).max(240)
});
const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  statement: z.string().trim().min(1).max(2000),
  periodStart: z.string().regex(dateOnly, "periodStart must be YYYY-MM-DD"),
  periodEnd: z.string().regex(dateOnly, "periodEnd must be YYYY-MM-DD"),
  scope: z.enum(["ARTIST", "CAMPAIGN", "RELEASE", "EVERGREEN", "CUSTOM"]),
  campaignId: z.string().uuid().optional(),
  releaseId: z.string().uuid().optional(),
  priority: z.enum(["PRIMARY", "SECONDARY"]),
  status: z.enum(["DRAFT", "ACTIVE"]).default("ACTIVE"),
  successCriteria: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
  relatedRefs: z.array(referenceSchema).max(100).default([])
}).superRefine((value, ctx) => {
  if (value.periodStart > value.periodEnd) ctx.addIssue({ code: "custom", path: ["periodEnd"], message: "periodEnd must be on or after periodStart" });
  if (value.scope === "CAMPAIGN" && !value.campaignId) ctx.addIssue({ code: "custom", path: ["campaignId"], message: "campaignId is required for CAMPAIGN scope" });
  if (value.scope === "RELEASE" && !value.releaseId) ctx.addIssue({ code: "custom", path: ["releaseId"], message: "releaseId is required for RELEASE scope" });
  if (value.scope !== "CAMPAIGN" && value.campaignId) ctx.addIssue({ code: "custom", path: ["campaignId"], message: "campaignId is only valid for CAMPAIGN scope" });
  if (value.scope !== "RELEASE" && value.releaseId) ctx.addIssue({ code: "custom", path: ["releaseId"], message: "releaseId is only valid for RELEASE scope" });
});
const transitionSchema = z.object({ objectiveId: z.string().uuid() });
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
  return { status: "FORBIDDEN", code: "PLANNING_OBJECTIVE_USER_REQUIRED", message: "An authenticated user is required." };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof PlanningObjectivePersistenceError) {
    if (error.code === "PLANNING_OBJECTIVE_NOT_FOUND") return { status: "NOT_FOUND", code: error.code, message: "Planning Objective was not found." };
    return { status: "CONFLICT", code: error.code, message: "Planning Objective conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "PLANNING_OBJECTIVE_PERSISTENCE_FAILED", message: "Planning Objective could not be persisted.", retryable: true };
};

export class CreatePlanningObjectiveService {
  constructor(private readonly writer: PlanningObjectiveWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}

  async execute(command: CreatePlanningObjectiveCommand, context: CommandContext): Promise<CommandResult<PlanningObjectiveResult>> {
    const denied = requireUser<PlanningObjectiveResult>(context); if (denied) return denied;
    const parsed = createSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "PLANNING_OBJECTIVE_INVALID", message: "Planning Objective is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };

    if (parsed.data.scope === "CAMPAIGN" || parsed.data.scope === "RELEASE") {
      return {
        status: "BLOCKED",
        code: "PLANNING_OBJECTIVE_TARGET_UNAVAILABLE",
        message: `${parsed.data.scope === "CAMPAIGN" ? "Campaign" : "Release"}-scoped objectives are blocked until the canonical target domain can verify ownership.`
      };
    }

    const normalized: CreatePlanningObjectiveCommand & { status: "DRAFT" | "ACTIVE"; successCriteria: string[]; relatedRefs: PlanningObjectiveReference[] } = {
      title: parsed.data.title,
      statement: parsed.data.statement,
      periodStart: parsed.data.periodStart,
      periodEnd: parsed.data.periodEnd,
      scope: parsed.data.scope,
      priority: parsed.data.priority,
      status: parsed.data.status,
      successCriteria: parsed.data.successCriteria,
      relatedRefs: parsed.data.relatedRefs,
      ...(parsed.data.campaignId ? { campaignId: parsed.data.campaignId } : {}),
      ...(parsed.data.releaseId ? { releaseId: parsed.data.releaseId } : {})
    };
    try {
      return { status: "SUCCESS", data: await this.writer.createObjective({ artistId: context.artistId, objectiveId: this.idFactory(), command: normalized, evidence: evidenceFrom(context) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

abstract class TransitionPlanningObjectiveService {
  protected abstract readonly targetStatus: PlanningObjectiveStatus;
  constructor(protected readonly writer: PlanningObjectiveWritePort) {}

  async execute(command: TransitionPlanningObjectiveCommand, context: CommandContext): Promise<CommandResult<PlanningObjectiveResult>> {
    const denied = requireUser<PlanningObjectiveResult>(context); if (denied) return denied;
    const parsed = transitionSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "PLANNING_OBJECTIVE_TRANSITION_INVALID", message: "Planning Objective transition request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      return {
        status: "SUCCESS",
        data: await this.writer.transitionObjective({
          artistId: context.artistId,
          objectiveId: parsed.data.objectiveId,
          toStatus: this.targetStatus,
          evidence: evidenceFrom(context),
          ...(context.expectedVersion !== undefined ? { expectedVersion: context.expectedVersion } : {})
        })
      };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class ActivatePlanningObjectiveService extends TransitionPlanningObjectiveService {
  protected readonly targetStatus = "ACTIVE" as const;
}

export class CompletePlanningObjectiveService extends TransitionPlanningObjectiveService {
  protected readonly targetStatus = "COMPLETED" as const;
}

export class CancelPlanningObjectiveService extends TransitionPlanningObjectiveService {
  protected readonly targetStatus = "CANCELLED" as const;
}

export class ArchivePlanningObjectiveService extends TransitionPlanningObjectiveService {
  protected readonly targetStatus = "ARCHIVED" as const;
}
