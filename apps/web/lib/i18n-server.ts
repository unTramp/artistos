import { cookies } from "next/headers";
import { localeCookieName, normalizeLocale, type Locale } from "./i18n";

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(localeCookieName)?.value);
}
