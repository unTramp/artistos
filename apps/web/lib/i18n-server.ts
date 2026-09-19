import { cookies } from "next/headers";
import { normalizeLocale, type Locale } from "./i18n";

export const localeCookieName = "artist-os-locale";

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(localeCookieName)?.value);
}
