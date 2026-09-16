import { ConfigureSongIdentityContextService, type ConfigureSongIdentityContextCommand } from "@artist-os/core";
import { PgSongBrainWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

type IdentityContextBody = Omit<ConfigureSongIdentityContextCommand, "songId">;

export async function POST(request: Request, context: { params: Promise<{ songId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const body = await readJson<IdentityContextBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { songId } = await context.params;

  const service = new ConfigureSongIdentityContextService(new PgSongBrainWriter(getDatabaseRuntime().db));
  const result = await service.execute({ songId, ...body }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
