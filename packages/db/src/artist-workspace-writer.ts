import { and, eq } from "drizzle-orm";
import type { ArtistWorkspaceWritePort, CreateArtistPersistenceRequest, CreateArtistResult } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { artistMemberships, artists, auditEvents, idempotencyRecords, outboxEvents, workspaceSettings } from "./schema";

export class PgArtistWorkspaceWriter implements ArtistWorkspaceWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createArtistWorkspace(request: CreateArtistPersistenceRequest): Promise<CreateArtistResult> {
    return this.db.transaction(async (tx) => {
      const scope = "CreateArtist";

      if (request.idempotencyKey) {
        const claimed = await tx.insert(idempotencyRecords).values({
          scope,
          key: request.idempotencyKey,
          commandName: "CreateArtist",
          artistId: request.artist.id,
          status: "IN_PROGRESS"
        }).onConflictDoNothing().returning({ id: idempotencyRecords.id });

        if (claimed.length === 0) {
          const [existing] = await tx.select({ status: idempotencyRecords.status, result: idempotencyRecords.result })
            .from(idempotencyRecords)
            .where(and(eq(idempotencyRecords.scope, scope), eq(idempotencyRecords.key, request.idempotencyKey)))
            .limit(1);

          if (existing?.status === "SUCCESS" && existing.result) {
            const previous = existing.result as Omit<CreateArtistResult, "replayed">;
            return { ...previous, replayed: true };
          }
          throw new Error("IDEMPOTENCY_IN_PROGRESS");
        }
      }

      const [existingMembership] = await tx.select({ artistId: artistMemberships.artistId })
        .from(artistMemberships)
        .where(eq(artistMemberships.authUserId, request.ownerUserId))
        .limit(1);

      if (existingMembership) {
        throw new Error("AUTH_USER_ALREADY_HAS_ARTIST");
      }

      await tx.insert(artists).values({
        id: request.artist.id,
        name: request.artist.name,
        artistName: request.artist.artistName,
        createdAt: request.artist.createdAt,
        updatedAt: request.artist.createdAt
      });

      const [workspace] = await tx.insert(workspaceSettings).values({
        artistId: request.artist.id,
        timezone: request.artist.timezone,
        locale: request.artist.locale,
        reportingCurrency: request.artist.reportingCurrency,
        createdAt: request.artist.createdAt,
        updatedAt: request.artist.createdAt
      }).returning({ id: workspaceSettings.id });

      if (!workspace) throw new Error("WORKSPACE_SETTINGS_NOT_CREATED");

      await tx.insert(artistMemberships).values({
        artistId: request.artist.id,
        authUserId: request.ownerUserId,
        role: "OWNER",
        createdAt: request.artist.createdAt
      });

      await tx.insert(outboxEvents).values({
        id: request.event.eventId,
        artistId: request.event.artistId,
        eventType: request.event.eventType,
        aggregateType: request.event.aggregateType,
        aggregateId: request.event.aggregateId,
        aggregateVersion: request.event.aggregateVersion,
        actorType: request.event.actorType,
        actorId: request.event.actorId,
        correlationId: request.event.correlationId,
        causationId: request.event.causationId,
        payloadVersion: request.event.payloadVersion,
        payload: request.event.payload,
        occurredAt: request.event.occurredAt,
        recordedAt: request.event.recordedAt
      });

      await tx.insert(auditEvents).values({
        id: request.audit.id,
        artistId: request.audit.artistId,
        actorType: request.audit.actorType,
        actorId: request.audit.actorId,
        action: request.audit.action,
        entityType: request.audit.entityType,
        entityId: request.audit.entityId,
        traceId: request.audit.traceId,
        metadata: request.audit.metadata,
        createdAt: request.audit.createdAt
      });

      const result = { artistId: request.artist.id, workspaceSettingsId: workspace.id };

      if (request.idempotencyKey) {
        await tx.update(idempotencyRecords).set({
          status: "SUCCESS",
          result,
          updatedAt: new Date()
        }).where(and(eq(idempotencyRecords.scope, scope), eq(idempotencyRecords.key, request.idempotencyKey)));
      }

      return { ...result, replayed: false };
    });
  }
}
