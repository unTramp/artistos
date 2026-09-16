import { CreateContentAngleService, type CreateContentAngleCommand } from "@artist-os/core";
import { PgContentFactoryWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateContentAngleCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;

  const service = new CreateContentAngleService(new PgContentFactoryWriter(getDatabaseRuntime().db));
  const result = await service.execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
