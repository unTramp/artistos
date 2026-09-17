"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AngleRejectionReason, ContentMode, ContentPillar, LearningScope } from "@artist-os/core";

type SongOption = { id: string; title: string };
type AngleAction = {
  id: string;
  title: string;
  status: string;
  songId: string | null;
  rejectionReason: string | null;
  decisionNote: string | null;
};

const pillars: ContentPillar[] = [
  "PERFORMANCE", "ACOUSTIC", "STORY", "PERSONALITY", "BTS", "LYRICS",
  "REACTION", "COMMUNITY", "PHOTO", "PROMO", "RELEASE", "EXPERIMENTAL"
];
const modes: ContentMode[] = ["EVERGREEN", "CAMPAIGN", "OPPORTUNISTIC", "EXPERIMENTAL"];
const rejectionReasons: AngleRejectionReason[] = [
  "TOO_GENERIC", "NOT_ME", "ALREADY_DONE", "TOO_EXPENSIVE", "NOT_FEASIBLE",
  "WRONG_SONG", "WRONG_TONE", "WRONG_VISUAL", "DO_NOT_LIKE_IDEA", "OTHER"
];
const splitList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
const UNKNOWN_DRAFT = "UNKNOWN — not specified in draft";

const learningStatementFor = (angle: AngleAction) => {
  const reason = angle.rejectionReason;
  if (reason === "TOO_GENERIC") return `Content angles similar to “${angle.title}” may be too generic to feel distinctive for this artist.`;
  if (reason === "NOT_ME") return `Content angles similar to “${angle.title}” may not fit the artist identity.`;
  if (reason === "ALREADY_DONE") return `Repeating concepts similar to “${angle.title}” may add limited creative value without a materially new angle.`;
  if (reason === "TOO_EXPENSIVE") return `Concepts similar to “${angle.title}” may require more production cost than their current value justifies.`;
  if (reason === "NOT_FEASIBLE") return `Concepts similar to “${angle.title}” may be impractical under the current production constraints.`;
  if (reason === "WRONG_SONG") return `The concept “${angle.title}” may not fit the selected song context.`;
  if (reason === "WRONG_TONE") return `The tone represented by “${angle.title}” may not fit the artist's current creative direction.`;
  if (reason === "WRONG_VISUAL") return `The visual direction represented by “${angle.title}” may not fit the artist's current identity.`;
  if (reason === "DO_NOT_LIKE_IDEA") return `The concept pattern represented by “${angle.title}” may not be a useful creative direction for this artist.`;
  return `The rejected concept “${angle.title}” may reveal a reusable constraint worth testing before future ideation.`;
};

const decisionStatementFor = (angle: AngleAction) => {
  if (angle.rejectionReason === "NOT_ME") return `Avoid content concepts that repeat the identity mismatch represented by “${angle.title}” unless the artist explicitly chooses to re-test the direction.`;
  if (angle.rejectionReason === "WRONG_TONE") return `Avoid the tone represented by “${angle.title}” in the current creative direction unless context materially changes.`;
  return `Avoid the visual direction represented by “${angle.title}” in the current identity unless context materially changes.`;
};

const decisionEligible = (angle: AngleAction) => ["NOT_ME", "WRONG_TONE", "WRONG_VISUAL"].includes(angle.rejectionReason ?? "");

export function FactoryActions({ songs, angles, unitAngleIds }: { songs: SongOption[]; angles: AngleAction[]; unitAngleIds: string[] }) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
  const [localAngles, setLocalAngles] = useState(angles);
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [songId, setSongId] = useState("");
  const [idea, setIdea] = useState("");
  const [pillar, setPillar] = useState<ContentPillar>("STORY");
  const [mode, setMode] = useState<ContentMode>("EVERGREEN");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [why, setWhy] = useState("");
  const [identityFit, setIdentityFit] = useState("");
  const [effort, setEffort] = useState("");
  const [learningValue, setLearningValue] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [assets, setAssets] = useState("");
  const [reasons, setReasons] = useState<Record<string, AngleRejectionReason>>({});

  useEffect(() => {
    setLocalAngles(angles);
  }, [angles]);

  const run = async (operation: string, url: string, body?: unknown, method = "POST") => {
    setPending(operation);
    setMessage(null);
    const idempotencyKey = keys.current.get(operation) ?? crypto.randomUUID();
    keys.current.set(operation, idempotencyKey);
    try {
      const response = await fetch(url, {
        method,
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {})
      });
      const payload = await response.json() as { error?: { message?: string } };
      if (!response.ok) {
        setMessage(payload.error?.message ?? "The Content Factory command could not be completed.");
        return false;
      }
      keys.current.delete(operation);
      setMessage("Saved. Context captured from normal work.");
      router.refresh();
      return true;
    } catch {
      setMessage("Network error. Retry will reuse the same idempotency key.");
      return false;
    } finally {
      setPending(null);
    }
  };

  const createAngle = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await run("create-angle", "/api/v1/content-factory/angles", {
      ...(songId ? { songId } : {}),
      title: title.trim(),
      idea: idea.trim(),
      pillar,
      mode,
      goal: goal.trim() || UNKNOWN_DRAFT,
      audience: audience.trim() || UNKNOWN_DRAFT,
      platformTargets: splitList(platforms),
      requiredAssets: splitList(assets),
      learningValue: learningValue.trim() || UNKNOWN_DRAFT,
      why: why.trim() || UNKNOWN_DRAFT,
      identityFitRationale: identityFit.trim() || UNKNOWN_DRAFT,
      productionEffort: effort.trim() || UNKNOWN_DRAFT
    });
    if (ok) {
      setTitle(""); setIdea(""); setGoal(""); setAudience(""); setWhy("");
      setIdentityFit(""); setEffort(""); setLearningValue(""); setPlatforms(""); setAssets("");
    }
  };

  async function rejectAngle(angle: AngleAction, reason: AngleRejectionReason, note?: string) {
    const ok = await run(`reject:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/reject`, { reason, ...(note ? { note } : {}) });
    if (!ok) return;
    setLocalAngles((current) => current.map((item) => item.id === angle.id
      ? { ...item, status: "REJECTED", rejectionReason: reason, decisionNote: note ?? null }
      : item));
  }

  async function captureLearningCandidate(angle: AngleAction) {
    const scope: LearningScope = angle.songId ? "SONG" : "ARTIST_GLOBAL";
    const references = [{
      refType: "ContentAngle",
      refId: angle.id,
      relation: "SUPPORTS",
      note: `Explicit human rejection${angle.rejectionReason ? ` · ${angle.rejectionReason}` : ""}${angle.decisionNote ? ` · ${angle.decisionNote}` : ""}`
    }];
    if (angle.songId) references.push({ refType: "Song", refId: angle.songId, relation: "SUBJECT", note: "Song context inherited from rejected ContentAngle" });
    await run(`learning:${angle.id}`, "/api/v1/learnings", {
      statement: learningStatementFor(angle),
      scope,
      confidence: "LOW",
      confidenceRationale: "Suggested from one explicit human review outcome. Treat as a candidate until repeated evidence or deliberate testing supports validation.",
      references
    });
  }

  async function captureDecisionCandidate(angle: AngleAction) {
    const proposed = decisionStatementFor(angle);
    const decision = window.prompt("Review decision candidate", proposed)?.trim();
    if (!decision) return;
    const titleValue = window.prompt("Decision title", `Creative constraint · ${angle.title}`)?.trim();
    if (!titleValue) return;
    await run(`decision:${angle.id}`, "/api/v1/decisions", {
      title: titleValue,
      decision,
      reason: `Based on explicit Content Factory rejection: ${angle.rejectionReason ?? "OTHER"}${angle.decisionNote ? ` · ${angle.decisionNote}` : ""}`,
      scope: angle.songId ? "content.song" : "content.artist",
      references: [
        { refType: "ContentAngle", refId: angle.id, relation: "BASED_ON" },
        ...(angle.songId ? [{ refType: "Song", refId: angle.songId, relation: "SUBJECT" }] : [])
      ]
    });
  }

  const reviewable = localAngles.filter((angle) => angle.status === "DRAFT" || angle.status === "DEFERRED");
  const convertible = localAngles.filter((angle) => angle.status === "APPROVED" && !unitAngleIds.includes(angle.id));
  const passiveCandidates = localAngles.filter((angle) => angle.status === "REJECTED" && angle.rejectionReason);

  return (
    <section className="factory-actions" aria-label="Content Factory commands">
      <div className="section-heading">
        <p className="eyebrow">HUMAN-CONTROLLED FACTORY</p>
        <h2>Start with the idea. Add depth when it matters.</h2>
        <p className="muted-note">A draft only needs creative intent and minimal context. Missing strategic detail stays explicitly UNKNOWN until you choose to add it.</p>
      </div>

      <form className="factory-angle-form" onSubmit={createAngle}>
        <div className="factory-form-primary">
          <label>Angle title<input aria-label="Angle title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={240} required /></label>
          <label>Song context<select aria-label="Song context" value={songId} onChange={(event) => setSongId(event.target.value)}><option value="">Artist-level / no song</option>{songs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}</select></label>
          <label className="factory-wide">What's the idea?<textarea aria-label="Big idea" value={idea} onChange={(event) => setIdea(event.target.value)} maxLength={12000} required /></label>
          <label>Pillar<select aria-label="Content pillar" value={pillar} onChange={(event) => setPillar(event.target.value as ContentPillar)}>{pillars.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
          <label>Mode<select aria-label="Content mode" value={mode} onChange={(event) => setMode(event.target.value as ContentMode)}>{modes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        </div>

        <details className="decision-advanced factory-progressive-fields">
          <summary>Advanced context · optional for draft</summary>
          <div className="factory-form-reasoning">
            <label>Goal<textarea aria-label="Angle goal" value={goal} onChange={(event) => setGoal(event.target.value)} /></label>
            <label>Audience<textarea aria-label="Angle audience" value={audience} onChange={(event) => setAudience(event.target.value)} /></label>
            <label>Why this angle<textarea aria-label="Why this angle" value={why} onChange={(event) => setWhy(event.target.value)} /></label>
            <label>Identity fit<textarea aria-label="Identity fit rationale" value={identityFit} onChange={(event) => setIdentityFit(event.target.value)} /></label>
            <label>Production effort<textarea aria-label="Production effort" value={effort} onChange={(event) => setEffort(event.target.value)} /></label>
            <label>Learning value<textarea aria-label="Learning value" value={learningValue} onChange={(event) => setLearningValue(event.target.value)} /></label>
            <label>Platform targets<input aria-label="Platform targets" value={platforms} onChange={(event) => setPlatforms(event.target.value)} placeholder="INSTAGRAM_REELS, TIKTOK" /></label>
            <label>Required assets<input aria-label="Required assets" value={assets} onChange={(event) => setAssets(event.target.value)} placeholder="performance take, clean audio" /></label>
          </div>
        </details>
        <button className="command-button factory-create-button" disabled={pending !== null} type="submit">Save draft</button>
      </form>

      {reviewable.length > 0 && (
        <div className="factory-review-list" aria-label="Angles awaiting human review">
          <div className="section-heading"><p className="eyebrow">REVIEW QUEUE</p><h3>Choose deliberately</h3><p className="muted-note">Your rejection/defer reason is retained as evidence automatically. No separate memory form is required.</p></div>
          {reviewable.map((angle) => {
            const reason = reasons[angle.id] ?? "TOO_GENERIC";
            return (
              <div className="factory-review-row" key={angle.id}>
                <div><strong>{angle.title}</strong><span>{angle.status}</span></div>
                <div className="inline-actions">
                  <button className="command-button" disabled={pending !== null} onClick={() => void run(`approve:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/approve`)} type="button">Approve</button>
                  <button className="command-button command-button-secondary" disabled={pending !== null || angle.status !== "DRAFT"} onClick={() => { const note = window.prompt("Why defer this angle?", "Needs more context before commitment")?.trim(); if (note) void run(`defer:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/defer`, { note }); }} type="button">Defer</button>
                  <select aria-label={`Rejection reason for ${angle.title}`} value={reason} onChange={(event) => setReasons((current) => ({ ...current, [angle.id]: event.target.value as AngleRejectionReason }))}>{rejectionReasons.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select>
                  <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => { const note = window.prompt("Optional context for this rejection")?.trim(); void rejectAngle(angle, reason, note); }} type="button">Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {passiveCandidates.length > 0 && (
        <div className="factory-review-list" aria-label="Memory candidates from normal work">
          <div className="section-heading"><p className="eyebrow">PASSIVE MEMORY</p><h3>Normal review created reusable evidence</h3><p className="muted-note">These are proposals, not truth. Capture a low-confidence Learning candidate or explicitly commit an identity-related Decision.</p></div>
          {passiveCandidates.slice(0, 6).map((angle) => (
            <div className="factory-review-row" key={`memory-${angle.id}`}>
              <div><strong>{angle.title}</strong><span>{angle.rejectionReason?.replaceAll("_", " ")}{angle.decisionNote ? ` · ${angle.decisionNote}` : ""}</span></div>
              <div className="inline-actions">
                <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void captureLearningCandidate(angle)} type="button">Capture Learning candidate</button>
                {decisionEligible(angle) && <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void captureDecisionCandidate(angle)} type="button">Review Decision candidate</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {convertible.length > 0 && (
        <div className="factory-convert-list" aria-label="Approved angles ready for production commitment">
          <div className="section-heading"><p className="eyebrow">PRODUCTION COMMITMENT</p><h3>Approved is not yet a Content Unit</h3></div>
          {convertible.map((angle) => (
            <div className="factory-review-row" key={angle.id}>
              <div><strong>{angle.title}</strong><span>APPROVED · explicit conversion required</span></div>
              <button className="command-button" disabled={pending !== null} onClick={() => void run(`convert:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/content-unit`, { priority: "NORMAL" })} type="button">Create Content Unit</button>
            </div>
          ))}
        </div>
      )}

      {message && <p className="command-message" role="status">{message}</p>}
    </section>
  );
}