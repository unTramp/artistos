import { CreateContentExecutionRevisionService } from "@artist-os/core";
import { PgContentExecutionReader, PgContentExecutionWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

type CreateBody = {
  format: string;
  productionIntent: "AUTHENTIC" | "CASUAL" | "POLISHED" | "CINEMATIC" | "EXPERIMENTAL";
  hookType?: string;
  hookText?: string;
  structure: string;
  scriptOrPerformanceConcept: string;
  shotList: Array<{ sequence: number; instruction: string }>;
  editBrief: string;
  caption?: string;
  cta?: string;
  platformNotes: Array<{ platform: string; note: string }>;
  feasibilityNotes: string;
  fallbackPlan?: string;
};

export async function GET(request: Request, context: { params: Promise<{ unitId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);
  const { unitId } = await context.params;
  const reader = new PgContentExecutionReader(getDatabaseRuntime().db);
  const revisions = await reader.listRevisions(actorContext.artistId, unitId);
  return successResponse({ revisions }, traceId);
}

export async function POST(request: Request, context: { params: Promise<{ unitId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { unitId } = await context.params;
  const result = await new CreateContentExecutionRevisionService(new PgContentExecutionWriter(getDatabaseRuntime().db)).execute({
    contentUnitId: unitId,
    format: body.format,
    productionIntent: body.productionIntent,
    ...(body.hookType ? { hookType: body.hookType } : {}),
    ...(body.hookText ? { hookText: body.hookText } : {}),
    structure: body.structure,
    scriptOrPerformanceConcept: body.scriptOrPerformanceConcept,
    shotList: body.shotList,
    editBrief: body.editBrief,
    ...(body.caption ? { caption: body.caption } : {}),
    ...(body.cta ? { cta: body.cta } : {}),
    platformNotes: body.platformNotes,
    feasibilityNotes: body.feasibilityNotes,
    ...(body.fallbackPlan ? { fallbackPlan: body.fallbackPlan } : {})
  }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
