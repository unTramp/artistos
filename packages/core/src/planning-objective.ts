import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type PlanningObjectiveScope = "ARTIST" | "CAMPAIGN" | "RELEASE" | "EVERGREEN" | "CUSTOM";
export type PlanningObjectivePriority = "PRIMARY" | "SECONDARY";

export interface CreatePlanningObjectiveCommand {
  title: string;
  statement: string;
  periodStart: string;
  periodEnd: string;
  scope: PlanningObjectiveScope;
  campaignId?: string;
  releaseId?: string;
  priority: PlanningObjectivePriority;
}

export interface CompletePlanningObjectiveCommand {
  objectiveId: string;
}

export interface PlanningObjectiveResult {
  objectiveId: string;
  version: number;
  completedAt: Date | null;
}

export type PlanningObjectivePersistenceCode =
  | "PLANNING_OBJECTIVE_NOT_FOUND"
  | "PLANNING_OBJECTIVE_VERSION_CONFLICT"
  | "PLANNING_OBJECTIVE_PRIMARY_OVERLAP"
  | "PLANNING_OBJECTIVE_ALREADY_COMPLETED"
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
    command: CreatePlanningObjectiveCommand;
    evidence: FoundationEvidence;
  }): Promise<PlanningObjectiveResult>;
  completeObjective(request: {
    artistId: string;
    objectiveId: string;
    evidence: FoundationEvidence;
    expectedVersion?: number;
  }): Promise<PlanningObjectiveResult>;
}

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  statement: z.string().trim().min(1).max(2000),
  periodStart: z.string().regex(dateOnly, "periodStart must be YYYY-MM-DD"),
  periodEnd: z.string().regex(dateOnly, "periodEnd must be YYYY-MM-DD"),
  scope: z.enum(["ARTIST", "CAMPAIGN", "RELEASE", "EVERGREEN", "CUSTOM"]),
  campaignId: z.string().uuid().optional(),
  releaseId: z.string().uuid().optional(),
  priority: z.enum(["PRIMARY", "SECONDARY"])
}).superRefine((value, ctx) => {
  if (value.periodStart > value.periodEnd) ctx.addIssue({ code: "custom", path: ["periodEnd"], message: "periodEnd must be on or after periodStart" });
  if (value.scope === "CAMPAIGN" && !value.campaignId) ctx.addIssue({ code: "custom", path: ["campaignId"], message: "campaignId is required for CAMPAIGN scope" });
  if (value.scope === "RELEASE" && !value.releaseId) ctx.addIssue({ code: "custom", path: ["releaseId"], message: "releaseId is required for RELEASE scope" });
  if (value.scope !== "CAMPAIGN" && value.campaignId) ctx.addIssue({ code: "custom", path: ["campaignId"], message: "campaignId is only valid for CAMPAIGN scope" });
  if (value.scope !== "RELEASE" && value.releaseId) ctx.addIssue({ code: "custom", path: ["releaseId"], message: "releaseId is only valid for RELEASE scope" });
});
const completeSchema = z.object({ objectiveId: z.string().uuid() });
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
    try {
      return { status: "SUCCESS", data: await this.writer.createObjective({ artistId: context.artistId, objectiveId: this.idFactory(), command: parsed.data, evidence: evidenceFrom(context) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class CompletePlanningObjectiveService {
  constructor(private readonly writer: PlanningObjectiveWritePort) {}

  async execute(command: CompletePlanningObjectiveCommand, context: CommandContext): Promise<CommandResult<PlanningObjectiveResult>> {
    const denied = requireUser<PlanningObjectiveResult>(context); if (denied) return denied;
    const parsed = completeSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "PLANNING_OBJECTIVE_COMPLETE_INVALID", message: "Completion request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      return { status: "SUCCESS", data: await this.writer.completeObjective({ artistId: context.artistId, objectiveId: parsed.data.objectiveId, evidence: evidenceFrom(context), ...(context.expectedVersion !== undefined ? { expectedVersion: context.expectedVersion } : {}) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}
