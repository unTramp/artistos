import { headers } from "next/headers";
import { AttentionProjectionService, type AttentionItem } from "@artist-os/core";
import {
  PgArtistFoundationReader,
  PgContentExecutionReader,
  PgContentFactoryReader,
  PgDecisionReader,
  PgKnowledgeReader,
  PgOperationalActionReader,
  PgPlanningObjectiveReader,
  listLearnings
} from "@artist-os/db";
import { AppShell } from "./components/app-shell";
import { AttentionExplainability } from "./components/attention-explainability";
import { CurrentFocusEditor } from "./components/current-focus-editor";
import { OperationalActionControls } from "./components/operational-action-controls";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
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

const hrefForOperationalSource = (sourceEntityType: string, sourceEntityId: string) => {
  if (sourceEntityType === "ContentUnit") return `/factory/units/${sourceEntityId}`;
  if (sourceEntityType === "ContentAngle") return "/factory";
  if (sourceEntityType === "CandidateKnowledge") return "/knowledge";
  if (sourceEntityType === "ArtistIdentity" || sourceEntityType === "IdentityVersion") return "/identity";
  if (sourceEntityType === "Song") return `/songs/${sourceEntityId}`;
  if (sourceEntityType === "Decision") return `/decisions/${sourceEntityId}`;
  if (sourceEntityType === "Learning") return "/learnings";
  if (sourceEntityType === "WeeklyReview") return `/weekly-reviews/${sourceEntityId}`;
  return "/";
};

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
  const decisionReader = new PgDecisionReader(runtime.db);
  const computedAt = new Date();
  const currentDate = computedAt.toISOString().slice(0, 10);

  const [identity, songs, knowledge, angles, units, operationalActions, currentObjective, recentDecisions, recentLearnings] = await Promise.all([
    artistReader.getIdentityHome(actorContext.artistId),
    artistReader.listSongs(actorContext.artistId),
    knowledgeReader.getHome(actorContext.artistId),
    factoryReader.listAngles(actorContext.artistId),
    factoryReader.listUnits(actorContext.artistId),
    actionReader.listActions(actorContext.artistId, { statuses: ["OPEN", "IN_PROGRESS", "BLOCKED"], limit: 50 }),
    objectiveReader.getCurrentPrimary(actorContext.artistId, currentDate),
    decisionReader.listDecisions(actorContext.artistId, { statuses: ["ACTIVE", "UNDER_REVIEW"], limit: 3 }),
    listLearnings(runtime.db, actorContext.artistId, { statuses: ["VALIDATED"], limit: 3 })
  ]);

  const approvedExecution = await Promise.all(
    units.map(async (unit) => ({ unit, approved: await executionReader.getApprovedRevision(actorContext.artistId!, unit.id) }))
  );

  const pendingKnowledge = knowledge.candidates.filter((candidate) => candidate.status === "PENDING");
  const reviewAngles = angles.filter((angle) => angle.status === "DRAFT" || angle.status === "DEFERRED");
  const unitAngleIds = new Set(units.flatMap((unit) => unit.angleId ? [unit.angleId] : []));
  const approvedWithoutUnit = angles.filter((angle) => angle.status === "APPROVED" && !unitAngleIds.has(angle.id));
  const unitsWithoutExecution = approvedExecution.filter((entry) => !entry.approved);
  const recentDecision = recentDecisions[0] ?? null;
  const recentLearning = recentLearnings[0] ?? null;

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

  const operationalActionByAttentionId = new Map(operationalActions.map((action) => [`operational-action:${action.id}`, action]));
  const primary = projection.items[0] ?? null;
  const primaryOperationalAction = primary ? operationalActionByAttentionId.get(primary.id) ?? null : null;
  const secondary = projection.items.slice(1, 4);
  const latestUnit = units[0] ?? null;

  return (
    <AppShell activeId="today" sessionEmail={actorContext.user.email} workspaceLabel="Artist Workspace">
      <section className="today-shell">
        <header className="today-header compact">
          <div>
            <p className="eyebrow">TODAY · DAILY OS</p>
            <h1>What needs attention now?</h1>
            <p>One deterministic projection across domain state and OperationalActions. Deep work stays in the owning domain.</p>
          </div>
          <div className="today-context-state"><i />Context Ready</div>
        </header>

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

        {primary ? (
          <section className={`today-hero-card tone-${toneFor(primary)}`}>
            <div>
              <span className="signal-label">{labelFor(primary)}</span>
              <h2>{primary.title}</h2>
              <p>{primary.whyThis[0]}</p>
              {primary.objectiveAligned && <small className="today-objective-note">Aligned with current objective</small>}
              {primaryOperationalAction && <OperationalActionControls
                actionId={primaryOperationalAction.id}
                status={primaryOperationalAction.status as "OPEN" | "IN_PROGRESS" | "BLOCKED"}
                version={primaryOperationalAction.version}
                executionMode={primaryOperationalAction.executionMode}
              />}
            </div>
            <div className="today-hero-actions">
              <AttentionExplainability item={primary} />
              <a className="primary-action" href={primary.action.href}>{primary.action.label} →</a>
            </div>
          </section>
        ) : (
          <section className="today-hero-card tone-emerald">
            <div>
              <span className="signal-label">CLEAR</span>
              <h2>No immediate blockers</h2>
              <p>Your implemented workflows have no unresolved deterministic attention item. This is not a generic AI recommendation.</p>
            </div>
            <a className="primary-action" href="/factory">Create with context →</a>
          </section>
        )}

        <div className="today-stat-grid">
          <article><span>IDENTITY</span><strong>{identity.activeVersion ? `v${identity.activeVersion.versionNumber} ACTIVE` : "NEEDS SETUP"}</strong><small>{identity.activeEra ? `Era · ${identity.activeEra.name}` : "Base identity context"}</small></article>
          <article><span>MUSIC</span><strong>{songs.length}</strong><small>song{songs.length === 1 ? "" : "s"} in Artist OS</small></article>
          <article><span>BRAIN</span><strong>{knowledge.latestSnapshot ? `v${knowledge.latestSnapshot.versionNumber}` : "NO SNAPSHOT"}</strong><small>{pendingKnowledge.length} pending review</small></article>
          <article><span>ACTIONS</span><strong>{operationalActions.length}</strong><small>active operational action{operationalActions.length === 1 ? "" : "s"}</small></article>
        </div>

        <div className="today-columns">
          <section className="attention-panel">
            <div className="panel-heading"><div><span className="signal-label">NEXT</span><h2>Attention queue</h2></div><small>{projection.items.length} current signal{projection.items.length === 1 ? "" : "s"}</small></div>
            {secondary.length === 0 ? <div className="quiet-state">No secondary attention items right now.</div> : secondary.map((item) => {
              const operationalAction = operationalActionByAttentionId.get(item.id) ?? null;
              return (
                <article className="attention-row" key={item.id}>
                  <i className={`attention-dot ${toneFor(item)}`} />
                  <div className="attention-row-copy">
                    <span>{labelFor(item)}</span><strong>{item.title}</strong><p>{item.whyThis[0]}</p>
                    {operationalAction && <OperationalActionControls
                      actionId={operationalAction.id}
                      status={operationalAction.status as "OPEN" | "IN_PROGRESS" | "BLOCKED"}
                      version={operationalAction.version}
                      executionMode={operationalAction.executionMode}
                    />}
                  </div>
                  <div className="attention-row-actions">
                    <AttentionExplainability item={item} compact />
                    <a href={item.action.href} aria-label={item.action.label}>→</a>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="memory-panel">
            <div className="panel-heading"><div><span className="signal-label">MEMORY</span><h2>What compounds</h2></div><small>{recentDecisions.length + recentLearnings.length} reusable memory signal{recentDecisions.length + recentLearnings.length === 1 ? "" : "s"}</small></div>
            <div className="memory-block"><span>RECENT DECISION</span><strong>{recentDecision?.title ?? "No decision memory yet"}</strong><p>{recentDecision ? recentDecision.reason : "Record material choices so future strategy can remember what you chose and why."}</p></div>
            <div className="memory-block"><span>VALIDATED LEARNING</span><strong>{recentLearning?.statement ?? "Not enough evidence yet"}</strong><p>{recentLearning ? `${recentLearning.scope} · ${recentLearning.confidence} confidence · ${recentLearning.confidenceRationale}` : "Artist OS will surface reusable findings here only after they move through the canonical Learning lifecycle and receive human validation."}</p></div>
            <div className="memory-block"><span>RECENT EXECUTION</span><strong>{latestUnit?.title ?? "No Content Unit yet"}</strong><p>{latestUnit ? `${latestUnit.status} · ${latestUnit.songTitle ?? "Artist-level"}` : "Create and approve content without losing the reason behind the concept."}</p></div>
            <a className="inline-link" href="/decisions">Open Decision Memory →</a>
            <a className="inline-link" href="/learnings">Open Learning Memory →</a>
            <a className="inline-link" href="/knowledge">Open Brain →</a>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
