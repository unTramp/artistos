import { z } from "zod";
import type { ActorType, CommandContext, CommandResult, DomainEvent } from "./index";

const createArtistSchema = z.object({
  name: z.string().trim().min(1).max(120),
  artistName: z.string().trim().min(1).max(120),
  timezone: z.string().trim().min(1),
  locale: z.string().trim().min(2).max(20).default("en"),
  reportingCurrency: z.string().regex(/^[A-Z]{3}$/).default("USD")
});

export interface CreateArtistCommand {
  name: string;
  artistName: string;
  timezone: string;
  locale?: string;
  reportingCurrency?: string;
}

export interface CreateArtistResult {
  artistId: string;
  workspaceSettingsId: string;
  replayed: boolean;
}

export interface AuditEvidence {
  id: string;
  artistId: string;
  actorType: ActorType;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  traceId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateArtistPersistenceRequest {
  ownerUserId: string;
  artist: {
    id: string;
    name: string;
    artistName: string;
    timezone: string;
    locale: string;
    reportingCurrency: string;
    createdAt: Date;
  };
  event: DomainEvent<{ artistName: string }>;
  audit: AuditEvidence;
  idempotencyKey?: string;
}

export interface ArtistWorkspaceWritePort {
  createArtistWorkspace(request: CreateArtistPersistenceRequest): Promise<CreateArtistResult>;
}

const isIanaTimezone = (timezone: string) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format(new Date());
    return true;
  } catch {
    return false;
  }
};

const validationErrors = (issues: z.ZodIssue[]) =>
  Object.fromEntries(issues.map((issue) => [issue.path.join(".") || "form", issue.message]));

export class CreateArtistService {
  constructor(
    private readonly writer: ArtistWorkspaceWritePort,
    private readonly clock: () => Date = () => new Date(),
    private readonly idFactory: () => string = () => globalThis.crypto.randomUUID()
  ) {}

  async execute(command: CreateArtistCommand, context: CommandContext): Promise<CommandResult<CreateArtistResult>> {
    const parsed = createArtistSchema.safeParse(command);
    if (!parsed.success) {
      return {
        status: "VALIDATION_ERROR",
        code: "ARTIST_INVALID_INPUT",
        message: "Artist workspace data is invalid.",
        fieldErrors: validationErrors(parsed.error.issues)
      };
    }

    if (!isIanaTimezone(parsed.data.timezone)) {
      return {
        status: "VALIDATION_ERROR",
        code: "ARTIST_INVALID_TIMEZONE",
        message: "Workspace timezone must be a valid IANA timezone.",
        fieldErrors: { timezone: "Invalid IANA timezone" }
      };
    }

    if (context.actor.type !== "USER" || !context.actor.id) {
      return {
        status: "FORBIDDEN",
        code: "ARTIST_OWNER_AUTH_REQUIRED",
        message: "An authenticated user is required to create an artist workspace."
      };
    }

    const now = this.clock();
    const actorFields = { actorId: context.actor.id };
    const event: DomainEvent<{ artistName: string }> = {
      eventId: this.idFactory(),
      eventType: "ArtistCreated",
      occurredAt: now,
      recordedAt: now,
      artistId: context.artistId,
      aggregateType: "Artist",
      aggregateId: context.artistId,
      aggregateVersion: 1,
      actorType: context.actor.type,
      ...actorFields,
      correlationId: context.traceId,
      causationId: context.commandId,
      payloadVersion: 1,
      payload: { artistName: parsed.data.artistName }
    };

    const audit: AuditEvidence = {
      id: this.idFactory(),
      artistId: context.artistId,
      actorType: context.actor.type,
      ...actorFields,
      action: "ARTIST_CREATED",
      entityType: "Artist",
      entityId: context.artistId,
      traceId: context.traceId,
      metadata: { commandId: context.commandId },
      createdAt: now
    };

    try {
      const result = await this.writer.createArtistWorkspace({
        ownerUserId: context.actor.id,
        artist: {
          id: context.artistId,
          name: parsed.data.name,
          artistName: parsed.data.artistName,
          timezone: parsed.data.timezone,
          locale: parsed.data.locale,
          reportingCurrency: parsed.data.reportingCurrency,
          createdAt: now
        },
        event,
        audit,
        ...(context.idempotencyKey ? { idempotencyKey: context.idempotencyKey } : {})
      });
      return { status: "SUCCESS", data: result };
    } catch {
      return {
        status: "EXTERNAL_FAILURE",
        code: "ARTIST_PERSISTENCE_FAILED",
        message: "Artist workspace could not be created.",
        retryable: true
      };
    }
  }
}
