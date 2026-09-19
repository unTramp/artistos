"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";
import { getUiCopy, type UiLocale } from "@/lib/i18n";

type ActionStatus = "OPEN" | "IN_PROGRESS" | "BLOCKED";
type ReasonMode = "block" | "reopen" | null;

export function OperationalActionControls({
  actionId,
  status,
  version,
  executionMode,
  locale
}: {
  actionId: string;
  status: ActionStatus;
  version: number;
  executionMode: string;
  locale: UiLocale;
}) {
  const router = useRouter();
  const copy = getUiCopy(locale);
  const [busy, setBusy] = useState(false);
  const [reasonMode, setReasonMode] = useState<ReasonMode>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  if (completed || (executionMode !== "MANUAL_NATIVE" && executionMode !== "EXTERNAL")) return null;

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
        body: JSON.stringify(body ?? {})
      });
      const payload = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(payload.error?.message ?? copy.action.updateError);
      const outcome = path === "start" ? "STARTED" : path === "complete" ? "COMPLETED" : path === "block" ? "BLOCKED" : "REOPENED";
      emitProductTelemetry({
        eventName: "ATTENTION_ACTION_OUTCOME_RECORDED",
        surface: "Today",
        entityType: "OperationalAction",
        entityId: actionId,
        metadata: { outcome, executionMode }
      });
      setReason("");
      setReasonMode(null);
      if (path === "complete") {
        setCompleted(true);
      } else {
        router.refresh();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.action.updateError);
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
        {status === "OPEN" && <button type="button" disabled={busy} onClick={() => void mutate("start")}>{copy.action.start}</button>}
        {(status === "OPEN" || status === "IN_PROGRESS" || status === "BLOCKED") && <button type="button" className="action-done-button" disabled={busy} onClick={() => void mutate("complete")}>{copy.action.done}</button>}
        {(status === "OPEN" || status === "IN_PROGRESS") && <button type="button" disabled={busy} aria-expanded={reasonMode === "block"} onClick={() => { setReasonMode(reasonMode === "block" ? null : "block"); setReason(""); setError(null); }}>{copy.action.block}</button>}
        {status === "BLOCKED" && <button type="button" disabled={busy} aria-expanded={reasonMode === "reopen"} onClick={() => { setReasonMode(reasonMode === "reopen" ? null : "reopen"); setReason(""); setError(null); }}>{copy.action.resolve}</button>}
      </div>
      {reasonMode && <div className="operational-action-reason">
        <input
          aria-label={reasonMode === "block" ? copy.action.blockReason : copy.action.resolutionReason}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={reasonMode === "block" ? copy.action.blockPlaceholder : copy.action.resolutionPlaceholder}
          maxLength={1000}
          disabled={busy}
        />
        <button type="button" disabled={busy || !reason.trim()} onClick={submitReason}>{reasonMode === "block" ? copy.action.confirmBlock : copy.action.reopen}</button>
      </div>}
      {error && <p className="operational-action-error" role="alert">{error}</p>}
    </div>
  );
}
