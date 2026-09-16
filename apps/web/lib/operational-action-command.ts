import { apiErrorResponse } from "./http";
import { resolveArtistMutationContext, type ArtistMutationContext } from "./artist-foundation-command";

export async function resolveOperationalActionMutationContext(request: Request): Promise<ArtistMutationContext | Response> {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const raw = request.headers.get("if-match")?.trim();
  if (!raw) return resolution;
  const normalized = raw.replace(/^W\//, "").replace(/^"|"$/g, "");
  const expectedVersion = Number(normalized);
  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    return apiErrorResponse({ code: "INVALID_IF_MATCH", message: "If-Match must contain a positive integer Operational Action version." }, resolution.traceId, 400);
  }

  return {
    ...resolution,
    commandContext: { ...resolution.commandContext, expectedVersion }
  };
}
