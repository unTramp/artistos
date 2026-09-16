import { MergeCandidateKnowledgeService } from "@artist-os/core";
import { PgKnowledgeWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

type MergeBody = { targetCandidateId: string };

export async function POST(request: Request, context: { params: Promise<{ candidateId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<MergeBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { candidateId } = await context.params;

  const result = await new MergeCandidateKnowledgeService(new PgKnowledgeWriter(getDatabaseRuntime().db))
    .execute({ candidateId, targetCandidateId: body.targetCandidateId }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
