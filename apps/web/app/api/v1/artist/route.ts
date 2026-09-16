import { NextResponse } from "next/server";
import { CreateArtistService, type CreateArtistCommand, type CommandStatus } from "@artist-os/core";
import { PgArtistScopeReader, PgArtistWorkspaceWriter } from "@artist-os/db";
import { auth } from "../../../../lib/auth";
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

function response<T>(data: T, traceId: string, status = 200) {
  return NextResponse.json(
    { data, meta: { traceId } },
    { status, headers: { "x-trace-id": traceId } }
  );
}

function errorResponse(
  error: { code: string; message: string; retryable?: boolean; fieldErrors?: Record<string, string> },
  traceId: string,
  status: number
) {
  return NextResponse.json(
    { error, meta: { traceId } },
    { status, headers: { "x-trace-id": traceId } }
  );
}

export async function POST(request: Request) {
  const traceId = request.headers.get("x-trace-id")?.trim() || crypto.randomUUID();
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return errorResponse(
      { code: "AUTH_REQUIRED", message: "Authentication is required." },
      traceId,
      401
    );
  }

  const { db } = getDatabaseRuntime();
  const scopeReader = new PgArtistScopeReader(db);
  const existingArtistId = await scopeReader.findArtistIdByAuthUserId(session.user.id);
  if (existingArtistId) {
    return response({ artistId: existingArtistId, existing: true }, traceId);
  }

  let body: CreateArtistCommand;
  try {
    body = (await request.json()) as CreateArtistCommand;
  } catch {
    return errorResponse(
      { code: "INVALID_JSON", message: "Request body must be valid JSON." },
      traceId,
      400
    );
  }

  const artistId = crypto.randomUUID();
  const commandId = crypto.randomUUID();
  const writer = new PgArtistWorkspaceWriter(db);
  const service = new CreateArtistService(writer);
  const idempotencyKey = request.headers.get("idempotency-key")?.trim() || undefined;

  const result = await service.execute(body, {
    commandId,
    artistId,
    actor: { type: "USER", id: session.user.id },
    requestedAt: new Date(),
    traceId,
    ...(idempotencyKey ? { idempotencyKey } : {})
  });

  if (result.status === "SUCCESS") {
    return response({ ...result.data, existing: false }, traceId, result.data.replayed ? 200 : 201);
  }

  return errorResponse(
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
