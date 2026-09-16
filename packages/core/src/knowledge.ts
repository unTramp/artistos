import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import type { FoundationEvidence } from "./artist-foundation";

export type ToneCorpusLabel = "AUTHENTIC" | "GOOD" | "NEUTRAL" | "DO_NOT_COPY" | "OUTDATED";
export type CandidateKnowledgeStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "MERGED" | "EXPIRED";
export type CandidateKnowledgeDestination =
  | "ARTIST_BRAIN"
  | "SONG_BRAIN"
  | "IDENTITY"
  | "ERA"
  | "PLATFORM_KNOWLEDGE"
  | "BUSINESS_KNOWLEDGE";

export type KnowledgePersistenceCode =
  | "TONE_ITEM_NOT_FOUND"
  | "CANDIDATE_NOT_FOUND"
  | "CANDIDATE_NOT_PENDING"
  | "CANDIDATE_DESTINATION_BLOCKED"
  | "CANDIDATE_MERGE_TARGET_NOT_FOUND"
  | "CANDIDATE_MERGE_SELF"
  | "IDEMPOTENCY_IN_PROGRESS";

export class KnowledgePersistenceError extends Error {
  constructor(public readonly code: KnowledgePersistenceCode) {
    super(code);
    this.name = "KnowledgePersistenceError";
  }
}

export interface AddToneCorpusItemCommand {
  textContent: string;
  label: ToneCorpusLabel;
  sourceType: string;
  sourceReference?: string;
  language?: string;
  isPrivate?: boolean;
}

export interface ToneCorpusItemResult {
  itemId: string;
  label: ToneCorpusLabel;
  textContent: string;
}

export interface RelabelToneCorpusItemCommand {
  itemId: string;
  label: ToneCorpusLabel;
}

export interface CreateCandidateKnowledgeCommand {
  sourceType: string;
  sourceId: string;
  content: string;
  destination: CandidateKnowledgeDestination;
  destinationTargetId?: string;
  confidenceMetadata?: Record<string, unknown>;
}

export interface CandidateKnowledgeResult {
  candidateId: string;
  status: CandidateKnowledgeStatus;
  destination: CandidateKnowledgeDestination;
  promotedEntityType: string | null;
  promotedEntityId: string | null;
  mergedIntoCandidateId: string | null;
}

export interface AcceptCandidateKnowledgeCommand {
  candidateId: string;
}

export interface RejectCandidateKnowledgeCommand {
  candidateId: string;
  reason?: string;
}

export interface MergeCandidateKnowledgeCommand {
  candidateId: string;
  targetCandidateId: string;
}

export interface ArtistBrainSnapshotResult {
  snapshotId: string;
  versionNumber: number;
}

export interface KnowledgeWritePort {
  addToneCorpusItem(request: {
    artistId: string;
    itemId: string;
    command: AddToneCorpusItemCommand;
    evidence: FoundationEvidence;
  }): Promise<ToneCorpusItemResult>;
  relabelToneCorpusItem(request: {
    artistId: string;
    command: RelabelToneCorpusItemCommand;
    evidence: FoundationEvidence;
  }): Promise<ToneCorpusItemResult>;
  createCandidate(request: {
    artistId: string;
    candidateId: string;
    command: CreateCandidateKnowledgeCommand;
    evidence: FoundationEvidence;
  }): Promise<CandidateKnowledgeResult>;
  acceptCandidate(request: {
    artistId: string;
    knowledgeItemId: string;
    command: AcceptCandidateKnowledgeCommand;
    evidence: FoundationEvidence;
  }): Promise<CandidateKnowledgeResult>;
  rejectCandidate(request: {
    artistId: string;
    command: RejectCandidateKnowledgeCommand;
    evidence: FoundationEvidence;
  }): Promise<CandidateKnowledgeResult>;
  mergeCandidate(request: {
    artistId: string;
    command: MergeCandidateKnowledgeCommand;
    evidence: FoundationEvidence;
  }): Promise<CandidateKnowledgeResult>;
  rebuildArtistBrain(request: {
    artistId: string;
    snapshotId: string;
    evidence: FoundationEvidence;
  }): Promise<ArtistBrainSnapshotResult>;
}

const toneLabelSchema = z.enum(["AUTHENTIC", "GOOD", "NEUTRAL", "DO_NOT_COPY", "OUTDATED"]);
const destinationSchema = z.enum([
  "ARTIST_BRAIN",
  "SONG_BRAIN",
  "IDENTITY",
  "ERA",
  "PLATFORM_KNOWLEDGE",
  "BUSINESS_KNOWLEDGE"
]);

const addToneSchema = z.object({
  textContent: z.string().trim().min(1).max(20000),
  label: toneLabelSchema,
  sourceType: z.string().trim().min(1).max(120),
  sourceReference: z.string().trim().min(1).max(1000).optional(),
  language: z.string().trim().min(1).max(32).optional(),
  isPrivate: z.boolean().optional()
});

const relabelToneSchema = z.object({ itemId: z.string().uuid(), label: toneLabelSchema });
const createCandidateSchema = z.object({
  sourceType: z.string().trim().min(1).max(120),
  sourceId: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1).max(20000),
  destination: destinationSchema,
  destinationTargetId: z.string().trim().min(1).max(500).optional(),
  confidenceMetadata: z.record(z.string(), z.unknown()).optional()
});
const acceptCandidateSchema = z.object({ candidateId: z.string().uuid() });
const rejectCandidateSchema = z.object({ candidateId: z.string().uuid(), reason: z.string().trim().min(1).max(2000).optional() });
const mergeCandidateSchema = z.object({ candidateId: z.string().uuid(), targetCandidateId: z.string().uuid() });

const fieldErrors = (issues: z.ZodIssue[]) => Object.fromEntries(
  issues.map((issue) => [issue.path.join(".") || "form", issue.message])
);

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
  return { status: "FORBIDDEN", code: "KNOWLEDGE_USER_REQUIRED", message: "An authenticated user is required for this Knowledge operation." };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof KnowledgePersistenceError) {
    if (error.code.endsWith("_NOT_FOUND")) {
      return { status: "NOT_FOUND", code: error.code, message: "The requested Knowledge resource was not found." };
    }
    if (error.code === "CANDIDATE_DESTINATION_BLOCKED") {
      return {
        status: "BLOCKED",
        code: error.code,
        message: "This candidate must be promoted through its owning domain workflow, which is not available in this slice."
      };
    }
    return { status: "CONFLICT", code: error.code, message: "The requested Knowledge operation conflicts with current state." };
  }
  return { status: "EXTERNAL_FAILURE", code: "KNOWLEDGE_PERSISTENCE_FAILED", message: "Knowledge state could not be persisted.", retryable: true };
};

export class AddToneCorpusItemService {
  constructor(private readonly writer: KnowledgeWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: AddToneCorpusItemCommand, context: CommandContext): Promise<CommandResult<ToneCorpusItemResult>> {
    const denied = requireUser<ToneCorpusItemResult>(context);
    if (denied) return denied;
    const parsed = addToneSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "TONE_CORPUS_INVALID", message: "Tone Corpus item is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      return { status: "SUCCESS", data: await this.writer.addToneCorpusItem({
        artistId: context.artistId,
        itemId: this.idFactory(),
        command: parsed.data,
        evidence: evidenceFrom(context)
      }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class RelabelToneCorpusItemService {
  constructor(private readonly writer: KnowledgeWritePort) {}
  async execute(command: RelabelToneCorpusItemCommand, context: CommandContext): Promise<CommandResult<ToneCorpusItemResult>> {
    const denied = requireUser<ToneCorpusItemResult>(context);
    if (denied) return denied;
    const parsed = relabelToneSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "TONE_CORPUS_RELABEL_INVALID", message: "Tone Corpus label change is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.relabelToneCorpusItem({ artistId: context.artistId, command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class CreateCandidateKnowledgeService {
  constructor(private readonly writer: KnowledgeWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateCandidateKnowledgeCommand, context: CommandContext): Promise<CommandResult<CandidateKnowledgeResult>> {
    const denied = requireUser<CandidateKnowledgeResult>(context);
    if (denied) return denied;
    const parsed = createCandidateSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CANDIDATE_KNOWLEDGE_INVALID", message: "Candidate Knowledge is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.createCandidate({ artistId: context.artistId, candidateId: this.idFactory(), command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class AcceptCandidateKnowledgeService {
  constructor(private readonly writer: KnowledgeWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: AcceptCandidateKnowledgeCommand, context: CommandContext): Promise<CommandResult<CandidateKnowledgeResult>> {
    const denied = requireUser<CandidateKnowledgeResult>(context);
    if (denied) return denied;
    const parsed = acceptCandidateSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CANDIDATE_ACCEPT_INVALID", message: "Candidate acceptance is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.acceptCandidate({ artistId: context.artistId, knowledgeItemId: this.idFactory(), command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class RejectCandidateKnowledgeService {
  constructor(private readonly writer: KnowledgeWritePort) {}
  async execute(command: RejectCandidateKnowledgeCommand, context: CommandContext): Promise<CommandResult<CandidateKnowledgeResult>> {
    const denied = requireUser<CandidateKnowledgeResult>(context);
    if (denied) return denied;
    const parsed = rejectCandidateSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CANDIDATE_REJECT_INVALID", message: "Candidate rejection is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.rejectCandidate({ artistId: context.artistId, command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class MergeCandidateKnowledgeService {
  constructor(private readonly writer: KnowledgeWritePort) {}
  async execute(command: MergeCandidateKnowledgeCommand, context: CommandContext): Promise<CommandResult<CandidateKnowledgeResult>> {
    const denied = requireUser<CandidateKnowledgeResult>(context);
    if (denied) return denied;
    const parsed = mergeCandidateSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "CANDIDATE_MERGE_INVALID", message: "Candidate merge is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try { return { status: "SUCCESS", data: await this.writer.mergeCandidate({ artistId: context.artistId, command: parsed.data, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class RebuildArtistBrainService {
  constructor(private readonly writer: KnowledgeWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(context: CommandContext): Promise<CommandResult<ArtistBrainSnapshotResult>> {
    const denied = requireUser<ArtistBrainSnapshotResult>(context);
    if (denied) return denied;
    try { return { status: "SUCCESS", data: await this.writer.rebuildArtistBrain({ artistId: context.artistId, snapshotId: this.idFactory(), evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}
