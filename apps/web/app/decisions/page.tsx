import { headers } from "next/headers";
import { PgDecisionReader } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { MemorySubnav } from "../components/memory-subnav";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { DecisionMemoryClient } from "./decision-memory-client";

export default async function DecisionsPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="memory" stage="Phase 2.5 · Decision Intelligence">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Decision Memory</h1>
          <p>Sign in before Artist OS can read or change private strategy memory.</p>
          <a className="inline-link" href="/auth">Sign in →</a>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="memory" sessionEmail={actorContext.user.email} stage="Phase 2.5 · Decision Intelligence">
        <section className="empty-state">
          <p className="eyebrow">WORKSPACE REQUIRED</p>
          <h1>Decision Memory</h1>
          <p>Create the artist workspace first. Decision Memory is always scoped to one Artist.</p>
          <a className="inline-link" href="/">Open Today →</a>
        </section>
      </AppShell>
    );
  }

  const decisions = await new PgDecisionReader(getDatabaseRuntime().db).listDecisions(actorContext.artistId, { limit: 100 });
  const serialized = decisions.map((decision) => ({
    ...decision,
    createdAt: decision.createdAt.toISOString(),
    updatedAt: decision.updatedAt.toISOString(),
    reviewAt: decision.reviewAt?.toISOString() ?? null
  }));

  return (
    <AppShell activeId="memory" sessionEmail={actorContext.user.email} stage="Phase 2.5 · Decision Intelligence">
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">MEMORY · DECISIONS</p>
        <h1>Remember the choice, not just the outcome</h1>
        <p>Decision Memory preserves what you chose, why you chose it, when it should be reconsidered and what later replaced it. Prior choices advise future strategy without becoming a hard policy.</p>
      </header>
      <MemorySubnav active="decisions" />
      <DecisionMemoryClient initialDecisions={serialized} />
    </AppShell>
  );
}
