"use client";

import { useCallback, useRef, useState } from "react";
import type { AttentionItem } from "@artist-os/core";
import { getContextualGuide } from "@/lib/contextual-guidance";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";
import type { ResolvedEntityReference } from "@/lib/entity-reference";
import { getUiCopy, localizeEntityType, type UiLocale } from "@/lib/i18n";
import { useModalFocusTrap } from "./ui/use-modal-focus-trap";

type Props = {
  item: AttentionItem;
  compact?: boolean;
  resolvedBasedOn?: ResolvedEntityReference[];
  resolvedBlockedBy?: ResolvedEntityReference[];
  locale: UiLocale;
};

type DrawerMode = "explanation" | "guidance";

type BasisMaturity = {
  label: "FOUNDATION CONTEXT" | "CONTEXTUAL STATE" | "WORKFLOW EVIDENCE" | "ARTIST-SPECIFIC MEMORY";
  description: string;
  counts: Array<{ type: string; count: number }>;
};

const memoryRefTypes = new Set(["Decision", "Learning", "Experiment", "Insight", "Hypothesis", "Evidence"]);
const workflowRefTypes = new Set(["OperationalAction", "ContentUnit", "ContentAngle", "WeeklyReview"]);

const basisMaturityFor = (item: AttentionItem): BasisMaturity => {
  const countMap = new Map<string, number>();
  for (const ref of item.basedOn) countMap.set(ref.type, (countMap.get(ref.type) ?? 0) + 1);
  const counts = [...countMap.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  const types = new Set(item.basedOn.map((ref) => ref.type));

  if ([...types].some((type) => memoryRefTypes.has(type))) {
    return {
      label: "ARTIST-SPECIFIC MEMORY",
      description: "This recommendation directly cites artist-specific decision, learning or evidence lineage. The label reflects provenance, not a quality score.",
      counts
    };
  }
  if ([...types].some((type) => workflowRefTypes.has(type))) {
    return {
      label: "WORKFLOW EVIDENCE",
      description: "This recommendation is grounded in durable state from work already happening inside Artist OS.",
      counts
    };
  }
  if (item.basedOn.length > 0) {
    return {
      label: "CONTEXTUAL STATE",
      description: "This recommendation uses explicit current context, but does not claim artist-specific learned memory unless that provenance is present.",
      counts
    };
  }
  return {
    label: "FOUNDATION CONTEXT",
    description: "This deterministic setup recommendation does not require additional artist-specific evidence yet.",
    counts: []
  };
};

export function AttentionExplainability({ item, compact = false, resolvedBasedOn, resolvedBlockedBy, locale }: Props) {
  const copy = getUiCopy(locale);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DrawerMode>("explanation");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const guide = item.guidanceRef ? getContextualGuide(item.guidanceRef.key, locale) : null;
  const maturity = basisMaturityFor(item);
  const maturityKey = maturity.label.replaceAll("-", "_").replaceAll(" ", "_") as keyof typeof copy.why.maturityLabels;
  const basedOn = resolvedBasedOn ?? item.basedOn.map((ref) => ({
    ...ref,
    label: ref.type,
    href: null,
    resolved: false
  }));
  const blockedBy = resolvedBlockedBy ?? item.blockedBy.map((ref) => ({
    ...ref,
    label: ref.type,
    href: null,
    resolved: false
  }));

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setMode("explanation");
  }, []);

  useModalFocusTrap({
    open,
    containerRef: drawerRef,
    initialFocusRef: closeRef,
    restoreFocusRef: triggerRef,
    onEscape: closeDrawer
  });

  const openExplanation = () => {
    setMode("explanation");
    setOpen(true);
    emitProductTelemetry({
      eventName: "ATTENTION_EXPLANATION_OPENED",
      surface: "Today",
      entityType: "AttentionItem",
      entityId: item.id,
      metadata: { kind: item.kind, objectiveAligned: item.objectiveAligned, basisMaturity: maturity.label }
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
    metadata: { kind: item.kind, objectiveAligned: item.objectiveAligned, basisMaturity: maturity.label }
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
        ref={triggerRef}
        className={compact ? "why-action compact" : "why-action"}
        type="button"
        onClick={openExplanation}
        aria-label={`${copy.why.triggerAria} ${item.title}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {copy.why.trigger}
      </button>

      {open && (
        <div className="attention-drawer-layer" role="presentation">
          <button className="attention-drawer-backdrop" aria-label={copy.why.close} type="button" onClick={closeDrawer} />
          <aside ref={drawerRef} className="attention-drawer" role="dialog" aria-modal="true" aria-labelledby={`attention-drawer-${item.id}`} tabIndex={-1}>
            <header className="attention-drawer-head">
              <div>
                {mode === "guidance" && (
                  <button className="drawer-back" type="button" onClick={() => setMode("explanation")}>{copy.why.back}</button>
                )}
                <span className="signal-label">{mode === "guidance" ? `${copy.why.learn} · ${guide?.estimatedMinutes ?? item.guidanceRef?.estimatedMinutes ?? ""} ${locale === "ru" ? "МИН" : "MIN"}` : copy.why.whyThis}</span>
                <h2 id={`attention-drawer-${item.id}`}>{mode === "guidance" && guide ? guide.title : item.title}</h2>
              </div>
              <button ref={closeRef} className="drawer-close" type="button" onClick={closeDrawer} aria-label={copy.why.close}>×</button>
            </header>

            {mode === "guidance" && guide ? (
              <div className="guidance-body" aria-label={`${copy.why.contextualGuidance}: ${guide.title}`}>
                <section className="guidance-intro">
                  <span>{copy.why.contextualGuidance}</span>
                  <p>{guide.summary}</p>
                  <div className="guidance-context-chip">{copy.why.applyTo} · {item.title}</div>
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
                  <span>{copy.why.ready}</span>
                  <strong>{guide.outcome}</strong>
                </section>

                <footer className="attention-drawer-footer guidance-footer">
                  <a className="primary-action" href={item.action.href} onClick={trackGuidanceApply}>{copy.why.applyNow} →</a>
                  <button className="secondary-drawer-action" type="button" onClick={() => setMode("explanation")}>{copy.why.returnRecommendation}</button>
                </footer>
              </div>
            ) : (
              <>
                {item.objectiveAligned && (
                  <div className="drawer-objective-chip">{copy.why.currentObjective}</div>
                )}

                <section className="drawer-section">
                  <span>{copy.why.whyThis}</span>
                  <ul>{item.whyThis.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </section>

                <section className="drawer-section">
                  <span>{copy.why.basedOn}</span>
                  {item.basedOn.length > 0 ? (
                    <div className="drawer-ref-grid">
                      {basedOn.map((ref) => ref.href ? (
                        <a className="drawer-ref drawer-ref-link" href={ref.href} key={`${ref.type}-${ref.id}-${ref.version ?? "current"}`}>
                          <strong>{ref.label}</strong>
                          <small>{localizeEntityType(locale, ref.type)}{ref.version !== undefined ? ` · v${ref.version}` : ""}</small>
                          <span aria-hidden="true">→</span>
                        </a>
                      ) : (
                        <div className="drawer-ref unresolved" key={`${ref.type}-${ref.id}-${ref.version ?? "current"}`}>
                          <strong>{ref.label}</strong>
                          <small>{localizeEntityType(locale, ref.type)} · {copy.today.unresolved}</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="drawer-empty">{copy.why.noRef}</p>
                  )}
                </section>

                <section className="drawer-section maturity-section">
                  <span>{copy.why.maturity}</span>
                  <div className="maturity-card">
                    <div className="maturity-head">
                      <strong>{copy.why.maturityLabels[maturityKey]}</strong>
                      <small>{item.basedOn.length} {item.basedOn.length === 1 ? copy.why.directRef : copy.why.directRefs}</small>
                    </div>
                    <p>{copy.why.maturityDescriptions[maturityKey]}</p>
                    {maturity.counts.length > 0 && (
                      <div className="maturity-counts">
                        {maturity.counts.map(({ type, count }) => <span key={type}>{localizeEntityType(locale, type)} · {count}</span>)}
                      </div>
                    )}
                  </div>
                </section>

                <section className="drawer-section">
                  <span>{copy.why.uncertainty}</span>
                  {item.uncertainty.length > 0 ? (
                    <ul>{item.uncertainty.map((entry) => <li key={entry}>{entry}</li>)}</ul>
                  ) : (
                    <p className="drawer-empty">{copy.why.lowUncertainty}</p>
                  )}
                </section>

                {item.blockedBy.length > 0 && (
                  <section className="drawer-section">
                    <span>{copy.why.blockedBy}</span>
                    <div className="drawer-ref-grid">
                      {blockedBy.map((ref) => ref.href ? (
                        <a className="drawer-ref drawer-ref-link" href={ref.href} key={`blocked-${ref.type}-${ref.id}`}>
                          <strong>{ref.label}</strong>
                          <small>{localizeEntityType(locale, ref.type)}</small>
                          <span aria-hidden="true">→</span>
                        </a>
                      ) : (
                        <div className="drawer-ref unresolved" key={`blocked-${ref.type}-${ref.id}`}>
                          <strong>{ref.label}</strong>
                          <small>{localizeEntityType(locale, ref.type)} · {copy.today.unresolved}</small>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="drawer-section">
                  <span>{copy.why.expectedEffect}</span>
                  <p>{item.expectedEffect ?? copy.why.expectedFallback}</p>
                </section>

                <section className="drawer-section">
                  <span>{copy.why.learnOutcome}</span>
                  <p>{item.whatWillBeLearned ?? copy.why.learnFallback}</p>
                </section>

                {item.guidanceRef && (
                  <section className="drawer-guidance">
                    <div>
                      <span>{copy.why.learnBefore}</span>
                      <strong>{item.guidanceRef.label}</strong>
                      {item.guidanceRef.estimatedMinutes && <small>{item.guidanceRef.estimatedMinutes} {locale === "ru" ? "мин" : "min"} · {copy.why.optional}</small>}
                    </div>
                    {guide ? (
                      <button type="button" onClick={openGuidance}>{copy.why.learn} →</button>
                    ) : (
                      <button type="button" disabled title={copy.why.unavailableTitle}>{copy.why.unavailable}</button>
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
