"use client";

import { useEffect, useState } from "react";
import type { AttentionItem } from "@artist-os/core";
import { getContextualGuide } from "@/lib/contextual-guidance";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";

type Props = {
  item: AttentionItem;
  compact?: boolean;
};

type DrawerMode = "explanation" | "guidance";

const shortId = (id: string) => id.length > 18 ? `${id.slice(0, 8)}…${id.slice(-5)}` : id;

export function AttentionExplainability({ item, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DrawerMode>("explanation");
  const guide = item.guidanceRef ? getContextualGuide(item.guidanceRef.key) : null;

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

  const closeDrawer = () => {
    setOpen(false);
    setMode("explanation");
  };

  const openExplanation = () => {
    setMode("explanation");
    setOpen(true);
    emitProductTelemetry({
      eventName: "ATTENTION_EXPLANATION_OPENED",
      surface: "Today",
      entityType: "AttentionItem",
      entityId: item.id,
      metadata: { kind: item.kind, objectiveAligned: item.objectiveAligned }
    });
  };

  const openGuidance = () => {
    if (!guide) return;
    setMode("guidance");
    emitProductTelemetry({
      eventName: "CONTEXTUAL_GUIDANCE_OPENED",
      surface: "Today",
      entityType: "AttentionItem",
      entityId: item.id,
      metadata: {
        kind: item.kind,
        guideKey: guide.key,
        guideVersion: guide.version,
        estimatedMinutes: guide.estimatedMinutes
      }
    });
  };

  const trackAction = () => emitProductTelemetry({
    eventName: "ATTENTION_ACTION_OPENED",
    surface: "Today",
    entityType: "AttentionItem",
    entityId: item.id,
    metadata: { kind: item.kind, objectiveAligned: item.objectiveAligned }
  });

  const trackGuidanceApply = () => {
    if (guide) {
      emitProductTelemetry({
        eventName: "CONTEXTUAL_GUIDANCE_APPLIED",
        surface: "Today",
        entityType: "AttentionItem",
        entityId: item.id,
        metadata: {
          kind: item.kind,
          guideKey: guide.key,
          guideVersion: guide.version,
          actionHref: item.action.href
        }
      });
    }
    trackAction();
  };

  return (
    <>
      <button
        className={compact ? "why-action compact" : "why-action"}
        type="button"
        onClick={openExplanation}
        aria-label={`Why this recommendation: ${item.title}`}
      >
        Why this?
      </button>

      {open && (
        <div className="attention-drawer-layer" role="presentation">
          <button className="attention-drawer-backdrop" aria-label="Close explanation" type="button" onClick={closeDrawer} />
          <aside className="attention-drawer" role="dialog" aria-modal="true" aria-labelledby={`attention-drawer-${item.id}`}>
            <header className="attention-drawer-head">
              <div>
                {mode === "guidance" && (
                  <button className="drawer-back" type="button" onClick={() => setMode("explanation")}>← Back to why</button>
                )}
                <span className="signal-label">{mode === "guidance" ? `LEARN · ${guide?.estimatedMinutes ?? item.guidanceRef?.estimatedMinutes ?? ""} MIN` : "WHY THIS"}</span>
                <h2 id={`attention-drawer-${item.id}`}>{mode === "guidance" && guide ? guide.title : item.title}</h2>
              </div>
              <button className="drawer-close" type="button" onClick={closeDrawer} aria-label="Close explanation">×</button>
            </header>

            {mode === "guidance" && guide ? (
              <div className="guidance-body" aria-label={`Contextual guidance: ${guide.title}`}>
                <section className="guidance-intro">
                  <span>CONTEXTUAL GUIDANCE</span>
                  <p>{guide.summary}</p>
                  <div className="guidance-context-chip">Apply to · {item.title}</div>
                </section>

                {guide.sections.map((section) => (
                  <section className="drawer-section guidance-section" key={section.label}>
                    <span>{section.label}</span>
                    <p>{section.body}</p>
                    {section.bullets && (
                      <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                    )}
                  </section>
                ))}

                <section className="guidance-outcome">
                  <span>READY TO APPLY</span>
                  <strong>{guide.outcome}</strong>
                </section>

                <footer className="attention-drawer-footer guidance-footer">
                  <a className="primary-action" href={item.action.href} onClick={trackGuidanceApply}>Apply now →</a>
                  <button className="secondary-drawer-action" type="button" onClick={() => setMode("explanation")}>Return to recommendation</button>
                </footer>
              </div>
            ) : (
              <>
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
                      {item.guidanceRef.estimatedMinutes && <small>{item.guidanceRef.estimatedMinutes} min · optional</small>}
                    </div>
                    {guide ? (
                      <button type="button" onClick={openGuidance}>Learn →</button>
                    ) : (
                      <button type="button" disabled title="Guidance content is not available for this reference">Unavailable</button>
                    )}
                  </section>
                )}

                <footer className="attention-drawer-footer">
                  <a className="primary-action" href={item.action.href} onClick={trackAction}>{item.action.label} →</a>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
