import { PgContentFactoryReader } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const reader = new PgContentFactoryReader(getDatabaseRuntime().db);
  const [angles, units] = await Promise.all([
    reader.listAngles(actorContext.artistId),
    reader.listUnits(actorContext.artistId)
  ]);
  return successResponse({ angles, units }, traceId);
}
