import { headers } from "next/headers";
import { PgDecisionReader, listLearnings, listWeeklyReviews } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { MemorySubnav } from "../components/memory-subnav";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";

export default async function MemoryPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="memory">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Memory</h1>
          <p>Sign in before Artist OS can read private learning and decision history.</p>
          <a className="inline-link" href="/auth">Sign in →</a>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="memory" sessionEmail={actorContext.user.email}>
        <section className="empty-state">
          <p className="eyebrow">WORKSPACE REQUIRED</p>
          <h1>Memory</h1>
          <p>Create the artist workspace first. Memory is always scoped to one Artist.</p>
          <a className="inline-link" href="/">Open Today →</a>
        </section>
      </AppShell>
    );
  }

  const runtime = getDatabaseRuntime();
  const [decisions, learnings, reviews] = await Promise.all([
    new PgDecisionReader(runtime.db).listDecisions(actorContext.artistId, { limit: 100 }),
    listLearnings(runtime.db, actorContext.artistId, { limit: 100 }),
    listWeeklyReviews(runtime.db, actorContext.artistId, 24)
  ]);

  const validatedLearnings = learnings.filter((learning) => learning.status === "VALIDATED").length;
  const activeDecisions = decisions.filter((decision) => decision.status === "ACTIVE" || decision.status === "UNDER_REVIEW").length;

  return (
    <AppShell activeId="memory" sessionEmail={actorContext.user.email}>
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">MEMORY · INTELLIGENCE</p>
        <h1>What happened, what changed, and what should be reused</h1>
        <p>Memory preserves evidence-backed learning, decisions and review history. It explains how Artist OS arrived here; Brain compiles only the context that should be active now.</p>
      </header>

      <MemorySubnav active="overview" />

      <section className="memory-hub-grid" aria-label="Memory workspace overview">
        <a className="memory-hub-card" href="/decisions">
          <span>DECISIONS</span>
          <strong>{activeDecisions}</strong>
          <p>Active or under-review choices with rationale, review dates and supersession history.</p>
          <small>{decisions.length} total recorded →</small>
        </a>

        <a className="memory-hub-card" href="/learnings">
          <span>LEARNINGS</span>
          <strong>{validatedLearnings}</strong>
          <p>Evidence-backed findings moving through candidate, testing, validation and revalidation.</p>
          <small>{learnings.length} total recorded →</small>
        </a>

        <a className="memory-hub-card" href="/weekly-reviews">
          <span>WEEKLY REVIEWS</span>
          <strong>{reviews.length}</strong>
          <p>Immutable review snapshots that turn recent work into explicit next decisions and actions.</p>
          <small>Open review history →</small>
        </a>
      </section>

      <section className="memory-boundary-card">
        <div>
          <span className="signal-label">BRAIN ≠ MEMORY</span>
          <h2>Memory keeps the history. Brain keeps the current working context.</h2>
        </div>
        <a className="inline-link" href="/knowledge">Open Artist Brain →</a>
      </section>
    </AppShell>
  );
}
