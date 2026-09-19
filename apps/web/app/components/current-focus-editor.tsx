"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./locale-provider";

type CurrentFocus = {
  id: string;
  title: string;
  statement: string;
  periodStart: string;
  periodEnd: string;
  priority: "PRIMARY" | "SECONDARY";
  version: number;
};

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string>;
  };
};

const addDays = (dateOnly: string, days: number) => {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export function CurrentFocusEditor({ currentDate, current }: { currentDate: string; current: CurrentFocus | null }) {
  const router = useRouter();
  const { messages } = useI18n();
  const copy = messages.currentFocus;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [periodStart, setPeriodStart] = useState(currentDate);
  const defaultEnd = useMemo(() => addDays(currentDate, 29), [currentDate]);
  const [periodEnd, setPeriodEnd] = useState(defaultEnd);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setStatement("");
    setPeriodStart(currentDate);
    setPeriodEnd(defaultEnd);
    setMessage(null);
  };

  const createFocus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/v1/objectives", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": `today-focus-${crypto.randomUUID()}`
        },
        body: JSON.stringify({
          title,
          statement,
          periodStart,
          periodEnd,
          scope: "ARTIST",
          priority: "PRIMARY"
        })
      });
      const payload = await response.json() as ApiErrorPayload;
      if (!response.ok) {
        const firstFieldError = payload.error?.fieldErrors ? Object.values(payload.error.fieldErrors)[0] : undefined;
        setMessage(firstFieldError ?? payload.error?.message ?? copy.createError);
        return;
      }
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setMessage(copy.createRetry);
    } finally {
      setPending(false);
    }
  };

  const completeFocus = async () => {
    if (!current) return;
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/v1/objectives/${current.id}/complete`, {
        method: "POST",
        headers: {
          "idempotency-key": `today-focus-complete-${crypto.randomUUID()}`,
          "if-match": String(current.version)
        }
      });
      const payload = await response.json() as ApiErrorPayload;
      if (!response.ok) {
        setMessage(payload.error?.message ?? copy.completeError);
        return;
      }
      router.refresh();
    } catch {
      setMessage(copy.completeRetry);
    } finally {
      setPending(false);
    }
  };

  if (current) {
    return (
      <section className="today-focus-card" id="current-focus" aria-label={copy.aria}>
        <div className="today-focus-copy">
          <span className="signal-label">{copy.currentFocus} · {current.priority === "PRIMARY" ? copy.primary : copy.secondary}</span>
          <strong>{current.title}</strong>
          <p>{current.statement}</p>
          {message && <small className="focus-form-message" role="alert">{message}</small>}
        </div>
        <div className="today-focus-actions">
          <small>{current.periodStart} → {current.periodEnd}</small>
          <button className="focus-complete-button" type="button" onClick={completeFocus} disabled={pending}>
            {pending ? copy.completing : copy.complete}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`today-focus-empty${open ? " is-open" : ""}`} id="current-focus">
      {!open ? (
        <>
          <div>
            <span className="signal-label">{copy.currentFocus}</span>
            <strong>{copy.noPrimary}</strong>
            <p>{copy.noPrimaryDescription}</p>
          </div>
          <button className="focus-set-button" type="button" onClick={() => setOpen(true)}>{copy.setCurrentFocus}</button>
        </>
      ) : (
        <form className="focus-editor-form" onSubmit={createFocus}>
          <div className="focus-editor-heading">
            <div>
              <span className="signal-label">{copy.setCurrentFocusLabel}</span>
              <strong>{copy.whatMatters}</strong>
              <p>{copy.whatMattersDescription}</p>
            </div>
            <button type="button" className="focus-cancel-button" onClick={() => { reset(); setOpen(false); }} disabled={pending}>{copy.cancel}</button>
          </div>

          <div className="focus-editor-grid">
            <label className="focus-field focus-field-wide">
              <span>{copy.titleLabel}</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={copy.titlePlaceholder} maxLength={200} required />
            </label>
            <label className="focus-field focus-field-wide">
              <span>{copy.successLabel}</span>
              <textarea value={statement} onChange={(event) => setStatement(event.target.value)} placeholder={copy.successPlaceholder} maxLength={2000} rows={3} required />
            </label>
            <label className="focus-field">
              <span>{copy.starts}</span>
              <input type="date" value={periodStart} onChange={(event) => setPeriodStart(event.target.value)} required />
            </label>
            <label className="focus-field">
              <span>{copy.ends}</span>
              <input type="date" value={periodEnd} min={periodStart} onChange={(event) => setPeriodEnd(event.target.value)} required />
            </label>
          </div>

          {message && <p className="focus-form-message" role="alert">{message}</p>}
          <div className="focus-editor-footer">
            <span>{copy.footer}</span>
            <button className="primary-action" type="submit" disabled={pending}>{pending ? copy.saving : copy.save}</button>
          </div>
        </form>
      )}
    </section>
  );
}
