import { CreateEraService, type CreateEraCommand } from "@artist-os/core";
import { PgArtistFoundationWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function POST(request: Request) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const body = await readJson<CreateEraCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;

  const service = new CreateEraService(new PgArtistFoundationWriter(getDatabaseRuntime().db));
  const result = await service.execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
