import type { ActorType } from "@artist-os/core";
import { PgArtistScopeReader } from "@artist-os/db";
import { auth } from "./auth";
import { getDatabaseRuntime } from "./runtime";

export interface AuthenticatedActorContext {
  actor: { type: Extract<ActorType, "USER">; id: string };
  user: { id: string; email: string };
  artistId: string | null;
}

export async function resolveAuthenticatedActorContext(requestHeaders: Headers): Promise<AuthenticatedActorContext | null> {
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.id || !session.user.email) return null;

  const scopeReader = new PgArtistScopeReader(getDatabaseRuntime().db);
  const artistId = await scopeReader.findArtistIdByAuthUserId(session.user.id);

  return {
    actor: { type: "USER", id: session.user.id },
    user: { id: session.user.id, email: session.user.email },
    artistId
  };
}
