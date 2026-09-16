"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type VersionAction = { id: string; versionNumber: number; label: string | null; status: string };
type EraAction = { id: string; name: string; status: string };

export function IdentityActions({
  activeVersionId,
  draftVersions,
  eras
}: {
  activeVersionId: string | null;
  draftVersions: VersionAction[];
  eras: EraAction[];
}) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [eraName, setEraName] = useState("");

  const run = async (operation: string, url: string, body?: unknown) => {
    setPending(operation);
    setMessage(null);
    const idempotencyKey = keys.current.get(operation) ?? crypto.randomUUID();
    keys.current.set(operation, idempotencyKey);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": idempotencyKey
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {})
      });
      const payload = await response.json() as { error?: { message?: string } };
      if (!response.ok) {
        setMessage(payload.error?.message ?? "The command could not be completed.");
        return false;
      }

      keys.current.delete(operation);
      setMessage("Saved. Read model refreshed from canonical state.");
      router.refresh();
      return true;
    } catch {
      setMessage("Network error. Retry will reuse the same idempotency key.");
      return false;
    } finally {
      setPending(null);
    }
  };

  const createDraft = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await run("create-identity-draft", "/api/v1/identity", { ...(label.trim() ? { label: label.trim() } : {}) });
    if (ok) setLabel("");
  };

  const createEra = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeVersionId || !eraName.trim()) return;
    const ok = await run("create-era", "/api/v1/identity/eras", {
      identityVersionId: activeVersionId,
      name: eraName.trim()
    });
    if (ok) setEraName("");
  };

  return (
    <section className="command-panel" aria-label="Identity commands">
      <div className="section-heading">
        <p className="eyebrow">HUMAN CONTROL</p>
        <h2>Identity actions</h2>
      </div>

      <div className="command-grid">
        <form className="command-form" onSubmit={createDraft}>
          <label>
            New identity draft
            <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Optional version label" maxLength={120} />
          </label>
          <button className="command-button" disabled={pending !== null} type="submit">Create draft</button>
        </form>

        <form className="command-form" onSubmit={createEra}>
          <label>
            New Era
            <input value={eraName} onChange={(event) => setEraName(event.target.value)} placeholder={activeVersionId ? "Creative chapter name" : "Activate an identity version first"} disabled={!activeVersionId} maxLength={120} />
          </label>
          <button className="command-button" disabled={pending !== null || !activeVersionId || !eraName.trim()} type="submit">Create Era draft</button>
        </form>
      </div>

      {draftVersions.length > 0 && (
        <div className="command-list">
          {draftVersions.map((version) => (
            <div key={version.id}>
              <span>Version {version.versionNumber} · {version.label ?? "Untitled"}</span>
              <button
                className="command-button command-button-secondary"
                disabled={pending !== null}
                onClick={() => void run(`activate-version:${version.id}`, `/api/v1/identity/versions/${version.id}/activate`)}
                type="button"
              >Activate</button>
            </div>
          ))}
        </div>
      )}

      {eras.length > 0 && (
        <div className="command-list">
          {eras.map((era) => (
            <div key={era.id}>
              <span>{era.name} · {era.status}</span>
              {era.status === "ACTIVE" ? (
                <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void run(`end-era:${era.id}`, `/api/v1/identity/eras/${era.id}/end`)} type="button">End Era</button>
              ) : (era.status === "DRAFT" || era.status === "ENDED") ? (
                <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void run(`activate-era:${era.id}`, `/api/v1/identity/eras/${era.id}/activate`)} type="button">Activate Era</button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {message && <p className="command-message" role="status">{message}</p>}
    </section>
  );
}
