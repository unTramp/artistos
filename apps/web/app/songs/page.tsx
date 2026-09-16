import { headers } from "next/headers";
import { PgArtistFoundationReader } from "@artist-os/db";
import { AppShell } from "../components/app-shell";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { getDatabaseRuntime } from "@/lib/runtime";
import { SongCreateForm } from "./song-create-form";

export default async function SongsPage() {
  const actorContext = await resolveAuthenticatedActorContext(await headers());

  if (!actorContext) {
    return (
      <AppShell activeId="songs" stage="Phase 1 · Artist Foundation">
        <section className="empty-state">
          <p className="eyebrow">AUTH REQUIRED</p>
          <h1>Songs</h1>
          <p>Sign in before Artist OS can read the private song catalog.</p>
          <a className="inline-link" href="/auth">Sign in →</a>
        </section>
      </AppShell>
    );
  }

  if (!actorContext.artistId) {
    return (
      <AppShell activeId="songs" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
        <section className="empty-state">
          <p className="eyebrow">WORKSPACE REQUIRED</p>
          <h1>Songs</h1>
          <p>Create the artist workspace first. Every Song belongs to one Artist and opens one Song Brain namespace.</p>
          <a className="inline-link" href="/">Open Overview →</a>
        </section>
      </AppShell>
    );
  }

  const reader = new PgArtistFoundationReader(getDatabaseRuntime().db);
  const songs = await reader.listSongs(actorContext.artistId);

  return (
    <AppShell activeId="songs" sessionEmail={actorContext.user.email} stage="Phase 1 · Artist Foundation">
      <header className="product-header">
        <p className="eyebrow">MUSIC / SONG BRAIN</p>
        <h1>Songs</h1>
        <p>The canonical creative catalog. Song owns story, meaning and music context; release lifecycle belongs to Release / ReleaseTrack.</p>
      </header>

      <div className="status-row">
        <span className="status-chip">{songs.length} {songs.length === 1 ? "SONG" : "SONGS"}</span>
        <span className="muted-note">No release status/date is stored on Song in MASTER v1.4.</span>
      </div>

      <SongCreateForm />

      {songs.length === 0 ? (
        <section className="empty-state">
          <p className="eyebrow">EMPTY CATALOG</p>
          <h2>Create the first Song Brain namespace</h2>
          <p>A Song may begin incomplete. Unknown ISRC, genre, language or platform links remain explicitly unknown rather than inferred.</p>
        </section>
      ) : (
        <section className="song-table" aria-label="Song catalog">
          <div className="song-table-head"><span>Song</span><span>Context</span><span>IDs</span></div>
          {songs.map((song) => (
            <article className="song-row" key={song.id}>
              <div>
                <a className="song-link" href={`/songs/${song.id}`}>{song.title}</a>
                <span>{song.isOriginal ? "Original" : `Cover${song.originalArtist ? ` · ${song.originalArtist}` : ""}`}</span>
              </div>
              <div>
                <strong>{song.genre ?? "Genre unknown"}</strong>
                <span>{[song.mood, song.language].filter(Boolean).join(" · ") || "Context incomplete"}</span>
              </div>
              <div>
                <strong>{song.isrc ?? "ISRC unknown"}</strong>
                <span>Updated {new Date(song.updatedAt).toLocaleDateString("en")}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}
