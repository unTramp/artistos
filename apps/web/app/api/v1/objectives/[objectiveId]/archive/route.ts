import { ArchivePlanningObjectiveService } from "@artist-os/core";
import { PgPlanningObjectiveWriter } from "@artist-os/db";
import { commandResultResponse } from "@/lib/artist-foundation-command";
import { resolvePlanningObjectiveMutationContext } from "@/lib/planning-objective-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ objectiveId: string }> }) {
  const resolution = await resolvePlanningObjectiveMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { objectiveId } = await context.params;
  const result = await new ArchivePlanningObjectiveService(new PgPlanningObjectiveWriter(getDatabaseRuntime().db))
    .execute({ objectiveId }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
