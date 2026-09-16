import type { ContentAngleContextSourceData } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { PgArtistFoundationReader } from "./artist-foundation-reader";
import { PgSongBrainReader } from "./song-brain-reader";
import { PgKnowledgeReader } from "./knowledge-reader";
import { PgContentFactoryReader } from "./content-factory-reader";

export class PgContentAngleContextReader {
  constructor(private readonly db: Stage0Database) {}

  async readSources(artistId: string, songId?: string): Promise<ContentAngleContextSourceData> {
    const identityReader = new PgArtistFoundationReader(this.db);
    const knowledgeReader = new PgKnowledgeReader(this.db);
    const factoryReader = new PgContentFactoryReader(this.db);
    const [identityHome, knowledgeHome, recentAngles, songBrain] = await Promise.all([
      identityReader.getIdentityHome(artistId),
      knowledgeReader.getHome(artistId),
      factoryReader.listAngles(artistId),
      songId ? new PgSongBrainReader(this.db).getSongBrain(artistId, songId) : Promise.resolve(null)
    ]);

    const activeIdentity = identityHome.activeVersion && identityHome.identityId
      ? {
          identityId: identityHome.identityId,
          activeVersionId: identityHome.activeVersion.id,
          versionNumber: identityHome.activeVersion.versionNumber,
          label: identityHome.activeVersion.label,
          eraId: identityHome.activeEra?.id ?? null,
          eraName: identityHome.activeEra?.name ?? null
        }
      : null;

    return {
      identity: activeIdentity,
      song: songBrain ? {
        id: songBrain.song.id,
        title: songBrain.song.title,
        genre: songBrain.song.genre,
        mood: songBrain.song.mood,
        language: songBrain.song.language,
        story: songBrain.song.story,
        meaning: songBrain.song.meaning,
        statements: songBrain.statements.map((statement) => ({
          id: statement.id,
          statementType: statement.statementType,
          statement: statement.statement,
          sourceLabel: statement.sourceLabel
        })),
        identityContext: songBrain.identityContext ? {
          id: songBrain.identityContext.id,
          identityVersionId: songBrain.identityContext.identityVersionId,
          eraIdentityId: songBrain.identityContext.eraIdentityId,
          songSpecificVisualNotes: songBrain.identityContext.songSpecificVisualNotes,
          songSpecificAnchors: songBrain.identityContext.songSpecificAnchors,
          allowedOverrides: songBrain.identityContext.allowedOverrides,
          version: songBrain.identityContext.version
        } : null
      } : null,
      approvedKnowledge: knowledgeHome.approvedKnowledge.map((item) => ({
        id: item.id,
        content: item.content,
        sourceType: item.sourceType,
        sourceId: item.sourceId
      })),
      toneExamples: knowledgeHome.toneCorpus.map((item) => ({
        id: item.id,
        textContent: item.textContent,
        label: item.label,
        sourceType: item.sourceType,
        language: item.language,
        isPrivate: item.isPrivate
      })),
      validatedLearnings: [],
      campaign: null,
      platformConstraints: [],
      productionCapability: null,
      recentAngles: recentAngles.slice(0, 12).map((angle) => ({
        id: angle.id,
        title: angle.title,
        pillar: angle.pillar,
        status: angle.status,
        idea: angle.idea
      }))
    };
  }
}
