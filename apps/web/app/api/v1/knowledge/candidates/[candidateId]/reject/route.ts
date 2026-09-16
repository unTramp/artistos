import { RejectCandidateKnowledgeService } from "@artist-os/core";
import { PgKnowledgeWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

type RejectBody = { reason?: string };

export async function POST(request: Request, context: { params: Promise<{ candidateId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<RejectBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { candidateId } = await context.params;

  const result = await new RejectCandidateKnowledgeService(new PgKnowledgeWriter(getDatabaseRuntime().db))
    .execute({ candidateId, ...(body.reason ? { reason: body.reason } : {}) }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
