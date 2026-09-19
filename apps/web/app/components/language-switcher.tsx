"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useI18n } from "./locale-provider";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, messages } = useI18n();

  const selectLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = nextLocale;
    startTransition(() => router.refresh());
  };

  return (
    <div className="language-switcher" role="group" aria-label={messages.shell.languageLabel}>
      <button
        type="button"
        className={locale === "en" ? "active" : undefined}
        aria-pressed={locale === "en"}
        onClick={() => selectLocale("en")}
      >
        {messages.shell.english}
      </button>
      <button
        type="button"
        className={locale === "ru" ? "active" : undefined}
        aria-pressed={locale === "ru"}
        onClick={() => selectLocale("ru")}
      >
        {messages.shell.russian}
      </button>
    </div>
  );
}
