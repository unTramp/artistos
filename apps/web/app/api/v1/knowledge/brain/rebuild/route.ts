import { RebuildArtistBrainService } from "@artist-os/core";
import { PgKnowledgeWriter } from "@artist-os/db";
import { commandResultResponse, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const result = await new RebuildArtistBrainService(new PgKnowledgeWriter(getDatabaseRuntime().db))
    .execute(resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
