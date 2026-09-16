import { z } from "zod";
import type { ActorType, CommandContext, CommandResult } from "./index";

export type IdentityVersionStatus = "DRAFT" | "REVIEW" | "ACTIVE" | "ARCHIVED";
export type EraStatus = "DRAFT" | "ACTIVE" | "ENDED" | "ARCHIVED";

export interface FoundationEvidence {
  actorType: ActorType;
  actorId?: string;
  commandId: string;
  traceId: string;
  occurredAt: Date;
  idempotencyKey?: string | undefined;
}

export type ArtistFoundationPersistenceCode =
  | "IDENTITY_VERSION_NOT_FOUND"
  | "IDENTITY_VERSION_NOT_ACTIVATABLE"
  | "ERA_NOT_FOUND"
  | "ERA_NOT_ACTIVATABLE"
  | "ERA_ACTIVE_EXISTS"
  | "ERA_IDENTITY_VERSION_NOT_ACTIVE"
  | "SONG_NOT_FOUND"
  | "SONG_DUPLICATE_ISRC"
  | "SONG_ERA_IDENTITY_MISMATCH"
  | "IDEMPOTENCY_IN_PROGRESS";

export class ArtistFoundationPersistenceError extends Error {
  constructor(public readonly code: ArtistFoundationPersistenceCode) {
    super(code);
    this.name = "ArtistFoundationPersistenceError";
  }
}

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
  return {
    status: "FORBIDDEN",
    code: "ARTIST_FOUNDATION_USER_REQUIRED",
    message: "An authenticated user is required for this artist operation."
  };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof ArtistFoundationPersistenceError) {
    if (error.code.endsWith("_NOT_FOUND")) {
      return { status: "NOT_FOUND", code: error.code, message: "The requested artist resource was not found." };
    }
    return { status: "CONFLICT", code: error.code, message: "The requested artist operation conflicts with current state." };
  }
  return {
    status: "EXTERNAL_FAILURE",
    code: "ARTIST_FOUNDATION_PERSISTENCE_FAILED",
    message: "Artist foundation state could not be persisted.",
    retryable: true
  };
};

export interface CreateIdentityDraftCommand {
  label?: string;
}

export interface CreateIdentityDraftResult {
  identityId: string;
  versionId: string;
  versionNumber: number;
  status: "DRAFT";
}

export interface ActivateIdentityVersionResult {
  identityId: string;
  versionId: string;
  versionNumber: number;
  status: "ACTIVE";
}

export interface CreateEraCommand {
  identityVersionId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  narrativeChapter?: string;
}

export interface EraResult {
  eraId: string;
  identityVersionId: string;
  name: string;
  status: EraStatus;
}

export interface CreateSongCommand {
  title: string;
  type?: string;
  isOriginal: boolean;
  originalArtist?: string;
  genre?: string;
  mood?: string;
  language?: string;
  story?: string;
  meaning?: string;
  lyricsReference?: string;
  isrc?: string;
  platformLinks?: Record<string, string>;
}

export interface SongResult {
  songId: string;
  title: string;
  isOriginal: boolean;
}

export interface ArtistFoundationWritePort {
  createIdentityDraft(request: {
    artistId: string;
    identityId: string;
    versionId: string;
    label?: string;
    evidence: FoundationEvidence;
  }): Promise<CreateIdentityDraftResult>;
  activateIdentityVersion(request: {
    artistId: string;
    versionId: string;
    evidence: FoundationEvidence;
  }): Promise<ActivateIdentityVersionResult>;
  createEra(request: {
    artistId: string;
    eraId: string;
    command: CreateEraCommand;
    evidence: FoundationEvidence;
  }): Promise<EraResult>;
  activateEra(request: {
    artistId: string;
    eraId: string;
    evidence: FoundationEvidence;
  }): Promise<EraResult>;
  endEra(request: {
    artistId: string;
    eraId: string;
    evidence: FoundationEvidence;
  }): Promise<EraResult>;
  createSong(request: {
    artistId: string;
    songId: string;
    command: CreateSongCommand;
    evidence: FoundationEvidence;
  }): Promise<SongResult>;
}

const identityDraftSchema = z.object({ label: z.string().trim().min(1).max(120).optional() });
const eraSchema = z.object({
  identityVersionId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  narrativeChapter: z.string().trim().max(4000).optional()
}).refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
  message: "Era end date must be on or after its start date.",
  path: ["endDate"]
});
const songSchema = z.object({
  title: z.string().trim().min(1).max(240),
  type: z.string().trim().min(1).max(80).optional(),
  isOriginal: z.boolean(),
  originalArtist: z.string().trim().min(1).max(240).optional(),
  genre: z.string().trim().max(120).optional(),
  mood: z.string().trim().max(120).optional(),
  language: z.string().trim().max(40).optional(),
  story: z.string().trim().max(12000).optional(),
  meaning: z.string().trim().max(12000).optional(),
  lyricsReference: z.string().trim().max(1000).optional(),
  isrc: z.string().trim().regex(/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/).optional(),
  platformLinks: z.record(z.string(), z.url()).optional()
});

const fieldErrors = (issues: z.ZodIssue[]) => Object.fromEntries(
  issues.map((issue) => [issue.path.join(".") || "form", issue.message])
);

export class CreateIdentityDraftService {
  constructor(private readonly writer: ArtistFoundationWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}

  async execute(command: CreateIdentityDraftCommand, context: CommandContext): Promise<CommandResult<CreateIdentityDraftResult>> {
    const denied = requireUser<CreateIdentityDraftResult>(context);
    if (denied) return denied;
    const parsed = identityDraftSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "IDENTITY_INVALID_DRAFT", message: "Identity draft is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      return { status: "SUCCESS", data: await this.writer.createIdentityDraft({
        artistId: context.artistId,
        identityId: this.idFactory(),
        versionId: this.idFactory(),
        ...(parsed.data.label ? { label: parsed.data.label } : {}),
        evidence: evidenceFrom(context)
      }) };
    } catch (error) { return mapPersistenceError(error); }
  }
}

export class ActivateIdentityVersionService {
  constructor(private readonly writer: ArtistFoundationWritePort) {}
  async execute(versionId: string, context: CommandContext): Promise<CommandResult<ActivateIdentityVersionResult>> {
    const denied = requireUser<ActivateIdentityVersionResult>(context);
    if (denied) return denied;
    if (!z.string().uuid().safeParse(versionId).success) return { status: "VALIDATION_ERROR", code: "IDENTITY_INVALID_VERSION_ID", message: "Identity version id is invalid.", fieldErrors: { versionId: "Invalid UUID" } };
    try { return { status: "SUCCESS", data: await this.writer.activateIdentityVersion({ artistId: context.artistId, versionId, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class CreateEraService {
  constructor(private readonly writer: ArtistFoundationWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateEraCommand, context: CommandContext): Promise<CommandResult<EraResult>> {
    const denied = requireUser<EraResult>(context); if (denied) return denied;
    const parsed = eraSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "ERA_INVALID_INPUT", message: "Era data is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      const normalized: CreateEraCommand = {
        identityVersionId: parsed.data.identityVersionId,
        name: parsed.data.name,
        ...(parsed.data.startDate ? { startDate: parsed.data.startDate } : {}),
        ...(parsed.data.endDate ? { endDate: parsed.data.endDate } : {}),
        ...(parsed.data.narrativeChapter ? { narrativeChapter: parsed.data.narrativeChapter } : {})
      };
      return { status: "SUCCESS", data: await this.writer.createEra({ artistId: context.artistId, eraId: this.idFactory(), command: normalized, evidence: evidenceFrom(context) }) };
    }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class ActivateEraService {
  constructor(private readonly writer: ArtistFoundationWritePort) {}
  async execute(eraId: string, context: CommandContext): Promise<CommandResult<EraResult>> {
    const denied = requireUser<EraResult>(context); if (denied) return denied;
    if (!z.string().uuid().safeParse(eraId).success) return { status: "VALIDATION_ERROR", code: "ERA_INVALID_ID", message: "Era id is invalid.", fieldErrors: { eraId: "Invalid UUID" } };
    try { return { status: "SUCCESS", data: await this.writer.activateEra({ artistId: context.artistId, eraId, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class EndEraService {
  constructor(private readonly writer: ArtistFoundationWritePort) {}
  async execute(eraId: string, context: CommandContext): Promise<CommandResult<EraResult>> {
    const denied = requireUser<EraResult>(context); if (denied) return denied;
    if (!z.string().uuid().safeParse(eraId).success) return { status: "VALIDATION_ERROR", code: "ERA_INVALID_ID", message: "Era id is invalid.", fieldErrors: { eraId: "Invalid UUID" } };
    try { return { status: "SUCCESS", data: await this.writer.endEra({ artistId: context.artistId, eraId, evidence: evidenceFrom(context) }) }; }
    catch (error) { return mapPersistenceError(error); }
  }
}

export class CreateSongService {
  constructor(private readonly writer: ArtistFoundationWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}
  async execute(command: CreateSongCommand, context: CommandContext): Promise<CommandResult<SongResult>> {
    const denied = requireUser<SongResult>(context); if (denied) return denied;
    const parsed = songSchema.safeParse(command);
    if (!parsed.success) return { status: "VALIDATION_ERROR", code: "SONG_INVALID_INPUT", message: "Song data is invalid.", fieldErrors: fieldErrors(parsed.error.issues) };
    try {
      const normalized: CreateSongCommand = {
        title: parsed.data.title,
        isOriginal: parsed.data.isOriginal,
        ...(parsed.data.type ? { type: parsed.data.type } : {}),
        ...(parsed.data.originalArtist ? { originalArtist: parsed.data.originalArtist } : {}),
        ...(parsed.data.genre ? { genre: parsed.data.genre } : {}),
        ...(parsed.data.mood ? { mood: parsed.data.mood } : {}),
        ...(parsed.data.language ? { language: parsed.data.language } : {}),
        ...(parsed.data.story ? { story: parsed.data.story } : {}),
        ...(parsed.data.meaning ? { meaning: parsed.data.meaning } : {}),
        ...(parsed.data.lyricsReference ? { lyricsReference: parsed.data.lyricsReference } : {}),
        ...(parsed.data.isrc ? { isrc: parsed.data.isrc } : {}),
        ...(parsed.data.platformLinks ? { platformLinks: parsed.data.platformLinks } : {})
      };
      return { status: "SUCCESS", data: await this.writer.createSong({ artistId: context.artistId, songId: this.idFactory(), command: normalized, evidence: evidenceFrom(context) }) };
    }
    catch (error) { return mapPersistenceError(error); }
  }
}
