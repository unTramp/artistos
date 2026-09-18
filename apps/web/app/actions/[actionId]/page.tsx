import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PgOperationalActionReader } from "@artist-os/db";
import { AppShell } from "../../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { shortEntityId } from "@/lib/entity-reference";
import { EntityReferenceResolver } from "@/lib/entity-reference-resolver";
import { getDatabaseRuntime } from "@/lib/runtime";

export default async function OperationalActionDetailPage({ params }: { params: Promise<{ actionId: string }> }) {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) {
    return <AppShell activeId="today"><section className="empty-state"><p className="eyebrow">AUTH REQUIRED</p><h1>Operational Action</h1><a className="inline-link" href="/auth">Sign in →</a></section></AppShell>;
  }
  if (!actorContext.artistId) {
    return <AppShell activeId="today" sessionEmail={actorContext.user.email}><section className="empty-state"><p className="eyebrow">WORKSPACE REQUIRED</p><h1>Operational Action</h1><a className="inline-link" href="/">Open Today →</a></section></AppShell>;
  }

  const { actionId } = await params;
  const runtime = getDatabaseRuntime();
  const action = await new PgOperationalActionReader(runtime.db).getAction(actorContext.artistId, actionId);
  if (!action) notFound();

  const source = await new EntityReferenceResolver(runtime.db, actorContext.artistId).resolve({
    type: action.sourceEntityType,
    id: action.sourceEntityId
  });

  return (
    <AppShell activeId="today" sessionEmail={actorContext.user.email}>
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">ACTION · PROVENANCE</p>
        <a className="inline-link" href="/">← Today</a>
        <h1>{action.title}</h1>
        <div className="decision-card-head">
          <span className="status-chip">{action.status.replaceAll("_", " ")}</span>
          <span>{action.priority} · {action.executionMode.replaceAll("_", " ")}</span>
        </div>
      </header>

      <section className="decision-detail-panel decision-detail-grid">
        <div>
          <div className="decision-detail-block">
            <h3>Action</h3>
            <p>{action.description ?? "No additional action description was recorded."}</p>
          </div>

          <div className="decision-detail-block">
            <h3>Source lineage</h3>
            <div className="decision-reference-list">
              <div className="decision-reference-item">
                <span>{action.sourceDomain} · {action.sourceEntityType}</span>
                {source.href ? (
                  <a className="provenance-link" href={source.href}>{source.label} →</a>
                ) : (
                  <strong>{source.label}</strong>
                )}
                {!source.resolved && <small>Unresolved canonical reference · {shortEntityId(action.sourceEntityId)}</small>}
              </div>
            </div>
          </div>

          {action.stateReason && (
            <div className="decision-detail-block">
              <h3>State reason</h3>
              <p>{action.stateReason}</p>
            </div>
          )}

          {action.evidenceRef && (
            <div className="decision-detail-block">
              <h3>Completion evidence</h3>
              <p>{action.evidenceRef}</p>
            </div>
          )}
        </div>

        <aside className="decision-detail-meta">
          <div><span>Status</span><strong>{action.status}</strong></div>
          <div><span>Priority</span><strong>{action.priority}</strong></div>
          <div><span>Action type</span><strong>{action.actionType}</strong></div>
          <div><span>Execution</span><strong>{action.executionMode}</strong></div>
          <div><span>Created</span><strong>{action.createdAt.toLocaleString("en")}</strong></div>
          <div><span>Updated</span><strong>{action.updatedAt.toLocaleString("en")}</strong></div>
          <div><span>Completed</span><strong>{action.completedAt ? action.completedAt.toLocaleString("en") : "Not completed"}</strong></div>
          <div><span>Version</span><strong>v{action.version}</strong></div>
        </aside>
      </section>
    </AppShell>
  );
}
