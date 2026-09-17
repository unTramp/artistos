"use client";

import { useMemo, useState } from "react";

type LearningStatus = "CANDIDATE" | "TESTING" | "VALIDATED" | "STALE" | "DEPRECATED";
type LearningScope = "ARTIST_GLOBAL" | "PLATFORM" | "SONG" | "PILLAR" | "FORMAT" | "AUDIENCE" | "CAMPAIGN" | "AUDIO_SEGMENT" | "NARRATIVE" | "MARKET" | "BUSINESS" | "IDENTITY";
type LearningConfidence = "LOW" | "MEDIUM" | "HIGH";
type LearningView = {
  id: string;
  statement: string;
  scope: LearningScope;
  confidence: LearningConfidence;
  confidenceRationale: string;
  references: Array<{ refType: string; refId: string; relation: string; note?: string }>;
  freshUntil: string | null;
  status: LearningStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
};

const scopes: LearningScope[] = ["ARTIST_GLOBAL", "PLATFORM", "SONG", "PILLAR", "FORMAT", "AUDIENCE", "CAMPAIGN", "AUDIO_SEGMENT", "NARRATIVE", "MARKET", "BUSINESS", "IDENTITY"];
const idempotencyKey = () => `learning-ui-${crypto.randomUUID()}`;

export function LearningMemoryClient({ initialLearnings }: { initialLearnings: LearningView[] }) {
  const [learnings, setLearnings] = useState(initialLearnings);
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const live = useMemo(() => learnings.filter((item) => item.status !== "DEPRECATED"), [learnings]);
  const historical = useMemo(() => learnings.filter((item) => item.status === "DEPRECATED"), [learnings]);

  async function reload() {
    const response = await fetch("/api/v1/learnings", { cache: "no-store" });
    const body = await response.json() as { data?: { learnings?: LearningView[] } };
    if (response.ok && body.data?.learnings) setLearnings(body.data.learnings);
  }

  async function create(formData: FormData) {
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/v1/learnings", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey() },
        body: JSON.stringify({
          statement: String(formData.get("statement") ?? "").trim(),
          scope: String(formData.get("scope") ?? "ARTIST_GLOBAL"),
          confidence: String(formData.get("confidence") ?? "LOW"),
          confidenceRationale: String(formData.get("confidenceRationale") ?? "").trim()
        })
      });
      const body = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Learning could not be recorded.");
      setShowCreate(false);
      await reload();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Learning could not be recorded."); }
    finally { setBusy(false); }
  }

  async function transition(learning: LearningView, action: "test" | "validate" | "stale" | "deprecate", rationale?: string) {
    setBusy(true); setError(null);
    try {
      const response = await fetch(`/api/v1/learnings/${learning.id}/${action}`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey(), "if-match": String(learning.version) },
        body: JSON.stringify(rationale ? { rationale } : {})
      });
      const body = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Learning could not be updated.");
      await reload();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Learning could not be updated."); }
    finally { setBusy(false); }
  }

  async function createDecision(learning: LearningView) {
    const title = window.prompt("Decision title", "Apply validated learning");
    if (!title) return;
    const decision = window.prompt("What are we choosing because of this learning?");
    if (!decision) return;
    const reason = `Based on validated Learning: ${learning.statement}`;
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/v1/decisions", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": `decision-from-learning-${crypto.randomUUID()}` },
        body: JSON.stringify({
          title,
          decision,
          reason,
          scope: `learning.${learning.scope.toLowerCase()}`,
          references: [{ refType: "Learning", refId: learning.id, relation: "BASED_ON" }]
        })
      });
      const body = await response.json() as { data?: { decisionId?: string }; error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Decision could not be created.");
      if (body.data?.decisionId) window.location.href = `/decisions/${body.data.decisionId}`;
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Decision could not be created."); setBusy(false); }
  }

  return (
    <>
      <section className="decision-toolbar">
        <div><span className="status-chip">{learnings.filter((item) => item.status === "VALIDATED").length} validated</span><span className="muted-note">{live.length} current · {historical.length} deprecated</span></div>
        <button className="decision-primary-button" type="button" onClick={() => setShowCreate((value) => !value)}>{showCreate ? "Close" : "Record learning"}</button>
      </section>
      {error && <div className="decision-error" role="alert">{error}</div>}
      {showCreate && (
        <form className="decision-create-card" action={create}>
          <div className="section-heading"><p className="eyebrow">CANDIDATE LEARNING</p><h2>Capture a scoped finding</h2><p>Candidate does not mean true. Record what the work suggests, where it applies and why your current confidence is justified.</p></div>
          <label>What did we learn?<textarea name="statement" required maxLength={6000} rows={4} /></label>
          <div className="decision-form-grid">
            <label>Scope<select name="scope" defaultValue="ARTIST_GLOBAL">{scopes.map((scope) => <option key={scope} value={scope}>{scope.replaceAll("_", " ")}</option>)}</select></label>
            <label>Confidence<select name="confidence" defaultValue="LOW"><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select></label>
          </div>
          <label>Why this confidence?<textarea name="confidenceRationale" required maxLength={4000} rows={3} /></label>
          <div className="decision-form-actions"><button className="decision-secondary-button" type="button" onClick={() => setShowCreate(false)}>Cancel</button><button className="decision-primary-button" type="submit" disabled={busy}>{busy ? "Recording…" : "Record candidate"}</button></div>
        </form>
      )}

      <section className="decision-section">
        <div className="section-heading"><p className="eyebrow">CURRENT LEARNING</p><h2>Evidence-backed memory in progress</h2></div>
        {live.length === 0 ? <div className="empty-state compact-empty"><h3>No Learnings yet</h3><p>Record findings from real work. Artist OS will keep candidate, validated and stale states distinct instead of turning every success into a rule.</p></div> : <div className="decision-list">{live.map((item) => <LearningCard key={item.id} item={item} busy={busy} onTransition={transition} onDecision={createDecision} />)}</div>}
      </section>

      {historical.length > 0 && <section className="decision-section"><div className="section-heading"><p className="eyebrow">HISTORY</p><h2>Deprecated Learnings</h2></div><div className="decision-list decision-history-list">{historical.map((item) => <LearningCard key={item.id} item={item} busy={busy} onTransition={transition} onDecision={createDecision} />)}</div></section>}
    </>
  );
}

function LearningCard({ item, busy, onTransition, onDecision }: { item: LearningView; busy: boolean; onTransition: (item: LearningView, action: "test" | "validate" | "stale" | "deprecate", rationale?: string) => Promise<void>; onDecision: (item: LearningView) => Promise<void> }) {
  const ask = (label: string) => window.prompt(label)?.trim() || undefined;
  return (
    <article className="decision-card">
      <div className="decision-card-head"><span className={`decision-status decision-status-${item.status.toLowerCase()}`}>{item.status}</span><span>{item.scope} · {item.confidence}</span></div>
      <h3>{item.statement}</h3>
      <p>{item.confidenceRationale}</p>
      {item.references.some((ref) => ref.relation === "CONTRADICTS") && <small>⚠ Contradictory evidence preserved</small>}
      <div className="decision-form-actions">
        {item.status === "CANDIDATE" && <button className="decision-secondary-button" disabled={busy} onClick={() => void onTransition(item, "test")} type="button">Start testing</button>}
        {item.status === "TESTING" && <button className="decision-primary-button" disabled={busy} onClick={() => { const rationale = ask("Why is this evidence strong enough to validate?"); if (rationale) void onTransition(item, "validate", rationale); }} type="button">Validate</button>}
        {item.status === "VALIDATED" && <button className="decision-secondary-button" disabled={busy} onClick={() => { const rationale = ask("Why does this need revalidation?"); if (rationale) void onTransition(item, "stale", rationale); }} type="button">Mark stale</button>}
        {item.status === "STALE" && <button className="decision-primary-button" disabled={busy} onClick={() => void onTransition(item, "test")} type="button">Retest</button>}
        {item.status !== "DEPRECATED" && <button className="decision-secondary-button" disabled={busy} onClick={() => { const rationale = ask("Why is this Learning deprecated?"); if (rationale) void onTransition(item, "deprecate", rationale); }} type="button">Deprecate</button>}
        {item.status === "VALIDATED" && <button className="decision-primary-button" disabled={busy} onClick={() => void onDecision(item)} type="button">Use in decision →</button>}
      </div>
    </article>
  );
}
