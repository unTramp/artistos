import type { CommandContext, CommandResult, CommandStatus } from "@artist-os/core";
import { apiErrorResponse, getTraceId, successResponse } from "./http";
import { resolveAuthenticatedActorContext } from "./actor-context";

const statusByCommandStatus: Record<Exclude<CommandStatus, "SUCCESS">, number> = {
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BLOCKED: 409,
  RETRYABLE_FAILURE: 503,
  EXTERNAL_FAILURE: 503
};

export type ArtistMutationContext = {
  traceId: string;
  commandContext: CommandContext;
};

export async function resolveArtistMutationContext(request: Request): Promise<ArtistMutationContext | Response> {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);

  if (!actorContext) {
    return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  }

  if (!actorContext.artistId) {
    return apiErrorResponse({ code: "ARTIST_SCOPE_REQUIRED", message: "Artist workspace must exist before this command can run." }, traceId, 409);
  }

  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey) {
    return apiErrorResponse({ code: "IDEMPOTENCY_KEY_REQUIRED", message: "idempotency-key header is required for artist mutations." }, traceId, 400);
  }

  return {
    traceId,
    commandContext: {
      commandId: crypto.randomUUID(),
      artistId: actorContext.artistId,
      actor: actorContext.actor,
      requestedAt: new Date(),
      idempotencyKey,
      traceId
    }
  };
}

export function commandResultResponse<T>(result: CommandResult<T>, traceId: string, successStatus = 200) {
  if (result.status === "SUCCESS") return successResponse(result.data, traceId, successStatus);

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

export async function readJson<T>(request: Request, traceId: string): Promise<T | Response> {
  try {
    return await request.json() as T;
  } catch {
    return apiErrorResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON." }, traceId, 400);
  }
}
