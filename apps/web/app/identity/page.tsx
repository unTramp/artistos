import { headers } from "next/headers";
import { PgArtistFoundationReader } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { IdentityActions } from "./identity-actions";

export default async function IdentityPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="identity" stage="Phase 1 · Artist Foundation">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Identity</h1>
          <p>Sign in before Artist OS can read artist-owned identity state.</p>
          <a className="inline-link" href="/auth">Sign in →</a>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="identity" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
        <section className="empty-state">
          <p className="eyebrow">WORKSPACE REQUIRED</p>
          <h1>Identity</h1>
          <p>Create the artist workspace first. Identity is always scoped to one canonical Artist.</p>
          <a className="inline-link" href="/">Open Overview →</a>
        </section>
      </AppShell>
    );
  }

  const reader = new PgArtistFoundationReader(getDatabaseRuntime().db);
  const identity = await reader.getIdentityHome(actorContext.artistId);

  return (
    <AppShell activeId="identity" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
      <header className="product-header">
        <p className="eyebrow">IDENTITY ENGINE</p>
        <h1>Identity</h1>
        <p>Structured identity is the source of truth. Drafts, active versions and Era context remain explicit and human-controlled.</p>
      </header>

      <div className="status-row">
        <span className="status-chip">{identity.state.replaceAll("_", " ")}</span>
        <span className="muted-note">Every mutation is authenticated, artist-scoped, idempotent and auditable.</span>
      </div>

      <IdentityActions
        activeVersionId={identity.activeVersion?.id ?? null}
        draftVersions={identity.draftVersions}
        eras={identity.eras}
      />

      {identity.state === "NO_IDENTITY" ? (
        <section className="empty-state">
          <p className="eyebrow">NO IDENTITY YET</p>
          <h2>Start with a versioned identity draft</h2>
          <p>No AI-generated identity fact is fabricated here. Create a human-controlled draft above, then activate it explicitly when it is ready.</p>
        </section>
      ) : (
        <div className="product-grid">
          <section className="product-card product-card-wide">
            <p className="eyebrow">ACTIVE IDENTITY VERSION</p>
            {identity.activeVersion ? (
              <>
                <h2>Version {identity.activeVersion.versionNumber}</h2>
                <p>{identity.activeVersion.label ?? "Untitled identity version"}</p>
                <dl className="fact-list">
                  <div><dt>Status</dt><dd>{identity.activeVersion.status}</dd></div>
                  <div><dt>Activated</dt><dd>{identity.activeVersion.activatedAt ? new Date(identity.activeVersion.activatedAt).toLocaleString("en") : "—"}</dd></div>
                </dl>
              </>
            ) : (
              <><h2>No active version</h2><p>Draft identity exists but has not been explicitly activated.</p></>
            )}
          </section>

          <section className="product-card">
            <p className="eyebrow">ACTIVE ERA</p>
            {identity.activeEra ? <><h2>{identity.activeEra.name}</h2><p>{identity.activeEra.startDate ?? "Open start"} → {identity.activeEra.endDate ?? "Open-ended"}</p></> : <><h2>Base identity</h2><p>No Era override is active. Context safely falls back to the active base Identity.</p></>}
          </section>

          <section className="product-card">
            <p className="eyebrow">DRAFT / REVIEW</p>
            <h2>{identity.draftVersions.length}</h2>
            <p>{identity.draftVersions.length === 1 ? "version awaits explicit review" : "versions await explicit review"}</p>
          </section>
        </div>
      )}

      {identity.draftVersions.length > 0 && (
        <section className="collection-section">
          <div className="section-heading"><p className="eyebrow">VERSION HISTORY</p><h2>Drafts and reviews</h2></div>
          <div className="collection-list">
            {identity.draftVersions.map((version) => (
              <article key={version.id}>
                <div><strong>Version {version.versionNumber}</strong><span>{version.label ?? "Untitled identity version"}</span></div>
                <span className="status-chip status-chip-muted">{version.status}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {identity.eras.length > 0 && (
        <section className="collection-section">
          <div className="section-heading"><p className="eyebrow">ERA TIMELINE</p><h2>Creative chapters</h2></div>
          <div className="collection-list">
            {identity.eras.map((era) => (
              <article key={era.id}>
                <div><strong>{era.name}</strong><span>{era.startDate ?? "No start date"} → {era.endDate ?? "Open-ended"}</span></div>
                <span className="status-chip status-chip-muted">{era.status}</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
