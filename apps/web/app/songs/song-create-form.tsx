"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SongCreateForm() {
  const router = useRouter();
  const idempotencyKey = useRef<string | null>(null);
  const [title, setTitle] = useState("");
  const [isOriginal, setIsOriginal] = useState(true);
  const [originalArtist, setOriginalArtist] = useState("");
  const [language, setLanguage] = useState("");
  const [isrc, setIsrc] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    setPending(true);
    setMessage(null);
    const key = idempotencyKey.current ?? crypto.randomUUID();
    idempotencyKey.current = key;

    try {
      const response = await fetch("/api/v1/songs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": key
        },
        body: JSON.stringify({
          title: title.trim(),
          isOriginal,
          ...(!isOriginal && originalArtist.trim() ? { originalArtist: originalArtist.trim() } : {}),
          ...(language.trim() ? { language: language.trim() } : {}),
          ...(isrc.trim() ? { isrc: isrc.trim().toUpperCase() } : {})
        })
      });
      const payload = await response.json() as { error?: { message?: string; fieldErrors?: Record<string, string> } };
      if (!response.ok) {
        const firstFieldError = payload.error?.fieldErrors ? Object.values(payload.error.fieldErrors)[0] : undefined;
        setMessage(firstFieldError ?? payload.error?.message ?? "Song could not be created.");
        return;
      }

      idempotencyKey.current = null;
      setTitle("");
      setOriginalArtist("");
      setLanguage("");
      setIsrc("");
      setMessage("Song created. Its Song Brain namespace is now available.");
      router.refresh();
    } catch {
      setMessage("Network error. Retry will reuse the same idempotency key.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="command-panel" aria-label="Create Song">
      <div className="section-heading">
        <p className="eyebrow">CATALOG COMMAND</p>
        <h2>Add Song</h2>
      </div>
      <form className="command-form command-form-song" onSubmit={submit}>
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Song title" required maxLength={240} />
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={isOriginal} onChange={(event) => setIsOriginal(event.target.checked)} />
          Original song
        </label>
        {!isOriginal && (
          <label>
            Original artist
            <input value={originalArtist} onChange={(event) => setOriginalArtist(event.target.value)} placeholder="Unknown is allowed" maxLength={240} />
          </label>
        )}
        <label>
          Language
          <input value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="Optional" maxLength={40} />
        </label>
        <label>
          ISRC
          <input value={isrc} onChange={(event) => setIsrc(event.target.value)} placeholder="Optional" maxLength={12} />
        </label>
        <button className="command-button" disabled={pending || !title.trim()} type="submit">{pending ? "Creating…" : "Create Song"}</button>
      </form>
      <p className="muted-note">Release date, release status and UPC intentionally do not exist here; Release / ReleaseTrack owns that lifecycle in MASTER v1.4.</p>
      {message && <p className="command-message" role="status">{message}</p>}
    </section>
  );
}
