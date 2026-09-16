import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type OperationalActionStatus = "OPEN" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "SKIPPED" | "EXPIRED";
export type OperationalActionPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type OperationalActionExecutionMode = "MANUAL_NATIVE" | "EXTERNAL" | "API_ASSISTED" | "SYSTEM_CHECK";

export interface CreateOperationalActionCommand {
  sourceDomain: string;
  sourceEntityType: string;
  sourceEntityId: string;
  platform?: string;
  title: string;
  description?: string;
  actionType: string;
  priority?: OperationalActionPriority;
  dueAt?: string;
  notBefore?: string;
  executionMode: OperationalActionExecutionMode;
  externalUrl?: string;
  evidenceRef?: string;
}

export interface StartOperationalActionCommand { actionId: string; }
export interface BlockOperationalActionCommand { actionId: string; reason: string; }
export interface CompleteOperationalActionCommand { actionId: string; evidenceRef?: string; }
export interface SkipOperationalActionCommand { actionId: string; reason: string; }
export interface ExpireOperationalActionCommand { actionId: string; reason?: string; }
export interface ReopenOperationalActionCommand { actionId: string; reason: string; }

export interface OperationalActionResult {
  actionId: string;
  status: OperationalActionStatus;
  version: number;
  completedAt: Date | null;
}

export type OperationalActionPersistenceCode =
  | "OPERATIONAL_ACTION_NOT_FOUND"
  | "OPERATIONAL_ACTION_INVALID_TRANSITION"
  | "OPERATIONAL_ACTION_VERSION_CONFLICT"
  | "OPERATIONAL_ACTION_COMPLETION_EVIDENCE_REQUIRED"
  | "IDEMPOTENCY_IN_PROGRESS";

export class OperationalActionPersistenceError extends Error {
  constructor(public readonly code: OperationalActionPersistenceCode) {
    super(code);
    this.name = "OperationalActionPersistenceError";
  }
}

export interface OperationalActionWritePort {
  createAction(request: {
    artistId: string;
    actionId: string;
    command: CreateOperationalActionCommand;
    evidence: FoundationEvidence;
    expectedVersion?: number;
  }): Promise<OperationalActionResult>;
  transitionAction(request: {
    artistId: string;
    actionId: string;
    toStatus: OperationalActionStatus;
    reason?: string;
    completionEvidenceRef?: string;
    evidence: FoundationEvidence;
    expectedVersion?: number;
  }): Promise<OperationalActionResult>;
}

const compact = z.string().trim().min(1).max(500);
const longText = z.string().trim().min(1).max(4000);
const createSchema = z.object({
  sourceDomain: compact,
  sourceEntityType: compact,
  sourceEntityId: compact,
  platform: compact.optional(),
  title: z.string().trim().min(1).max(240),
  description: longText.optional(),
  actionType: compact,
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  dueAt: z.string().datetime({ offset: true }).optional(),
  notBefore: z.string().datetime({ offset: true }).optional(),
  executionMode: z.enum(["MANUAL_NATIVE", "EXTERNAL", "API_ASSISTED", "SYSTEM_CHECK"]),
  externalUrl: z.string().url().max(2000).optional(),
  evidenceRef: compact.optional()
}).refine((value) => !value.dueAt || !value.notBefore || new Date(value.notBefore) <= new Date(value.dueAt), {
  message: "notBefore must be before or equal to dueAt.",
  path: ["notBefore"]
});

const actionIdSchema = z.object({ actionId: z.string().uuid() });
const reasonSchema = z.object({ actionId: z.string().uuid(), reason: z.string().trim().min(1).max(2000) });
const completeSchema = z.object({ actionId: z.string().uuid(), evidenceRef: compact.optional() });
const expireSchema = z.object({ actionId: z.string().uuid(), reason: z.string().trim().min(1).max(2000).optional() });

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
  return { status: "FORBIDDEN", code: "OPERATIONAL_ACTION_USER_REQUIRED", message: "An authenticated user is required for this operation." };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof OperationalActionPersistenceError) {
    if (error.code === "OPERATIONAL_ACTION_NOT_FOUND") return { status: "NOT_FOUND", code: error.code, message: "Operational Action was not found." };
    if (error.code === "OPERATIONAL_ACTION_COMPLETION_EVIDENCE_REQUIRED") return { status: "BLOCKED", code: error.code, message: "Completion requires user confirmation or verifiable evidence." };
    return { status: "CONFLICT", code: error.code, message: "The requested Operational Action transition conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "OPERATIONAL_ACTION_PERSISTENCE_FAILED", message: "Operational Action state could not be persisted.", retryable: true };
};

export class CreateOperationalActionService {
  constructor(private readonly writer: OperationalActionWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateOperationalActionCommand, context: CommandContext): Promise<CommandResult<OperationalActionResult>> {
    const denied = requireUser<OperationalActionResult>(context); if (denied) return denied;
    const parsed = createSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "OPERATIONAL_ACTION_INVALID", message: "Operational Action is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    const data: CreateOperationalActionCommand = {
      sourceDomain: parsed.data.sourceDomain,
      sourceEntityType: parsed.data.sourceEntityType,
      sourceEntityId: parsed.data.sourceEntityId,
      title: parsed.data.title,
      actionType: parsed.data.actionType,
      priority: parsed.data.priority,
      executionMode: parsed.data.executionMode,
      ...(parsed.data.platform ? { platform: parsed.data.platform } : {}),
      ...(parsed.data.description ? { description: parsed.data.description } : {}),
      ...(parsed.data.dueAt ? { dueAt: parsed.data.dueAt } : {}),
      ...(parsed.data.notBefore ? { notBefore: parsed.data.notBefore } : {}),
      ...(parsed.data.externalUrl ? { externalUrl: parsed.data.externalUrl } : {}),
      ...(parsed.data.evidenceRef ? { evidenceRef: parsed.data.evidenceRef } : {})
    };
    try {
      return { status: "SUCCESS", data: await this.writer.createAction({ artistId: context.artistId, actionId: this.idFactory(), command: data, evidence: evidenceFrom(context), ...(context.expectedVersion !== undefined ? { expectedVersion: context.expectedVersion } : {}) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

abstract class TransitionOperationalActionService<T> {
  constructor(protected readonly writer: OperationalActionWritePort) {}
  protected async transition(actionId: string, toStatus: OperationalActionStatus, context: CommandContext, options: { reason?: string; completionEvidenceRef?: string } = {}): Promise<CommandResult<OperationalActionResult>> {
    try {
      return { status: "SUCCESS", data: await this.writer.transitionAction({ artistId: context.artistId, actionId, toStatus, ...options, evidence: evidenceFrom(context), ...(context.expectedVersion !== undefined ? { expectedVersion: context.expectedVersion } : {}) }) };
    } catch (error) { return mapPersistenceError(error); }
  }
  abstract execute(command: T, context: CommandContext): Promise<CommandResult<OperationalActionResult>>;
}

export class StartOperationalActionService extends TransitionOperationalActionService<StartOperationalActionCommand> {
  async execute(command: StartOperationalActionCommand, context: CommandContext) {
    const denied = requireUser<OperationalActionResult>(context); if (denied) return denied;
    const parsed = actionIdSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR" as const, code: "OPERATIONAL_ACTION_START_INVALID", message: "Start request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    return this.transition(parsed.data.actionId, "IN_PROGRESS", context);
  }
}

export class BlockOperationalActionService extends TransitionOperationalActionService<BlockOperationalActionCommand> {
  async execute(command: BlockOperationalActionCommand, context: CommandContext) {
    const denied = requireUser<OperationalActionResult>(context); if (denied) return denied;
    const parsed = reasonSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR" as const, code: "OPERATIONAL_ACTION_BLOCK_INVALID", message: "Block request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    return this.transition(parsed.data.actionId, "BLOCKED", context, { reason: parsed.data.reason });
  }
}

export class CompleteOperationalActionService extends TransitionOperationalActionService<CompleteOperationalActionCommand> {
  async execute(command: CompleteOperationalActionCommand, context: CommandContext) {
    const parsed = completeSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR" as const, code: "OPERATIONAL_ACTION_COMPLETE_INVALID", message: "Completion request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    if (context.actor.type !== "USER" && !parsed.data.evidenceRef) return { status: "BLOCKED" as const, code: "OPERATIONAL_ACTION_COMPLETION_EVIDENCE_REQUIRED", message: "Non-user completion requires verifiable evidence." };
    if (context.actor.type === "USER" && !context.actor.id) return { status: "FORBIDDEN" as const, code: "OPERATIONAL_ACTION_USER_REQUIRED", message: "Authenticated user confirmation is required." };
    return this.transition(parsed.data.actionId, "DONE", context, parsed.data.evidenceRef ? { completionEvidenceRef: parsed.data.evidenceRef } : {});
  }
}

export class SkipOperationalActionService extends TransitionOperationalActionService<SkipOperationalActionCommand> {
  async execute(command: SkipOperationalActionCommand, context: CommandContext) {
    const denied = requireUser<OperationalActionResult>(context); if (denied) return denied;
    const parsed = reasonSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR" as const, code: "OPERATIONAL_ACTION_SKIP_INVALID", message: "Skip request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    return this.transition(parsed.data.actionId, "SKIPPED", context, { reason: parsed.data.reason });
  }
}

export class ExpireOperationalActionService extends TransitionOperationalActionService<ExpireOperationalActionCommand> {
  async execute(command: ExpireOperationalActionCommand, context: CommandContext) {
    const parsed = expireSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR" as const, code: "OPERATIONAL_ACTION_EXPIRE_INVALID", message: "Expire request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    if (!["USER", "SYSTEM", "WORKER"].includes(context.actor.type)) return { status: "FORBIDDEN" as const, code: "OPERATIONAL_ACTION_EXPIRY_FORBIDDEN", message: "This actor cannot expire Operational Actions." };
    return this.transition(parsed.data.actionId, "EXPIRED", context, parsed.data.reason ? { reason: parsed.data.reason } : {});
  }
}

export class ReopenOperationalActionService extends TransitionOperationalActionService<ReopenOperationalActionCommand> {
  async execute(command: ReopenOperationalActionCommand, context: CommandContext) {
    const denied = requireUser<OperationalActionResult>(context); if (denied) return denied;
    const parsed = reasonSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR" as const, code: "OPERATIONAL_ACTION_REOPEN_INVALID", message: "Reopen request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    return this.transition(parsed.data.actionId, "OPEN", context, { reason: parsed.data.reason });
  }
}
