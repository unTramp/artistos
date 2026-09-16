import { and, desc, eq } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { songs } from "./schema";
import { contentAngles, contentUnits } from "./content-factory-schema";

export interface ContentFactoryAngleReadModel {
  id: string;
  songId: string | null;
  songTitle: string | null;
  title: string;
  idea: string;
  pillar: string;
  mode: string;
  goal: string;
  audience: string;
  platformTargets: string[];
  requiredAssets: string[];
  learningValue: string;
  why: string;
  identityFitRationale: string;
  productionEffort: string;
  status: string;
  version: number;
  identityVersionId: string | null;
  eraIdentityId: string | null;
  rejectionReason: string | null;
  decisionNote: string | null;
  updatedAt: Date;
}

export interface ContentFactoryUnitReadModel {
  id: string;
  unitCode: string;
  angleId: string | null;
  songId: string | null;
  songTitle: string | null;
  title: string;
  pillar: string;
  format: string | null;
  platformTargets: string[];
  priority: string | null;
  status: string;
  identityVersionId: string;
  eraIdentityId: string | null;
  updatedAt: Date;
}

export class PgContentFactoryReader {
  constructor(private readonly db: Stage0Database) {}

  async listAngles(artistId: string): Promise<ContentFactoryAngleReadModel[]> {
    const rows = await this.db.select({
      id: contentAngles.id,
      songId: contentAngles.songId,
      songTitle: songs.title,
      title: contentAngles.title,
      idea: contentAngles.idea,
      pillar: contentAngles.pillar,
      mode: contentAngles.mode,
      goal: contentAngles.goal,
      audience: contentAngles.audience,
      platformTargets: contentAngles.platformTargets,
      requiredAssets: contentAngles.requiredAssets,
      learningValue: contentAngles.learningValue,
      why: contentAngles.why,
      identityFitRationale: contentAngles.identityFitRationale,
      productionEffort: contentAngles.productionEffort,
      status: contentAngles.status,
      version: contentAngles.version,
      identityVersionId: contentAngles.identityVersionId,
      eraIdentityId: contentAngles.eraIdentityId,
      rejectionReason: contentAngles.rejectionReason,
      decisionNote: contentAngles.decisionNote,
      updatedAt: contentAngles.updatedAt
    }).from(contentAngles)
      .leftJoin(songs, and(eq(songs.id, contentAngles.songId), eq(songs.artistId, artistId)))
      .where(eq(contentAngles.artistId, artistId))
      .orderBy(desc(contentAngles.updatedAt));
    return rows;
  }

  async listUnits(artistId: string): Promise<ContentFactoryUnitReadModel[]> {
    return this.db.select({
      id: contentUnits.id,
      unitCode: contentUnits.unitCode,
      angleId: contentUnits.angleId,
      songId: contentUnits.songId,
      songTitle: songs.title,
      title: contentUnits.title,
      pillar: contentUnits.pillar,
      format: contentUnits.format,
      platformTargets: contentUnits.platformTargets,
      priority: contentUnits.priority,
      status: contentUnits.status,
      identityVersionId: contentUnits.identityVersionId,
      eraIdentityId: contentUnits.eraIdentityId,
      updatedAt: contentUnits.updatedAt
    }).from(contentUnits)
      .leftJoin(songs, and(eq(songs.id, contentUnits.songId), eq(songs.artistId, artistId)))
      .where(eq(contentUnits.artistId, artistId))
      .orderBy(desc(contentUnits.updatedAt));
  }

  async getAngle(artistId: string, angleId: string): Promise<ContentFactoryAngleReadModel | null> {
    const rows = await this.db.select({
      id: contentAngles.id,
      songId: contentAngles.songId,
      songTitle: songs.title,
      title: contentAngles.title,
      idea: contentAngles.idea,
      pillar: contentAngles.pillar,
      mode: contentAngles.mode,
      goal: contentAngles.goal,
      audience: contentAngles.audience,
      platformTargets: contentAngles.platformTargets,
      requiredAssets: contentAngles.requiredAssets,
      learningValue: contentAngles.learningValue,
      why: contentAngles.why,
      identityFitRationale: contentAngles.identityFitRationale,
      productionEffort: contentAngles.productionEffort,
      status: contentAngles.status,
      version: contentAngles.version,
      identityVersionId: contentAngles.identityVersionId,
      eraIdentityId: contentAngles.eraIdentityId,
      rejectionReason: contentAngles.rejectionReason,
      decisionNote: contentAngles.decisionNote,
      updatedAt: contentAngles.updatedAt
    }).from(contentAngles)
      .leftJoin(songs, and(eq(songs.id, contentAngles.songId), eq(songs.artistId, artistId)))
      .where(and(eq(contentAngles.artistId, artistId), eq(contentAngles.id, angleId)))
      .limit(1);
    return rows[0] ?? null;
  }
}
