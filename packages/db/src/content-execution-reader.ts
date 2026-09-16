import { and, desc, eq } from "drizzle-orm";
import type { ContentExecutionSnapshot, ContentExecutionRevisionStatus } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { contentUnits } from "./content-factory-schema";
import { contentExecutionRevisions } from "./content-execution-schema";

export interface ContentExecutionRevisionProjection {
  id: string;
  contentUnitId: string;
  revisionNumber: number;
  status: ContentExecutionRevisionStatus;
  sourceType: string;
  format: string;
  productionIntent: string;
  identityVersionId: string;
  eraIdentityId: string | null;
  snapshot: ContentExecutionSnapshot;
  decisionReason: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export class PgContentExecutionReader {
  constructor(private readonly db: Stage0Database) {}

  async listRevisions(artistId: string, contentUnitId: string): Promise<ContentExecutionRevisionProjection[]> {
    const [unit] = await this.db.select({ id: contentUnits.id }).from(contentUnits)
      .where(and(eq(contentUnits.id, contentUnitId), eq(contentUnits.artistId, artistId)))
      .limit(1);
    if (!unit) return [];

    const rows = await this.db.select().from(contentExecutionRevisions)
      .where(and(eq(contentExecutionRevisions.artistId, artistId), eq(contentExecutionRevisions.contentUnitId, contentUnitId)))
      .orderBy(desc(contentExecutionRevisions.revisionNumber));

    return rows.map((row) => ({
      id: row.id,
      contentUnitId: row.contentUnitId,
      revisionNumber: row.revisionNumber,
      status: row.status as ContentExecutionRevisionStatus,
      sourceType: row.sourceType,
      format: row.format,
      productionIntent: row.productionIntent,
      identityVersionId: row.identityVersionId,
      eraIdentityId: row.eraIdentityId,
      snapshot: row.snapshot,
      decisionReason: row.decisionReason,
      decidedAt: row.decidedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString()
    }));
  }

  async getApprovedRevision(artistId: string, contentUnitId: string): Promise<ContentExecutionRevisionProjection | null> {
    const rows = await this.db.select().from(contentExecutionRevisions)
      .where(and(
        eq(contentExecutionRevisions.artistId, artistId),
        eq(contentExecutionRevisions.contentUnitId, contentUnitId),
        eq(contentExecutionRevisions.status, "APPROVED")
      ))
      .orderBy(desc(contentExecutionRevisions.revisionNumber))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      contentUnitId: row.contentUnitId,
      revisionNumber: row.revisionNumber,
      status: row.status as ContentExecutionRevisionStatus,
      sourceType: row.sourceType,
      format: row.format,
      productionIntent: row.productionIntent,
      identityVersionId: row.identityVersionId,
      eraIdentityId: row.eraIdentityId,
      snapshot: row.snapshot,
      decisionReason: row.decisionReason,
      decidedAt: row.decidedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString()
    };
  }
}
