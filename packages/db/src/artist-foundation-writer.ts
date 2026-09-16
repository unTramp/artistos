import { and, desc, eq, isNull, sql } from "drizzle-orm";
import {
  ArtistFoundationPersistenceError,
  type ArtistFoundationWritePort,
  type ActivateIdentityVersionResult,
  type CreateIdentityDraftResult,
  type EraResult,
  type FoundationEvidence,
  type SongResult
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { artistIdentities, artistIdentityVersions, auditEvents, eraIdentities, outboxEvents, songs } from "./schema";

const actorFields = (evidence: FoundationEvidence) => evidence.actorId ? { actorId: evidence.actorId } : {};

const writeEvidence = async (
  tx: Parameters<Parameters<Stage0Database["transaction"]>[0]>[0],
  input: {
    artistId: string;
    aggregateType: string;
    aggregateId: string;
    aggregateVersion: number;
    eventType: string;
    payload: Record<string, unknown>;
    auditAction: string;
    entityType: string;
    entityId: string;
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
    entityType: input.entityType,
    entityId: input.entityId,
    traceId: input.evidence.traceId,
    metadata: { commandId: input.evidence.commandId },
    createdAt: input.evidence.occurredAt
  });
};

export class PgArtistFoundationWriter implements ArtistFoundationWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createIdentityDraft(request: {
    artistId: string;
    identityId: string;
    versionId: string;
    label?: string;
    evidence: FoundationEvidence;
  }): Promise<CreateIdentityDraftResult> {
    return this.db.transaction(async (tx) => {
      let [identity] = await tx.select({ id: artistIdentities.id })
        .from(artistIdentities)
        .where(eq(artistIdentities.artistId, request.artistId))
        .limit(1);

      if (!identity) {
        [identity] = await tx.insert(artistIdentities).values({
          id: request.identityId,
          artistId: request.artistId,
          createdAt: request.evidence.occurredAt,
          updatedAt: request.evidence.occurredAt
        }).returning({ id: artistIdentities.id });
      }
      if (!identity) throw new Error("IDENTITY_NOT_CREATED");

      const [latest] = await tx.select({ versionNumber: artistIdentityVersions.versionNumber })
        .from(artistIdentityVersions)
        .where(eq(artistIdentityVersions.identityId, identity.id))
        .orderBy(desc(artistIdentityVersions.versionNumber))
        .limit(1);
      const versionNumber = (latest?.versionNumber ?? 0) + 1;

      await tx.insert(artistIdentityVersions).values({
        id: request.versionId,
        identityId: identity.id,
        artistId: request.artistId,
        versionNumber,
        ...(request.label ? { label: request.label } : {}),
        status: "DRAFT",
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ArtistIdentityVersion",
        aggregateId: request.versionId,
        aggregateVersion: versionNumber,
        eventType: "IdentityVersionDraftCreated",
        payload: { identityId: identity.id, versionNumber, label: request.label ?? null },
        auditAction: "IDENTITY_VERSION_DRAFT_CREATED",
        entityType: "ArtistIdentityVersion",
        entityId: request.versionId,
        evidence: request.evidence
      });

      return { identityId: identity.id, versionId: request.versionId, versionNumber, status: "DRAFT" };
    });
  }

  async activateIdentityVersion(request: {
    artistId: string;
    versionId: string;
    evidence: FoundationEvidence;
  }): Promise<ActivateIdentityVersionResult> {
    return this.db.transaction(async (tx) => {
      const [target] = await tx.select({
        id: artistIdentityVersions.id,
        identityId: artistIdentityVersions.identityId,
        versionNumber: artistIdentityVersions.versionNumber,
        status: artistIdentityVersions.status
      }).from(artistIdentityVersions)
        .where(and(eq(artistIdentityVersions.id, request.versionId), eq(artistIdentityVersions.artistId, request.artistId)))
        .limit(1);

      if (!target) throw new ArtistFoundationPersistenceError("IDENTITY_VERSION_NOT_FOUND");
      if (target.status !== "DRAFT" && target.status !== "REVIEW") {
        throw new ArtistFoundationPersistenceError("IDENTITY_VERSION_NOT_ACTIVATABLE");
      }

      await tx.update(artistIdentityVersions).set({
        status: "ARCHIVED",
        archivedAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).where(and(eq(artistIdentityVersions.identityId, target.identityId), eq(artistIdentityVersions.status, "ACTIVE")));

      await tx.update(artistIdentityVersions).set({
        status: "ACTIVE",
        activatedAt: request.evidence.occurredAt,
        archivedAt: null,
        updatedAt: request.evidence.occurredAt
      }).where(eq(artistIdentityVersions.id, target.id));

      await tx.update(artistIdentities).set({
        activeVersionId: target.id,
        version: sql`${artistIdentities.version} + 1`,
        updatedAt: request.evidence.occurredAt
      }).where(eq(artistIdentities.id, target.identityId));

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ArtistIdentityVersion",
        aggregateId: target.id,
        aggregateVersion: target.versionNumber,
        eventType: "IdentityVersionActivated",
        payload: { identityId: target.identityId, versionNumber: target.versionNumber },
        auditAction: "IDENTITY_VERSION_ACTIVATED",
        entityType: "ArtistIdentityVersion",
        entityId: target.id,
        evidence: request.evidence
      });

      return { identityId: target.identityId, versionId: target.id, versionNumber: target.versionNumber, status: "ACTIVE" };
    });
  }

  async createEra(request: {
    artistId: string;
    eraId: string;
    command: {
      identityVersionId: string;
      name: string;
      startDate?: string;
      endDate?: string;
      narrativeChapter?: string;
    };
    evidence: FoundationEvidence;
  }): Promise<EraResult> {
    return this.db.transaction(async (tx) => {
      const [version] = await tx.select({ id: artistIdentityVersions.id })
        .from(artistIdentityVersions)
        .where(and(eq(artistIdentityVersions.id, request.command.identityVersionId), eq(artistIdentityVersions.artistId, request.artistId)))
        .limit(1);
      if (!version) throw new ArtistFoundationPersistenceError("IDENTITY_VERSION_NOT_FOUND");

      await tx.insert(eraIdentities).values({
        id: request.eraId,
        artistId: request.artistId,
        identityVersionId: request.command.identityVersionId,
        name: request.command.name,
        ...(request.command.startDate ? { startDate: request.command.startDate } : {}),
        ...(request.command.endDate ? { endDate: request.command.endDate } : {}),
        ...(request.command.narrativeChapter ? { narrativeChapter: request.command.narrativeChapter } : {}),
        status: "DRAFT",
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "EraIdentity",
        aggregateId: request.eraId,
        aggregateVersion: 1,
        eventType: "EraDraftCreated",
        payload: { identityVersionId: request.command.identityVersionId, name: request.command.name },
        auditAction: "ERA_DRAFT_CREATED",
        entityType: "EraIdentity",
        entityId: request.eraId,
        evidence: request.evidence
      });

      return { eraId: request.eraId, identityVersionId: request.command.identityVersionId, name: request.command.name, status: "DRAFT" };
    });
  }

  async activateEra(request: { artistId: string; eraId: string; evidence: FoundationEvidence }): Promise<EraResult> {
    return this.db.transaction(async (tx) => {
      const [era] = await tx.select({
        id: eraIdentities.id,
        identityVersionId: eraIdentities.identityVersionId,
        name: eraIdentities.name,
        status: eraIdentities.status
      }).from(eraIdentities)
        .where(and(eq(eraIdentities.id, request.eraId), eq(eraIdentities.artistId, request.artistId)))
        .limit(1);
      if (!era) throw new ArtistFoundationPersistenceError("ERA_NOT_FOUND");
      if (era.status !== "DRAFT" && era.status !== "ENDED") throw new ArtistFoundationPersistenceError("ERA_NOT_ACTIVATABLE");

      const [identityVersion] = await tx.select({ status: artistIdentityVersions.status })
        .from(artistIdentityVersions)
        .where(and(eq(artistIdentityVersions.id, era.identityVersionId), eq(artistIdentityVersions.artistId, request.artistId)))
        .limit(1);
      if (identityVersion?.status !== "ACTIVE") throw new ArtistFoundationPersistenceError("ERA_IDENTITY_VERSION_NOT_ACTIVE");

      const [otherActive] = await tx.select({ id: eraIdentities.id }).from(eraIdentities)
        .where(and(eq(eraIdentities.artistId, request.artistId), eq(eraIdentities.status, "ACTIVE")))
        .limit(1);
      if (otherActive && otherActive.id !== era.id) throw new ArtistFoundationPersistenceError("ERA_ACTIVE_EXISTS");

      await tx.update(eraIdentities).set({ status: "ACTIVE", updatedAt: request.evidence.occurredAt })
        .where(eq(eraIdentities.id, era.id));

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "EraIdentity",
        aggregateId: era.id,
        aggregateVersion: 1,
        eventType: "EraActivated",
        payload: { identityVersionId: era.identityVersionId, name: era.name },
        auditAction: "ERA_ACTIVATED",
        entityType: "EraIdentity",
        entityId: era.id,
        evidence: request.evidence
      });
      return { eraId: era.id, identityVersionId: era.identityVersionId, name: era.name, status: "ACTIVE" };
    });
  }

  async endEra(request: { artistId: string; eraId: string; evidence: FoundationEvidence }): Promise<EraResult> {
    return this.db.transaction(async (tx) => {
      const [era] = await tx.select({
        id: eraIdentities.id,
        identityVersionId: eraIdentities.identityVersionId,
        name: eraIdentities.name,
        status: eraIdentities.status,
        endDate: eraIdentities.endDate
      }).from(eraIdentities)
        .where(and(eq(eraIdentities.id, request.eraId), eq(eraIdentities.artistId, request.artistId)))
        .limit(1);
      if (!era) throw new ArtistFoundationPersistenceError("ERA_NOT_FOUND");
      if (era.status !== "ACTIVE") throw new ArtistFoundationPersistenceError("ERA_NOT_ACTIVATABLE");

      const endDate = era.endDate ?? request.evidence.occurredAt.toISOString().slice(0, 10);
      await tx.update(eraIdentities).set({ status: "ENDED", endDate, updatedAt: request.evidence.occurredAt })
        .where(eq(eraIdentities.id, era.id));

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "EraIdentity",
        aggregateId: era.id,
        aggregateVersion: 1,
        eventType: "EraEnded",
        payload: { identityVersionId: era.identityVersionId, name: era.name, endDate },
        auditAction: "ERA_ENDED",
        entityType: "EraIdentity",
        entityId: era.id,
        evidence: request.evidence
      });
      return { eraId: era.id, identityVersionId: era.identityVersionId, name: era.name, status: "ENDED" };
    });
  }

  async createSong(request: {
    artistId: string;
    songId: string;
    command: {
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
    };
    evidence: FoundationEvidence;
  }): Promise<SongResult> {
    return this.db.transaction(async (tx) => {
      if (request.command.isrc) {
        const [conflict] = await tx.select({ id: songs.id }).from(songs)
          .where(and(eq(songs.artistId, request.artistId), eq(songs.isrc, request.command.isrc), isNull(songs.archivedAt)))
          .limit(1);
        if (conflict) throw new ArtistFoundationPersistenceError("SONG_DUPLICATE_ISRC");
      }

      await tx.insert(songs).values({
        id: request.songId,
        artistId: request.artistId,
        title: request.command.title,
        ...(request.command.type ? { type: request.command.type } : {}),
        isOriginal: request.command.isOriginal,
        ...(request.command.originalArtist ? { originalArtist: request.command.originalArtist } : {}),
        ...(request.command.genre ? { genre: request.command.genre } : {}),
        ...(request.command.mood ? { mood: request.command.mood } : {}),
        ...(request.command.language ? { language: request.command.language } : {}),
        ...(request.command.story ? { story: request.command.story } : {}),
        ...(request.command.meaning ? { meaning: request.command.meaning } : {}),
        ...(request.command.lyricsReference ? { lyricsReference: request.command.lyricsReference } : {}),
        ...(request.command.isrc ? { isrc: request.command.isrc } : {}),
        ...(request.command.platformLinks ? { platformLinks: request.command.platformLinks } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "Song",
        aggregateId: request.songId,
        aggregateVersion: 1,
        eventType: "SongCreated",
        payload: { title: request.command.title, isOriginal: request.command.isOriginal },
        auditAction: "SONG_CREATED",
        entityType: "Song",
        entityId: request.songId,
        evidence: request.evidence
      });
      return { songId: request.songId, title: request.command.title, isOriginal: request.command.isOriginal };
    });
  }
}
