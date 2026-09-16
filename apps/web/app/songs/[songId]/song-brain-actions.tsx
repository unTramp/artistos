"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SongBrainStatementType } from "@artist-os/core";

export function SongBrainActions({
  songId,
  activeIdentityVersion,
  activeEra
}: {
  songId: string;
  activeIdentityVersion: { id: string; versionNumber: number } | null;
  activeEra: { id: string; name: string } | null;
}) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [statementType, setStatementType] = useState<SongBrainStatementType>("ARTIST_INTERPRETATION");
  const [statement, setStatement] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [visualNotes, setVisualNotes] = useState("");
  const [anchors, setAnchors] = useState("");
  const [overrides, setOverrides] = useState("");
  const [useEra, setUseEra] = useState(Boolean(activeEra));

  const run = async (operation: string, url: string, body: unknown) => {
    setPending(operation);
    setMessage(null);
    const key = keys.current.get(operation) ?? crypto.randomUUID();
    keys.current.set(operation, key);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": key },
        body: JSON.stringify(body)
      });
      const payload = await response.json() as { error?: { message?: string; fieldErrors?: Record<string, string> } };
      if (!response.ok) {
        const fieldError = payload.error?.fieldErrors ? Object.values(payload.error.fieldErrors)[0] : undefined;
        setMessage(fieldError ?? payload.error?.message ?? "Song Brain command failed.");
        return false;
      }
      keys.current.delete(operation);
      setMessage("Saved to canonical Song Brain state.");
      router.refresh();
      return true;
    } catch {
      setMessage("Network error. Retry will reuse the same idempotency key.");
      return false;
    } finally {
      setPending(null);
    }
  };

  const addStatement = async (event: FormEvent) => {
    event.preventDefault();
    if (!statement.trim()) return;
    const ok = await run("add-statement", `/api/v1/songs/${songId}/statements`, {
      statementType,
      statement: statement.trim(),
      ...(sourceLabel.trim() ? { sourceLabel: sourceLabel.trim() } : {})
    });
    if (ok) {
      setStatement("");
      setSourceLabel("");
    }
  };

  const configureContext = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeIdentityVersion) return;
    await run("configure-identity-context", `/api/v1/songs/${songId}/identity-context`, {
      identityVersionId: activeIdentityVersion.id,
      ...(useEra && activeEra ? { eraIdentityId: activeEra.id } : {}),
      ...(visualNotes.trim() ? { songSpecificVisualNotes: visualNotes.trim() } : {}),
      songSpecificAnchors: anchors.split(",").map((value) => value.trim()).filter(Boolean),
      allowedOverrides: overrides.split(",").map((value) => value.trim()).filter(Boolean)
    });
  };

  return (
    <section className="brain-actions" aria-label="Song Brain commands">
      <div className="command-grid">
        <form className="command-form" onSubmit={addStatement}>
          <div className="section-heading"><p className="eyebrow">TRUTH / INTERPRETATION</p><h2>Add statement</h2></div>
          <label>
            Statement type
            <select value={statementType} onChange={(event) => setStatementType(event.target.value as SongBrainStatementType)}>
              <option value="FACT">Fact</option>
              <option value="ARTIST_INTERPRETATION">Artist interpretation</option>
              <option value="AUDIENCE_INTERPRETATION">Audience interpretation</option>
            </select>
          </label>
          <label>
            Statement
            <textarea value={statement} onChange={(event) => setStatement(event.target.value)} placeholder="What is known or interpreted about this song?" required maxLength={12000} />
          </label>
          <label>
            Source label
            <input value={sourceLabel} onChange={(event) => setSourceLabel(event.target.value)} placeholder="Optional provenance note" maxLength={240} />
          </label>
          <button className="command-button" disabled={pending !== null || !statement.trim()} type="submit">Add to Song Brain</button>
        </form>

        <form className="command-form" onSubmit={configureContext}>
          <div className="section-heading"><p className="eyebrow">IDENTITY INHERITANCE</p><h2>Song Identity Context</h2></div>
          {activeIdentityVersion ? (
            <p className="muted-note">Base Identity Version {activeIdentityVersion.versionNumber}. The Song stores the reference and only narrow song-specific refinements.</p>
          ) : (
            <p className="muted-note">Activate an Identity Version before configuring Song Identity Context.</p>
          )}
          {activeEra && (
            <label className="checkbox-row">
              <input type="checkbox" checked={useEra} onChange={(event) => setUseEra(event.target.checked)} />
              Inherit active Era: {activeEra.name}
            </label>
          )}
          <label>
            Visual notes
            <textarea value={visualNotes} onChange={(event) => setVisualNotes(event.target.value)} placeholder="Song-specific refinement, not a replacement identity" maxLength={8000} />
          </label>
          <label>
            Song anchors
            <input value={anchors} onChange={(event) => setAnchors(event.target.value)} placeholder="Comma-separated" />
          </label>
          <label>
            Allowed overrides
            <input value={overrides} onChange={(event) => setOverrides(event.target.value)} placeholder="Comma-separated explicit overrides" />
          </label>
          <button className="command-button" disabled={pending !== null || !activeIdentityVersion} type="submit">Save Identity Context</button>
        </form>
      </div>
      {message && <p className="command-message" role="status">{message}</p>}
    </section>
  );
}
