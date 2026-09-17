import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PgDecisionReader } from "@artist-os/db";
import { AppShell } from "../../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { DecisionActions } from "./decision-actions";

export default async function DecisionDetailPage({ params }: { params: Promise<{ decisionId: string }> }) {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) {
    return <AppShell activeId="memory"><section className="empty-state"><p className="eyebrow">AUTH REQUIRED</p><h1>Decision Memory</h1><a className="inline-link" href="/auth">Sign in →</a></section></AppShell>;
  }
  if (!actorContext.artistId) {
    return <AppShell activeId="memory" sessionEmail={actorContext.user.email}><section className="empty-state"><p className="eyebrow">WORKSPACE REQUIRED</p><h1>Decision Memory</h1><a className="inline-link" href="/">Open Today →</a></section></AppShell>;
  }

  const { decisionId } = await params;
  const reader = new PgDecisionReader(getDatabaseRuntime().db);
  const decision = await reader.getDecision(actorContext.artistId, decisionId);
  if (!decision) notFound();
  const history = await reader.listHistory(actorContext.artistId, decisionId);

  return (
    <AppShell activeId="memory" sessionEmail={actorContext.user.email} stage="Phase 2.5 · Decision Intelligence">
      <header className="product-header decision-memory-hero">
        <p className="eyebrow">MEMORY · DECISION</p>
        <a className="inline-link" href="/decisions">← Decision Memory</a>
        <h1>{decision.title}</h1>
        <div className="decision-card-head">
          <span className={`decision-status decision-status-${decision.status.toLowerCase()}`}>{decision.status.replaceAll("_", " ")}</span>
          <span>{decision.scope}</span>
        </div>
      </header>

      <section className="decision-detail-panel decision-detail-grid">
        <div>
          <div className="decision-detail-block"><h3>What we decided</h3><p>{decision.decision}</p></div>
          <div className="decision-detail-block"><h3>Why</h3><p>{decision.reason}</p></div>
          <div className="decision-detail-block">
            <h3>Based on / subject / lineage</h3>
            {decision.references.length === 0 && decision.evidenceIds.length === 0 && decision.experimentIds.length === 0 ? (
              <p className="muted-note">No explicit upstream references were recorded. Artist OS keeps this unknown rather than fabricating lineage.</p>
            ) : (
              <div className="decision-reference-list">
                {decision.evidenceIds.map((id) => <div className="decision-reference-item" key={`e-${id}`}><span>BASED ON · EVIDENCE</span><strong>{id}</strong></div>)}
                {decision.experimentIds.map((id) => <div className="decision-reference-item" key={`x-${id}`}><span>BASED ON · EXPERIMENT</span><strong>{id}</strong></div>)}
                {decision.references.map((reference, index) => <div className="decision-reference-item" key={`${reference.relation}-${reference.refType}-${reference.refId}-${index}`}><span>{reference.relation} · {reference.refType}</span><strong>{reference.refId}</strong></div>)}
              </div>
            )}
          </div>
          <div className="decision-detail-block">
            <h3>History</h3>
            <div className="decision-history-timeline">
              {history.map((event) => (
                <div className="decision-history-event" key={event.id}>
                  <span>{event.changedAt.toLocaleString("en")} · {event.actorType}</span>
                  <strong>{event.fromStatus ?? "CREATED"} → {event.toStatus}</strong>
                  {event.rationale && <p>{event.rationale}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="decision-detail-meta">
          <div><span>Created</span><strong>{decision.createdAt.toLocaleString("en")}</strong></div>
          <div><span>Review</span><strong>{decision.reviewAt ? decision.reviewAt.toLocaleString("en") : "Not scheduled"}</strong></div>
          <div><span>Scope</span><strong>{decision.scope}</strong></div>
          <div><span>Topic key</span><strong>{decision.decisionKey ?? "Ad-hoc decision"}</strong></div>
          <div><span>Version</span><strong>v{decision.version}</strong></div>
          {decision.supersedesDecisionId && <div><span>Replaces</span><strong><a className="inline-link" href={`/decisions/${decision.supersedesDecisionId}`}>{decision.supersedesDecisionId}</a></strong></div>}
        </aside>
      </section>

      <DecisionActions decisionId={decision.id} status={decision.status} version={decision.version} />
    </AppShell>
  );
}
