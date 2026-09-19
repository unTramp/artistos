import { headers } from "next/headers";
import { AttentionProjectionService, type AttentionItem } from "@artist-os/core";
import {
  PgArtistFoundationReader,
  PgContentExecutionReader,
  PgContentFactoryReader,
  PgKnowledgeReader,
  PgOperationalActionReader,
  PgPlanningObjectiveReader
} from "@artist-os/db";
import { AppShell } from "./components/app-shell";
import { AttentionExplainability } from "./components/attention-explainability";
import { CurrentFocusEditor } from "./components/current-focus-editor";
import { OperationalActionControls } from "./components/operational-action-controls";
import { PageHeader } from "./components/ui/presentation";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { hrefForOperationalSource } from "@/lib/entity-href";
import { entityReferenceKey } from "@/lib/entity-reference";
import { EntityReferenceResolver } from "@/lib/entity-reference-resolver";
import { getDatabaseRuntime } from "@/lib/runtime";
import { getUiCopy, localizeAttentionItem, type UiLocale } from "@/lib/i18n";
import { resolveUiLocale } from "@/lib/ui-locale-server";

const toneFor = (item: AttentionItem): "violet" | "amber" | "cyan" | "emerald" => {
  if (item.kind === "BLOCKER") return "amber";
  if (item.kind === "MEMORY") return "amber";
  if (item.kind === "REVIEW") return "cyan";
  return "violet";
};

const labelFor = (item: AttentionItem, locale: UiLocale) => getUiCopy(locale).today.kind[item.kind];

const memoryReferenceTypes = new Set(["Decision", "Learning", "WeeklyReview"]);

export default async function HomePage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  const locale = await resolveUiLocale(actorContext?.artistId);
  const copy = getUiCopy(locale);

  if (!actorContext) {
    return (
      <AppShell activeId="today" locale={locale}>
        <section className="today-shell">
          <header className="today-header">
            <p className="eyebrow">{copy.today.signedOutEyebrow}</p>
            <h1>{copy.today.signedOutTitle}</h1>
            <p>{copy.today.signedOutBody}</p>
          </header>
          <section className="today-hero-card unauthenticated">
            <div>
              <span className="signal-label">{copy.today.startHere}</span>
              <h2>{copy.today.establishWorkspace}</h2>
              <p>{copy.today.establishWorkspaceBody}</p>
            </div>
            <a className="primary-action" href="/auth">{copy.shell.signIn} →</a>
          </section>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="today" sessionEmail={actorContext.user.email} locale={locale}>
        <section className="today-shell">
          <header className="today-header">
            <p className="eyebrow">{copy.today.welcome}</p>
            <h1>{copy.today.createWorkspace}</h1>
            <p>{copy.today.createWorkspaceBody}</p>
          </header>
          <section className="today-hero-card">
            <div>
              <span className="signal-label">{copy.today.onboarding}</span>
              <h2>{copy.today.noDevTools}</h2>
              <p>{copy.today.noDevToolsBody}</p>
            </div>
            <a className="primary-action" href="/onboarding">{copy.today.createWorkspaceAction} →</a>
          </section>
        </section>
      </AppShell>
    );
  }

  const runtime = getDatabaseRuntime();
  const artistReader = new PgArtistFoundationReader(runtime.db);
  const knowledgeReader = new PgKnowledgeReader(runtime.db);
  const factoryReader = new PgContentFactoryReader(runtime.db);
  const executionReader = new PgContentExecutionReader(runtime.db);
  const actionReader = new PgOperationalActionReader(runtime.db);
  const objectiveReader = new PgPlanningObjectiveReader(runtime.db);
  const computedAt = new Date();
  const currentDate = computedAt.toISOString().slice(0, 10);

  const [identity, songs, knowledge, angles, units, operationalActions, currentObjective] = await Promise.all([
    artistReader.getIdentityHome(actorContext.artistId),
    artistReader.listSongs(actorContext.artistId),
    knowledgeReader.getHome(actorContext.artistId),
    factoryReader.listAngles(actorContext.artistId),
    factoryReader.listUnits(actorContext.artistId),
    actionReader.listActions(actorContext.artistId, { statuses: ["OPEN", "IN_PROGRESS", "BLOCKED"], limit: 50 }),
    objectiveReader.getCurrentPrimary(actorContext.artistId, currentDate)
  ]);

  const approvedExecution = await Promise.all(
    units.map(async (unit) => ({ unit, approved: await executionReader.getApprovedRevision(actorContext.artistId!, unit.id) }))
  );

  const pendingKnowledge = knowledge.candidates.filter((candidate) => candidate.status === "PENDING");
  const reviewAngles = angles.filter((angle) => angle.status === "DRAFT" || angle.status === "DEFERRED");
  const unitAngleIds = new Set(units.flatMap((unit) => unit.angleId ? [unit.angleId] : []));
  const approvedWithoutUnit = angles.filter((angle) => angle.status === "APPROVED" && !unitAngleIds.has(angle.id));
  const unitsWithoutExecution = approvedExecution.filter((entry) => !entry.approved);

  const projection = new AttentionProjectionService().project({
    computedAt,
    activeObjective: currentObjective ? {
      id: currentObjective.id,
      title: currentObjective.title,
      statement: currentObjective.statement,
      priority: currentObjective.priority,
      scope: currentObjective.scope,
      relatedRefs: currentObjective.relatedRefs.map((reference) => ({ type: reference.refType, id: reference.refId })),
      ...(currentObjective.campaignId ? { campaignId: currentObjective.campaignId } : {}),
      ...(currentObjective.releaseId ? { releaseId: currentObjective.releaseId } : {})
    } : null,
    identity: {
      active: Boolean(identity.activeVersion),
      ...(identity.activeVersion ? { versionRef: { type: "IdentityVersion", id: identity.activeVersion.id, version: identity.activeVersion.versionNumber } } : {})
    },
    songsCount: songs.length,
    pendingKnowledge: {
      count: pendingKnowledge.length,
      refs: pendingKnowledge.slice(0, 10).map((candidate) => ({ type: "CandidateKnowledge", id: candidate.id }))
    },
    reviewAngles: {
      count: reviewAngles.length,
      refs: reviewAngles.slice(0, 10).map((angle) => ({ type: "ContentAngle", id: angle.id }))
    },
    approvedAnglesWithoutUnit: {
      count: approvedWithoutUnit.length,
      refs: approvedWithoutUnit.slice(0, 10).map((angle) => ({ type: "ContentAngle", id: angle.id }))
    },
    unitsWithoutApprovedExecution: unitsWithoutExecution.map(({ unit }) => ({ id: unit.id, title: unit.title })),
    operationalActions: operationalActions.map((action) => ({
      id: action.id,
      sourceDomain: action.sourceDomain,
      sourceEntityType: action.sourceEntityType,
      sourceEntityId: action.sourceEntityId,
      title: action.title,
      description: action.description,
      status: action.status,
      priority: action.priority,
      dueAt: action.dueAt,
      notBefore: action.notBefore,
      externalUrl: action.externalUrl,
      targetHref: hrefForOperationalSource(action.sourceEntityType, action.sourceEntityId),
      version: action.version
    }))
  });

  const provenanceResolver = new EntityReferenceResolver(runtime.db, actorContext.artistId);
  const resolvedReferenceMap = await provenanceResolver.resolveMany(
    projection.items.flatMap((item) => [...item.basedOn, ...item.blockedBy])
  );
  const resolvedRefsFor = (refs: AttentionItem["basedOn"]) => refs.map((ref) =>
    resolvedReferenceMap[entityReferenceKey(ref.type, ref.id)] ?? {
      ...ref,
      label: ref.type,
      href: null,
      resolved: false
    }
  );

  const localizedItems = projection.items.map((item) => localizeAttentionItem(locale, item));
  const operationalActionByAttentionId = new Map(operationalActions.map((action) => [`operational-action:${action.id}`, action]));
  const primary = localizedItems[0] ?? null;
  const primaryOperationalAction = primary ? operationalActionByAttentionId.get(primary.id) ?? null : null;
  const secondary = localizedItems.slice(1, 6);
  const remainingSecondaryCount = Math.max(0, localizedItems.length - 1 - secondary.length);
  const primaryBasedOn = primary ? resolvedRefsFor(primary.basedOn) : [];
  const primaryBlockedBy = primary ? resolvedRefsFor(primary.blockedBy) : [];
  const primaryMemoryRefs = primaryBasedOn.filter((ref) => memoryReferenceTypes.has(ref.type));
  const primaryWorkflowRefs = primaryBasedOn.filter((ref) => !memoryReferenceTypes.has(ref.type));

  return (
    <AppShell activeId="today" sessionEmail={actorContext.user.email} workspaceLabel="Artist Workspace" locale={locale}>
      <section className="today-shell">
        <PageHeader
          eyebrow={copy.today.eyebrow}
          title={copy.today.title}
          description={copy.today.description}
          className="today-page-header"
        />

        <CurrentFocusEditor
          locale={locale}
          currentDate={currentDate}
          current={currentObjective ? {
            id: currentObjective.id,
            title: currentObjective.title,
            statement: currentObjective.statement,
            periodStart: currentObjective.periodStart,
            periodEnd: currentObjective.periodEnd,
            priority: currentObjective.priority,
            version: currentObjective.version
          } : null}
        />

        <div className="today-workspace-grid">
          <main className="today-main-column">
            {primary ? (
              <section
                className={`today-hero-card today-primary-card tone-${toneFor(primary)}`}
                id={primaryOperationalAction ? `action-${primaryOperationalAction.id}` : undefined}
              >
                <div className="today-primary-copy">
                  <span className="signal-label">{copy.today.primary} · {labelFor(primary, locale)}</span>
                  <h2>{primary.title}</h2>
                  <p>{primary.whyThis[0]}</p>
                  {primary.objectiveAligned && <small className="today-objective-note">{copy.today.aligned}</small>}
                  {primaryOperationalAction && (
                    <OperationalActionControls
                      actionId={primaryOperationalAction.id}
                      status={primaryOperationalAction.status as "OPEN" | "IN_PROGRESS" | "BLOCKED"}
                      version={primaryOperationalAction.version}
                      executionMode={primaryOperationalAction.executionMode}
                      locale={locale}
                    />
                  )}
                </div>
                <div className="today-hero-actions">
                  <AttentionExplainability
                    item={primary}
                    resolvedBasedOn={primaryBasedOn}
                    resolvedBlockedBy={primaryBlockedBy}
                    locale={locale}
                  />
                  <a className="primary-action" href={primary.action.href}>{primary.action.label} →</a>
                </div>
              </section>
            ) : (
              <section className="today-hero-card today-primary-card tone-emerald">
                <div className="today-primary-copy">
                  <span className="signal-label">{copy.today.clear}</span>
                  <h2>{copy.today.noBlockers}</h2>
                  <p>{copy.today.noBlockersBody}</p>
                </div>
                <a className="primary-action" href="/factory">{copy.today.createWithContext} →</a>
              </section>
            )}

            <section className="attention-panel">
              <div className="panel-heading">
                <div>
                  <span className="signal-label">{copy.today.next}</span>
                  <h2>{copy.today.queue}</h2>
                </div>
                <small>{Math.max(0, localizedItems.length - 1)} {localizedItems.length - 1 === 1 ? copy.today.secondarySignal : copy.today.secondarySignals}</small>
              </div>
              {secondary.length === 0 ? (
                <div className="quiet-state">{copy.today.noSecondary}</div>
              ) : (
                secondary.map((item) => {
                  const operationalAction = operationalActionByAttentionId.get(item.id) ?? null;
                  return (
                    <article className="attention-row" key={item.id} id={operationalAction ? `action-${operationalAction.id}` : undefined}>
                      <i className={`attention-dot ${toneFor(item)}`} aria-hidden="true" />
                      <div className="attention-row-copy">
                        <span>{labelFor(item, locale)}</span>
                        <strong>{item.title}</strong>
                        <p>{item.whyThis[0]}</p>
                        {operationalAction && (
                          <OperationalActionControls
                            actionId={operationalAction.id}
                            status={operationalAction.status as "OPEN" | "IN_PROGRESS" | "BLOCKED"}
                            version={operationalAction.version}
                            executionMode={operationalAction.executionMode}
                            locale={locale}
                          />
                        )}
                      </div>
                      <div className="attention-row-actions">
                        <AttentionExplainability
                          item={item}
                          compact
                          resolvedBasedOn={resolvedRefsFor(item.basedOn)}
                          resolvedBlockedBy={resolvedRefsFor(item.blockedBy)}
                          locale={locale}
                        />
                        <a href={item.action.href} aria-label={item.action.label}>→</a>
                      </div>
                    </article>
                  );
                })
              )}
              {remainingSecondaryCount > 0 && (
                <div className="attention-overflow-note">+ {remainingSecondaryCount} {remainingSecondaryCount === 1 ? copy.today.lowerPriority : copy.today.lowerPriorityPlural} {copy.today.notExpanded}</div>
              )}
            </section>
          </main>

          <aside className="today-context-rail" aria-label="Context for primary attention">
            <div className="today-context-rail-head">
              <span className="signal-label">{copy.today.context}</span>
              <h2>{copy.today.whyHere}</h2>
              <p>{copy.today.whyHereBody}</p>
            </div>

            {primary ? (
              <>
                {primaryMemoryRefs.length > 0 && (
                  <section className="today-context-group">
                    <span>{copy.today.memoryInUse}</span>
                    <div className="today-context-ref-list">
                      {primaryMemoryRefs.slice(0, 4).map((ref) => ref.href ? (
                        <a href={ref.href} key={`${ref.type}-${ref.id}-memory`}>
                          <small>{ref.type}</small>
                          <strong>{ref.label}</strong>
                          <i aria-hidden="true">→</i>
                        </a>
                      ) : (
                        <div className="today-context-ref unresolved" key={`${ref.type}-${ref.id}-memory`}>
                          <small>{ref.type}</small>
                          <strong>{ref.label}</strong>
                          <i>{copy.today.unresolved}</i>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {primaryWorkflowRefs.length > 0 && (
                  <section className="today-context-group">
                    <span>{copy.today.workflowContext}</span>
                    <div className="today-context-ref-list">
                      {primaryWorkflowRefs.slice(0, 4).map((ref) => ref.href ? (
                        <a href={ref.href} key={`${ref.type}-${ref.id}-workflow`}>
                          <small>{ref.type}</small>
                          <strong>{ref.label}</strong>
                          <i aria-hidden="true">→</i>
                        </a>
                      ) : (
                        <div className="today-context-ref unresolved" key={`${ref.type}-${ref.id}-workflow`}>
                          <small>{ref.type}</small>
                          <strong>{ref.label}</strong>
                          <i>{copy.today.unresolved}</i>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {primaryBlockedBy.length > 0 && (
                  <section className="today-context-group">
                    <span>{copy.today.blockedBy}</span>
                    <div className="today-context-ref-list">
                      {primaryBlockedBy.slice(0, 3).map((ref) => ref.href ? (
                        <a href={ref.href} key={`${ref.type}-${ref.id}-blocked`}>
                          <small>{ref.type}</small>
                          <strong>{ref.label}</strong>
                          <i aria-hidden="true">→</i>
                        </a>
                      ) : (
                        <div className="today-context-ref unresolved" key={`${ref.type}-${ref.id}-blocked`}>
                          <small>{ref.type}</small>
                          <strong>{ref.label}</strong>
                          <i>{copy.today.unresolved}</i>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {primaryBasedOn.length === 0 && primaryBlockedBy.length === 0 && (
                  <div className="today-context-empty">
                    {copy.today.noExtraRef}
                  </div>
                )}
              </>
            ) : (
              <div className="today-context-empty">
                {copy.today.noPrimaryContext}
              </div>
            )}

            <footer className="today-context-links">
              <a href="/memory">{copy.today.openMemory} →</a>
              <a href="/knowledge">{copy.today.openBrain} →</a>
            </footer>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
