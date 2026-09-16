import { ApproveContentExecutionRevisionService } from "@artist-os/core";
import { PgContentExecutionReader, PgContentExecutionWriter } from "@artist-os/db";
import { commandResultResponse, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { apiErrorResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ unitId: string; revisionId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { unitId, revisionId } = await context.params;
  const runtime = getDatabaseRuntime();
  const revisions = await new PgContentExecutionReader(runtime.db).listRevisions(resolution.commandContext.artistId, unitId);
  if (!revisions.some((revision) => revision.id === revisionId)) {
    return apiErrorResponse({ code: "EXECUTION_REVISION_NOT_FOUND", message: "The execution revision was not found for this Content Unit." }, resolution.traceId, 404);
  }
  const result = await new ApproveContentExecutionRevisionService(new PgContentExecutionWriter(runtime.db))
    .execute({ revisionId }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
