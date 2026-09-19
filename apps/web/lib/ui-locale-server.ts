import "server-only";

import { cookies, headers } from "next/headers";
import { PgWorkspaceSettingsReader } from "@artist-os/db";
import { DEFAULT_UI_LOCALE, normalizeUiLocale, UI_LOCALE_COOKIE, type UiLocale } from "./i18n";
import { resolveAuthenticatedActorContext } from "./actor-context";
import { getDatabaseRuntime } from "./runtime";

export async function resolveUiLocale(artistId?: string | null): Promise<UiLocale> {
  const store = await cookies();
  const cookieValue = store.get(UI_LOCALE_COOKIE)?.value;
  if (cookieValue) return normalizeUiLocale(cookieValue);

  let resolvedArtistId = artistId ?? null;
  if (artistId === undefined) {
    const actorContext = await resolveAuthenticatedActorContext(await headers());
    resolvedArtistId = actorContext?.artistId ?? null;
  }

  if (resolvedArtistId) {
    const reader = new PgWorkspaceSettingsReader(getDatabaseRuntime().db);
    const persisted = await reader.getLocale(resolvedArtistId);
    if (persisted) return normalizeUiLocale(persisted);
  }

  return DEFAULT_UI_LOCALE;
}
