import { PgSongBrainReader } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request, context: { params: Promise<{ songId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const { songId } = await context.params;
  const brain = await new PgSongBrainReader(getDatabaseRuntime().db).getSongBrain(actorContext.artistId, songId);
  if (!brain) return apiErrorResponse({ code: "SONG_NOT_FOUND", message: "Song was not found in the current artist scope." }, traceId, 404);
  return successResponse(brain, traceId);
}
