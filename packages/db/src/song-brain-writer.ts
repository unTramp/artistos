import { and, eq, sql } from "drizzle-orm";
import {
  ArtistFoundationPersistenceError,
  type FoundationEvidence,
  type SongBrainStatementResult,
  type SongBrainWritePort,
  type SongIdentityContextResult
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import {
  artistIdentityVersions,
  auditEvents,
  eraIdentities,
  idempotencyRecords,
  outboxEvents,
  songBrainStatements,
  songIdentityContexts,
  songs
} from "./schema";

type SongBrainTx = Parameters<Parameters<Stage0Database["transaction"]>[0]>[0];

const actorFields = (evidence: FoundationEvidence) => evidence.actorId ? { actorId: evidence.actorId } : {};

const runIdempotent = async <T>(
  tx: SongBrainTx,
  artistId: string,
  evidence: FoundationEvidence,
  commandName: string,
  work: () => Promise<T>
): Promise<T> => {
  if (!evidence.idempotencyKey) return work();

  const actorScope = evidence.actorId ?? evidence.actorType;
  const scope = `SongBrain:${commandName}:${artistId}:${actorScope}`;
  const [claim] = await tx.insert(idempotencyRecords).values({
    scope,
    key: evidence.idempotencyKey,
    commandName,
    artistId,
    status: "IN_PROGRESS",
    createdAt: evidence.occurredAt,
    updatedAt: evidence.occurredAt
  }).onConflictDoNothing().returning({ id: idempotencyRecords.id });

  if (!claim) {
    const [existing] = await tx.select({ status: idempotencyRecords.status, result: idempotencyRecords.result })
      .from(idempotencyRecords)
      .where(and(eq(idempotencyRecords.scope, scope), eq(idempotencyRecords.key, evidence.idempotencyKey)))
      .limit(1);
    if (existing?.status === "SUCCESS" && existing.result) return existing.result as T;
    throw new ArtistFoundationPersistenceError("IDEMPOTENCY_IN_PROGRESS");
  }

  const result = await work();
  await tx.update(idempotencyRecords).set({
    status: "SUCCESS",
    result: result as Record<string, unknown>,
    updatedAt: evidence.occurredAt
  }).where(eq(idempotencyRecords.id, claim.id));
  return result;
};

const writeEvidence = async (
  tx: SongBrainTx,
  input: {
    artistId: string;
    aggregateType: string;
    aggregateId: string;
    aggregateVersion: number;
    eventType: string;
    payload: Record<string, unknown>;
    auditAction: string;
    evidence: FoundationEvidence;
  }
) => {
  await tx.insert(outboxEvents).values({
    id: crypto.randomUUID(),
    artistId: input.artistId,
    eventType: input.eventType,
    aggregateType: input.aggregateType,
    aggregateId: input.aggregateId,
    aggregateVersion: input.aggregateVersion,
    actorType: input.evidence.actorType,
    ...actorFields(input.evidence),
    correlationId: input.evidence.traceId,
    causationId: input.evidence.commandId,
    payloadVersion: 1,
    payload: input.payload,
    occurredAt: input.evidence.occurredAt,
    recordedAt: input.evidence.occurredAt
  });

  await tx.insert(auditEvents).values({
    id: crypto.randomUUID(),
    artistId: input.artistId,
    actorType: input.evidence.actorType,
    ...actorFields(input.evidence),
    action: input.auditAction,
    entityType: input.aggregateType,
    entityId: input.aggregateId,
    traceId: input.evidence.traceId,
    metadata: { commandId: input.evidence.commandId },
    createdAt: input.evidence.occurredAt
  });
};

export class PgSongBrainWriter implements SongBrainWritePort {
  constructor(private readonly db: Stage0Database) {}

  async addStatement(request: Parameters<SongBrainWritePort["addStatement"]>[0]): Promise<SongBrainStatementResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "AddSongBrainStatement", async () => {
      const [song] = await tx.select({ id: songs.id }).from(songs)
        .where(and(eq(songs.id, request.command.songId), eq(songs.artistId, request.artistId)))
        .limit(1);
      if (!song) throw new ArtistFoundationPersistenceError("SONG_NOT_FOUND");

      await tx.insert(songBrainStatements).values({
        id: request.statementId,
        artistId: request.artistId,
        songId: request.command.songId,
        statementType: request.command.statementType,
        statement: request.command.statement,
        ...(request.command.sourceLabel ? { sourceLabel: request.command.sourceLabel } : {}),
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "SongBrainStatement",
        aggregateId: request.statementId,
        aggregateVersion: 1,
        eventType: "SongBrainStatementAdded",
        payload: { songId: request.command.songId, statementType: request.command.statementType },
        auditAction: "SONG_BRAIN_STATEMENT_ADDED",
        evidence: request.evidence
      });

      return {
        statementId: request.statementId,
        songId: request.command.songId,
        statementType: request.command.statementType,
        statement: request.command.statement
      };
    }));
  }

  async configureIdentityContext(request: Parameters<SongBrainWritePort["configureIdentityContext"]>[0]): Promise<SongIdentityContextResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "ConfigureSongIdentityContext", async () => {
      const [song] = await tx.select({ id: songs.id }).from(songs)
        .where(and(eq(songs.id, request.command.songId), eq(songs.artistId, request.artistId)))
        .limit(1);
      if (!song) throw new ArtistFoundationPersistenceError("SONG_NOT_FOUND");

      const [identityVersion] = await tx.select({ id: artistIdentityVersions.id })
        .from(artistIdentityVersions)
        .where(and(eq(artistIdentityVersions.id, request.command.identityVersionId), eq(artistIdentityVersions.artistId, request.artistId)))
        .limit(1);
      if (!identityVersion) throw new ArtistFoundationPersistenceError("IDENTITY_VERSION_NOT_FOUND");

      if (request.command.eraIdentityId) {
        const [era] = await tx.select({ identityVersionId: eraIdentities.identityVersionId })
          .from(eraIdentities)
          .where(and(eq(eraIdentities.id, request.command.eraIdentityId), eq(eraIdentities.artistId, request.artistId)))
          .limit(1);
        if (!era) throw new ArtistFoundationPersistenceError("ERA_NOT_FOUND");
        if (era.identityVersionId !== request.command.identityVersionId) {
          throw new ArtistFoundationPersistenceError("SONG_ERA_IDENTITY_MISMATCH");
        }
      }

      const [existing] = await tx.select({ id: songIdentityContexts.id, version: songIdentityContexts.version })
        .from(songIdentityContexts)
        .where(eq(songIdentityContexts.songId, request.command.songId))
        .limit(1);

      const contextId = existing?.id ?? request.contextId;
      const nextVersion = (existing?.version ?? 0) + 1;
      if (existing) {
        await tx.update(songIdentityContexts).set({
          identityVersionId: request.command.identityVersionId,
          eraIdentityId: request.command.eraIdentityId ?? null,
          songSpecificVisualNotes: request.command.songSpecificVisualNotes ?? null,
          songSpecificAnchors: request.command.songSpecificAnchors ?? [],
          allowedOverrides: request.command.allowedOverrides ?? [],
          version: nextVersion,
          updatedAt: request.evidence.occurredAt
        }).where(eq(songIdentityContexts.id, existing.id));
      } else {
        await tx.insert(songIdentityContexts).values({
          id: contextId,
          artistId: request.artistId,
          songId: request.command.songId,
          identityVersionId: request.command.identityVersionId,
          ...(request.command.eraIdentityId ? { eraIdentityId: request.command.eraIdentityId } : {}),
          ...(request.command.songSpecificVisualNotes ? { songSpecificVisualNotes: request.command.songSpecificVisualNotes } : {}),
          songSpecificAnchors: request.command.songSpecificAnchors ?? [],
          allowedOverrides: request.command.allowedOverrides ?? [],
          version: nextVersion,
          createdAt: request.evidence.occurredAt,
          updatedAt: request.evidence.occurredAt
        });
      }

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "SongIdentityContext",
        aggregateId: contextId,
        aggregateVersion: nextVersion,
        eventType: "SongIdentityContextConfigured",
        payload: {
          songId: request.command.songId,
          identityVersionId: request.command.identityVersionId,
          eraIdentityId: request.command.eraIdentityId ?? null
        },
        auditAction: "SONG_IDENTITY_CONTEXT_CONFIGURED",
        evidence: request.evidence
      });

      await tx.update(songs).set({
        version: sql`${songs.version} + 1`,
        updatedAt: request.evidence.occurredAt
      }).where(eq(songs.id, request.command.songId));

      return {
        contextId,
        songId: request.command.songId,
        identityVersionId: request.command.identityVersionId,
        eraIdentityId: request.command.eraIdentityId ?? null
      };
    }));
  }
}
