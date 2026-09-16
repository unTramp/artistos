import { headers } from "next/headers";
import { PgArtistFoundationReader, PgContentFactoryReader } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { FactoryActions } from "./factory-actions";

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

  return (
    <AppShell activeId="factory" sessionEmail={actorContext.user.email} stage="Phase 2 · Content Factory">
      <header className="product-header factory-hero">
        <p className="eyebrow">CONTENT FACTORY · DECISION LAYER</p>
        <h1>Make fewer ideas matter more</h1>
        <p>Angles are proposals, not production commitments. Review them against Identity, song context, effort and learning value first; only then create a canonical Content Unit.</p>
      </header>

      <div className="status-row">
        <span className="status-chip">{reviewCount} TO REVIEW</span>
        <span className="status-chip status-chip-muted">{approvedCount} APPROVED</span>
        <span className="muted-note">{units.length} content unit{units.length === 1 ? "" : "s"} · {rejectedCount} rejected angle{rejectedCount === 1 ? "" : "s"}</span>
      </div>

      <section className="factory-context-strip" aria-label="Factory operating principles">
        <article><span>1</span><div><strong>Context</strong><p>Identity, Era and optional Song references are captured from canonical state.</p></div></article>
        <article><span>2</span><div><strong>Human review</strong><p>Approve, defer or reject before production commitment.</p></div></article>
        <article><span>3</span><div><strong>Unit</strong><p>Approved Angle becomes one canonical Content Unit only through an explicit command.</p></div></article>
      </section>

      <section className="factory-ai-boundary">
        <div><p className="eyebrow">AI PROPOSAL LAYER</p><h2>Not connected yet — by design</h2></div>
        <p>The manual path is already canonical. Future AI generation will assemble Identity + Song Brain + Artist Brain context and write proposals into this same review queue; it will not create production truth directly.</p>
      </section>

      <FactoryActions
        songs={songs.map((song) => ({ id: song.id, title: song.title }))}
        angles={angles.map((angle) => ({ id: angle.id, title: angle.title, status: angle.status }))}
        unitAngleIds={unitAngleIds}
      />

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">ANGLE LIBRARY</p><h2>Concepts with reasons</h2></div>
        {angles.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No angles yet</h3><p>Create a manual Angle first. Cold start stays explicit; Artist OS does not invent generic ideas to make the screen look full.</p></div>
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
                  <div><dt>Goal</dt><dd>{angle.goal}</dd></div>
                  <div><dt>Audience</dt><dd>{angle.audience}</dd></div>
                  <div><dt>Effort</dt><dd>{angle.productionEffort}</dd></div>
                  <div className="factory-reason-wide"><dt>Why</dt><dd>{angle.why}</dd></div>
                  <div className="factory-reason-wide"><dt>Identity fit</dt><dd>{angle.identityFitRationale}</dd></div>
                  <div className="factory-reason-wide"><dt>Learning value</dt><dd>{angle.learningValue}</dd></div>
                </dl>
                <div className="factory-tag-row">
                  {angle.platformTargets.map((target) => <span key={target}>{target.replaceAll("_", " ")}</span>)}
                  {angle.requiredAssets.map((asset) => <span className="asset-tag" key={asset}>{asset}</span>)}
                </div>
                {angle.rejectionReason && <p className="factory-decision-note"><strong>{angle.rejectionReason.replaceAll("_", " ")}</strong>{angle.decisionNote ? ` · ${angle.decisionNote}` : ""}</p>}
                {!angle.rejectionReason && angle.decisionNote && <p className="factory-decision-note">{angle.decisionNote}</p>}
                <small>Identity {angle.identityVersionId ? "captured" : "not yet active"}{angle.eraIdentityId ? " · Era captured" : ""}</small>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">CONTENT UNITS</p><h2>Production commitments</h2><p className="muted-note">Execution revisions and production state controls arrive in the next slice. A Unit here is canonical concept truth, not a fake completed package.</p></div>
        {units.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No production commitment yet</h3><p>Approve an Angle, then explicitly convert it. Approval alone never creates or schedules content.</p></div>
        ) : (
          <div className="factory-unit-list">
            {units.map((unit) => (
              <article key={unit.id}>
                <div><span className="unit-code">{unit.unitCode}</span><span className="candidate-status candidate-status-approved">{unit.status}</span></div>
                <h3>{unit.title}</h3>
                <p>{unit.songTitle ?? "Artist-level"} · {unit.pillar} · {unit.format ?? "Execution format not defined yet"}</p>
                <small>Identity snapshot {unit.identityVersionId.slice(0, 8)}…{unit.eraIdentityId ? ` · Era ${unit.eraIdentityId.slice(0, 8)}…` : ""}</small>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
