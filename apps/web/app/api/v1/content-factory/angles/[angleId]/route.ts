import { EditContentAngleService, type EditContentAngleCommand } from "@artist-os/core";
import { PgContentFactoryReader, PgContentFactoryWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

type EditBody = Omit<EditContentAngleCommand, "angleId">;

export async function GET(request: Request, context: { params: Promise<{ angleId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);
  const { angleId } = await context.params;
  const angle = await new PgContentFactoryReader(getDatabaseRuntime().db).getAngle(actorContext.artistId, angleId);
  if (!angle) return apiErrorResponse({ code: "ANGLE_NOT_FOUND", message: "Content Angle was not found." }, traceId, 404);
  return successResponse(angle, traceId);
}

export async function PATCH(request: Request, context: { params: Promise<{ angleId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<EditBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { angleId } = await context.params;

  const service = new EditContentAngleService(new PgContentFactoryWriter(getDatabaseRuntime().db));
  const result = await service.execute({ angleId, ...body }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
