import { CreateWeeklyReviewService, type CreateWeeklyReviewCommand } from "@artist-os/core";
import { PgWeeklyReviewWriter, listWeeklyReviews } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const reviews = await listWeeklyReviews(getDatabaseRuntime().db, actorContext.artistId);
  return successResponse({ reviews }, traceId);
}

export async function POST(request: Request) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateWeeklyReviewCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;

  const result = await new CreateWeeklyReviewService(new PgWeeklyReviewWriter(getDatabaseRuntime().db)).execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
