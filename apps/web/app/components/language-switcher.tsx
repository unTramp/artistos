"use client";

import { useState } from "react";
import { getUiCopy, type UiLocale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: UiLocale }) {
  const [saving, setSaving] = useState(false);
  const copy = getUiCopy(locale);

  async function setLocale(next: UiLocale) {
    if (next === locale || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/v1/workspace/locale", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: next })
      });
      if (!response.ok) throw new Error("LOCALE_UPDATE_FAILED");
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="language-switcher" role="group" aria-label={copy.language.label} aria-busy={saving}>
      <button type="button" className={locale === "en" ? "active" : undefined} onClick={() => void setLocale("en")} disabled={saving}>EN</button>
      <button type="button" className={locale === "ru" ? "active" : undefined} onClick={() => void setLocale("ru")} disabled={saving}>RU</button>
    </div>
  );
}
