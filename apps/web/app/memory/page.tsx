import { headers } from "next/headers";
import {
  PgDecisionReader,
  listLearnings,
  listWeeklyReviews
} from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";

type RecentMemoryItem = {
  key: string;
  kind: "DECISION" | "LEARNING" | "WEEKLY REVIEW";
  title: string;
  meta: string;
  href: string;
  occurredAt: Date;
};

const truncate = (value: string, limit = 110) =>
  value.length > limit ? `${value.slice(0, limit - 1)}…` : value;

export default async function MemoryPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="memory">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Memory</h1>
          <p>Sign in before Artist OS can read private decisions, learnings and review history.</p>
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
          <p>Create the artist workspace first. Memory always belongs to one Artist scope.</p>
          <a className="inline-link" href="/">Open Today →</a>
        </section>
      </AppShell>
    );
  }

  const runtime = getDatabaseRuntime();
  const decisionReader = new PgDecisionReader(runtime.db);

  const [decisions, learnings, weeklyReviews] = await Promise.all([
    decisionReader.listDecisions(actorContext.artistId, { limit: 100 }),
    listLearnings(runtime.db, actorContext.artistId, { limit: 100 }),
    listWeeklyReviews(runtime.db, actorContext.artistId, 24)
  ]);

  const liveDecisions = decisions.filter((decision) => decision.status === "ACTIVE" || decision.status === "UNDER_REVIEW");
  const historicalDecisions = decisions.length - liveDecisions.length;
  const validatedLearnings = learnings.filter((learning) => learning.status === "VALIDATED");
  const testingLearnings = learnings.filter((learning) => learning.status === "TESTING");
  const latestDecision = decisions[0] ?? null;
  const latestLearning = learnings[0] ?? null;
  const latestReview = weeklyReviews[0] ?? null;

  const recentMemory: RecentMemoryItem[] = [
    ...decisions.slice(0, 8).map((decision) => ({
      key: `decision:${decision.id}`,
      kind: "DECISION" as const,
      title: decision.title,
      meta: `${decision.status.replaceAll("_", " ")} · ${decision.scope}`,
      href: `/decisions/${decision.id}`,
      occurredAt: decision.updatedAt
    })),
    ...learnings.slice(0, 8).map((learning) => ({
      key: `learning:${learning.id}`,
      kind: "LEARNING" as const,
      title: truncate(learning.statement),
      meta: `${learning.status} · ${learning.scope} · ${learning.confidence} confidence`,
      href: `/learnings#learning-${learning.id}`,
      occurredAt: learning.updatedAt
    })),
    ...weeklyReviews.slice(0, 8).map((review) => ({
      key: `weekly-review:${review.id}`,
      kind: "WEEKLY REVIEW" as const,
      title: `${review.periodStart.toISOString().slice(0, 10)} → ${review.periodEnd.toISOString().slice(0, 10)}`,
      meta: `${review.sections.reduce((count, section) => count + section.items.length, 0)} review items · ${review.configurationVersion}`,
      href: `/weekly-reviews/${review.id}`,
      occurredAt: review.generatedAt
    }))
  ]
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, 8);

  return (
    <AppShell activeId="memory" sessionEmail={actorContext.user.email}>
      <section className="memory-workspace">
        <header className="product-header memory-workspace-hero">
          <p className="eyebrow">MEMORY · INTELLIGENCE</p>
          <h1>Remember what happened — and why it matters next.</h1>
          <p>Memory preserves decisions, learnings and review history. It does not replace Brain: Brain is the current context Artist OS should use now; Memory preserves the lineage that explains how you got there.</p>
        </header>

        <section className="memory-boundary-grid" aria-label="Brain and Memory boundary">
          <article>
            <span>MEMORY</span>
            <strong>History + learning + decisions</strong>
            <p>What happened, what was observed, what was learned, what you chose and why. Historical truth stays inspectable even when direction changes.</p>
          </article>
          <article>
            <span>BRAIN</span>
            <strong>Current usable context</strong>
            <p>A versioned projection of Identity, Knowledge, hard rules and eligible validated Learnings that current work can safely consume.</p>
            <a className="inline-link" href="/knowledge">Open Brain →</a>
          </article>
        </section>

        <section className="memory-domain-grid" aria-label="Memory domains">
          <article className="memory-domain-card">
            <div className="memory-domain-head">
              <span>DECISIONS</span>
              <strong>{liveDecisions.length}</strong>
            </div>
            <h2>Material choices</h2>
            <p>{latestDecision ? latestDecision.title : "No Decision memory yet."}</p>
            <small>{liveDecisions.length} live · {historicalDecisions} historical</small>
            <a className="decision-secondary-button" href="/decisions">Open Decisions →</a>
          </article>

          <article className="memory-domain-card">
            <div className="memory-domain-head">
              <span>LEARNINGS</span>
              <strong>{validatedLearnings.length}</strong>
            </div>
            <h2>Evidence-backed memory</h2>
            <p>{latestLearning ? truncate(latestLearning.statement) : "No Learning memory yet."}</p>
            <small>{validatedLearnings.length} validated · {testingLearnings.length} testing · {learnings.length} total</small>
            <a className="decision-secondary-button" href="/learnings">Open Learnings →</a>
          </article>

          <article className="memory-domain-card">
            <div className="memory-domain-head">
              <span>WEEKLY REVIEWS</span>
              <strong>{weeklyReviews.length}</strong>
            </div>
            <h2>Immutable reflection</h2>
            <p>{latestReview
              ? `Latest: ${latestReview.periodStart.toISOString().slice(0, 10)} → ${latestReview.periodEnd.toISOString().slice(0, 10)}`
              : "No Weekly Review snapshots yet."}</p>
            <small>Facts, observations, hypotheses and recommendations stay distinguishable.</small>
            <a className="decision-secondary-button" href="/weekly-reviews">Open Weekly Reviews →</a>
          </article>
        </section>

        <section className="memory-recent-section">
          <div className="section-heading">
            <p className="eyebrow">RECENT MEMORY</p>
            <h2>What changed most recently</h2>
            <p className="muted-note">Chronology only. Recency is not a score and does not imply importance or truth.</p>
          </div>

          {recentMemory.length === 0 ? (
            <div className="empty-state compact-empty">
              <h3>No durable memory yet</h3>
              <p>Decisions, Learnings and Weekly Reviews will appear here as real work creates evidence and human commitments.</p>
            </div>
          ) : (
            <div className="memory-recent-list">
              {recentMemory.map((item) => (
                <a className="memory-recent-row" href={item.href} key={item.key}>
                  <span>{item.kind}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </div>
                  <time dateTime={item.occurredAt.toISOString()}>{item.occurredAt.toLocaleDateString("en")}</time>
                  <i aria-hidden="true">→</i>
                </a>
              ))}
            </div>
          )}
        </section>
      </section>
    </AppShell>
  );
}
