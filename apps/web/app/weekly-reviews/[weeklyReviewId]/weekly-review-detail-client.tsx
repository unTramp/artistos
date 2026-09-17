"use client";

import { useState } from "react";

type Reference = { refType: string; refId: string };
type EpistemicLabel = "FACT" | "OBSERVATION" | "HYPOTHESIS" | "RECOMMENDATION";
type Item = { text: string; epistemicLabel?: EpistemicLabel; references?: Reference[] };
type Section = { kind: string; label: string; items: Item[] };
type Review = { id: string; generatedAt: string; configurationVersion: string; sections: Section[] };

const idempotencyKey = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const canCreateDecision = (kind: string) => kind === "DECISIONS_TO_MAKE" || kind === "RECOMMENDED_NEXT_FOCUS";
const canCreateAction = (kind: string) => kind === "NEXT_ACTIONS" || kind === "SIGNALS";

export function WeeklyReviewDetailClient({ review }: { review: Review }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createDecision(section: Section, item: Item, itemIndex: number) {
    const title = window.prompt("Decision title", section.kind === "RECOMMENDED_NEXT_FOCUS" ? "Set next focus" : "Commit Weekly Review decision");
    if (!title) return;
    const decision = window.prompt("What are we choosing?", item.text);
    if (!decision) return;
    const reason = window.prompt("Why are we choosing this?", `Based on Weekly Review: ${item.text}`);
    if (!reason) return;
    const scope = window.prompt("Decision scope", "weekly_review")?.trim();
    if (!scope) return;
    setBusy(true); setError(null);
    try {
      const response = await fetch(`/api/v1/weekly-reviews/${review.id}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey("decision-from-weekly-review") },
        body: JSON.stringify({ title, decision, reason, scope, sectionKind: section.kind, itemIndex })
      });
      const body = await response.json() as { data?: { decisionId?: string }; error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Decision could not be created.");
      if (body.data?.decisionId) window.location.href = `/decisions/${body.data.decisionId}`;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Decision could not be created.");
      setBusy(false);
    }
  }

  async function createAction(section: Section, item: Item, itemIndex: number) {
    const title = window.prompt("Action title", item.text.replace(/^(Continue|Resolve|Blocked|Due):\s*/i, ""));
    if (!title) return;
    const description = window.prompt("Optional action detail", `Created from Weekly Review: ${item.text}`)?.trim() || undefined;
    setBusy(true); setError(null);
    try {
      const response = await fetch(`/api/v1/weekly-reviews/${review.id}/action`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey("action-from-weekly-review") },
        body: JSON.stringify({
          title,
          description,
          actionType: "WEEKLY_REVIEW_FOLLOW_UP",
          priority: section.kind === "SIGNALS" ? "HIGH" : "NORMAL",
          executionMode: "MANUAL_NATIVE",
          sectionKind: section.kind,
          itemIndex
        })
      });
      const body = await response.json() as { data?: { actionId?: string }; error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Operational Action could not be created.");
      window.location.href = "/";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Operational Action could not be created.");
      setBusy(false);
    }
  }

  return (
    <>
      <section className="decision-toolbar">
        <div><span className="status-chip">Epistemic labels enforced</span><span className="muted-note">{review.configurationVersion} · generated {new Date(review.generatedAt).toLocaleString()}</span></div>
        <a className="decision-secondary-button" href="/">Back to Today</a>
      </section>
      {error && <div className="decision-error" role="alert">{error}</div>}
      <div className="decision-list">
        {review.sections.map((section) => (
          <section className="decision-section" key={section.kind}>
            <div className="section-heading"><p className="eyebrow">{section.kind.replaceAll("_", " ")}</p><h2>{section.label}</h2></div>
            {section.items.length === 0 ? <div className="quiet-state">No supported signal in this snapshot.</div> : section.items.map((item, itemIndex) => (
              <article className="decision-card" key={`${section.kind}-${itemIndex}`}>
                <div className="status-row"><span className="status-chip">{item.epistemicLabel ?? "LEGACY · UNLABELLED"}</span></div>
                <p>{item.text}</p>
                {item.references?.length ? <small>{item.references.map((reference) => `${reference.refType}:${reference.refId}`).join(" · ")}</small> : null}
                {(canCreateDecision(section.kind) || canCreateAction(section.kind)) && <div className="decision-form-actions">
                  {canCreateDecision(section.kind) && <button className="decision-primary-button" type="button" disabled={busy} onClick={() => void createDecision(section, item, itemIndex)}>Turn into Decision →</button>}
                  {canCreateAction(section.kind) && <button className="decision-primary-button" type="button" disabled={busy} onClick={() => void createAction(section, item, itemIndex)}>Create Action →</button>}
                </div>}
              </article>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
