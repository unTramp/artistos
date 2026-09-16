import { and, desc, eq, isNull } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { artistIdentities, artistIdentityVersions, eraIdentities, songs } from "./schema";

export interface IdentityHomeProjection {
  state: "NO_IDENTITY" | "DRAFT_ONLY" | "ACTIVE" | "ACTIVE_WITH_DRAFT";
  identityId: string | null;
  activeVersion: {
    id: string;
    versionNumber: number;
    label: string | null;
    status: string;
    activatedAt: string | null;
  } | null;
  draftVersions: Array<{
    id: string;
    versionNumber: number;
    label: string | null;
    status: string;
    createdAt: string;
  }>;
  activeEra: {
    id: string;
    name: string;
    identityVersionId: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
  } | null;
  eras: Array<{
    id: string;
    name: string;
    identityVersionId: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
  }>;
}

export interface SongListItem {
  id: string;
  title: string;
  type: string | null;
  isOriginal: boolean;
  originalArtist: string | null;
  genre: string | null;
  mood: string | null;
  language: string | null;
  isrc: string | null;
  createdAt: string;
  updatedAt: string;
}

export class PgArtistFoundationReader {
  constructor(private readonly db: Stage0Database) {}

  async getIdentityHome(artistId: string): Promise<IdentityHomeProjection> {
    const [identity] = await this.db.select({
      id: artistIdentities.id,
      activeVersionId: artistIdentities.activeVersionId
    }).from(artistIdentities).where(eq(artistIdentities.artistId, artistId)).limit(1);

    if (!identity) {
      return { state: "NO_IDENTITY", identityId: null, activeVersion: null, draftVersions: [], activeEra: null, eras: [] };
    }

    const versions = await this.db.select({
      id: artistIdentityVersions.id,
      versionNumber: artistIdentityVersions.versionNumber,
      label: artistIdentityVersions.label,
      status: artistIdentityVersions.status,
      activatedAt: artistIdentityVersions.activatedAt,
      createdAt: artistIdentityVersions.createdAt
    }).from(artistIdentityVersions)
      .where(and(eq(artistIdentityVersions.artistId, artistId), eq(artistIdentityVersions.identityId, identity.id)))
      .orderBy(desc(artistIdentityVersions.versionNumber));

    const eras = await this.db.select({
      id: eraIdentities.id,
      name: eraIdentities.name,
      identityVersionId: eraIdentities.identityVersionId,
      status: eraIdentities.status,
      startDate: eraIdentities.startDate,
      endDate: eraIdentities.endDate
    }).from(eraIdentities)
      .where(eq(eraIdentities.artistId, artistId))
      .orderBy(desc(eraIdentities.createdAt));

    const activeRaw = versions.find((version) => version.id === identity.activeVersionId) ?? versions.find((version) => version.status === "ACTIVE") ?? null;
    const draftsRaw = versions.filter((version) => version.status === "DRAFT" || version.status === "REVIEW");
    const activeEraRaw = eras.find((era) => era.status === "ACTIVE") ?? null;

    const state: IdentityHomeProjection["state"] = activeRaw
      ? draftsRaw.length > 0 ? "ACTIVE_WITH_DRAFT" : "ACTIVE"
      : "DRAFT_ONLY";

    return {
      state,
      identityId: identity.id,
      activeVersion: activeRaw ? {
        id: activeRaw.id,
        versionNumber: activeRaw.versionNumber,
        label: activeRaw.label,
        status: activeRaw.status,
        activatedAt: activeRaw.activatedAt?.toISOString() ?? null
      } : null,
      draftVersions: draftsRaw.map((version) => ({
        id: version.id,
        versionNumber: version.versionNumber,
        label: version.label,
        status: version.status,
        createdAt: version.createdAt.toISOString()
      })),
      activeEra: activeEraRaw ? {
        id: activeEraRaw.id,
        name: activeEraRaw.name,
        identityVersionId: activeEraRaw.identityVersionId,
        status: activeEraRaw.status,
        startDate: activeEraRaw.startDate,
        endDate: activeEraRaw.endDate
      } : null,
      eras: eras.map((era) => ({
        id: era.id,
        name: era.name,
        identityVersionId: era.identityVersionId,
        status: era.status,
        startDate: era.startDate,
        endDate: era.endDate
      }))
    };
  }

  async listSongs(artistId: string): Promise<SongListItem[]> {
    const rows = await this.db.select({
      id: songs.id,
      title: songs.title,
      type: songs.type,
      isOriginal: songs.isOriginal,
      originalArtist: songs.originalArtist,
      genre: songs.genre,
      mood: songs.mood,
      language: songs.language,
      isrc: songs.isrc,
      createdAt: songs.createdAt,
      updatedAt: songs.updatedAt
    }).from(songs)
      .where(and(eq(songs.artistId, artistId), isNull(songs.archivedAt)))
      .orderBy(desc(songs.updatedAt));

    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }));
  }
}
