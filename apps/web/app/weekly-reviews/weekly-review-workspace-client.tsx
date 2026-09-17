"use client";

import { useState } from "react";

type Review = {
  id: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  configurationVersion: string;
  sections: Array<{ kind: string; label: string; items: Array<{ text: string }> }>;
};

const idempotencyKey = () => `weekly-review-ui-${crypto.randomUUID()}`;
const startIsoForDateInput = (value: string) => new Date(`${value}T00:00:00.000Z`).toISOString();
const endIsoForDateInput = (value: string) => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (value === today) return now.toISOString();
  return new Date(`${value}T23:59:59.999Z`).toISOString();
};

export function WeeklyReviewWorkspaceClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const response = await fetch("/api/v1/weekly-reviews", { cache: "no-store" });
    const body = await response.json() as { data?: { reviews?: Review[] } };
    if (response.ok && body.data?.reviews) setReviews(body.data.reviews);
  }

  async function generate(formData: FormData) {
    const periodStart = String(formData.get("periodStart") ?? "");
    const periodEnd = String(formData.get("periodEnd") ?? "");
    if (!periodStart || !periodEnd) return;
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/v1/weekly-reviews/generate", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey() },
        body: JSON.stringify({ periodStart: startIsoForDateInput(periodStart), periodEnd: endIsoForDateInput(periodEnd) })
      });
      const body = await response.json() as { data?: { weeklyReviewId?: string }; error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Weekly Review could not be generated.");
      if (body.data?.weeklyReviewId) window.location.href = `/weekly-reviews/${body.data.weeklyReviewId}`;
      else await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Weekly Review could not be generated.");
      setBusy(false);
    }
  }

  const now = new Date();
  const endDefault = now.toISOString().slice(0, 10);
  const start = new Date(now); start.setUTCDate(start.getUTCDate() - 7);
  const startDefault = start.toISOString().slice(0, 10);

  return (
    <>
      <form className="decision-create-card" action={generate}>
        <div className="section-heading"><p className="eyebrow">GENERATE SNAPSHOT</p><h2>Review a real period</h2><p>Artist OS reads canonical state and captures only supported facts. A rerun creates another immutable artifact instead of rewriting history.</p></div>
        <div className="decision-form-grid">
          <label>Period start<input name="periodStart" type="date" defaultValue={startDefault} required /></label>
          <label>Period end<input name="periodEnd" type="date" defaultValue={endDefault} required /></label>
        </div>
        <div className="decision-form-actions"><button className="decision-primary-button" type="submit" disabled={busy}>{busy ? "Generating…" : "Generate Weekly Review"}</button></div>
      </form>
      {error && <div className="decision-error" role="alert">{error}</div>}
      <section className="decision-section">
        <div className="section-heading"><p className="eyebrow">HISTORY</p><h2>Immutable review artifacts</h2></div>
        {reviews.length === 0 ? <div className="empty-state compact-empty"><h3>No reviews yet</h3><p>Generate the first review when you have enough activity to inspect.</p></div> : <div className="decision-list">{reviews.map((review) => (
          <article className="decision-card" key={review.id}>
            <div className="decision-card-head"><span className="decision-status">WEEKLY REVIEW</span><span>{review.configurationVersion}</span></div>
            <h3>{new Date(review.periodStart).toLocaleDateString()} — {new Date(review.periodEnd).toLocaleDateString()}</h3>
            <p>{review.sections.reduce((count, section) => count + section.items.length, 0)} evidence-backed review items · generated {new Date(review.generatedAt).toLocaleString()}</p>
            <div className="decision-form-actions"><a className="decision-primary-button" href={`/weekly-reviews/${review.id}`}>Open review →</a></div>
          </article>
        ))}</div>}
      </section>
    </>
  );
}
