import { RelabelToneCorpusItemService, type ToneCorpusLabel } from "@artist-os/core";
import { PgKnowledgeWriter } from "@artist-os/db";
import { commandResultResponse, readJson, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { getDatabaseRuntime } from "@/lib/runtime";

type RelabelBody = { label: ToneCorpusLabel };

export async function POST(request: Request, context: { params: Promise<{ itemId: string }> }) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<RelabelBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { itemId } = await context.params;

  const result = await new RelabelToneCorpusItemService(new PgKnowledgeWriter(getDatabaseRuntime().db))
    .execute({ itemId, label: body.label }, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId);
}
