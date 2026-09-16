import { CreateArtistService, type CreateArtistCommand, type CommandStatus } from "@artist-os/core";
import { PgArtistWorkspaceWriter } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "../../../../lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "../../../../lib/http";
import { getDatabaseRuntime } from "../../../../lib/runtime";

const statusByCommandStatus: Record<Exclude<CommandStatus, "SUCCESS">, number> = {
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BLOCKED: 409,
  RETRYABLE_FAILURE: 503,
  EXTERNAL_FAILURE: 503
};

export async function POST(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);

  if (!actorContext) {
    return apiErrorResponse(
      { code: "AUTH_REQUIRED", message: "Authentication is required." },
      traceId,
      401
    );
  }

  if (actorContext.artistId) {
    return successResponse({ artistId: actorContext.artistId, existing: true }, traceId);
  }

  let body: CreateArtistCommand;
  try {
    body = (await request.json()) as CreateArtistCommand;
  } catch {
    return apiErrorResponse(
      { code: "INVALID_JSON", message: "Request body must be valid JSON." },
      traceId,
      400
    );
  }

  const artistId = crypto.randomUUID();
  const commandId = crypto.randomUUID();
  const writer = new PgArtistWorkspaceWriter(getDatabaseRuntime().db);
  const service = new CreateArtistService(writer);
  const idempotencyKey = request.headers.get("idempotency-key")?.trim() || undefined;

  const result = await service.execute(body, {
    commandId,
    artistId,
    actor: actorContext.actor,
    requestedAt: new Date(),
    traceId,
    ...(idempotencyKey ? { idempotencyKey } : {})
  });

  if (result.status === "SUCCESS") {
    return successResponse({ ...result.data, existing: false }, traceId, result.data.replayed ? 200 : 201);
  }

  return apiErrorResponse(
    {
      code: result.code,
      message: result.message,
      ...(result.retryable !== undefined ? { retryable: result.retryable } : {}),
      ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {})
    },
    traceId,
    statusByCommandStatus[result.status]
  );
}
