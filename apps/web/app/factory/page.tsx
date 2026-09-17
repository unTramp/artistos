import { headers } from "next/headers";
import { PgArtistFoundationReader, PgContentFactoryReader } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { FactoryActions } from "./factory-actions";
import { FactoryAIProposals } from "./factory-ai-proposals";

const UNKNOWN_DRAFT = "UNKNOWN — not specified in draft";
const displayDraftValue = (value: string) => value === UNKNOWN_DRAFT ? "Not set yet" : value;

export default async function FactoryPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) {
    return (
      <AppShell activeId="factory" stage="Phase 2 · Content Factory">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Content Factory</h1>
          <p>Sign in before Artist OS can assemble private Identity, Song and Knowledge context for content decisions.</p>
          <a className="inline-link" href="/auth">Sign in →</a>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="factory" sessionEmail={actorContext.user.email} stage="Phase 2 · Content Factory">
        <section className="empty-state">
          <p className="eyebrow">WORKSPACE REQUIRED</p>
          <h1>Content Factory</h1>
          <p>Create the artist workspace first. Factory decisions must always belong to one canonical Artist scope.</p>
          <a className="inline-link" href="/">Open Overview →</a>
        </section>
      </AppShell>
    );
  }

  const runtime = getDatabaseRuntime();
  const reader = new PgContentFactoryReader(runtime.db);
  const artistReader = new PgArtistFoundationReader(runtime.db);
  const [angles, units, songs] = await Promise.all([
    reader.listAngles(actorContext.artistId),
    reader.listUnits(actorContext.artistId),
    artistReader.listSongs(actorContext.artistId)
  ]);

  const reviewCount = angles.filter((angle) => angle.status === "DRAFT" || angle.status === "DEFERRED").length;
  const approvedCount = angles.filter((angle) => angle.status === "APPROVED").length;
  const rejectedCount = angles.filter((angle) => angle.status === "REJECTED").length;
  const unitAngleIds = units.flatMap((unit) => unit.angleId ? [unit.angleId] : []);
  const songOptions = songs.map((song) => ({ id: song.id, title: song.title }));

  return (
    <AppShell activeId="factory" sessionEmail={actorContext.user.email} stage="Phase 2.5 · Passive Capture">
      <header className="product-header factory-hero">
        <p className="eyebrow">CONTENT FACTORY · CREATIVE DECISIONS</p>
        <h1>Start with intent. Let context accumulate.</h1>
        <p>Create a lightweight draft, make the real review decision, and let Artist OS preserve the reason as evidence instead of asking you to maintain memory in a separate CRM-like workflow.</p>
      </header>

      <div className="status-row">
        <span className="status-chip">{reviewCount} TO REVIEW</span>
        <span className="status-chip status-chip-muted">{approvedCount} APPROVED</span>
        <span className="muted-note">{units.length} content unit{units.length === 1 ? "" : "s"} · {rejectedCount} rejected angle{rejectedCount === 1 ? "" : "s"}</span>
      </div>

      <section className="factory-context-strip" aria-label="Factory operating principles">
        <article><span>1</span><div><strong>Intent</strong><p>Capture the idea and minimum context first. Strategic detail can stay unknown in a draft.</p></div></article>
        <article><span>2</span><div><strong>Human judgment</strong><p>Approve, defer or reject. The reason becomes reusable evidence automatically.</p></div></article>
        <article><span>3</span><div><strong>Memory</strong><p>Artist OS may suggest a Learning or Decision candidate, but only you commit it.</p></div></article>
      </section>

      <FactoryAIProposals songs={songOptions} />

      <FactoryActions
        songs={songOptions}
        angles={angles.map((angle) => ({
          id: angle.id,
          title: angle.title,
          status: angle.status,
          songId: angle.songId,
          rejectionReason: angle.rejectionReason,
          decisionNote: angle.decisionNote
        }))}
        unitAngleIds={unitAngleIds}
      />

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">ANGLE LIBRARY</p><h2>Concepts with preserved context</h2></div>
        {angles.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No angles yet</h3><p>Capture one real idea. Artist OS does not fabricate generic creative work to make the screen look populated.</p></div>
        ) : (
          <div className="factory-angle-grid">
            {angles.map((angle) => (
              <article className={`factory-angle-card factory-angle-${angle.status.toLowerCase()}`} key={angle.id}>
                <div className="factory-card-head">
                  <div><span className={`candidate-status candidate-status-${angle.status.toLowerCase()}`}>{angle.status}</span><span>v{angle.version}</span></div>
                  <span>{angle.pillar} · {angle.mode}</span>
                </div>
                <h3>{angle.title}</h3>
                <p className="factory-idea">{angle.idea}</p>
                <dl className="factory-reason-grid">
                  <div><dt>Song</dt><dd>{angle.songTitle ?? "Artist-level"}</dd></div>
                  <div><dt>Goal</dt><dd>{displayDraftValue(angle.goal)}</dd></div>
                  <div><dt>Audience</dt><dd>{displayDraftValue(angle.audience)}</dd></div>
                  <div><dt>Effort</dt><dd>{displayDraftValue(angle.productionEffort)}</dd></div>
                  <div className="factory-reason-wide"><dt>Why</dt><dd>{displayDraftValue(angle.why)}</dd></div>
                  <div className="factory-reason-wide"><dt>Identity fit</dt><dd>{displayDraftValue(angle.identityFitRationale)}</dd></div>
                  <div className="factory-reason-wide"><dt>Learning value</dt><dd>{displayDraftValue(angle.learningValue)}</dd></div>
                </dl>
                <div className="factory-tag-row">
                  {angle.platformTargets.map((target) => <span key={target}>{target.replaceAll("_", " ")}</span>)}
                  {angle.requiredAssets.map((asset) => <span className="asset-tag" key={asset}>{asset}</span>)}
                </div>
                {angle.rejectionReason && <p className="factory-decision-note"><strong>{angle.rejectionReason.replaceAll("_", " ")}</strong>{angle.decisionNote ? ` · ${angle.decisionNote}` : ""}</p>}
                {!angle.rejectionReason && angle.decisionNote && <p className="factory-decision-note">{angle.decisionNote}</p>}
                <small>{angle.sourceType === "AI_PROPOSAL" ? "AI proposal · " : ""}Identity {angle.identityVersionId ? "captured" : "not yet active"}{angle.eraIdentityId ? " · Era captured" : ""}</small>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">CONTENT UNITS</p><h2>Production commitments</h2><p className="muted-note">Each Unit owns versioned execution revisions. Concept truth stays stable while production instructions can evolve without rewriting the approved Angle.</p></div>
        {units.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No production commitment yet</h3><p>Approve an Angle, then explicitly convert it. Approval alone never creates or schedules content.</p></div>
        ) : (
          <div className="factory-unit-list">
            {units.map((unit) => (
              <article key={unit.id}>
                <div><span className="unit-code">{unit.unitCode}</span><span className="candidate-status candidate-status-approved">{unit.status}</span></div>
                <h3>{unit.title}</h3>
                <p>{unit.songTitle ?? "Artist-level"} · {unit.pillar} · {unit.format ?? "Execution format lives in revisions"}</p>
                <small>Identity snapshot {unit.identityVersionId.slice(0, 8)}…{unit.eraIdentityId ? ` · Era ${unit.eraIdentityId.slice(0, 8)}…` : ""}</small>
                <a className="inline-link factory-execution-link" href={`/factory/units/${unit.id}`}>Open execution workspace →</a>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
