"use client";

import { useState } from "react";
import { getUiCopy, localeCookieName, type Locale } from "@/lib/i18n";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const [pending, setPending] = useState(false);
  const copy = getUiCopy(locale).locale;

  const setLocale = (next: Locale) => {
    if (next === locale || pending) return;
    setPending(true);
    document.cookie = `${localeCookieName}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    window.location.reload();
  };

  return (
    <div className="locale-switcher" role="group" aria-label={copy.label}>
      <button type="button" onClick={() => setLocale("en")} aria-pressed={locale === "en"} disabled={pending}>EN</button>
      <button type="button" onClick={() => setLocale("ru")} aria-pressed={locale === "ru"} disabled={pending}>RU</button>
    </div>
  );
}
