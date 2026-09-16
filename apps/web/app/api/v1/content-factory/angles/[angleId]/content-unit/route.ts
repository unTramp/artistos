import { CreateContentUnitFromAngleService } from "@artist-os/core";
import { PgContentFactoryReader, PgContentFactoryWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { apiErrorResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

type ConvertBody = { priority?: string };

const duplicateConversionResponse = (traceId: string) => apiErrorResponse(
  {
    code: "ANGLE_ALREADY_CONVERTED",
    message: "This Content Angle already has a canonical Content Unit."
  },
  traceId,
  409
);

export async function POST(request: Request, context: { params: Promise<{ angleId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<ConvertBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { angleId } = await context.params;
  const runtime = getDatabaseRuntime();
  const reader = new PgContentFactoryReader(runtime.db);
  const existingUnits = await reader.listUnits(resolution.commandContext.artistId);

  if (existingUnits.some((unit) => unit.angleId === angleId)) {
    return duplicateConversionResponse(resolution.traceId);
  }

  const result = await new CreateContentUnitFromAngleService(new PgContentFactoryWriter(runtime.db))
    .execute({ angleId, ...(body.priority ? { priority: body.priority } : {}) }, resolution.commandContext);

  if (result.status === "EXTERNAL_FAILURE" && result.code === "CONTENT_FACTORY_PERSISTENCE_FAILED") {
    const unitsAfterFailure = await reader.listUnits(resolution.commandContext.artistId);
    if (unitsAfterFailure.some((unit) => unit.angleId === angleId)) {
      return duplicateConversionResponse(resolution.traceId);
    }
  }

  return commandResultResponse(result, resolution.traceId, 201);
}
