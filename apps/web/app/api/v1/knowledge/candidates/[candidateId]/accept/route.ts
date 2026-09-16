import { AcceptCandidateKnowledgeService } from "@artist-os/core";
import { PgKnowledgeWriter } from "@artist-os/db";
import { commandResultResponse, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ candidateId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { candidateId } = await context.params;

  const result = await new AcceptCandidateKnowledgeService(new PgKnowledgeWriter(getDatabaseRuntime().db))
    .execute({ candidateId }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
