import { CreateSongService, type CreateSongCommand } from "@artist-os/core";
import { PgArtistFoundationReader, PgArtistFoundationWriter } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);

  if (!actorContext) {
    return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  }
  if (!actorContext.artistId) {
    return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);
  }

  const reader = new PgArtistFoundationReader(getDatabaseRuntime().db);
  const songs = await reader.listSongs(actorContext.artistId);
  return successResponse(songs, traceId);
}

export async function POST(request: Request) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const body = await readJson<CreateSongCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;

  const service = new CreateSongService(new PgArtistFoundationWriter(getDatabaseRuntime().db));
  const result = await service.execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
