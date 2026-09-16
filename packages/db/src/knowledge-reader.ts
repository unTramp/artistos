import { and, desc, eq, isNull } from "drizzle-orm";
import type { CandidateKnowledgeDestination, CandidateKnowledgeStatus, ToneCorpusLabel } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { artistBrainKnowledgeItems, artistBrainSnapshots, candidateKnowledge, toneCorpusItems } from "./knowledge-schema";

export interface KnowledgeHomeReadModel {
  toneCorpus: Array<{
    id: string;
    textContent: string;
    label: ToneCorpusLabel;
    sourceType: string;
    sourceReference: string | null;
    language: string | null;
    isPrivate: boolean;
    createdAt: Date;
  }>;
  candidates: Array<{
    id: string;
    content: string;
    sourceType: string;
    sourceId: string;
    destination: CandidateKnowledgeDestination;
    destinationTargetId: string | null;
    status: CandidateKnowledgeStatus;
    promotedEntityType: string | null;
    promotedEntityId: string | null;
    mergedIntoCandidateId: string | null;
    resolutionReason: string | null;
    createdAt: Date;
    resolvedAt: Date | null;
  }>;
  approvedKnowledge: Array<{
    id: string;
    content: string;
    sourceCandidateId: string;
    sourceType: string;
    sourceId: string;
    createdAt: Date;
  }>;
  latestSnapshot: {
    id: string;
    versionNumber: number;
    payload: Record<string, unknown>;
    sourceRefs: unknown;
    builtAt: Date;
  } | null;
}

export class PgKnowledgeReader {
  constructor(private readonly db: Stage0Database) {}

  async getHome(artistId: string): Promise<KnowledgeHomeReadModel> {
    const [toneCorpus, candidates, approvedKnowledge, snapshots] = await Promise.all([
      this.db.select({
        id: toneCorpusItems.id,
        textContent: toneCorpusItems.textContent,
        label: toneCorpusItems.label,
        sourceType: toneCorpusItems.sourceType,
        sourceReference: toneCorpusItems.sourceReference,
        language: toneCorpusItems.language,
        isPrivate: toneCorpusItems.isPrivate,
        createdAt: toneCorpusItems.createdAt
      }).from(toneCorpusItems)
        .where(and(eq(toneCorpusItems.artistId, artistId), isNull(toneCorpusItems.archivedAt)))
        .orderBy(desc(toneCorpusItems.createdAt)),
      this.db.select({
        id: candidateKnowledge.id,
        content: candidateKnowledge.content,
        sourceType: candidateKnowledge.sourceType,
        sourceId: candidateKnowledge.sourceId,
        destination: candidateKnowledge.destination,
        destinationTargetId: candidateKnowledge.destinationTargetId,
        status: candidateKnowledge.status,
        promotedEntityType: candidateKnowledge.promotedEntityType,
        promotedEntityId: candidateKnowledge.promotedEntityId,
        mergedIntoCandidateId: candidateKnowledge.mergedIntoCandidateId,
        resolutionReason: candidateKnowledge.resolutionReason,
        createdAt: candidateKnowledge.createdAt,
        resolvedAt: candidateKnowledge.resolvedAt
      }).from(candidateKnowledge)
        .where(eq(candidateKnowledge.artistId, artistId))
        .orderBy(desc(candidateKnowledge.createdAt)),
      this.db.select({
        id: artistBrainKnowledgeItems.id,
        content: artistBrainKnowledgeItems.content,
        sourceCandidateId: artistBrainKnowledgeItems.sourceCandidateId,
        sourceType: artistBrainKnowledgeItems.sourceType,
        sourceId: artistBrainKnowledgeItems.sourceId,
        createdAt: artistBrainKnowledgeItems.createdAt
      }).from(artistBrainKnowledgeItems)
        .where(and(eq(artistBrainKnowledgeItems.artistId, artistId), isNull(artistBrainKnowledgeItems.archivedAt)))
        .orderBy(desc(artistBrainKnowledgeItems.createdAt)),
      this.db.select({
        id: artistBrainSnapshots.id,
        versionNumber: artistBrainSnapshots.versionNumber,
        payload: artistBrainSnapshots.payload,
        sourceRefs: artistBrainSnapshots.sourceRefs,
        builtAt: artistBrainSnapshots.builtAt
      }).from(artistBrainSnapshots)
        .where(eq(artistBrainSnapshots.artistId, artistId))
        .orderBy(desc(artistBrainSnapshots.versionNumber))
        .limit(1)
    ]);

    return {
      toneCorpus: toneCorpus.map((item) => ({ ...item, label: item.label as ToneCorpusLabel })),
      candidates: candidates.map((item) => ({
        ...item,
        destination: item.destination as CandidateKnowledgeDestination,
        status: item.status as CandidateKnowledgeStatus
      })),
      approvedKnowledge,
      latestSnapshot: snapshots[0]
        ? {
            ...snapshots[0],
            payload: snapshots[0].payload as Record<string, unknown>
          }
        : null
    };
  }
}
