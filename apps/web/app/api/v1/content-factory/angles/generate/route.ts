import { z } from "zod";
import { PgAgentRunWriter, PgContentAngleContextReader, PgRequestIdempotency } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { createConfiguredAIProvider } from "@/lib/ai-provider";
import { GenerateContentAnglesService, type GenerateContentAnglesOutput } from "@/lib/content-angle-generation";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

const bodySchema = z.object({
  explicitRequest: z.string().trim().min(1).max(2000),
  songId: z.string().uuid().optional(),
  platformTargets: z.array(z.string().trim().min(1).max(120)).max(12).optional(),
  maxCandidates: z.number().int().min(1).max(5).optional()
});

export async function POST(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey) return apiErrorResponse({ code: "IDEMPOTENCY_KEY_REQUIRED", message: "idempotency-key header is required." }, traceId, 400);

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return apiErrorResponse({ code: "CONTENT_ANGLE_GENERATION_INVALID", message: "Generation request is invalid." }, traceId, 400);

  const runtime = getDatabaseRuntime();
  const gate = new PgRequestIdempotency(runtime.db);
  const scope = `GenerateContentAngles:${actorContext.artistId}:${actorContext.actor.id}`;
  const claim = await gate.claim<GenerateContentAnglesOutput>({
    scope,
    key: idempotencyKey,
    commandName: "GenerateContentAngles",
    artistId: actorContext.artistId,
    now: new Date()
  });
  if (claim.status === "REPLAY") return successResponse(claim.result, traceId);
  if (claim.status === "IN_PROGRESS") return apiErrorResponse({ code: "IDEMPOTENCY_IN_PROGRESS", message: "This generation request is already in progress." }, traceId, 409);

  try {
    const service = new GenerateContentAnglesService(
      new PgContentAngleContextReader(runtime.db),
      createConfiguredAIProvider(),
      new PgAgentRunWriter(runtime.db)
    );
    const result = await service.execute({
      artistId: actorContext.artistId,
      traceId,
      explicitRequest: body.data.explicitRequest,
      ...(body.data.songId ? { songId: body.data.songId } : {}),
      ...(body.data.platformTargets ? { platformTargets: body.data.platformTargets } : {}),
      ...(body.data.maxCandidates !== undefined ? { maxCandidates: body.data.maxCandidates } : {})
    });
    await gate.complete(claim.recordId, result, new Date());
    return successResponse(result, traceId);
  } catch (error) {
    await gate.abandon(claim.recordId);
    return apiErrorResponse({ code: "CONTENT_ANGLE_GENERATION_FAILED", message: "Content Angle generation failed safely; the manual Factory remains available." }, traceId, 500);
  }
}
