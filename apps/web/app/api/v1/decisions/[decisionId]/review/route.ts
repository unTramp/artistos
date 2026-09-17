import { MarkDecisionUnderReviewService } from "@artist-os/core";
import { PgDecisionWriter } from "@artist-os/db";
import { commandResultResponse } from "@/lib/artist-foundation-command";
import { resolveDecisionMutationContext } from "@/lib/decision-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ decisionId: string }> }) {
  const resolution = await resolveDecisionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { decisionId } = await context.params;
  const body = await request.json().catch(() => ({})) as { rationale?: string };
  const result = await new MarkDecisionUnderReviewService(new PgDecisionWriter(getDatabaseRuntime().db))
    .execute({ decisionId, ...(body.rationale ? { rationale: body.rationale } : {}) }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
