import { StartOperationalActionService } from "@artist-os/core";
import { PgOperationalActionWriter } from "@artist-os/db";
import { commandResultResponse } from "@/lib/artist-foundation-command";
import { resolveOperationalActionMutationContext } from "@/lib/operational-action-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ actionId: string }> }) {
  const resolution = await resolveOperationalActionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { actionId } = await context.params;
  const result = await new StartOperationalActionService(new PgOperationalActionWriter(getDatabaseRuntime().db))
    .execute({ actionId }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
