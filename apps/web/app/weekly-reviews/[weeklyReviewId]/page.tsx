import { headers } from "next/headers";
import { getWeeklyReview } from "@artist-os/db";
import { AppShell } from "../../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { EntityReferenceResolver } from "@/lib/entity-reference-resolver";
import { getDatabaseRuntime } from "@/lib/runtime";
import { WeeklyReviewDetailClient } from "./weekly-review-detail-client";

export default async function WeeklyReviewDetailPage({ params }: { params: Promise<{ weeklyReviewId: string }> }) {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) return <AppShell activeId="brain"><section className="empty-state"><h1>Weekly Review</h1><a className="inline-link" href="/auth">Sign in →</a></section></AppShell>;
  if (!actorContext.artistId) return <AppShell activeId="brain" sessionEmail={actorContext.user.email}><section className="empty-state"><h1>Weekly Review</h1><a className="inline-link" href="/">Open Today →</a></section></AppShell>;
  const { weeklyReviewId } = await params;
  const runtime = getDatabaseRuntime();
  const review = await getWeeklyReview(runtime.db, actorContext.artistId, weeklyReviewId);
  if (!review) return <AppShell activeId="brain" sessionEmail={actorContext.user.email}><section className="empty-state"><p className="eyebrow">NOT FOUND</p><h1>Weekly Review</h1><p>This review does not exist in the current artist scope.</p><a className="inline-link" href="/weekly-reviews">Review history →</a></section></AppShell>;

  const resolver = new EntityReferenceResolver(runtime.db, actorContext.artistId);
  const resolvedReferences = await resolver.resolveMany(
    review.sections.flatMap((section) =>
      section.items.flatMap((item) => (item.references ?? []).map((reference) => ({
        type: reference.refType,
        id: reference.refId
      })))
    )
  );

  const serialized = {
    ...review,
    periodStart: review.periodStart.toISOString(),
    periodEnd: review.periodEnd.toISOString(),
    generatedAt: review.generatedAt.toISOString(),
    createdAt: review.createdAt.toISOString()
  };

  return (
    <AppShell activeId="brain" sessionEmail={actorContext.user.email}>
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">WEEKLY REVIEW · IMMUTABLE SNAPSHOT</p>
        <h1>{new Date(review.periodStart).toLocaleDateString()} — {new Date(review.periodEnd).toLocaleDateString()}</h1>
        <p>Facts and uncertainty are preserved as they were seen at generation time. Commit only the decisions and actions you actually want to carry forward.</p>
        <p><a className="inline-link" href="/weekly-reviews">← Review history</a></p>
      </header>
      <WeeklyReviewDetailClient review={serialized} resolvedReferences={resolvedReferences} />
    </AppShell>
  );
}
