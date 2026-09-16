"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AngleRejectionReason, ContentMode, ContentPillar } from "@artist-os/core";

type SongOption = { id: string; title: string };
type AngleAction = { id: string; title: string; status: string };

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

export function FactoryActions({ songs, angles, unitAngleIds }: { songs: SongOption[]; angles: AngleAction[]; unitAngleIds: string[] }) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
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
      setMessage("Saved. Factory read model refreshed from canonical state.");
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
      goal: goal.trim(),
      audience: audience.trim(),
      platformTargets: splitList(platforms),
      requiredAssets: splitList(assets),
      learningValue: learningValue.trim(),
      why: why.trim(),
      identityFitRationale: identityFit.trim(),
      productionEffort: effort.trim()
    });
    if (ok) {
      setTitle(""); setIdea(""); setGoal(""); setAudience(""); setWhy("");
      setIdentityFit(""); setEffort(""); setLearningValue(""); setPlatforms(""); setAssets("");
    }
  };

  const reviewable = angles.filter((angle) => angle.status === "DRAFT" || angle.status === "DEFERRED");
  const convertible = angles.filter((angle) => angle.status === "APPROVED" && !unitAngleIds.includes(angle.id));

  return (
    <section className="factory-actions" aria-label="Content Factory commands">
      <div className="section-heading">
        <p className="eyebrow">HUMAN-CONTROLLED FACTORY</p>
        <h2>Angles before output volume</h2>
        <p className="muted-note">Manual creation is the canonical fallback. AI will propose into the same review queue later; it will never bypass approval.</p>
      </div>

      <form className="factory-angle-form" onSubmit={createAngle}>
        <div className="factory-form-primary">
          <label>Angle title<input aria-label="Angle title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={240} required /></label>
          <label>Song context<select aria-label="Song context" value={songId} onChange={(event) => setSongId(event.target.value)}><option value="">Artist-level / no song</option>{songs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}</select></label>
          <label className="factory-wide">Big idea<textarea aria-label="Big idea" value={idea} onChange={(event) => setIdea(event.target.value)} maxLength={12000} required /></label>
          <label>Pillar<select aria-label="Content pillar" value={pillar} onChange={(event) => setPillar(event.target.value as ContentPillar)}>{pillars.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
          <label>Mode<select aria-label="Content mode" value={mode} onChange={(event) => setMode(event.target.value as ContentMode)}>{modes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        </div>

        <div className="factory-form-reasoning">
          <label>Goal<textarea aria-label="Angle goal" value={goal} onChange={(event) => setGoal(event.target.value)} required /></label>
          <label>Audience<textarea aria-label="Angle audience" value={audience} onChange={(event) => setAudience(event.target.value)} required /></label>
          <label>Why this angle<textarea aria-label="Why this angle" value={why} onChange={(event) => setWhy(event.target.value)} required /></label>
          <label>Identity fit<textarea aria-label="Identity fit rationale" value={identityFit} onChange={(event) => setIdentityFit(event.target.value)} required /></label>
          <label>Production effort<textarea aria-label="Production effort" value={effort} onChange={(event) => setEffort(event.target.value)} required /></label>
          <label>Learning value<textarea aria-label="Learning value" value={learningValue} onChange={(event) => setLearningValue(event.target.value)} required /></label>
          <label>Platform targets<input aria-label="Platform targets" value={platforms} onChange={(event) => setPlatforms(event.target.value)} placeholder="INSTAGRAM_REELS, TIKTOK" /></label>
          <label>Required assets<input aria-label="Required assets" value={assets} onChange={(event) => setAssets(event.target.value)} placeholder="performance take, clean audio" /></label>
        </div>
        <button className="command-button factory-create-button" disabled={pending !== null} type="submit">Save Angle draft</button>
      </form>

      {reviewable.length > 0 && (
        <div className="factory-review-list" aria-label="Angles awaiting human review">
          <div className="section-heading"><p className="eyebrow">REVIEW QUEUE</p><h3>Choose deliberately</h3></div>
          {reviewable.map((angle) => {
            const reason = reasons[angle.id] ?? "TOO_GENERIC";
            return (
              <div className="factory-review-row" key={angle.id}>
                <div><strong>{angle.title}</strong><span>{angle.status}</span></div>
                <div className="inline-actions">
                  <button className="command-button" disabled={pending !== null} onClick={() => void run(`approve:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/approve`)} type="button">Approve</button>
                  <button className="command-button command-button-secondary" disabled={pending !== null || angle.status !== "DRAFT"} onClick={() => void run(`defer:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/defer`, { note: "Deferred during Factory review" })} type="button">Defer</button>
                  <select aria-label={`Rejection reason for ${angle.title}`} value={reason} onChange={(event) => setReasons((current) => ({ ...current, [angle.id]: event.target.value as AngleRejectionReason }))}>{rejectionReasons.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select>
                  <button className="command-button command-button-secondary" disabled={pending !== null} onClick={() => void run(`reject:${angle.id}`, `/api/v1/content-factory/angles/${angle.id}/reject`, { reason, note: "Rejected during Factory review" })} type="button">Reject</button>
                </div>
              </div>
            );
          })}
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
