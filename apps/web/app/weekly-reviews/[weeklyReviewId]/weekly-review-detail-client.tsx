"use client";

import { useState } from "react";
import { entityReferenceKey, shortEntityId, type ResolvedEntityReference } from "@/lib/entity-reference";

type Reference = { refType: string; refId: string };
type EpistemicLabel = "FACT" | "OBSERVATION" | "HYPOTHESIS" | "RECOMMENDATION";
type Item = { text: string; epistemicLabel?: EpistemicLabel; references?: Reference[] };
type Section = { kind: string; label: string; items: Item[] };
type Review = { id: string; generatedAt: string; configurationVersion: string; sections: Section[] };
type FocusDraft = { section: Section; item: Item; itemIndex: number };

const idempotencyKey = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const canCreateDecision = (kind: string) => kind === "DECISIONS_TO_MAKE" || kind === "RECOMMENDED_NEXT_FOCUS";
const canCreateAction = (kind: string) => kind === "NEXT_ACTIONS" || kind === "SIGNALS";
const canSetFocus = (kind: string) => kind === "RECOMMENDED_NEXT_FOCUS";
const dateInputValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function WeeklyReviewDetailClient({ review, resolvedReferences }: { review: Review; resolvedReferences: Record<string, ResolvedEntityReference> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusDraft, setFocusDraft] = useState<FocusDraft | null>(null);
  const [focusTitle, setFocusTitle] = useState("");
  const [focusStatement, setFocusStatement] = useState("");
  const [focusStart, setFocusStart] = useState("");
  const [focusEnd, setFocusEnd] = useState("");

  function beginFocus(section: Section, item: Item, itemIndex: number) {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 29);
    setFocusDraft({ section, item, itemIndex });
    setFocusTitle(item.text.length > 120 ? `${item.text.slice(0, 117)}…` : item.text);
    setFocusStatement(item.text);
    setFocusStart(dateInputValue(start));
    setFocusEnd(dateInputValue(end));
    setError(null);
  }

  async function createFocus() {
    if (!focusDraft || !focusTitle.trim() || !focusStatement.trim() || !focusStart || !focusEnd) return;
    setBusy(true); setError(null);
    try {
      const response = await fetch(`/api/v1/weekly-reviews/${review.id}/focus`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey("focus-from-weekly-review") },
        body: JSON.stringify({
          itemIndex: focusDraft.itemIndex,
          title: focusTitle.trim(),
          statement: focusStatement.trim(),
          periodStart: focusStart,
          periodEnd: focusEnd
        })
      });
      const body = await response.json() as { data?: { objectiveId?: string }; error?: { code?: string; message?: string } };
      if (!response.ok) {
        if (body.error?.code === "PLANNING_OBJECTIVE_PRIMARY_OVERLAP") {
          throw new Error("A primary focus is already active for this period. Complete or close it on Today before confirming this recommendation.");
        }
        throw new Error(body.error?.message ?? "Current focus could not be created.");
      }
      window.location.href = "/";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Current focus could not be created.");
      setBusy(false);
    }
  }

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
      {error && <div className="decision-error" role="alert">{error} {error.includes("primary focus is already active") ? <a className="inline-link" href="/">Open Today →</a> : null}</div>}
      <div className="decision-list">
        {review.sections.map((section) => (
          <section className="decision-section" key={section.kind}>
            <div className="section-heading"><p className="eyebrow">{section.kind.replaceAll("_", " ")}</p><h2>{section.label}</h2></div>
            {section.items.length === 0 ? <div className="quiet-state">No supported signal in this snapshot.</div> : section.items.map((item, itemIndex) => {
              const focusOpen = focusDraft?.section.kind === section.kind && focusDraft.itemIndex === itemIndex;
              const existingFocusRef = item.references?.find((reference) => reference.refType === "PlanningObjective");
              const showFocusConfirmation = canSetFocus(section.kind) && !existingFocusRef;
              return (
                <article className="decision-card" key={`${section.kind}-${itemIndex}`}>
                  <div className="status-row"><span className="status-chip">{item.epistemicLabel ?? "LEGACY · UNLABELLED"}</span></div>
                  <p>{item.text}</p>
                  {item.references?.length ? (
                    <div className="provenance-inline-list" aria-label="Provenance">
                      {item.references.map((reference) => {
                        const resolved = resolvedReferences[entityReferenceKey(reference.refType, reference.refId)];
                        return resolved?.href ? (
                          <a className="provenance-inline-ref" href={resolved.href} key={entityReferenceKey(reference.refType, reference.refId)}>
                            <span>{reference.refType}</span>
                            <strong>{resolved.label}</strong>
                            <i aria-hidden="true">→</i>
                          </a>
                        ) : (
                          <span className="provenance-inline-ref unresolved" key={entityReferenceKey(reference.refType, reference.refId)}>
                            <span>{reference.refType}</span>
                            <strong>{resolved?.label ?? shortEntityId(reference.refId)}</strong>
                            <i>UNRESOLVED</i>
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                  {(showFocusConfirmation || existingFocusRef || canCreateDecision(section.kind) || canCreateAction(section.kind)) && <div className="decision-form-actions">
                    {showFocusConfirmation && <button className="decision-primary-button" type="button" disabled={busy} onClick={() => focusOpen ? setFocusDraft(null) : beginFocus(section, item, itemIndex)}>{focusOpen ? "Cancel focus" : "Set current focus →"}</button>}
                    {existingFocusRef && <a className="decision-secondary-button" href="/">Open current focus →</a>}
                    {canCreateDecision(section.kind) && <button className="decision-secondary-button" type="button" disabled={busy} onClick={() => void createDecision(section, item, itemIndex)}>Turn into Decision →</button>}
                    {canCreateAction(section.kind) && <button className="decision-primary-button" type="button" disabled={busy} onClick={() => void createAction(section, item, itemIndex)}>Create Action →</button>}
                  </div>}
                  {focusOpen && showFocusConfirmation && <div className="decision-create-card">
                    <label>Focus title<input value={focusTitle} onChange={(event) => setFocusTitle(event.target.value)} maxLength={200} /></label>
                    <label>What does success look like?<textarea value={focusStatement} onChange={(event) => setFocusStatement(event.target.value)} rows={3} maxLength={2000} /></label>
                    <div className="decision-form-grid">
                      <label>Start<input type="date" value={focusStart} onChange={(event) => setFocusStart(event.target.value)} /></label>
                      <label>End<input type="date" value={focusEnd} min={focusStart} onChange={(event) => setFocusEnd(event.target.value)} /></label>
                    </div>
                    <p className="muted-note">This is an explicit confirmation. The review itself remains immutable; its references become bounded focus context for Today.</p>
                    <div className="decision-form-actions">
                      <button className="decision-primary-button" type="button" disabled={busy || !focusTitle.trim() || !focusStatement.trim() || !focusStart || !focusEnd} onClick={() => void createFocus()}>{busy ? "Setting focus…" : "Confirm current focus"}</button>
                    </div>
                  </div>}
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </>
  );
}
