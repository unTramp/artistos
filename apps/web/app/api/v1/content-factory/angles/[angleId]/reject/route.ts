import { RejectContentAngleService, type AngleRejectionReason } from "@artist-os/core";
import { PgContentFactoryWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

type RejectBody = { reason: AngleRejectionReason; note?: string };

export async function POST(request: Request, context: { params: Promise<{ angleId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<RejectBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { angleId } = await context.params;
  const result = await new RejectContentAngleService(new PgContentFactoryWriter(getDatabaseRuntime().db))
    .execute({ angleId, reason: body.reason, ...(body.note ? { note: body.note } : {}) }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
