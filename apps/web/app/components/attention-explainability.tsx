"use client";

import { useEffect, useState } from "react";
import type { AttentionItem } from "@artist-os/core";

type Props = {
  item: AttentionItem;
  compact?: boolean;
};

const shortId = (id: string) => id.length > 18 ? `${id.slice(0, 8)}…${id.slice(-5)}` : id;

export function AttentionExplainability({ item, compact = false }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        className={compact ? "why-action compact" : "why-action"}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Why this recommendation: ${item.title}`}
      >
        Why this?
      </button>

      {open && (
        <div className="attention-drawer-layer" role="presentation">
          <button className="attention-drawer-backdrop" aria-label="Close explanation" type="button" onClick={() => setOpen(false)} />
          <aside className="attention-drawer" role="dialog" aria-modal="true" aria-labelledby={`attention-drawer-${item.id}`}>
            <header className="attention-drawer-head">
              <div>
                <span className="signal-label">WHY THIS</span>
                <h2 id={`attention-drawer-${item.id}`}>{item.title}</h2>
              </div>
              <button className="drawer-close" type="button" onClick={() => setOpen(false)} aria-label="Close explanation">×</button>
            </header>

            {item.objectiveAligned && (
              <div className="drawer-objective-chip">Current objective aligned</div>
            )}

            <section className="drawer-section">
              <span>WHY THIS</span>
              <ul>{item.whyThis.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            </section>

            <section className="drawer-section">
              <span>BASED ON</span>
              {item.basedOn.length > 0 ? (
                <div className="drawer-ref-grid">
                  {item.basedOn.map((ref) => (
                    <div className="drawer-ref" key={`${ref.type}-${ref.id}-${ref.version ?? "current"}`}>
                      <strong>{ref.type}</strong>
                      <code>{shortId(ref.id)}</code>
                      {ref.version !== undefined && <small>v{ref.version}</small>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="drawer-empty">No additional entity reference is required for this deterministic state.</p>
              )}
            </section>

            <section className="drawer-section">
              <span>UNCERTAINTY</span>
              {item.uncertainty.length > 0 ? (
                <ul>{item.uncertainty.map((entry) => <li key={entry}>{entry}</li>)}</ul>
              ) : (
                <p className="drawer-empty">Low — this recommendation comes from deterministic current state.</p>
              )}
            </section>

            {item.blockedBy.length > 0 && (
              <section className="drawer-section">
                <span>BLOCKED BY</span>
                <div className="drawer-ref-grid">
                  {item.blockedBy.map((ref) => (
                    <div className="drawer-ref" key={`blocked-${ref.type}-${ref.id}`}>
                      <strong>{ref.type}</strong>
                      <code>{shortId(ref.id)}</code>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="drawer-section">
              <span>EXPECTED EFFECT</span>
              <p>{item.expectedEffect ?? "Completing this item resolves the currently surfaced attention state."}</p>
            </section>

            <section className="drawer-section">
              <span>WHAT WE MAY LEARN</span>
              <p>{item.whatWillBeLearned ?? "No learning claim is implied — this is operational or readiness work."}</p>
            </section>

            {item.guidanceRef && (
              <section className="drawer-guidance">
                <div>
                  <span>LEARN BEFORE DOING</span>
                  <strong>{item.guidanceRef.label}</strong>
                  {item.guidanceRef.estimatedMinutes && <small>{item.guidanceRef.estimatedMinutes} min</small>}
                </div>
                <button type="button" disabled title="Contextual Guidance UI will be connected in a later Phase 2.5 slice">Learn →</button>
              </section>
            )}

            <footer className="attention-drawer-footer">
              <a className="primary-action" href={item.action.href}>{item.action.label} →</a>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
