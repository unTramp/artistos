import { BlockOperationalActionService } from "@artist-os/core";
import { PgOperationalActionWriter } from "@artist-os/db";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { resolveOperationalActionMutationContext } from "@/lib/operational-action-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ actionId: string }> }) {
  const resolution = await resolveOperationalActionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { actionId } = await context.params;
  const body = await readJson<{ reason: string }>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const result = await new BlockOperationalActionService(new PgOperationalActionWriter(getDatabaseRuntime().db))
    .execute({ actionId, reason: body.reason }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
