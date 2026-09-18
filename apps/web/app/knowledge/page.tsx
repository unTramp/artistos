import { headers } from "next/headers";
import { PgKnowledgeReader } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { KnowledgeActions } from "./knowledge-actions";

type BrainPayload = {
  identity?: { identityVersionId: string; versionNumber: number; label: string | null } | null;
  era?: { eraId: string; name: string; identityVersionId: string } | null;
  approvedKnowledge?: Array<{ id: string; content: string; sourceCandidateId: string; sourceType: string; sourceId: string }>;
  toneExamples?: Array<{ id: string; textContent: string; label: string; sourceType: string; language: string | null; isPrivate: boolean }>;
  hardRules?: unknown[];
  validatedLearnings?: unknown[];
};

export default async function KnowledgePage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="knowledge" stage="Phase 1 · Artist Foundation">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Knowledge</h1>
          <p>Sign in before Artist OS can read private artist context and provenance.</p>
          <a className="inline-link" href="/auth">Sign in →</a>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="knowledge" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
        <section className="empty-state">
          <p className="eyebrow">WORKSPACE REQUIRED</p>
          <h1>Knowledge</h1>
          <p>Create the artist workspace first. Every context source must have one canonical Artist owner.</p>
          <a className="inline-link" href="/">Open Overview →</a>
        </section>
      </AppShell>
    );
  }

  const home = await new PgKnowledgeReader(getDatabaseRuntime().db).getHome(actorContext.artistId);
  const payload = home.latestSnapshot?.payload as BrainPayload | undefined;
  const pendingCount = home.candidates.filter((candidate) => candidate.status === "PENDING").length;
  const positiveToneCount = home.toneCorpus.filter((item) => item.label === "AUTHENTIC" || item.label === "GOOD").length;

  return (
    <AppShell activeId="knowledge" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
      <header className="product-header knowledge-hero">
        <p className="eyebrow">ARTIST BRAIN · KNOWLEDGE</p>
        <h1>Current context, compiled deliberately</h1>
        <p>Artist Brain is the current working projection over approved sources — identity, knowledge, tone and eligible validated learnings. It consumes Memory where relevant, but does not own the historical learning or decision record.</p>
      </header>

      <div className="status-row">
        <span className="status-chip">{home.latestSnapshot ? `BRAIN v${home.latestSnapshot.versionNumber}` : "NO SNAPSHOT"}</span>
        <span className="muted-note">{pendingCount} pending candidate{pendingCount === 1 ? "" : "s"} · {positiveToneCount} positive tone example{positiveToneCount === 1 ? "" : "s"}</span>
      </div>

      <section className="artist-brain-board" aria-label="Artist Brain projection">
        <div className="artist-brain-head">
          <div>
            <p className="eyebrow">HOT CONTEXT PROJECTION</p>
            <h2>Artist Brain</h2>
            <p>{home.latestSnapshot ? `Built ${home.latestSnapshot.builtAt.toLocaleString("en")}. Canonical sources remain independently editable and auditable.` : "No projection yet. Unknown stays unknown until approved sources exist and the Brain is explicitly rebuilt."}</p>
          </div>
          <span className="brain-version">{home.latestSnapshot ? `v${home.latestSnapshot.versionNumber}` : "∅"}</span>
        </div>

        <div className="brain-columns">
          <article className="brain-module">
            <p className="eyebrow">IDENTITY CONTEXT</p>
            <h3>{payload?.identity?.label ?? (payload?.identity ? `Identity v${payload.identity.versionNumber}` : "Unknown")}</h3>
            <p>{payload?.identity ? `Canonical Identity Version ${payload.identity.versionNumber}` : "No active Identity was compiled into the latest snapshot."}</p>
            <span>{payload?.era ? `Era · ${payload.era.name}` : "Base identity · no active Era in snapshot"}</span>
          </article>

          <article className="brain-module">
            <p className="eyebrow">APPROVED KNOWLEDGE</p>
            <h3>{payload?.approvedKnowledge?.length ?? 0}</h3>
            <p>Human-promoted Artist Brain items with source lineage.</p>
            <span>Pending candidates are excluded by design.</span>
          </article>

          <article className="brain-module">
            <p className="eyebrow">TONE CORPUS</p>
            <h3>{payload?.toneExamples?.length ?? 0}</h3>
            <p>AUTHENTIC + GOOD examples available as positive style evidence.</p>
            <span>DO NOT COPY and OUTDATED never enter positive context.</span>
          </article>

          <article className="brain-module">
            <p className="eyebrow">LEARNING / HARD RULES</p>
            <h3>{(payload?.validatedLearnings?.length ?? 0) + (payload?.hardRules?.length ?? 0)}</h3>
            <p>Not fabricated before their canonical domains are implemented.</p>
            <span>Empty means unknown/not connected — not “no rules exist”.</span>
          </article>
        </div>
      </section>

      <KnowledgeActions candidates={home.candidates} toneCorpus={home.toneCorpus} />

      <section className="collection-section knowledge-inbox">
        <div className="section-heading">
          <p className="eyebrow">CANDIDATE INBOX</p>
          <h2>Review before context</h2>
          <p>Lifecycle is fixed by AR-062: PENDING → ACCEPTED / REJECTED / MERGED / EXPIRED. Candidate rows remain evidence; they never become permanent truth themselves.</p>
        </div>
        {home.candidates.length === 0 ? (
          <div className="empty-state compact-empty"><h3>Inbox is empty</h3><p>Voice notes, research and AI workflows will eventually feed reviewable candidates here.</p></div>
        ) : (
          <div className="brain-statement-list">
            {home.candidates.map((candidate) => (
              <article key={candidate.id}>
                <div className="brain-statement-meta">
                  <span className={`candidate-status candidate-status-${candidate.status.toLowerCase()}`}>{candidate.status}</span>
                  <span>{candidate.destination.replaceAll("_", " ")}</span>
                  <span>{candidate.sourceType} · {candidate.sourceId}</span>
                </div>
                <p>{candidate.content}</p>
                {candidate.promotedEntityType && <small>Promoted → {candidate.promotedEntityType} · {candidate.promotedEntityId}</small>}
                {candidate.mergedIntoCandidateId && <small>Merged → {candidate.mergedIntoCandidateId}</small>}
                {candidate.resolutionReason && <small>Resolution: {candidate.resolutionReason}</small>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">APPROVED CONTEXT</p><h2>Durable Artist Brain knowledge</h2></div>
        {home.approvedKnowledge.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No promoted Artist Brain items</h3><p>This is valid cold-start state. Artist OS prefers unknown over generic musician clichés.</p></div>
        ) : (
          <div className="brain-statement-list">
            {home.approvedKnowledge.map((item) => (
              <article key={item.id}>
                <div className="brain-statement-meta"><span className="statement-type statement-type-artist_interpretation">APPROVED</span><span>{item.sourceType} · {item.sourceId}</span></div>
                <p>{item.content}</p>
                <small>Source candidate · {item.sourceCandidateId}</small>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="collection-section">
        <div className="section-heading"><p className="eyebrow">TONE CORPUS</p><h2>Real voice, labeled deliberately</h2></div>
        {home.toneCorpus.length === 0 ? (
          <div className="empty-state compact-empty"><h3>No voice examples yet</h3><p>Add real captions, transcripts, messages or interview excerpts. Fine-tuning is intentionally out of scope.</p></div>
        ) : (
          <div className="brain-statement-list">
            {home.toneCorpus.map((item) => (
              <article key={item.id}>
                <div className="brain-statement-meta">
                  <span className={`tone-label tone-label-${item.label.toLowerCase()}`}>{item.label.replaceAll("_", " ")}</span>
                  <span>{item.sourceType}{item.language ? ` · ${item.language}` : ""}</span>
                  {item.isPrivate && <span>PRIVATE SOURCE</span>}
                </div>
                <p>{item.textContent}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
