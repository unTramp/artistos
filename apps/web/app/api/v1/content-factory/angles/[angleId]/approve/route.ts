import { ApproveContentAngleService } from "@artist-os/core";
import { PgContentFactoryWriter } from "@artist-os/db";
import { commandResultResponse, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ angleId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const { angleId } = await context.params;
  const result = await new ApproveContentAngleService(new PgContentFactoryWriter(getDatabaseRuntime().db))
    .execute({ angleId }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
