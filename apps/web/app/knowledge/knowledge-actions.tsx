"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CandidateKnowledgeDestination, CandidateKnowledgeStatus, ToneCorpusLabel } from "@artist-os/core";

type CandidateAction = {
  id: string;
  content: string;
  destination: CandidateKnowledgeDestination;
  status: CandidateKnowledgeStatus;
};

type ToneAction = { id: string; label: ToneCorpusLabel; textContent: string };

const toneLabels: ToneCorpusLabel[] = ["AUTHENTIC", "GOOD", "NEUTRAL", "DO_NOT_COPY", "OUTDATED"];
const destinations: CandidateKnowledgeDestination[] = [
  "ARTIST_BRAIN",
  "SONG_BRAIN",
  "IDENTITY",
  "ERA",
  "PLATFORM_KNOWLEDGE",
  "BUSINESS_KNOWLEDGE"
];

export function KnowledgeActions({ candidates, toneCorpus }: { candidates: CandidateAction[]; toneCorpus: ToneAction[] }) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [toneText, setToneText] = useState("");
  const [toneLabel, setToneLabel] = useState<ToneCorpusLabel>("AUTHENTIC");
  const [toneSource, setToneSource] = useState("CAPTION");
  const [toneLanguage, setToneLanguage] = useState("en");
  const [tonePrivate, setTonePrivate] = useState(false);
  const [candidateText, setCandidateText] = useState("");
  const [candidateSourceType, setCandidateSourceType] = useState("VOICE_NOTE");
  const [candidateSourceId, setCandidateSourceId] = useState("");
  const [destination, setDestination] = useState<CandidateKnowledgeDestination>("ARTIST_BRAIN");

  const run = async (operation: string, url: string, body?: unknown) => {
    setPending(operation);
    setMessage(null);
    const idempotencyKey = keys.current.get(operation) ?? crypto.randomUUID();
    keys.current.set(operation, idempotencyKey);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {})
      });
      const payload = await response.json() as { error?: { message?: string } };
      if (!response.ok) {
        setMessage(payload.error?.message ?? "The command could not be completed.");
        return false;
      }
      keys.current.delete(operation);
      setMessage("Saved. Knowledge read model refreshed from canonical state.");
      router.refresh();
      return true;
    } catch {
      setMessage("Network error. Retry will reuse the same idempotency key.");
      return false;
    } finally {
      setPending(null);
    }
  };

  const addTone = async (event: FormEvent) => {
    event.preventDefault();
    if (!toneText.trim() || !toneSource.trim()) return;
    const ok = await run("add-tone", "/api/v1/knowledge/tone-corpus", {
      textContent: toneText.trim(),
      label: toneLabel,
      sourceType: toneSource.trim(),
      ...(toneLanguage.trim() ? { language: toneLanguage.trim() } : {}),
      isPrivate: tonePrivate
    });
    if (ok) setToneText("");
  };

  const addCandidate = async (event: FormEvent) => {
    event.preventDefault();
    if (!candidateText.trim() || !candidateSourceType.trim() || !candidateSourceId.trim()) return;
    const ok = await run("create-candidate", "/api/v1/knowledge/candidates", {
      sourceType: candidateSourceType.trim(),
      sourceId: candidateSourceId.trim(),
      content: candidateText.trim(),
      destination
    });
    if (ok) {
      setCandidateText("");
      setCandidateSourceId("");
    }
  };

  return (
    <section className="brain-actions" aria-label="Knowledge commands">
      <div className="section-heading">
        <p className="eyebrow">HUMAN-CONTROLLED MEMORY</p>
        <h2>Capture, review, then promote</h2>
        <p className="muted-note">AI or imports may propose candidates. Only an explicit review command can create durable Artist Brain knowledge.</p>
      </div>

      <div className="command-grid">
        <form className="command-form" onSubmit={addTone}>
          <label>Voice example<textarea aria-label="Voice example" value={toneText} onChange={(event) => setToneText(event.target.value)} placeholder="A real caption, interview line or message that sounds like you" maxLength={20000} required /></label>
          <label>Quality label<select aria-label="Tone label" value={toneLabel} onChange={(event) => setToneLabel(event.target.value as ToneCorpusLabel)}>{toneLabels.map((label) => <option key={label} value={label}>{label.replaceAll("_", " ")}</option>)}</select></label>
          <label>Source type<input aria-label="Tone source type" value={toneSource} onChange={(event) => setToneSource(event.target.value)} maxLength={120} required /></label>
          <label>Language<input aria-label="Tone language" value={toneLanguage} onChange={(event) => setToneLanguage(event.target.value)} maxLength={32} /></label>
          <label className="checkbox-row"><input aria-label="Private tone example" type="checkbox" checked={tonePrivate} onChange={(event) => setTonePrivate(event.target.checked)} />Private source — never expose verbatim publicly</label>
          <button className="command-button" disabled={pending !== null || !toneText.trim()} type="submit">Add to Tone Corpus</button>
        </form>

        <form className="command-form" onSubmit={addCandidate}>
          <label>Candidate knowledge<textarea aria-label="Candidate knowledge" value={candidateText} onChange={(event) => setCandidateText(event.target.value)} placeholder="A statement worth reviewing before it becomes durable memory" maxLength={20000} required /></label>
          <label>Destination<select aria-label="Candidate destination" value={destination} onChange={(event) => setDestination(event.target.value as CandidateKnowledgeDestination)}>{destinations.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
          <label>Source type<input aria-label="Candidate source type" value={candidateSourceType} onChange={(event) => setCandidateSourceType(event.target.value)} maxLength={120} required /></label>
          <label>Source ID<input aria-label="Candidate source ID" value={candidateSourceId} onChange={(event) => setCandidateSourceId(event.target.value)} placeholder="voice-note-001 / research-claim-id" maxLength={500} required /></label>
          <button className="command-button" disabled={pending !== null || !candidateText.trim() || !candidateSourceId.trim()} type="submit">Send to Knowledge Inbox</button>
        </form>
      </div>

      <div className="knowledge-command-row">
        <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void run("rebuild-brain", "/api/v1/knowledge/brain/rebuild")} type="button">Rebuild Artist Brain snapshot</button>
        <span>Projection only: rebuild never edits Identity, Tone Corpus or approved knowledge.</span>
      </div>

      {candidates.some((candidate) => candidate.status === "PENDING") && (
        <div className="command-list" aria-label="Pending candidate actions">
          {candidates.filter((candidate) => candidate.status === "PENDING").map((candidate) => (
            <div key={candidate.id}>
              <span><strong>{candidate.destination.replaceAll("_", " ")}</strong> · {candidate.content}</span>
              <div className="inline-actions">
                {candidate.destination === "ARTIST_BRAIN" ? (
                  <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void run(`accept:${candidate.id}`, `/api/v1/knowledge/candidates/${candidate.id}/accept`)} type="button">Accept to Artist Brain</button>
                ) : <span className="governance-note">Owning workflow required</span>}
                <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void run(`reject:${candidate.id}`, `/api/v1/knowledge/candidates/${candidate.id}/reject`, { reason: "Rejected during Knowledge review" })} type="button">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toneCorpus.length > 0 && (
        <div className="tone-label-actions" aria-label="Tone Corpus label actions">
          {toneCorpus.map((item) => (
            <label key={item.id}>
              <span>{item.textContent}</span>
              <select
                aria-label={`Label tone example ${item.id}`}
                value={item.label}
                disabled={pending !== null}
                onChange={(event) => void run(`relabel:${item.id}:${event.target.value}`, `/api/v1/knowledge/tone-corpus/${item.id}/label`, { label: event.target.value })}
              >{toneLabels.map((label) => <option key={label} value={label}>{label.replaceAll("_", " ")}</option>)}</select>
            </label>
          ))}
        </div>
      )}

      {message && <p className="command-message" role="status">{message}</p>}
    </section>
  );
}
