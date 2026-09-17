import { DeprecateLearningService } from "@artist-os/core";
import { PgLearningWriter } from "@artist-os/db";
import { commandResultResponse } from "@/lib/artist-foundation-command";
import { resolveLearningMutationContext } from "@/lib/learning-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ learningId: string }> }) {
  const resolution = await resolveLearningMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { learningId } = await context.params;
  const body = await request.json().catch(() => ({})) as { rationale?: string };
  const result = await new DeprecateLearningService(new PgLearningWriter(getDatabaseRuntime().db)).execute({ learningId, ...(body.rationale ? { rationale: body.rationale } : {}) }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
