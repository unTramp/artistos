import { headers } from "next/headers";
import { listLearnings } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { MemorySubnav } from "../components/memory-subnav";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { EntityReferenceResolver } from "@/lib/entity-reference-resolver";
import { getDatabaseRuntime } from "@/lib/runtime";
import { LearningMemoryClient } from "./learning-memory-client";

export default async function LearningsPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) {
    return <AppShell activeId="memory" stage="Phase 2.5 · Learning"><section className="empty-state"><p className="eyebrow">AUTH REQUIRED</p><h1>Learning Memory</h1><p>Sign in before Artist OS can read or change private learnings.</p><a className="inline-link" href="/auth">Sign in →</a></section></AppShell>;
  }
  if (!actorContext.artistId) {
    return <AppShell activeId="memory" sessionEmail={actorContext.user.email} stage="Phase 2.5 · Learning"><section className="empty-state"><p className="eyebrow">WORKSPACE REQUIRED</p><h1>Learning Memory</h1><p>Create the artist workspace first.</p><a className="inline-link" href="/">Open Today →</a></section></AppShell>;
  }

  const runtime = getDatabaseRuntime();
  const learnings = await listLearnings(runtime.db, actorContext.artistId, { limit: 100 });
  const resolver = new EntityReferenceResolver(runtime.db, actorContext.artistId);
  const resolvedReferences = await resolver.resolveMany(
    learnings.flatMap((learning) => learning.references.map((reference) => ({
      type: reference.refType,
      id: reference.refId
    })))
  );
  const serialized = learnings.map((learning) => ({ ...learning, freshUntil: learning.freshUntil?.toISOString() ?? null, createdAt: learning.createdAt.toISOString(), updatedAt: learning.updatedAt.toISOString() }));

  return (
    <AppShell activeId="memory" sessionEmail={actorContext.user.email} stage="Phase 2.5 · Learning Intelligence">
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">MEMORY · LEARNINGS</p>
        <h1>Remember what the work actually taught you</h1>
        <p>Learning is scoped evidence-backed memory from actions and results. It stays separate from Knowledge, keeps contradictions visible and only becomes VALIDATED through explicit human approval.</p>
      </header>
      <MemorySubnav active="learnings" />
      <LearningMemoryClient initialLearnings={serialized} resolvedReferences={resolvedReferences} />
    </AppShell>
  );
}
