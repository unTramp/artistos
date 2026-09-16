"use client";

import { FormEvent, useMemo, useState } from "react";

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const browserTimezone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch { return "UTC"; }
  }, []);
  const browserLocale = useMemo(() => typeof navigator === "undefined" ? "en" : (navigator.language || "en"), []);

  const [name, setName] = useState(defaultName);
  const [artistName, setArtistName] = useState(defaultName);
  const [timezone, setTimezone] = useState(browserTimezone);
  const [locale, setLocale] = useState(browserLocale);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/v1/artist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "idempotency-key": crypto.randomUUID()
        },
        body: JSON.stringify({
          name,
          artistName,
          timezone,
          locale,
          reportingCurrency: "USD"
        })
      });
      const body = await response.json() as { error?: { message?: string } };
      if (!response.ok) {
        setMessage(body.error?.message ?? "Could not create artist workspace.");
        return;
      }
      window.location.assign("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="onboarding-form" onSubmit={submit}>
      <label>
        <span>Your name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        <span>Artist name</span>
        <input value={artistName} onChange={(event) => setArtistName(event.target.value)} required />
      </label>
      <div className="onboarding-grid">
        <label>
          <span>Timezone</span>
          <input value={timezone} onChange={(event) => setTimezone(event.target.value)} required />
        </label>
        <label>
          <span>Language / locale</span>
          <input value={locale} onChange={(event) => setLocale(event.target.value)} required />
        </label>
      </div>
      <button className="primary-action onboarding-submit" disabled={submitting} type="submit">{submitting ? "Creating…" : "Create my Artist OS"}</button>
      {message ? <p className="form-message" role="status">{message}</p> : null}
    </form>
  );
}
