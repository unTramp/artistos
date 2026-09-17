"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ActionStatus = "OPEN" | "IN_PROGRESS" | "BLOCKED";
type ExecutionMode = "MANUAL_NATIVE" | "EXTERNAL" | "API_ASSISTED" | "SYSTEM_CHECK";
type ReasonMode = "block" | "reopen" | null;

export function OperationalActionControls({
  actionId,
  status,
  version,
  executionMode
}: {
  actionId: string;
  status: ActionStatus;
  version: number;
  executionMode: ExecutionMode;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reasonMode, setReasonMode] = useState<ReasonMode>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (executionMode === "API_ASSISTED" || executionMode === "SYSTEM_CHECK") return null;

  async function mutate(path: "start" | "complete" | "block" | "reopen", body?: Record<string, string>) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/actions/${actionId}/${path}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": `today-${path}-${crypto.randomUUID()}`,
          "if-match": String(version)
        },
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      const payload = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(payload.error?.message ?? "Action could not be updated.");
      setReason("");
      setReasonMode(null);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Action could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  const submitReason = () => {
    const normalized = reason.trim();
    if (!normalized || !reasonMode) return;
    void mutate(reasonMode, { reason: normalized });
  };

  return (
    <div className="operational-action-controls" data-testid={`action-controls-${actionId}`}>
      <div className="operational-action-buttons">
        {status === "OPEN" && <button type="button" disabled={busy} onClick={() => void mutate("start")}>Start</button>}
        {(status === "OPEN" || status === "IN_PROGRESS" || status === "BLOCKED") && <button type="button" className="action-done-button" disabled={busy} onClick={() => void mutate("complete")}>Done</button>}
        {(status === "OPEN" || status === "IN_PROGRESS") && <button type="button" disabled={busy} aria-expanded={reasonMode === "block"} onClick={() => { setReasonMode(reasonMode === "block" ? null : "block"); setReason(""); setError(null); }}>Block</button>}
        {status === "BLOCKED" && <button type="button" disabled={busy} aria-expanded={reasonMode === "reopen"} onClick={() => { setReasonMode(reasonMode === "reopen" ? null : "reopen"); setReason(""); setError(null); }}>Resolve blocker</button>}
      </div>
      {reasonMode && <div className="operational-action-reason">
        <input
          aria-label={reasonMode === "block" ? "Block reason" : "Resolution reason"}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={reasonMode === "block" ? "What is blocking this?" : "What changed?"}
          maxLength={1000}
          disabled={busy}
        />
        <button type="button" disabled={busy || !reason.trim()} onClick={submitReason}>{reasonMode === "block" ? "Confirm block" : "Reopen"}</button>
      </div>}
      {error && <p className="operational-action-error" role="alert">{error}</p>}
    </div>
  );
}
