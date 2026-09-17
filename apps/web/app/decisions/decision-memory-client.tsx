"use client";

import { useMemo, useState } from "react";

type DecisionStatus = "ACTIVE" | "UNDER_REVIEW" | "REVERSED" | "EXPIRED";

type DecisionView = {
  id: string;
  title: string;
  decision: string;
  reason: string;
  scope: string;
  decisionKey: string | null;
  supersedesDecisionId: string | null;
  reviewAt: string | null;
  status: DecisionStatus;
  createdAt: string;
  references: Array<{ refType: string; refId: string; relation: string }>;
};

type ConflictContext = {
  prior: DecisionView;
  payload: CreatePayload;
};

type CreatePayload = {
  title: string;
  decision: string;
  reason: string;
  scope: string;
  reviewAt?: string;
  decisionKey?: string;
  overrideDecisionId?: string;
  overrideRationale?: string;
};

const idempotencyKey = () => `decision-ui-${crypto.randomUUID()}`;

export function DecisionMemoryClient({ initialDecisions }: { initialDecisions: DecisionView[] }) {
  const [decisions, setDecisions] = useState(initialDecisions);
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictContext | null>(null);
  const [overrideRationale, setOverrideRationale] = useState("");

  const active = useMemo(() => decisions.filter((item) => item.status === "ACTIVE" || item.status === "UNDER_REVIEW"), [decisions]);
  const history = useMemo(() => decisions.filter((item) => item.status === "REVERSED" || item.status === "EXPIRED"), [decisions]);

  async function reload() {
    const response = await fetch("/api/v1/decisions", { cache: "no-store" });
    if (!response.ok) return;
    const body = await response.json() as { data?: { decisions?: Array<Omit<DecisionView, "createdAt" | "reviewAt"> & { createdAt: string; reviewAt: string | null }> } };
    if (body.data?.decisions) setDecisions(body.data.decisions);
  }

  async function submit(payload: CreatePayload) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/decisions", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey() },
        body: JSON.stringify(payload)
      });
      const body = await response.json() as {
        error?: { code?: string; message?: string; fieldErrors?: Record<string, string> };
      };

      if (response.status === 409 && body.error?.code === "DECISION_CONFLICT") {
        const conflictingDecisionId = body.error.fieldErrors?.conflictingDecisionId;
        if (!conflictingDecisionId) throw new Error("Artist OS detected a conflict but could not resolve the prior Decision.");
        const priorResponse = await fetch(`/api/v1/decisions/${conflictingDecisionId}`, { cache: "no-store" });
        const priorBody = await priorResponse.json() as { data?: { decision?: DecisionView } };
        if (!priorResponse.ok || !priorBody.data?.decision) throw new Error("The prior Decision could not be loaded.");
        setConflict({ prior: priorBody.data.decision, payload });
        setOverrideRationale("");
        return;
      }

      if (!response.ok) throw new Error(body.error?.message ?? "Decision could not be recorded.");
      setShowCreate(false);
      setConflict(null);
      setOverrideRationale("");
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Decision could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  async function createFromForm(formData: FormData) {
    const reviewAtRaw = String(formData.get("reviewAt") ?? "").trim();
    const decisionKey = String(formData.get("decisionKey") ?? "").trim();
    const payload: CreatePayload = {
      title: String(formData.get("title") ?? "").trim(),
      decision: String(formData.get("decision") ?? "").trim(),
      reason: String(formData.get("reason") ?? "").trim(),
      scope: String(formData.get("scope") ?? "").trim(),
      ...(decisionKey ? { decisionKey } : {}),
      ...(reviewAtRaw ? { reviewAt: new Date(reviewAtRaw).toISOString() } : {})
    };
    await submit(payload);
  }

  async function confirmOverride() {
    if (!conflict || !overrideRationale.trim()) return;
    await submit({
      ...conflict.payload,
      overrideDecisionId: conflict.prior.id,
      overrideRationale: overrideRationale.trim()
    });
  }

  return (
    <>
      <section className="decision-toolbar">
        <div>
          <span className="status-chip">{active.length} live</span>
          <span className="muted-note">{history.length} historical decision{history.length === 1 ? "" : "s"}</span>
        </div>
        <button className="decision-primary-button" onClick={() => setShowCreate((value) => !value)} type="button">
          {showCreate ? "Close" : "Record decision"}
        </button>
      </section>

      {error && <div className="decision-error" role="alert">{error}</div>}

      {showCreate && (
        <form className="decision-create-card" action={createFromForm}>
          <div className="section-heading">
            <p className="eyebrow">HUMAN COMMIT</p>
            <h2>Record a material choice</h2>
            <p>Capture the choice and the reason. Evidence may be linked by owning workflows as those domains come online.</p>
          </div>
          <label>Title<input name="title" required maxLength={200} placeholder="Use Trastevere as next release" /></label>
          <label>Decision<textarea name="decision" required maxLength={4000} rows={3} placeholder="What exactly are we choosing?" /></label>
          <label>Why<textarea name="reason" required maxLength={6000} rows={4} placeholder="Why is this the right choice in the current context?" /></label>
          <div className="decision-form-grid">
            <label>Scope<input name="scope" required maxLength={120} defaultValue="artist.strategy" placeholder="music.release" /></label>
            <label>Review date<input name="reviewAt" type="datetime-local" /></label>
          </div>
          <details className="decision-advanced">
            <summary>Conflict memory</summary>
            <label>Topic key <input name="decisionKey" maxLength={160} placeholder="song.next-release" /></label>
            <p>Optional. Reuse the same stable topic key when a new choice would replace an earlier one. Artist OS will surface the prior Decision instead of silently overwriting it.</p>
          </details>
          <div className="decision-form-actions">
            <button type="button" className="decision-secondary-button" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="decision-primary-button" disabled={busy}>{busy ? "Recording…" : "Record decision"}</button>
          </div>
        </form>
      )}

      <section className="decision-section">
        <div className="section-heading">
          <p className="eyebrow">ACTIVE MEMORY</p>
          <h2>Choices Artist OS should remember now</h2>
        </div>
        {active.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No active Decisions yet</h3><p>Important choices will appear here so future recommendations can respect what you already decided and why.</p></div>
        ) : (
          <div className="decision-list">
            {active.map((item) => <DecisionCard key={item.id} decision={item} />)}
          </div>
        )}
      </section>

      <section className="decision-section">
        <div className="section-heading">
          <p className="eyebrow">HISTORY</p>
          <h2>Reversed and expired choices</h2>
        </div>
        {history.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No historical Decisions</h3><p>When direction changes, Artist OS preserves the previous choice instead of rewriting history.</p></div>
        ) : (
          <div className="decision-list decision-history-list">
            {history.map((item) => <DecisionCard key={item.id} decision={item} />)}
          </div>
        )}
      </section>

      {conflict && (
        <div className="decision-conflict-backdrop" role="presentation">
          <section className="decision-conflict-dialog" role="dialog" aria-modal="true" aria-labelledby="decision-conflict-title">
            <p className="eyebrow">PRIOR DECISION FOUND</p>
            <h2 id="decision-conflict-title">This changes a previous choice</h2>
            <div className="decision-conflict-prior">
              <span>Current decision</span>
              <strong>{conflict.prior.title}</strong>
              <p>{conflict.prior.decision}</p>
              <small>WHY · {conflict.prior.reason}</small>
            </div>
            <div className="decision-conflict-next">
              <span>New decision</span>
              <strong>{conflict.payload.title}</strong>
              <p>{conflict.payload.decision}</p>
            </div>
            <label>What changed?<textarea value={overrideRationale} onChange={(event) => setOverrideRationale(event.target.value)} rows={4} placeholder="Explain the changed context that justifies reconsidering the prior Decision." /></label>
            <p className="muted-note">This is advisory memory, not a hard policy. Continuing will preserve the old Decision as REVERSED and link the new Decision to it.</p>
            <div className="decision-form-actions">
              <button className="decision-secondary-button" type="button" onClick={() => setConflict(null)}>Keep prior decision</button>
              <button className="decision-primary-button" type="button" disabled={busy || !overrideRationale.trim()} onClick={confirmOverride}>{busy ? "Saving…" : "Use new decision"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function DecisionCard({ decision }: { decision: DecisionView }) {
  return (
    <a className="decision-card" href={`/decisions/${decision.id}`}>
      <div className="decision-card-head">
        <span className={`decision-status decision-status-${decision.status.toLowerCase()}`}>{decision.status.replaceAll("_", " ")}</span>
        <span>{decision.scope}</span>
      </div>
      <h3>{decision.title}</h3>
      <p>{decision.decision}</p>
      <div className="decision-why"><span>WHY</span><p>{decision.reason}</p></div>
      <footer>
        <span>{new Date(decision.createdAt).toLocaleDateString()}</span>
        {decision.reviewAt && <span>Review {new Date(decision.reviewAt).toLocaleDateString()}</span>}
        {decision.supersedesDecisionId && <span>Replaces prior Decision</span>}
      </footer>
    </a>
  );
}
