import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type ContentAngleStatus = "DRAFT" | "APPROVED" | "REJECTED" | "DEFERRED";
export type ContentUnitStatus =
  | "IDEA"
  | "APPROVED"
  | "SCRIPT_READY"
  | "TO_SHOOT"
  | "SHOT"
  | "EDITING"
  | "REVIEW"
  | "READY"
  | "SCHEDULED"
  | "PUBLISHED"
  | "MEASURING"
  | "ANALYZED"
  | "ARCHIVED"
  | "BLOCKED"
  | "REJECTED"
  | "PAUSED";

export type ContentPillar =
  | "PERFORMANCE"
  | "ACOUSTIC"
  | "STORY"
  | "PERSONALITY"
  | "BTS"
  | "LYRICS"
  | "REACTION"
  | "COMMUNITY"
  | "PHOTO"
  | "PROMO"
  | "RELEASE"
  | "EXPERIMENTAL";

export type ContentMode = "CAMPAIGN" | "EVERGREEN" | "OPPORTUNISTIC" | "EXPERIMENTAL";

export type AngleRejectionReason =
  | "TOO_GENERIC"
  | "NOT_ME"
  | "ALREADY_DONE"
  | "TOO_EXPENSIVE"
  | "NOT_FEASIBLE"
  | "WRONG_SONG"
  | "WRONG_TONE"
  | "WRONG_VISUAL"
  | "DO_NOT_LIKE_IDEA"
  | "OTHER";

export type ContentFactoryPersistenceCode =
  | "ANGLE_NOT_FOUND"
  | "ANGLE_NOT_EDITABLE"
  | "ANGLE_NOT_REVIEWABLE"
  | "ANGLE_NOT_APPROVED"
  | "ANGLE_IDENTITY_CONTEXT_REQUIRED"
  | "ANGLE_SONG_NOT_FOUND"
  | "ANGLE_IDENTITY_NOT_FOUND"
  | "ANGLE_ERA_MISMATCH"
  | "CONTENT_UNIT_NOT_FOUND"
  | "CONTENT_UNIT_INVALID_TRANSITION"
  | "IDEMPOTENCY_IN_PROGRESS";

export class ContentFactoryPersistenceError extends Error {
  constructor(public readonly code: ContentFactoryPersistenceCode) {
    super(code);
    this.name = "ContentFactoryPersistenceError";
  }
}

export interface CreateContentAngleCommand {
  songId?: string;
  campaignId?: string;
  title: string;
  idea: string;
  pillar: ContentPillar;
  mode: ContentMode;
  goal: string;
  audience: string;
  platformTargets: string[];
  requiredAssets: string[];
  learningValue: string;
  why: string;
  identityFitRationale: string;
  productionEffort: string;
}

export interface EditContentAngleCommand {
  angleId: string;
  title?: string;
  idea?: string;
  pillar?: ContentPillar;
  mode?: ContentMode;
  goal?: string;
  audience?: string;
  platformTargets?: string[];
  requiredAssets?: string[];
  learningValue?: string;
  why?: string;
  identityFitRationale?: string;
  productionEffort?: string;
}

export interface ReviewContentAngleCommand {
  angleId: string;
}

export interface RejectContentAngleCommand {
  angleId: string;
  reason: AngleRejectionReason;
  note?: string;
}

export interface DeferContentAngleCommand {
  angleId: string;
  note?: string;
}

export interface CreateContentUnitFromAngleCommand {
  angleId: string;
  priority?: string;
}

export interface ChangeContentUnitStatusCommand {
  contentUnitId: string;
  status: ContentUnitStatus;
  reason?: string;
}

export interface ContentAngleResult {
  angleId: string;
  status: ContentAngleStatus;
  version: number;
  identityVersionId: string | null;
  eraIdentityId: string | null;
}

export interface ContentUnitResult {
  contentUnitId: string;
  angleId: string | null;
  status: ContentUnitStatus;
  identityVersionId: string;
  eraIdentityId: string | null;
}

export interface ContentFactoryWritePort {
  createAngle(request: {
    artistId: string;
    angleId: string;
    command: CreateContentAngleCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentAngleResult>;
  editAngle(request: {
    artistId: string;
    command: EditContentAngleCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentAngleResult>;
  approveAngle(request: {
    artistId: string;
    command: ReviewContentAngleCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentAngleResult>;
  rejectAngle(request: {
    artistId: string;
    command: RejectContentAngleCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentAngleResult>;
  deferAngle(request: {
    artistId: string;
    command: DeferContentAngleCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentAngleResult>;
  createContentUnitFromAngle(request: {
    artistId: string;
    contentUnitId: string;
    command: CreateContentUnitFromAngleCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentUnitResult>;
  changeContentUnitStatus(request: {
    artistId: string;
    command: ChangeContentUnitStatusCommand;
    evidence: FoundationEvidence;
  }): Promise<ContentUnitResult>;
}

const pillarSchema = z.enum([
  "PERFORMANCE", "ACOUSTIC", "STORY", "PERSONALITY", "BTS", "LYRICS",
  "REACTION", "COMMUNITY", "PHOTO", "PROMO", "RELEASE", "EXPERIMENTAL"
]);
const modeSchema = z.enum(["CAMPAIGN", "EVERGREEN", "OPPORTUNISTIC", "EXPERIMENTAL"]);
const rejectionReasonSchema = z.enum([
  "TOO_GENERIC", "NOT_ME", "ALREADY_DONE", "TOO_EXPENSIVE", "NOT_FEASIBLE",
  "WRONG_SONG", "WRONG_TONE", "WRONG_VISUAL", "DO_NOT_LIKE_IDEA", "OTHER"
]);
const contentUnitStatusSchema = z.enum([
  "IDEA", "APPROVED", "SCRIPT_READY", "TO_SHOOT", "SHOT", "EDITING", "REVIEW",
  "READY", "SCHEDULED", "PUBLISHED", "MEASURING", "ANALYZED", "ARCHIVED",
  "BLOCKED", "REJECTED", "PAUSED"
]);
const compactText = z.string().trim().min(1).max(2000);
const longText = z.string().trim().min(1).max(12000);
const stringList = z.array(z.string().trim().min(1).max(300)).max(30);

const createAngleSchema = z.object({
  songId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(240),
  idea: longText,
  pillar: pillarSchema,
  mode: modeSchema,
  goal: compactText,
  audience: compactText,
  platformTargets: stringList,
  requiredAssets: stringList,
  learningValue: compactText,
  why: compactText,
  identityFitRationale: compactText,
  productionEffort: z.string().trim().min(1).max(1000)
});

const editAngleSchema = z.object({
  angleId: z.string().uuid(),
  title: z.string().trim().min(1).max(240).optional(),
  idea: longText.optional(),
  pillar: pillarSchema.optional(),
  mode: modeSchema.optional(),
  goal: compactText.optional(),
  audience: compactText.optional(),
  platformTargets: stringList.optional(),
  requiredAssets: stringList.optional(),
  learningValue: compactText.optional(),
  why: compactText.optional(),
  identityFitRationale: compactText.optional(),
  productionEffort: z.string().trim().min(1).max(1000).optional()
}).refine((value) => Object.keys(value).some((key) => key !== "angleId"), { message: "At least one editable field is required." });

const reviewAngleSchema = z.object({ angleId: z.string().uuid() });
const rejectAngleSchema = z.object({
  angleId: z.string().uuid(),
  reason: rejectionReasonSchema,
  note: z.string().trim().min(1).max(2000).optional()
});
const deferAngleSchema = z.object({
  angleId: z.string().uuid(),
  note: z.string().trim().min(1).max(2000).optional()
});
const createUnitSchema = z.object({
  angleId: z.string().uuid(),
  priority: z.string().trim().min(1).max(80).optional()
});
const changeUnitStatusSchema = z.object({
  contentUnitId: z.string().uuid(),
  status: contentUnitStatusSchema,
  reason: z.string().trim().min(1).max(2000).optional()
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
  return { status: "FORBIDDEN", code: "CONTENT_FACTORY_USER_REQUIRED", message: "An authenticated user is required for this Content Factory operation." };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof ContentFactoryPersistenceError) {
    if (error.code.endsWith("_NOT_FOUND")) return { status: "NOT_FOUND", code: error.code, message: "The requested content resource was not found." };
    if (error.code === "ANGLE_IDENTITY_CONTEXT_REQUIRED") return { status: "BLOCKED", code: error.code, message: "An active Identity Version is required before this angle can become a production unit." };
    return { status: "CONFLICT", code: error.code, message: "The requested content operation conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "CONTENT_FACTORY_PERSISTENCE_FAILED", message: "Content Factory state could not be persisted.", retryable: true };
};

const optionalCreateCommand = (data: z.infer<typeof createAngleSchema>): CreateContentAngleCommand => ({
  ...(data.songId ? { songId: data.songId } : {}),
  ...(data.campaignId ? { campaignId: data.campaignId } : {}),
  title: data.title,
  idea: data.idea,
  pillar: data.pillar,
  mode: data.mode,
  goal: data.goal,
  audience: data.audience,
  platformTargets: data.platformTargets,
  requiredAssets: data.requiredAssets,
  learningValue: data.learningValue,
  why: data.why,
  identityFitRationale: data.identityFitRationale,
  productionEffort: data.productionEffort
});

export class CreateContentAngleService {
  constructor(private readonly writer: ContentFactoryWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateContentAngleCommand, context: CommandContext): Promise<CommandResult<ContentAngleResult>> {
    const denied = requireUser<ContentAngleResult>(context); if (denied) return denied;
    const parsed = createAngleSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_ANGLE_INVALID", message: "Content Angle is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.createAngle({ artistId: context.artistId, angleId: this.idFactory(), command: optionalCreateCommand(parsed.data), evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class EditContentAngleService {
  constructor(private readonly writer: ContentFactoryWritePort) {}
  async execute(command: EditContentAngleCommand, context: CommandContext): Promise<CommandResult<ContentAngleResult>> {
    const denied = requireUser<ContentAngleResult>(context); if (denied) return denied;
    const parsed = editAngleSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_ANGLE_EDIT_INVALID", message: "Content Angle edit is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    const data = parsed.data;
    const normalized: EditContentAngleCommand = {
      angleId: data.angleId,
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.idea !== undefined ? { idea: data.idea } : {}),
      ...(data.pillar !== undefined ? { pillar: data.pillar } : {}),
      ...(data.mode !== undefined ? { mode: data.mode } : {}),
      ...(data.goal !== undefined ? { goal: data.goal } : {}),
      ...(data.audience !== undefined ? { audience: data.audience } : {}),
      ...(data.platformTargets !== undefined ? { platformTargets: data.platformTargets } : {}),
      ...(data.requiredAssets !== undefined ? { requiredAssets: data.requiredAssets } : {}),
      ...(data.learningValue !== undefined ? { learningValue: data.learningValue } : {}),
      ...(data.why !== undefined ? { why: data.why } : {}),
      ...(data.identityFitRationale !== undefined ? { identityFitRationale: data.identityFitRationale } : {}),
      ...(data.productionEffort !== undefined ? { productionEffort: data.productionEffort } : {})
    };
    try { return { status: "SUCCESS", data: await this.writer.editAngle({ artistId: context.artistId, command: normalized, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class ApproveContentAngleService {
  constructor(private readonly writer: ContentFactoryWritePort) {}
  async execute(command: ReviewContentAngleCommand, context: CommandContext): Promise<CommandResult<ContentAngleResult>> {
    const denied = requireUser<ContentAngleResult>(context); if (denied) return denied;
    const parsed = reviewAngleSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_ANGLE_APPROVAL_INVALID", message: "Content Angle approval is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.approveAngle({ artistId: context.artistId, command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class RejectContentAngleService {
  constructor(private readonly writer: ContentFactoryWritePort) {}
  async execute(command: RejectContentAngleCommand, context: CommandContext): Promise<CommandResult<ContentAngleResult>> {
    const denied = requireUser<ContentAngleResult>(context); if (denied) return denied;
    const parsed = rejectAngleSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_ANGLE_REJECTION_INVALID", message: "Content Angle rejection is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.rejectAngle({ artistId: context.artistId, command: { angleId: parsed.data.angleId, reason: parsed.data.reason, ...(parsed.data.note ? { note: parsed.data.note } : {}) }, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class DeferContentAngleService {
  constructor(private readonly writer: ContentFactoryWritePort) {}
  async execute(command: DeferContentAngleCommand, context: CommandContext): Promise<CommandResult<ContentAngleResult>> {
    const denied = requireUser<ContentAngleResult>(context); if (denied) return denied;
    const parsed = deferAngleSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_ANGLE_DEFER_INVALID", message: "Content Angle deferral is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.deferAngle({ artistId: context.artistId, command: { angleId: parsed.data.angleId, ...(parsed.data.note ? { note: parsed.data.note } : {}) }, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class CreateContentUnitFromAngleService {
  constructor(private readonly writer: ContentFactoryWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateContentUnitFromAngleCommand, context: CommandContext): Promise<CommandResult<ContentUnitResult>> {
    const denied = requireUser<ContentUnitResult>(context); if (denied) return denied;
    const parsed = createUnitSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_UNIT_CREATE_INVALID", message: "Content Unit request is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.createContentUnitFromAngle({ artistId: context.artistId, contentUnitId: this.idFactory(), command: { angleId: parsed.data.angleId, ...(parsed.data.priority ? { priority: parsed.data.priority } : {}) }, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class ChangeContentUnitStatusService {
  constructor(private readonly writer: ContentFactoryWritePort) {}
  async execute(command: ChangeContentUnitStatusCommand, context: CommandContext): Promise<CommandResult<ContentUnitResult>> {
    const denied = requireUser<ContentUnitResult>(context); if (denied) return denied;
    const parsed = changeUnitStatusSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CONTENT_UNIT_STATUS_INVALID", message: "Content Unit status change is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.changeContentUnitStatus({ artistId: context.artistId, command: { contentUnitId: parsed.data.contentUnitId, status: parsed.data.status, ...(parsed.data.reason ? { reason: parsed.data.reason } : {}) }, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}
