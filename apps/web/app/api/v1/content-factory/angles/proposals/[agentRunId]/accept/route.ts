import { z } from "zod";
import { ContentFactoryPersistenceError } from "@artist-os/core";
import { PgAIProposalAngleWriter, PgAgentRunReader } from "@artist-os/db";
import { AcceptContentAngleProposalService } from "@/lib/accept-content-angle-proposal";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

const bodySchema = z.object({ proposalIndex: z.number().int().min(0).max(4) });

export async function POST(request: Request, context: { params: Promise<{ agentRunId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey) return apiErrorResponse({ code: "IDEMPOTENCY_KEY_REQUIRED", message: "idempotency-key header is required." }, traceId, 400);

  const { agentRunId } = await context.params;
  if (!z.string().uuid().safeParse(agentRunId).success) return apiErrorResponse({ code: "AGENT_RUN_ID_INVALID", message: "AgentRun id is invalid." }, traceId, 400);
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return apiErrorResponse({ code: "PROPOSAL_ACCEPT_INVALID", message: "Proposal acceptance request is invalid." }, traceId, 400);

  const runtime = getDatabaseRuntime();
  const service = new AcceptContentAngleProposalService(
    new PgAgentRunReader(runtime.db),
    new PgAIProposalAngleWriter(runtime.db)
  );

  try {
    const result = await service.execute({ agentRunId, proposalIndex: body.data.proposalIndex }, {
      commandId: crypto.randomUUID(),
      artistId: actorContext.artistId,
      actor: actorContext.actor,
      requestedAt: new Date(),
      idempotencyKey,
      traceId
    });
    if (result.status === "SUCCESS") return successResponse(result.data, traceId);
    const status = result.status === "NOT_FOUND" ? 404 : result.status === "VALIDATION_ERROR" ? 400 : 409;
    return apiErrorResponse({ code: result.code, message: result.message }, traceId, status);
  } catch (error) {
    if (error instanceof ContentFactoryPersistenceError && error.code === "IDEMPOTENCY_IN_PROGRESS") {
      return apiErrorResponse({ code: error.code, message: "This proposal acceptance is already in progress." }, traceId, 409);
    }
    return apiErrorResponse({ code: "PROPOSAL_ACCEPT_FAILED", message: "The proposal could not be accepted safely." }, traceId, 500);
  }
}
