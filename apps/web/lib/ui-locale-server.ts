import "server-only";

import { cookies } from "next/headers";
import { PgWorkspaceSettingsReader } from "@artist-os/db";
import { DEFAULT_UI_LOCALE, normalizeUiLocale, UI_LOCALE_COOKIE, type UiLocale } from "./i18n";
import { getDatabaseRuntime } from "./runtime";

export async function resolveUiLocale(artistId?: string | null): Promise<UiLocale> {
  const store = await cookies();
  const cookieValue = store.get(UI_LOCALE_COOKIE)?.value;
  if (cookieValue) return normalizeUiLocale(cookieValue);

  if (artistId) {
    const reader = new PgWorkspaceSettingsReader(getDatabaseRuntime().db);
    const persisted = await reader.getLocale(artistId);
    if (persisted) return normalizeUiLocale(persisted);
  }

  return DEFAULT_UI_LOCALE;
}
