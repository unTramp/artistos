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

const toneFor = (item: AttentionItem): "violet" | "amber" | "cyan" | "emerald" => {
  if (item.kind === "BLOCKER") return "amber";
  if (item.kind === "MEMORY") return "amber";
  if (item.kind === "REVIEW") return "cyan";
  return "violet";
};

const labelFor = (item: AttentionItem) => {
  if (item.kind === "BLOCKER") return "BLOCKED";
  if (item.kind === "NEXT_ACTION") return "NEXT";
  if (item.kind === "REVIEW") return "REVIEW";
  if (item.kind === "MEMORY") return "MEMORY";
  if (item.kind === "FOUNDATION") return "FOUNDATION";
  return "MUSIC";
};

const memoryReferenceTypes = new Set(["Decision", "Learning", "WeeklyReview"]);

export default async function HomePage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="today">
        <section className="today-shell">
          <header className="today-header">
            <p className="eyebrow">YOUR CAREER · ONE OPERATING SYSTEM</p>
            <h1>Know what matters next.</h1>
            <p>Artist OS connects your identity, music, memory and execution so the next decision starts with context instead of a blank page.</p>
          </header>
          <section className="today-hero-card unauthenticated">
            <div>
              <span className="signal-label">START HERE</span>
              <h2>Establish your artist workspace</h2>
              <p>Sign in or create an account. Artist OS will keep every future decision inside your private artist scope.</p>
            </div>
            <a className="primary-action" href="/auth">Sign in →</a>
          </section>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="today" sessionEmail={actorContext.user.email}>
        <section className="today-shell">
          <header className="today-header">
            <p className="eyebrow">WELCOME TO ARTIST OS</p>
            <h1>Create your artist workspace.</h1>
            <p>Three essentials are enough to start. Everything else should be learned progressively as you use the product.</p>
          </header>
          <section className="today-hero-card">
            <div>
              <span className="signal-label">ONBOARDING</span>
              <h2>No DevTools required</h2>
              <p>Create the canonical Artist scope, then Artist OS can begin building Identity, Song Brain and memory around your real work.</p>
            </div>
            <a className="primary-action" href="/onboarding">Create workspace →</a>
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

  const operationalActionByAttentionId = new Map(operationalActions.map((action) => [`operational-action:${action.id}`, action]));
  const primary = projection.items[0] ?? null;
  const primaryOperationalAction = primary ? operationalActionByAttentionId.get(primary.id) ?? null : null;
  const secondary = projection.items.slice(1, 6);
  const remainingSecondaryCount = Math.max(0, projection.items.length - 1 - secondary.length);
  const primaryBasedOn = primary ? resolvedRefsFor(primary.basedOn) : [];
  const primaryBlockedBy = primary ? resolvedRefsFor(primary.blockedBy) : [];
  const primaryMemoryRefs = primaryBasedOn.filter((ref) => memoryReferenceTypes.has(ref.type));
  const primaryWorkflowRefs = primaryBasedOn.filter((ref) => !memoryReferenceTypes.has(ref.type));

  return (
    <AppShell activeId="today" sessionEmail={actorContext.user.email} workspaceLabel="Artist Workspace">
      <section className="today-shell">
        <PageHeader
          eyebrow="DAILY OS"
          title="Today"
          description="What needs attention now? Artist OS projects current canonical state into one primary action, a bounded attention queue and the provenance that explains why."
          className="today-page-header"
        />

        <CurrentFocusEditor
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
                  <span className="signal-label">PRIMARY · {labelFor(primary)}</span>
                  <h2>{primary.title}</h2>
                  <p>{primary.whyThis[0]}</p>
                  {primary.objectiveAligned && <small className="today-objective-note">Aligned with current objective</small>}
                  {primaryOperationalAction && (
                    <OperationalActionControls
                      actionId={primaryOperationalAction.id}
                      status={primaryOperationalAction.status as "OPEN" | "IN_PROGRESS" | "BLOCKED"}
                      version={primaryOperationalAction.version}
                      executionMode={primaryOperationalAction.executionMode}
                    />
                  )}
                </div>
                <div className="today-hero-actions">
                  <AttentionExplainability
                    item={primary}
                    resolvedBasedOn={primaryBasedOn}
                    resolvedBlockedBy={primaryBlockedBy}
                  />
                  <a className="primary-action" href={primary.action.href}>{primary.action.label} →</a>
                </div>
              </section>
            ) : (
              <section className="today-hero-card today-primary-card tone-emerald">
                <div className="today-primary-copy">
                  <span className="signal-label">CLEAR</span>
                  <h2>No immediate blockers</h2>
                  <p>Your implemented workflows have no unresolved deterministic attention item. Artist OS is not filling the gap with generic AI advice.</p>
                </div>
                <a className="primary-action" href="/factory">Create with context →</a>
              </section>
            )}

            <section className="attention-panel">
              <div className="panel-heading">
                <div>
                  <span className="signal-label">NEXT</span>
                  <h2>Attention queue</h2>
                </div>
                <small>{Math.max(0, projection.items.length - 1)} secondary signal{projection.items.length - 1 === 1 ? "" : "s"}</small>
              </div>
              {secondary.length === 0 ? (
                <div className="quiet-state">No secondary attention items right now.</div>
              ) : (
                secondary.map((item) => {
                  const operationalAction = operationalActionByAttentionId.get(item.id) ?? null;
                  return (
                    <article className="attention-row" key={item.id} id={operationalAction ? `action-${operationalAction.id}` : undefined}>
                      <i className={`attention-dot ${toneFor(item)}`} aria-hidden="true" />
                      <div className="attention-row-copy">
                        <span>{labelFor(item)}</span>
                        <strong>{item.title}</strong>
                        <p>{item.whyThis[0]}</p>
                        {operationalAction && (
                          <OperationalActionControls
                            actionId={operationalAction.id}
                            status={operationalAction.status as "OPEN" | "IN_PROGRESS" | "BLOCKED"}
                            version={operationalAction.version}
                            executionMode={operationalAction.executionMode}
                          />
                        )}
                      </div>
                      <div className="attention-row-actions">
                        <AttentionExplainability
                          item={item}
                          compact
                          resolvedBasedOn={resolvedRefsFor(item.basedOn)}
                          resolvedBlockedBy={resolvedRefsFor(item.blockedBy)}
                        />
                        <a href={item.action.href} aria-label={item.action.label}>→</a>
                      </div>
                    </article>
                  );
                })
              )}
              {remainingSecondaryCount > 0 && (
                <div className="attention-overflow-note">+ {remainingSecondaryCount} lower-priority signal{remainingSecondaryCount === 1 ? "" : "s"} not expanded here.</div>
              )}
            </section>
          </main>

          <aside className="today-context-rail" aria-label="Context for primary attention">
            <div className="today-context-rail-head">
              <span className="signal-label">CONTEXT</span>
              <h2>Why this is here</h2>
              <p>Only direct provenance from the current primary recommendation is shown here. Recency alone does not make something relevant.</p>
            </div>

            {primary ? (
              <>
                {primaryMemoryRefs.length > 0 && (
                  <section className="today-context-group">
                    <span>MEMORY IN USE</span>
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
                          <i>UNRESOLVED</i>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {primaryWorkflowRefs.length > 0 && (
                  <section className="today-context-group">
                    <span>WORKFLOW CONTEXT</span>
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
                          <i>UNRESOLVED</i>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {primaryBlockedBy.length > 0 && (
                  <section className="today-context-group">
                    <span>BLOCKED BY</span>
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
                          <i>UNRESOLVED</i>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {primaryBasedOn.length === 0 && primaryBlockedBy.length === 0 && (
                  <div className="today-context-empty">
                    No additional entity reference is required for this deterministic recommendation.
                  </div>
                )}
              </>
            ) : (
              <div className="today-context-empty">
                No primary attention item is active, so Artist OS has no recommendation provenance to surface here.
              </div>
            )}

            <footer className="today-context-links">
              <a href="/memory">Open Memory →</a>
              <a href="/knowledge">Open Brain →</a>
            </footer>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
