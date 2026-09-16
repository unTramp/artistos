import { ActivateIdentityVersionService } from "@artist-os/core";
import { PgArtistFoundationWriter } from "@artist-os/db";
import { commandResultResponse, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request, context: { params: Promise<{ versionId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const { versionId } = await context.params;
  const service = new ActivateIdentityVersionService(new PgArtistFoundationWriter(getDatabaseRuntime().db));
  const result = await service.execute(versionId, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
