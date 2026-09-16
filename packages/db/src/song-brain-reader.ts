import { and, asc, eq } from "drizzle-orm";
import type { SongBrainStatementType } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { artistIdentityVersions, eraIdentities, songBrainStatements, songIdentityContexts, songs } from "./schema";

export interface SongBrainProjection {
  song: {
    id: string;
    title: string;
    isOriginal: boolean;
    originalArtist: string | null;
    genre: string | null;
    mood: string | null;
    language: string | null;
    story: string | null;
    meaning: string | null;
  };
  statements: Array<{
    id: string;
    statementType: SongBrainStatementType;
    statement: string;
    sourceLabel: string | null;
    createdAt: string;
  }>;
  identityContext: {
    id: string;
    identityVersionId: string;
    identityVersionNumber: number;
    identityVersionStatus: string;
    eraIdentityId: string | null;
    eraName: string | null;
    songSpecificVisualNotes: string | null;
    songSpecificAnchors: string[];
    allowedOverrides: string[];
    version: number;
  } | null;
}

export class PgSongBrainReader {
  constructor(private readonly db: Stage0Database) {}

  async getSongBrain(artistId: string, songId: string): Promise<SongBrainProjection | null> {
    const [song] = await this.db.select({
      id: songs.id,
      title: songs.title,
      isOriginal: songs.isOriginal,
      originalArtist: songs.originalArtist,
      genre: songs.genre,
      mood: songs.mood,
      language: songs.language,
      story: songs.story,
      meaning: songs.meaning
    }).from(songs)
      .where(and(eq(songs.id, songId), eq(songs.artistId, artistId)))
      .limit(1);
    if (!song) return null;

    const statementRows = await this.db.select({
      id: songBrainStatements.id,
      statementType: songBrainStatements.statementType,
      statement: songBrainStatements.statement,
      sourceLabel: songBrainStatements.sourceLabel,
      createdAt: songBrainStatements.createdAt
    }).from(songBrainStatements)
      .where(and(eq(songBrainStatements.songId, songId), eq(songBrainStatements.artistId, artistId)))
      .orderBy(asc(songBrainStatements.createdAt));

    const [context] = await this.db.select({
      id: songIdentityContexts.id,
      identityVersionId: songIdentityContexts.identityVersionId,
      identityVersionNumber: artistIdentityVersions.versionNumber,
      identityVersionStatus: artistIdentityVersions.status,
      eraIdentityId: songIdentityContexts.eraIdentityId,
      eraName: eraIdentities.name,
      songSpecificVisualNotes: songIdentityContexts.songSpecificVisualNotes,
      songSpecificAnchors: songIdentityContexts.songSpecificAnchors,
      allowedOverrides: songIdentityContexts.allowedOverrides,
      version: songIdentityContexts.version
    }).from(songIdentityContexts)
      .innerJoin(artistIdentityVersions, eq(songIdentityContexts.identityVersionId, artistIdentityVersions.id))
      .leftJoin(eraIdentities, eq(songIdentityContexts.eraIdentityId, eraIdentities.id))
      .where(and(eq(songIdentityContexts.songId, songId), eq(songIdentityContexts.artistId, artistId)))
      .limit(1);

    return {
      song,
      statements: statementRows.map((row) => ({
        id: row.id,
        statementType: row.statementType as SongBrainStatementType,
        statement: row.statement,
        sourceLabel: row.sourceLabel,
        createdAt: row.createdAt.toISOString()
      })),
      identityContext: context ? {
        id: context.id,
        identityVersionId: context.identityVersionId,
        identityVersionNumber: context.identityVersionNumber,
        identityVersionStatus: context.identityVersionStatus,
        eraIdentityId: context.eraIdentityId,
        eraName: context.eraName,
        songSpecificVisualNotes: context.songSpecificVisualNotes,
        songSpecificAnchors: Array.isArray(context.songSpecificAnchors) ? context.songSpecificAnchors as string[] : [],
        allowedOverrides: Array.isArray(context.allowedOverrides) ? context.allowedOverrides as string[] : [],
        version: context.version
      } : null
    };
  }
}
