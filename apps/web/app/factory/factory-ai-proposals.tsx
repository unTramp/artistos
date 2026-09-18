"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SongOption = { id: string; title: string };
type Proposal = {
  title: string;
  idea: string;
  pillar: string;
  mode: string;
  goal: string;
  audience: string;
  platformTargets: string[];
  requiredAssets: string[];
  productionEffort: string;
  learningValue: string;
  why: string;
  identityFitRationale: string;
  basedOn: Array<{ entityType: string; entityId: string; reason: string }>;
  uncertainty: { level: "LOW" | "MEDIUM" | "HIGH"; note: string };
};
type GenerationData = {
  agentRunId?: string;
  result:
    | { status: "PROPOSALS"; proposals: Proposal[]; coverageNote: string; provider: string; model: string; promptVersion: string }
    | { status: "INSUFFICIENT_CONTEXT"; code: string; message: string; missingSources: string[] }
    | { status: "PROVIDER_UNAVAILABLE"; code: string; message: string }
    | { status: "REJECTED_OUTPUT"; code: string; message: string };
  context: {
    readiness: string;
    maturity: string;
    missingSources: string[];
    sourceCount: number;
    estimatedTokens: number;
    truncated: boolean;
    contextVersion: string;
  };
};

const listFrom = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export function FactoryAIProposals({ songs }: { songs: SongOption[] }) {
  const router = useRouter();
  const [explicitRequest, setExplicitRequest] = useState("Generate distinct content angles that feel specific to the current artist identity and create useful learning, not filler.");
  const [songId, setSongId] = useState("");
  const [platforms, setPlatforms] = useState("INSTAGRAM_REELS");
  const [data, setData] = useState<GenerationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [accepting, setAccepting] = useState<number | null>(null);
  const [accepted, setAccepted] = useState<Set<number>>(() => new Set());

  const generate = async () => {
    setBusy(true);
    setError(null);
    setAccepted(new Set());
    try {
      const response = await fetch("/api/v1/content-factory/angles/generate", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
        body: JSON.stringify({
          explicitRequest,
          ...(songId ? { songId } : {}),
          platformTargets: listFrom(platforms),
          maxCandidates: 5
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "Generation failed safely.");
      setData(payload.data as GenerationData);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Generation failed safely.");
    } finally {
      setBusy(false);
    }
  };

  const accept = async (proposalIndex: number) => {
    if (!data?.agentRunId) return;
    setAccepting(proposalIndex);
    setError(null);
    try {
      const response = await fetch(`/api/v1/content-factory/angles/proposals/${data.agentRunId}/accept`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
        body: JSON.stringify({ proposalIndex })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "Proposal could not be accepted safely.");
      setAccepted((current) => new Set(current).add(proposalIndex));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Proposal could not be accepted safely.");
    } finally {
      setAccepting(null);
    }
  };

  return (
    <section className="factory-ai-workspace" aria-label="AI Content Angle proposals">
      <div className="factory-ai-head">
        <div>
          <p className="eyebrow">AI PROPOSAL LAYER</p>
          <h2>Generate bounded Angle Cards</h2>
          <p>AI can propose. It cannot approve, convert to a Content Unit, publish or rewrite permanent knowledge.</p>
        </div>
        {data && <span className="status-chip status-chip-muted">{data.context.readiness} · {data.context.maturity}</span>}
      </div>

      <div className="factory-ai-controls">
        <label>
          <span>Creative request</span>
          <textarea value={explicitRequest} onChange={(event) => setExplicitRequest(event.target.value)} rows={3} />
        </label>
        <label>
          <span>Song scope</span>
          <select value={songId} onChange={(event) => setSongId(event.target.value)}>
            <option value="">Artist-level</option>
            {songs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}
          </select>
        </label>
        <label>
          <span>Platform targets</span>
          <input value={platforms} onChange={(event) => setPlatforms(event.target.value)} placeholder="INSTAGRAM_REELS, TIKTOK" />
        </label>
        <button className="primary-button" type="button" onClick={generate} disabled={busy || explicitRequest.trim().length === 0}>
          {busy ? "Assembling context…" : "Generate Angles"}
        </button>
      </div>

      {error && <p className="factory-ai-message factory-ai-error">{error}</p>}

      {data?.result.status === "PROVIDER_UNAVAILABLE" && (
        <div className="factory-ai-message">
          <strong>{data.result.code}</strong>
          <p>{data.result.message}</p>
          <small>Manual Angle creation below remains the canonical fallback.</small>
        </div>
      )}
      {data?.result.status === "INSUFFICIENT_CONTEXT" && (
        <div className="factory-ai-message">
          <strong>{data.result.code}</strong>
          <p>{data.result.message}</p>
          <small>Missing: {data.result.missingSources.join(", ") || "none"}</small>
        </div>
      )}
      {data?.result.status === "REJECTED_OUTPUT" && (
        <div className="factory-ai-message factory-ai-error"><strong>{data.result.code}</strong><p>{data.result.message}</p></div>
      )}

      {data?.result.status === "PROPOSALS" && (
        <div className="factory-ai-results">
          <p className="muted-note">{data.result.coverageNote}</p>
          <details className="factory-ai-diagnostics">
            <summary>Generation diagnostics</summary>
            <div className="factory-ai-run-meta">
              <span>{data.result.provider} · {data.result.model} · {data.result.promptVersion}</span>
              <span>{data.context.sourceCount} sources · ~{data.context.estimatedTokens} tokens{data.context.truncated ? " · pruned" : ""} · {data.context.contextVersion}</span>
            </div>
          </details>
          <div className="factory-angle-grid">
            {data.result.proposals.map((proposal, index) => (
              <article className="factory-angle-card factory-ai-proposal" key={`${proposal.title}-${index}`}>
                <div className="factory-card-head">
                  <div><span className="candidate-status">AI PROPOSAL</span><span>{proposal.pillar} · {proposal.mode}</span></div>
                  <span>UNCERTAINTY {proposal.uncertainty.level}</span>
                </div>
                <h3>{proposal.title}</h3>
                <p className="factory-idea">{proposal.idea}</p>
                <dl className="factory-reason-grid">
                  <div><dt>Goal</dt><dd>{proposal.goal}</dd></div>
                  <div><dt>Audience</dt><dd>{proposal.audience}</dd></div>
                  <div><dt>Effort</dt><dd>{proposal.productionEffort}</dd></div>
                  <div className="factory-reason-wide"><dt>Why</dt><dd>{proposal.why}</dd></div>
                  <div className="factory-reason-wide"><dt>Identity fit</dt><dd>{proposal.identityFitRationale}</dd></div>
                  <div className="factory-reason-wide"><dt>What we learn</dt><dd>{proposal.learningValue}</dd></div>
                  <div className="factory-reason-wide"><dt>Uncertain</dt><dd>{proposal.uncertainty.note}</dd></div>
                </dl>
                <div className="factory-ai-sources">
                  {proposal.basedOn.map((source) => <span key={`${source.entityType}-${source.entityId}`}>{source.entityType} · {source.reason}</span>)}
                </div>
                <button className="secondary-button" type="button" onClick={() => accept(index)} disabled={accepting !== null || accepted.has(index)}>
                  {accepted.has(index) ? "Draft created" : accepting === index ? "Creating draft…" : "Create draft for review"}
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
