import { headers } from "next/headers";
import { PgArtistFoundationReader, PgContentExecutionReader, PgContentFactoryReader, PgKnowledgeReader } from "@artist-os/db";
import { AppShell } from "./components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";

type AttentionItem = {
  tone: "violet" | "amber" | "cyan" | "emerald";
  label: string;
  title: string;
  reason: string;
  href: string;
  action: string;
};

type BrainPayload = {
  validatedLearnings?: unknown[];
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

  const [identity, songs, knowledge, angles, units] = await Promise.all([
    artistReader.getIdentityHome(actorContext.artistId),
    artistReader.listSongs(actorContext.artistId),
    knowledgeReader.getHome(actorContext.artistId),
    factoryReader.listAngles(actorContext.artistId),
    factoryReader.listUnits(actorContext.artistId)
  ]);

  const approvedExecution = await Promise.all(
    units.map(async (unit) => ({ unit, approved: await executionReader.getApprovedRevision(actorContext.artistId!, unit.id) }))
  );

  const pendingKnowledge = knowledge.candidates.filter((candidate) => candidate.status === "PENDING");
  const reviewAngles = angles.filter((angle) => angle.status === "DRAFT" || angle.status === "DEFERRED");
  const unitAngleIds = new Set(units.flatMap((unit) => unit.angleId ? [unit.angleId] : []));
  const approvedWithoutUnit = angles.filter((angle) => angle.status === "APPROVED" && !unitAngleIds.has(angle.id));
  const unitsWithoutExecution = approvedExecution.filter((entry) => !entry.approved);
  const brainPayload = knowledge.latestSnapshot?.payload as BrainPayload | undefined;
  const learningCount = brainPayload?.validatedLearnings?.length ?? 0;

  const attention: AttentionItem[] = [];
  if (!identity.activeVersion) {
    attention.push({ tone: "amber", label: "FOUNDATION", title: "Activate your artist identity", reason: "Factory and future recommendations need one canonical active Identity Version.", href: "/identity", action: "Open Identity" });
  }
  if (unitsWithoutExecution[0]) {
    attention.push({ tone: "violet", label: "NOW", title: `Finish execution · ${unitsWithoutExecution[0].unit.title}`, reason: "This Content Unit exists, but it has no approved execution source yet.", href: `/factory/units/${unitsWithoutExecution[0].unit.id}`, action: "Continue execution" });
  }
  if (approvedWithoutUnit.length > 0) {
    attention.push({ tone: "cyan", label: "NEXT", title: `${approvedWithoutUnit.length} approved angle${approvedWithoutUnit.length === 1 ? "" : "s"} waiting for commitment`, reason: "Approval does not create a Content Unit automatically. Decide which idea should enter production.", href: "/factory", action: "Review approved angles" });
  }
  if (reviewAngles.length > 0) {
    attention.push({ tone: "cyan", label: "REVIEW", title: `${reviewAngles.length} content angle${reviewAngles.length === 1 ? "" : "s"} need judgment`, reason: "Draft and deferred ideas remain proposals until you explicitly approve, reject or defer them.", href: "/factory", action: "Review angles" });
  }
  if (pendingKnowledge.length > 0) {
    attention.push({ tone: "amber", label: "MEMORY", title: `${pendingKnowledge.length} knowledge candidate${pendingKnowledge.length === 1 ? "" : "s"} waiting`, reason: "Candidate knowledge stays outside permanent Artist Brain context until you review it.", href: "/knowledge", action: "Review Brain inbox" });
  }
  if (songs.length === 0) {
    attention.push({ tone: "violet", label: "MUSIC", title: "Add your first song", reason: "Song Brain gives future content and strategy decisions track-specific context.", href: "/songs", action: "Add song" });
  }

  const primary = attention[0] ?? null;
  const secondary = attention.slice(1, 4);
  const latestUnit = units[0] ?? null;

  return (
    <AppShell activeId="today" sessionEmail={actorContext.user.email} workspaceLabel="Artist Workspace">
      <section className="today-shell">
        <header className="today-header compact">
          <div>
            <p className="eyebrow">TODAY · DAILY OS</p>
            <h1>What needs attention now?</h1>
            <p>One selective surface across identity, music, memory and execution. Deep work stays in the owning domain.</p>
          </div>
          <div className="today-context-state"><i />Context Ready</div>
        </header>

        {primary ? (
          <section className={`today-hero-card tone-${primary.tone}`}>
            <div>
              <span className="signal-label">{primary.label}</span>
              <h2>{primary.title}</h2>
              <p>{primary.reason}</p>
            </div>
            <a className="primary-action" href={primary.href}>{primary.action} →</a>
          </section>
        ) : (
          <section className="today-hero-card tone-emerald">
            <div>
              <span className="signal-label">CLEAR</span>
              <h2>No immediate blockers</h2>
              <p>Your currently implemented workflows have no unresolved deterministic attention item. This is not a generic AI recommendation.</p>
            </div>
            <a className="primary-action" href="/factory">Create with context →</a>
          </section>
        )}

        <div className="today-stat-grid">
          <article><span>IDENTITY</span><strong>{identity.activeVersion ? `v${identity.activeVersion.versionNumber} ACTIVE` : "NEEDS SETUP"}</strong><small>{identity.activeEra ? `Era · ${identity.activeEra.name}` : "Base identity context"}</small></article>
          <article><span>MUSIC</span><strong>{songs.length}</strong><small>song{songs.length === 1 ? "" : "s"} in Artist OS</small></article>
          <article><span>BRAIN</span><strong>{knowledge.latestSnapshot ? `v${knowledge.latestSnapshot.versionNumber}` : "NO SNAPSHOT"}</strong><small>{pendingKnowledge.length} pending review</small></article>
          <article><span>EXECUTION</span><strong>{units.length}</strong><small>{unitsWithoutExecution.length} need approved execution</small></article>
        </div>

        <div className="today-columns">
          <section className="attention-panel">
            <div className="panel-heading"><div><span className="signal-label">NEXT</span><h2>Attention queue</h2></div><small>{attention.length} current signal{attention.length === 1 ? "" : "s"}</small></div>
            {secondary.length === 0 ? <div className="quiet-state">No secondary attention items right now.</div> : secondary.map((item) => (
              <a className="attention-row" href={item.href} key={`${item.label}-${item.title}`}>
                <i className={`attention-dot ${item.tone}`} />
                <div><span>{item.label}</span><strong>{item.title}</strong><p>{item.reason}</p></div>
                <b>→</b>
              </a>
            ))}
          </section>

          <section className="memory-panel">
            <div className="panel-heading"><div><span className="signal-label">MEMORY</span><h2>What compounds</h2></div></div>
            <div className="memory-block"><span>VALIDATED LEARNING</span><strong>{learningCount > 0 ? `${learningCount} available` : "Not enough evidence yet"}</strong><p>{learningCount > 0 ? "Validated learnings are available for future context assembly." : "Artist OS will surface reusable findings here only after their canonical intelligence workflow exists and evidence earns them."}</p></div>
            <div className="memory-block"><span>RECENT EXECUTION</span><strong>{latestUnit?.title ?? "No Content Unit yet"}</strong><p>{latestUnit ? `${latestUnit.status} · ${latestUnit.songTitle ?? "Artist-level"}` : "Create and approve content without losing the reason behind the concept."}</p></div>
            <a className="inline-link" href="/knowledge">Open Brain →</a>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
