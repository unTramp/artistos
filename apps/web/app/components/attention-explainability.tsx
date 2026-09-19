"use client";

import { useCallback, useRef, useState } from "react";
import type { AttentionItem } from "@artist-os/core";
import { getContextualGuide } from "@/lib/contextual-guidance";
import { emitProductTelemetry } from "@/lib/product-telemetry-client";
import type { ResolvedEntityReference } from "@/lib/entity-reference";
import { useModalFocusTrap } from "./ui/use-modal-focus-trap";
import { getUiCopy, type Locale } from "@/lib/i18n";

type Props = {
  item: AttentionItem;
  compact?: boolean;
  resolvedBasedOn?: ResolvedEntityReference[];
  resolvedBlockedBy?: ResolvedEntityReference[];
  locale: Locale;
};

type DrawerMode = "explanation" | "guidance";

type BasisMaturity = {
  label: "FOUNDATION CONTEXT" | "CONTEXTUAL STATE" | "WORKFLOW EVIDENCE" | "ARTIST-SPECIFIC MEMORY";
  description: string;
  counts: Array<{ type: string; count: number }>;
};

const memoryRefTypes = new Set(["Decision", "Learning", "Experiment", "Insight", "Hypothesis", "Evidence"]);
const workflowRefTypes = new Set(["OperationalAction", "ContentUnit", "ContentAngle", "WeeklyReview"]);

const basisMaturityFor = (item: AttentionItem, locale: Locale): BasisMaturity => {
  const countMap = new Map<string, number>();
  for (const ref of item.basedOn) countMap.set(ref.type, (countMap.get(ref.type) ?? 0) + 1);
  const counts = [...countMap.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  const types = new Set(item.basedOn.map((ref) => ref.type));

  if ([...types].some((type) => memoryRefTypes.has(type))) {
    return {
      label: "ARTIST-SPECIFIC MEMORY",
      description: locale === "ru" ? "Эта рекомендация напрямую опирается на решения, выводы или доказательства конкретного артиста. Метка описывает происхождение, а не качество рекомендации." : "This recommendation directly cites artist-specific decision, learning or evidence lineage. The label reflects provenance, not a quality score.",
      counts
    };
  }
  if ([...types].some((type) => workflowRefTypes.has(type))) {
    return {
      label: "WORKFLOW EVIDENCE",
      description: locale === "ru" ? "Эта рекомендация основана на устойчивом состоянии реальной работы, уже происходящей внутри Artist OS." : "This recommendation is grounded in durable state from work already happening inside Artist OS.",
      counts
    };
  }
  if (item.basedOn.length > 0) {
    return {
      label: "CONTEXTUAL STATE",
      description: locale === "ru" ? "Эта рекомендация использует явный текущий контекст, но не заявляет о памяти конкретного артиста без подтверждённого происхождения." : "This recommendation uses explicit current context, but does not claim artist-specific learned memory unless that provenance is present.",
      counts
    };
  }
  return {
    label: "FOUNDATION CONTEXT",
    description: locale === "ru" ? "Этой детерминированной рекомендации пока не требуются дополнительные данные конкретного артиста." : "This deterministic setup recommendation does not require additional artist-specific evidence yet.",
    counts: []
  };
};

export function AttentionExplainability({ item, compact = false, resolvedBasedOn, resolvedBlockedBy, locale }: Props) {
  const copy = getUiCopy(locale).why;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DrawerMode>("explanation");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const guide = item.guidanceRef ? getContextualGuide(item.guidanceRef.key, locale) : null;
  const maturity = basisMaturityFor(item, locale);
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
        aria-label={`${copy.ariaPrefix}: ${item.title}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {copy.button}
      </button>

      {open && (
        <div className="attention-drawer-layer" role="presentation">
          <button className="attention-drawer-backdrop" aria-label={copy.close} type="button" onClick={closeDrawer} />
          <aside ref={drawerRef} className="attention-drawer" role="dialog" aria-modal="true" aria-labelledby={`attention-drawer-${item.id}`} tabIndex={-1}>
            <header className="attention-drawer-head">
              <div>
                {mode === "guidance" && (
                  <button className="drawer-back" type="button" onClick={() => setMode("explanation")}>{copy.back}</button>
                )}
                <span className="signal-label">{mode === "guidance" ? `${copy.learn} · ${guide?.estimatedMinutes ?? item.guidanceRef?.estimatedMinutes ?? ""} ${copy.min}` : copy.whyThis}</span>
                <h2 id={`attention-drawer-${item.id}`}>{mode === "guidance" && guide ? guide.title : item.title}</h2>
              </div>
              <button ref={closeRef} className="drawer-close" type="button" onClick={closeDrawer} aria-label={copy.close}>×</button>
            </header>

            {mode === "guidance" && guide ? (
              <div className="guidance-body" aria-label={`${copy.contextualGuidance}: ${guide.title}`}>
                <section className="guidance-intro">
                  <span>{copy.contextualGuidance}</span>
                  <p>{guide.summary}</p>
                  <div className="guidance-context-chip">{copy.applyTo} · {item.title}</div>
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
                  <span>{copy.ready}</span>
                  <strong>{guide.outcome}</strong>
                </section>

                <footer className="attention-drawer-footer guidance-footer">
                  <a className="primary-action" href={item.action.href} onClick={trackGuidanceApply}>{copy.applyNow} →</a>
                  <button className="secondary-drawer-action" type="button" onClick={() => setMode("explanation")}>{copy.returnRecommendation}</button>
                </footer>
              </div>
            ) : (
              <>
                {item.objectiveAligned && (
                  <div className="drawer-objective-chip">{copy.currentObjective}</div>
                )}

                <section className="drawer-section">
                  <span>{copy.whyThis}</span>
                  <ul>{item.whyThis.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </section>

                <section className="drawer-section">
                  <span>{copy.basedOn}</span>
                  {item.basedOn.length > 0 ? (
                    <div className="drawer-ref-grid">
                      {basedOn.map((ref) => ref.href ? (
                        <a className="drawer-ref drawer-ref-link" href={ref.href} key={`${ref.type}-${ref.id}-${ref.version ?? "current"}`}>
                          <strong>{ref.label}</strong>
                          <small>{ref.type}{ref.version !== undefined ? ` · v${ref.version}` : ""}</small>
                          <span aria-hidden="true">→</span>
                        </a>
                      ) : (
                        <div className="drawer-ref unresolved" key={`${ref.type}-${ref.id}-${ref.version ?? "current"}`}>
                          <strong>{ref.label}</strong>
                          <small>{ref.type} · {copy.unresolved}</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="drawer-empty">{locale === "ru" ? "Для этого детерминированного состояния дополнительные ссылки на сущности не требуются." : "No additional entity reference is required for this deterministic state."}</p>
                  )}
                </section>

                <section className="drawer-section maturity-section">
                  <span>{copy.maturity}</span>
                  <div className="maturity-card">
                    <div className="maturity-head">
                      <strong>{locale === "ru" ? ({
  "FOUNDATION CONTEXT": "БАЗОВЫЙ КОНТЕКСТ",
  "CONTEXTUAL STATE": "ТЕКУЩИЙ КОНТЕКСТ",
  "WORKFLOW EVIDENCE": "ДАННЫЕ РАБОЧЕГО ПРОЦЕССА",
  "ARTIST-SPECIFIC MEMORY": "ПАМЯТЬ КОНКРЕТНОГО АРТИСТА"
} as const)[maturity.label] : maturity.label}</strong>
                      <small>{locale === "ru" ? `${item.basedOn.length} прямых ссылок происхождения` : `${item.basedOn.length} direct provenance ref${item.basedOn.length === 1 ? "" : "s"}`}</small>
                    </div>
                    <p>{maturity.description}</p>
                    {maturity.counts.length > 0 && (
                      <div className="maturity-counts">
                        {maturity.counts.map(({ type, count }) => <span key={type}>{type} · {count}</span>)}
                      </div>
                    )}
                  </div>
                </section>

                <section className="drawer-section">
                  <span>{copy.uncertainty}</span>
                  {item.uncertainty.length > 0 ? (
                    <ul>{item.uncertainty.map((entry) => <li key={entry}>{entry}</li>)}</ul>
                  ) : (
                    <p className="drawer-empty">{locale === "ru" ? "Низкая — рекомендация получена из детерминированного текущего состояния." : "Low — this recommendation comes from deterministic current state."}</p>
                  )}
                </section>

                {item.blockedBy.length > 0 && (
                  <section className="drawer-section">
                    <span>{locale === "ru" ? "ЗАБЛОКИРОВАНО" : "BLOCKED BY"}</span>
                    <div className="drawer-ref-grid">
                      {blockedBy.map((ref) => ref.href ? (
                        <a className="drawer-ref drawer-ref-link" href={ref.href} key={`blocked-${ref.type}-${ref.id}`}>
                          <strong>{ref.label}</strong>
                          <small>{ref.type}</small>
                          <span aria-hidden="true">→</span>
                        </a>
                      ) : (
                        <div className="drawer-ref unresolved" key={`blocked-${ref.type}-${ref.id}`}>
                          <strong>{ref.label}</strong>
                          <small>{ref.type} · {copy.unresolved}</small>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="drawer-section">
                  <span>{copy.expected}</span>
                  <p>{item.expectedEffect ?? (locale === "ru" ? "Завершение этого пункта снимает текущий сигнал внимания." : "Completing this item resolves the currently surfaced attention state.")}</p>
                </section>

                <section className="drawer-section">
                  <span>{copy.mayLearn}</span>
                  <p>{item.whatWillBeLearned ?? (locale === "ru" ? "Здесь не подразумевается новый вывод — это операционная работа или работа по готовности." : "No learning claim is implied — this is operational or readiness work.")}</p>
                </section>

                {item.guidanceRef && (
                  <section className="drawer-guidance">
                    <div>
                      <span>{locale === "ru" ? "РАЗОБРАТЬСЯ ПЕРЕД ДЕЙСТВИЕМ" : "LEARN BEFORE DOING"}</span>
                      <strong>{item.guidanceRef.label}</strong>
                      {item.guidanceRef.estimatedMinutes && <small>{item.guidanceRef.estimatedMinutes} {locale === "ru" ? "мин · необязательно" : "min · optional"}</small>}
                    </div>
                    {guide ? (
                      <button type="button" onClick={openGuidance}>{locale === "ru" ? "Разобраться" : "Learn"} →</button>
                    ) : (
                      <button type="button" disabled title={locale === "ru" ? "Подсказка для этой ссылки пока недоступна" : "Guidance content is not available for this reference"}>{locale === "ru" ? "Недоступно" : "Unavailable"}</button>
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
