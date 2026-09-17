import { headers } from "next/headers";
import { listWeeklyReviews } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { WeeklyReviewWorkspaceClient } from "./weekly-review-workspace-client";

export default async function WeeklyReviewsPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) {
    return <AppShell activeId="brain"><section className="empty-state"><p className="eyebrow">AUTH REQUIRED</p><h1>Weekly Review</h1><p>Sign in before Artist OS can review private career context.</p><a className="inline-link" href="/auth">Sign in →</a></section></AppShell>;
  }
  if (!actorContext.artistId) {
    return <AppShell activeId="brain" sessionEmail={actorContext.user.email}><section className="empty-state"><p className="eyebrow">WORKSPACE REQUIRED</p><h1>Weekly Review</h1><p>Create the artist workspace first.</p><a className="inline-link" href="/">Open Today →</a></section></AppShell>;
  }

  const reviews = await listWeeklyReviews(getDatabaseRuntime().db, actorContext.artistId, 24);
  const serialized = reviews.map((review) => ({
    ...review,
    periodStart: review.periodStart.toISOString(),
    periodEnd: review.periodEnd.toISOString(),
    generatedAt: review.generatedAt.toISOString(),
    createdAt: review.createdAt.toISOString()
  }));

  return (
    <AppShell activeId="brain" sessionEmail={actorContext.user.email}>
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">RITUAL · WEEKLY REVIEW</p>
        <h1>Turn the week into better decisions</h1>
        <p>Deterministic facts first. Review what happened, what changed, what was learned and what still needs judgment. Nothing changes strategy until you explicitly commit it.</p>
      </header>
      <WeeklyReviewWorkspaceClient initialReviews={serialized} />
    </AppShell>
  );
}
