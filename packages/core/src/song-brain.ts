import { z } from "zod";
import type { CommandContext, CommandResult } from "./index";
import { ArtistFoundationPersistenceError, type FoundationEvidence } from "./artist-foundation";

export type SongBrainStatementType = "FACT" | "ARTIST_INTERPRETATION" | "AUDIENCE_INTERPRETATION";

export interface AddSongBrainStatementCommand {
  songId: string;
  statementType: SongBrainStatementType;
  statement: string;
  sourceLabel?: string;
}

export interface SongBrainStatementResult {
  statementId: string;
  songId: string;
  statementType: SongBrainStatementType;
  statement: string;
}

export interface ConfigureSongIdentityContextCommand {
  songId: string;
  identityVersionId: string;
  eraIdentityId?: string;
  songSpecificVisualNotes?: string;
  songSpecificAnchors?: string[];
  allowedOverrides?: string[];
}

export interface SongIdentityContextResult {
  contextId: string;
  songId: string;
  identityVersionId: string;
  eraIdentityId: string | null;
}

export interface SongBrainWritePort {
  addStatement(request: {
    artistId: string;
    statementId: string;
    command: AddSongBrainStatementCommand;
    evidence: FoundationEvidence;
  }): Promise<SongBrainStatementResult>;
  configureIdentityContext(request: {
    artistId: string;
    contextId: string;
    command: ConfigureSongIdentityContextCommand;
    evidence: FoundationEvidence;
  }): Promise<SongIdentityContextResult>;
}

const statementSchema = z.object({
  songId: z.string().uuid(),
  statementType: z.enum(["FACT", "ARTIST_INTERPRETATION", "AUDIENCE_INTERPRETATION"]),
  statement: z.string().trim().min(1).max(12000),
  sourceLabel: z.string().trim().min(1).max(240).optional()
});

const identityContextSchema = z.object({
  songId: z.string().uuid(),
  identityVersionId: z.string().uuid(),
  eraIdentityId: z.string().uuid().optional(),
  songSpecificVisualNotes: z.string().trim().max(8000).optional(),
  songSpecificAnchors: z.array(z.string().trim().min(1).max(240)).max(50).optional(),
  allowedOverrides: z.array(z.string().trim().min(1).max(500)).max(50).optional()
});

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
  return {
    status: "FORBIDDEN",
    code: "SONG_BRAIN_USER_REQUIRED",
    message: "An authenticated user is required for this Song Brain operation."
  };
};

const mapPersistenceError = <T>(error: unknown): CommandResult<T> => {
  if (error instanceof ArtistFoundationPersistenceError) {
    if (error.code.endsWith("_NOT_FOUND")) {
      return { status: "NOT_FOUND", code: error.code, message: "The requested Song Brain resource was not found." };
    }
    return { status: "CONFLICT", code: error.code, message: "The requested Song Brain operation conflicts with current state." };
  }
  return {
    status: "EXTERNAL_FAILURE",
    code: "SONG_BRAIN_PERSISTENCE_FAILED",
    message: "Song Brain state could not be persisted.",
    retryable: true
  };
};

export class AddSongBrainStatementService {
  constructor(private readonly writer: SongBrainWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}

  async execute(command: AddSongBrainStatementCommand, context: CommandContext): Promise<CommandResult<SongBrainStatementResult>> {
    const denied = requireUser<SongBrainStatementResult>(context);
    if (denied) return denied;
    const parsed = statementSchema.safeParse(command);
    if (!parsed.success) {
      return {
        status: "VALIDATION_ERROR",
        code: "SONG_BRAIN_INVALID_STATEMENT",
        message: "Song Brain statement is invalid.",
        fieldErrors: fieldErrors(parsed.error.issues)
      };
    }

    try {
      return {
        status: "SUCCESS",
        data: await this.writer.addStatement({
          artistId: context.artistId,
          statementId: this.idFactory(),
          command: {
            songId: parsed.data.songId,
            statementType: parsed.data.statementType,
            statement: parsed.data.statement,
            ...(parsed.data.sourceLabel ? { sourceLabel: parsed.data.sourceLabel } : {})
          },
          evidence: evidenceFrom(context)
        })
      };
    } catch (error) {
      return mapPersistenceError(error);
    }
  }
}

export class ConfigureSongIdentityContextService {
  constructor(private readonly writer: SongBrainWritePort, private readonly idFactory = () => globalThis.crypto.randomUUID()) {}

  async execute(command: ConfigureSongIdentityContextCommand, context: CommandContext): Promise<CommandResult<SongIdentityContextResult>> {
    const denied = requireUser<SongIdentityContextResult>(context);
    if (denied) return denied;
    const parsed = identityContextSchema.safeParse(command);
    if (!parsed.success) {
      return {
        status: "VALIDATION_ERROR",
        code: "SONG_IDENTITY_CONTEXT_INVALID",
        message: "Song Identity Context is invalid.",
        fieldErrors: fieldErrors(parsed.error.issues)
      };
    }

    try {
      return {
        status: "SUCCESS",
        data: await this.writer.configureIdentityContext({
          artistId: context.artistId,
          contextId: this.idFactory(),
          command: {
            songId: parsed.data.songId,
            identityVersionId: parsed.data.identityVersionId,
            ...(parsed.data.eraIdentityId ? { eraIdentityId: parsed.data.eraIdentityId } : {}),
            ...(parsed.data.songSpecificVisualNotes ? { songSpecificVisualNotes: parsed.data.songSpecificVisualNotes } : {}),
            ...(parsed.data.songSpecificAnchors ? { songSpecificAnchors: parsed.data.songSpecificAnchors } : {}),
            ...(parsed.data.allowedOverrides ? { allowedOverrides: parsed.data.allowedOverrides } : {})
          },
          evidence: evidenceFrom(context)
        })
      };
    } catch (error) {
      return mapPersistenceError(error);
    }
  }
}
