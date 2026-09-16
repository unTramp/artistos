import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type ProductionIntent = "AUTHENTIC" | "CASUAL" | "POLISHED" | "CINEMATIC" | "EXPERIMENTAL";
export type ContentExecutionRevisionStatus = "DRAFT" | "APPROVED" | "REJECTED" | "SUPERSEDED";
export type ContentExecutionSourceType = "MANUAL" | "AI_PROPOSAL";

export interface ExecutionShotInstruction {
  sequence: number;
  instruction: string;
}

export interface ExecutionPlatformNote {
  platform: string;
  note: string;
}

export interface ContentExecutionSnapshot {
  schemaVersion: 1;
  format: string;
  productionIntent: ProductionIntent;
  hookType?: string;
  hookText?: string;
  structure: string;
  scriptOrPerformanceConcept: string;
  shotList: ExecutionShotInstruction[];
  editBrief: string;
  caption?: string;
  cta?: string;
  platformNotes: ExecutionPlatformNote[];
  feasibilityNotes: string;
  fallbackPlan?: string;
  rightsStatus: "UNKNOWN";
}

export interface CreateContentExecutionRevisionCommand {
  contentUnitId: string;
  format: string;
  productionIntent: ProductionIntent;
  hookType?: string;
  hookText?: string;
  structure: string;
  scriptOrPerformanceConcept: string;
  shotList: ExecutionShotInstruction[];
  editBrief: string;
  caption?: string;
  cta?: string;
  platformNotes: ExecutionPlatformNote[];
  feasibilityNotes: string;
  fallbackPlan?: string;
}

export interface ReviewContentExecutionRevisionCommand {
  revisionId: string;
}

export interface RejectContentExecutionRevisionCommand {
  revisionId: string;
  reason: string;
}

export interface ContentExecutionRevisionResult {
  revisionId: string;
  contentUnitId: string;
  revisionNumber: number;
  status: ContentExecutionRevisionStatus;
}

export type ContentExecutionPersistenceCode =
  | "CONTENT_UNIT_NOT_FOUND"
  | "EXECUTION_REVISION_NOT_FOUND"
  | "EXECUTION_REVISION_NOT_REVIEWABLE"
  | "IDEMPOTENCY_IN_PROGRESS";

export class ContentExecutionPersistenceError extends Error {
  constructor(public readonly code: ContentExecutionPersistenceCode) {
    super(code);
    this.name = "ContentExecutionPersistenceError";
  }
}

export interface ContentExecutionWritePort {
  createRevision(request: {
    artistId: string;
    revisionId: string;
    command: CreateContentExecutionRevisionCommand;
    evidence: FoundationEvidence;
    sourceType: ContentExecutionSourceType;
  }): Promise<ContentExecutionRevisionResult>;
  approveRevision(request: {
    artistId: string;
    command: ReviewContentExecutionRevisionCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentExecutionRevisionResult>;
  rejectRevision(request: {
    artistId: string;
    command: RejectContentExecutionRevisionCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentExecutionRevisionResult>;
}

const productionIntentSchema = z.enum(["AUTHENTIC", "CASUAL", "POLISHED", "CINEMATIC", "EXPERIMENTAL"]);
const compactText = z.string().trim().min(1).max(2000);
const longText = z.string().trim().min(1).max(16000);
const optionalText = z.string().trim().min(1).max(8000).optional();
const shotSchema = z.object({ sequence: z.number().int().min(1).max(999), instruction: compactText });
const platformNoteSchema = z.object({ platform: z.string().trim().min(1).max(120), note: compactText });
const createRevisionSchema = z.object({
  contentUnitId: z.string().uuid(),
  format: z.string().trim().min(1).max(160),
  productionIntent: productionIntentSchema,
  hookType: z.string().trim().min(1).max(160).optional(),
  hookText: optionalText,
  structure: longText,
  scriptOrPerformanceConcept: longText,
  shotList: z.array(shotSchema).max(100),
  editBrief: longText,
  caption: optionalText,
  cta: z.string().trim().min(1).max(2000).optional(),
  platformNotes: z.array(platformNoteSchema).max(30),
  feasibilityNotes: compactText,
  fallbackPlan: optionalText
});
const reviewSchema = z.object({ revisionId: z.string().uuid() });
const rejectSchema = z.object({ revisionId: z.string().uuid(), reason: compactText });

const fieldErrors = (issues: z.ZodIssue[]) => Object.fromEntries(issues.map((issue) => [issue.path.join(".") || "form", issue.message]));
const evidenceFrom = (context: CommandContext): FoundationEvidence => ({
  actorType: context.actor.type,
  ...(context.actor.id ? { actorId: context.actor.id } : {}),
  commandId: context.commandId,
  traceId: context.traceId,
  occurredAt: context.requestedAt,
  ...(context.idempotencyKey ? { idempotencyKey: context.idempotencyKey } : {})
});
const requireUser = <T>(context: CommandContext): CommandResult<T> | null => context.actor.type === "USER" && context.actor.id
  ? null
  : { status: "FORBIDDEN", code: "CONTENT_EXECUTION_USER_REQUIRED", message: "An authenticated user is required for this execution decision." };
const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof ContentExecutionPersistenceError) {
    if (error.code.endsWith("_NOT_FOUND")) return { status: "NOT_FOUND", code: error.code, message: "The requested execution resource was not found." };
    return { status: "CONFLICT", code: error.code, message: "The requested execution operation conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "CONTENT_EXECUTION_PERSISTENCE_FAILED", message: "Execution state could not be persisted.", retryable: true };
};

const normalizeCreate = (data: z.infer<typeof createRevisionSchema>): CreateContentExecutionRevisionCommand => ({
  contentUnitId: data.contentUnitId,
  format: data.format,
  productionIntent: data.productionIntent,
  ...(data.hookType !== undefined ? { hookType: data.hookType } : {}),
  ...(data.hookText !== undefined ? { hookText: data.hookText } : {}),
  structure: data.structure,
  scriptOrPerformanceConcept: data.scriptOrPerformanceConcept,
  shotList: data.shotList,
  editBrief: data.editBrief,
  ...(data.caption !== undefined ? { caption: data.caption } : {}),
  ...(data.cta !== undefined ? { cta: data.cta } : {}),
  platformNotes: data.platformNotes,
  feasibilityNotes: data.feasibilityNotes,
  ...(data.fallbackPlan !== undefined ? { fallbackPlan: data.fallbackPlan } : {})
});

export class CreateContentExecutionRevisionService {
  constructor(private readonly writer: ContentExecutionWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateContentExecutionRevisionCommand, context: CommandContext): Promise<CommandResult<ContentExecutionRevisionResult>> {
    const denied = requireUser<ContentExecutionRevisionResult>(context); if (denied) return denied;
    const parsed = createRevisionSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_EXECUTION_REVISION_INVALID", message: "Execution revision is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      return { status: "SUCCESS", data: await this.writer.createRevision({ artistId: context.artistId, revisionId: this.idFactory(), command: normalizeCreate(parsed.data), evidence: evidenceFrom(context), sourceType: "MANUAL" }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class ApproveContentExecutionRevisionService {
  constructor(private readonly writer: ContentExecutionWritePort) {}
  async execute(command: ReviewContentExecutionRevisionCommand, context: CommandContext): Promise<CommandResult<ContentExecutionRevisionResult>> {
    const denied = requireUser<ContentExecutionRevisionResult>(context); if (denied) return denied;
    const parsed = reviewSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_EXECUTION_APPROVAL_INVALID", message: "Execution approval is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.approveRevision({ artistId: context.artistId, command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class RejectContentExecutionRevisionService {
  constructor(private readonly writer: ContentExecutionWritePort) {}
  async execute(command: RejectContentExecutionRevisionCommand, context: CommandContext): Promise<CommandResult<ContentExecutionRevisionResult>> {
    const denied = requireUser<ContentExecutionRevisionResult>(context); if (denied) return denied;
    const parsed = rejectSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_EXECUTION_REJECTION_INVALID", message: "Execution rejection is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.rejectRevision({ artistId: context.artistId, command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}
