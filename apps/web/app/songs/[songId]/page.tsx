import { headers } from "next/headers";
import { AppShell } from "../../components/app-shell";
import { PgArtistFoundationReader, PgSongBrainReader } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { SongBrainActions } from "./song-brain-actions";

const statementLabel = {
  FACT: "FACT",
  ARTIST_INTERPRETATION: "ARTIST INTERPRETATION",
  AUDIENCE_INTERPRETATION: "AUDIENCE INTERPRETATION"
} as const;

export default async function SongBrainPage({ params }: { params: Promise<{ songId: string }> }) {
  const actorContext = await resolveAuthenticatedActorContext(await headers());
  if (!actorContext) {
    return (
      <AppShell activeId="songs" stage="Phase 1 · Artist Foundation">
        <section className="empty-state"><p className="eyebrow">AUTH REQUIRED</p><h1>Song Brain</h1><p>Sign in before Artist OS can read private song knowledge.</p><a className="inline-link" href="/auth">Sign in →</a></section>
      </AppShell>
    );
  }
  if (!actorContext.artistId) {
    return (
      <AppShell activeId="songs" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
        <section className="empty-state"><p className="eyebrow">WORKSPACE REQUIRED</p><h1>Song Brain</h1><p>Create the artist workspace before opening song-scoped knowledge.</p><a className="inline-link" href="/">Open Overview →</a></section>
      </AppShell>
    );
  }

  const { songId } = await params;
  const runtime = getDatabaseRuntime();
  const [brain, identity] = await Promise.all([
    new PgSongBrainReader(runtime.db).getSongBrain(actorContext.artistId, songId),
    new PgArtistFoundationReader(runtime.db).getIdentityHome(actorContext.artistId)
  ]);

  if (!brain) {
    return (
      <AppShell activeId="songs" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
        <section className="empty-state"><p className="eyebrow">SONG NOT FOUND</p><h1>Song Brain</h1><p>This Song does not exist inside the current artist scope.</p><a className="inline-link" href="/songs">Back to Songs →</a></section>
      </AppShell>
    );
  }

  return (
    <AppShell activeId="songs" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
      <header className="product-header">
        <p className="eyebrow">SONG BRAIN</p>
        <h1>{brain.song.title}</h1>
        <p>Song-scoped truth, interpretation and identity context. This Brain remains distinct from global Artist knowledge and from Release lifecycle state.</p>
      </header>

      <div className="status-row">
        <span className="status-chip">{brain.song.isOriginal ? "ORIGINAL" : "COVER"}</span>
        <span className="muted-note">Sectional readiness only · no universal Song score.</span>
      </div>

      <div className="product-grid">
        <section className="product-card">
          <p className="eyebrow">STORY</p>
          <h2>{brain.song.story ? "Captured" : "Empty"}</h2>
          <p>{brain.song.story ?? "No canonical story has been written yet. Missing knowledge stays missing."}</p>
        </section>
        <section className="product-card">
          <p className="eyebrow">MEANING</p>
          <h2>{brain.song.meaning ? "Artist meaning" : "Empty"}</h2>
          <p>{brain.song.meaning ?? "No artist-confirmed meaning yet. Audience interpretation cannot fill this automatically."}</p>
        </section>
        <section className="product-card product-card-wide">
          <p className="eyebrow">IDENTITY CONTEXT</p>
          {brain.identityContext ? (
            <>
              <h2>Identity Version {brain.identityContext.identityVersionNumber}</h2>
              <p>{brain.identityContext.eraName ? `Era: ${brain.identityContext.eraName}` : "Base Identity only"}</p>
              <dl className="fact-list">
                <div><dt>Identity status</dt><dd>{brain.identityContext.identityVersionStatus}</dd></div>
                <div><dt>Context revision</dt><dd>v{brain.identityContext.version}</dd></div>
              </dl>
              {brain.identityContext.songSpecificVisualNotes && <p className="brain-note">{brain.identityContext.songSpecificVisualNotes}</p>}
            </>
          ) : (
            <><h2>Inherited context not configured</h2><p>Choose an active Identity below. Artist OS will store a reference plus narrow Song-specific refinements rather than duplicate the Identity model.</p></>
          )}
        </section>
      </div>

      <SongBrainActions
        songId={songId}
        activeIdentityVersion={identity.activeVersion ? { id: identity.activeVersion.id, versionNumber: identity.activeVersion.versionNumber } : null}
        activeEra={identity.activeEra ? { id: identity.activeEra.id, name: identity.activeEra.name } : null}
      />

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">SCOPED KNOWLEDGE</p><h2>Statements</h2></div>
        {brain.statements.length === 0 ? (
          <div className="empty-state"><h2>No statements yet</h2><p>Add a fact, an artist interpretation, or an attributed audience interpretation. The types remain distinct evidence.</p></div>
        ) : (
          <div className="brain-statement-list">
            {brain.statements.map((item) => (
              <article key={item.id}>
                <div className="brain-statement-meta">
                  <span className={`statement-type statement-type-${item.statementType.toLowerCase()}`}>{statementLabel[item.statementType]}</span>
                  {item.sourceLabel && <span>{item.sourceLabel}</span>}
                </div>
                <p>{item.statement}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
