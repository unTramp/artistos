import { headers } from "next/headers";
import { PgContentExecutionReader, PgContentFactoryReader } from "@artist-os/db";
import { AppShell } from "../../../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { ExecutionActions } from "./execution-actions";

export default async function ContentExecutionPage({ params }: { params: Promise<{ unitId: string }> }) {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  const { unitId } = await params;
  if (!actorContext) {
    return (
      <AppShell activeId="factory" stage="Phase 2 · Content Factory">
        <section className="empty-state"><p className="eyebrow">AUTH REQUIRED</p><h1>Execution</h1><p>Sign in before opening private production instructions.</p><a className="inline-link" href="/auth">Sign in →</a></section>
      </AppShell>
    );
  }
  if (!actorContext.artistId) {
    return (
      <AppShell activeId="factory" sessionEmail={actorContext.user.email} stage="Phase 2 · Content Factory">
        <section className="empty-state"><p className="eyebrow">WORKSPACE REQUIRED</p><h1>Execution</h1><p>Create the artist workspace first.</p><a className="inline-link" href="/">Open Overview →</a></section>
      </AppShell>
    );
  }

  const runtime = getDatabaseRuntime();
  const factoryReader = new PgContentFactoryReader(runtime.db);
  const executionReader = new PgContentExecutionReader(runtime.db);
  const [units, revisions] = await Promise.all([
    factoryReader.listUnits(actorContext.artistId),
    executionReader.listRevisions(actorContext.artistId, unitId)
  ]);
  const unit = units.find((candidate) => candidate.id === unitId);
  if (!unit) {
    return (
      <AppShell activeId="factory" sessionEmail={actorContext.user.email} stage="Phase 2 · Content Factory">
        <section className="empty-state"><p className="eyebrow">NOT FOUND</p><h1>Content Unit unavailable</h1><p>The requested production unit does not exist in this Artist workspace.</p><a className="inline-link" href="/factory">Back to Factory →</a></section>
      </AppShell>
    );
  }

  const approved = revisions.find((revision) => revision.status === "APPROVED") ?? null;

  return (
    <AppShell activeId="factory" sessionEmail={actorContext.user.email} stage="Phase 2 · Content Factory">
      <header className="product-header execution-hero">
        <p className="eyebrow">CONTENT UNIT · {unit.unitCode}</p>
        <h1>{unit.title}</h1>
        <p>Execution is versioned beneath the canonical concept. The approved Angle rationale stays untouched while production instructions can evolve through explicit revisions.</p>
        <a className="inline-link" href="/factory">← Back to Factory</a>
      </header>

      <div className="status-row">
        <span className="status-chip">UNIT {unit.status}</span>
        <span className="status-chip status-chip-muted">{revisions.length} EXECUTION REVISION{revisions.length === 1 ? "" : "S"}</span>
        <span className="muted-note">{approved ? `Approved source · revision ${approved.revisionNumber}` : "No approved execution source yet"}</span>
      </div>

      <section className="execution-context-grid">
        <article><p className="eyebrow">MASTER CONCEPT</p><h2>{unit.pillar}</h2><p>{unit.songTitle ?? "Artist-level content"}</p><span>Concept fields stay ContentUnit-owned.</span></article>
        <article><p className="eyebrow">IDENTITY SNAPSHOT</p><h2>{unit.identityVersionId.slice(0, 8)}…</h2><p>{unit.eraIdentityId ? `Era ${unit.eraIdentityId.slice(0, 8)}…` : "Base Identity · no Era"}</p><span>Execution revisions inherit these canonical references.</span></article>
        <article><p className="eyebrow">RIGHTS READINESS</p><h2>UNKNOWN</h2><p>Rights domain is not connected in this slice.</p><span>Execution approval never means publishability.</span></article>
      </section>

      {approved && (
        <section className="execution-approved-card" aria-label="Approved execution source">
          <div className="section-heading"><p className="eyebrow">APPROVED EXECUTION SOURCE</p><h2>Revision {approved.revisionNumber}</h2></div>
          <div className="execution-approved-grid">
            <div><span>Format</span><strong>{approved.snapshot.format}</strong></div>
            <div><span>Intent</span><strong>{approved.snapshot.productionIntent}</strong></div>
            <div className="execution-wide"><span>Hook</span><strong>{approved.snapshot.hookText ?? "No explicit hook text"}</strong></div>
            <div className="execution-wide"><span>Structure</span><p>{approved.snapshot.structure}</p></div>
            <div className="execution-wide"><span>Performance / script</span><p>{approved.snapshot.scriptOrPerformanceConcept}</p></div>
            <div className="execution-wide"><span>Edit brief</span><p>{approved.snapshot.editBrief}</p></div>
          </div>
        </section>
      )}

      <ExecutionActions
        unitId={unit.id}
        revisions={revisions.map((revision) => ({ id: revision.id, revisionNumber: revision.revisionNumber, status: revision.status, snapshot: revision.snapshot }))}
      />

      <section className="collection-section execution-history">
        <div className="section-heading"><p className="eyebrow">REVISION HISTORY</p><h2>Immutable execution evidence</h2><p className="muted-note">Approved revisions can be superseded, never silently rewritten.</p></div>
        {revisions.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No execution revisions yet</h3><p>Create a manual production-ready draft. AI generation will later propose into the same versioned workflow.</p></div>
        ) : (
          <div className="execution-revision-list">
            {revisions.map((revision) => (
              <article key={revision.id}>
                <div className="factory-card-head"><div><span className={`execution-status execution-status-${revision.status.toLowerCase()}`}>{revision.status}</span><span>REV {revision.revisionNumber}</span></div><span>{revision.sourceType} · {revision.productionIntent}</span></div>
                <h3>{revision.format}</h3>
                <p>{revision.snapshot.structure}</p>
                <div className="factory-tag-row"><span>Rights {revision.snapshot.rightsStatus}</span><span>Identity {revision.identityVersionId.slice(0, 8)}…</span>{revision.eraIdentityId && <span>Era {revision.eraIdentityId.slice(0, 8)}…</span>}</div>
                {revision.decisionReason && <small>Decision: {revision.decisionReason}</small>}
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
