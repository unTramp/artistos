"use client";

import { useState } from "react";

type DecisionStatus = "ACTIVE" | "UNDER_REVIEW" | "REVERSED" | "EXPIRED";

export function DecisionActions({ decisionId, status, version }: { decisionId: string; status: DecisionStatus; version: number }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rationale, setRationale] = useState("");

  async function transition(command: "review" | "activate" | "reverse" | "expire", needsRationale = false) {
    if (needsRationale && !rationale.trim()) {
      setError("Explain why this Decision is being reversed or expired.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/decisions/${decisionId}/${command}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": `decision-transition-${crypto.randomUUID()}`,
          "if-match": String(version)
        },
        body: JSON.stringify(needsRationale ? { rationale: rationale.trim() } : {})
      });
      const body = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Decision state could not be changed.");
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Decision state could not be changed.");
      setBusy(false);
    }
  }

  if (status === "REVERSED" || status === "EXPIRED") return null;

  return (
    <section className="decision-detail-panel">
      <div className="section-heading">
        <p className="eyebrow">HUMAN CONTROL</p>
        <h2>Decision state</h2>
        <p>Review does not rewrite the original choice. Reversal and expiry require an explicit rationale and remain in history.</p>
      </div>
      {error && <div className="decision-error" role="alert">{error}</div>}
      <div className="decision-lifecycle-row">
        {status === "ACTIVE" && <button className="decision-secondary-button" disabled={busy} onClick={() => transition("review")} type="button">Mark under review</button>}
        {status === "UNDER_REVIEW" && <button className="decision-secondary-button" disabled={busy} onClick={() => transition("activate")} type="button">Keep active</button>}
      </div>
      <label className="decision-rationale-field">Change rationale<textarea rows={3} value={rationale} onChange={(event) => setRationale(event.target.value)} placeholder="What changed or why does this choice no longer apply?" /></label>
      <div className="decision-form-actions">
        <button className="decision-secondary-button" disabled={busy || !rationale.trim()} onClick={() => transition("expire", true)} type="button">Expire</button>
        <button className="decision-danger-button" disabled={busy || !rationale.trim()} onClick={() => transition("reverse", true)} type="button">Reverse decision</button>
      </div>
    </section>
  );
}
