"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ContentExecutionSnapshot, ProductionIntent } from "@artist-os/core";

type RevisionAction = {
  id: string;
  revisionNumber: number;
  status: string;
  snapshot: ContentExecutionSnapshot;
};

const intents: ProductionIntent[] = ["AUTHENTIC", "CASUAL", "POLISHED", "CINEMATIC", "EXPERIMENTAL"];
const shotText = (snapshot?: ContentExecutionSnapshot) => snapshot?.shotList.map((shot) => shot.instruction).join("\n") ?? "";
const platformText = (snapshot?: ContentExecutionSnapshot) => snapshot?.platformNotes.map((note) => `${note.platform}: ${note.note}`).join("\n") ?? "";

const parseShots = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean).map((instruction, index) => ({ sequence: index + 1, instruction }));
const parsePlatformNotes = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
  const separator = line.indexOf(":");
  return separator > 0
    ? { platform: line.slice(0, separator).trim(), note: line.slice(separator + 1).trim() }
    : { platform: "GENERAL", note: line };
}).filter((item) => item.note.length > 0);

export function ExecutionActions({ unitId, revisions }: { unitId: string; revisions: RevisionAction[] }) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
  const latest = revisions[0]?.snapshot;
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [format, setFormat] = useState(latest?.format ?? "VERTICAL_PERFORMANCE");
  const [intent, setIntent] = useState<ProductionIntent>(latest?.productionIntent ?? "AUTHENTIC");
  const [hookType, setHookType] = useState(latest?.hookType ?? "PERSONAL_LINE");
  const [hookText, setHookText] = useState(latest?.hookText ?? "");
  const [structure, setStructure] = useState(latest?.structure ?? "");
  const [concept, setConcept] = useState(latest?.scriptOrPerformanceConcept ?? "");
  const [shots, setShots] = useState(shotText(latest));
  const [editBrief, setEditBrief] = useState(latest?.editBrief ?? "");
  const [caption, setCaption] = useState(latest?.caption ?? "");
  const [cta, setCta] = useState(latest?.cta ?? "");
  const [platformNotes, setPlatformNotes] = useState(platformText(latest));
  const [feasibility, setFeasibility] = useState(latest?.feasibilityNotes ?? "");
  const [fallback, setFallback] = useState(latest?.fallbackPlan ?? "");
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

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
        setMessage(payload.error?.message ?? "The execution command could not be completed.");
        return false;
      }
      keys.current.delete(operation);
      setMessage("Saved as canonical revision state. Previous snapshots remain unchanged.");
      router.refresh();
      return true;
    } catch {
      setMessage("Network error. Retry will reuse the same idempotency key.");
      return false;
    } finally {
      setPending(null);
    }
  };

  const createRevision = async (event: FormEvent) => {
    event.preventDefault();
    await run("create-execution-revision", `/api/v1/content-factory/units/${unitId}/execution-revisions`, {
      format: format.trim(),
      productionIntent: intent,
      ...(hookType.trim() ? { hookType: hookType.trim() } : {}),
      ...(hookText.trim() ? { hookText: hookText.trim() } : {}),
      structure: structure.trim(),
      scriptOrPerformanceConcept: concept.trim(),
      shotList: parseShots(shots),
      editBrief: editBrief.trim(),
      ...(caption.trim() ? { caption: caption.trim() } : {}),
      ...(cta.trim() ? { cta: cta.trim() } : {}),
      platformNotes: parsePlatformNotes(platformNotes),
      feasibilityNotes: feasibility.trim(),
      ...(fallback.trim() ? { fallbackPlan: fallback.trim() } : {})
    });
  };

  const drafts = revisions.filter((revision) => revision.status === "DRAFT");

  return (
    <section className="execution-editor" aria-label="Execution revision editor">
      <div className="section-heading">
        <p className="eyebrow">VERSIONED EXECUTION</p>
        <h2>{revisions.length === 0 ? "Create the first execution revision" : "Create the next execution revision"}</h2>
        <p className="muted-note">Editing means a new immutable snapshot. Approval can supersede the prior approved source, but never rewrites it.</p>
      </div>

      <form className="execution-form" onSubmit={createRevision}>
        <div className="execution-form-grid">
          <label>Format<input aria-label="Execution format" value={format} onChange={(event) => setFormat(event.target.value)} required /></label>
          <label>Production intent<select aria-label="Production intent" value={intent} onChange={(event) => setIntent(event.target.value as ProductionIntent)}>{intents.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          <label>Hook type<input aria-label="Hook type" value={hookType} onChange={(event) => setHookType(event.target.value)} /></label>
          <label>Hook text<input aria-label="Hook text" value={hookText} onChange={(event) => setHookText(event.target.value)} /></label>
          <label className="execution-wide">Structure<textarea aria-label="Execution structure" value={structure} onChange={(event) => setStructure(event.target.value)} required /></label>
          <label className="execution-wide">Script / performance concept<textarea aria-label="Script or performance concept" value={concept} onChange={(event) => setConcept(event.target.value)} required /></label>
          <label className="execution-wide">Shot list · one instruction per line<textarea aria-label="Shot list" value={shots} onChange={(event) => setShots(event.target.value)} placeholder="Locked waist-up opening\nStay in the same setup for the first phrase" /></label>
          <label className="execution-wide">Edit brief<textarea aria-label="Edit brief" value={editBrief} onChange={(event) => setEditBrief(event.target.value)} required /></label>
          <label>Caption<textarea aria-label="Execution caption" value={caption} onChange={(event) => setCaption(event.target.value)} /></label>
          <label>CTA<textarea aria-label="Execution CTA" value={cta} onChange={(event) => setCta(event.target.value)} /></label>
          <label className="execution-wide">Platform notes · one PLATFORM: note per line<textarea aria-label="Platform notes" value={platformNotes} onChange={(event) => setPlatformNotes(event.target.value)} /></label>
          <label className="execution-wide">Feasibility notes<textarea aria-label="Feasibility notes" value={feasibility} onChange={(event) => setFeasibility(event.target.value)} required /></label>
          <label className="execution-wide">Fallback plan<textarea aria-label="Fallback plan" value={fallback} onChange={(event) => setFallback(event.target.value)} /></label>
        </div>
        <div className="execution-governance-note">
          <strong>Rights: UNKNOWN</strong>
          <span>Rights domain is not connected yet. Execution approval never implies publishability.</span>
        </div>
        <button className="command-button" disabled={pending !== null} type="submit">Save new execution revision</button>
      </form>

      {drafts.length > 0 && (
        <div className="execution-review-list" aria-label="Execution revisions awaiting review">
          <div className="section-heading"><p className="eyebrow">HUMAN APPROVAL</p><h3>Review drafts explicitly</h3></div>
          {drafts.map((revision) => (
            <div className="factory-review-row" key={revision.id}>
              <div><strong>Revision {revision.revisionNumber}</strong><span>{revision.snapshot.format} · {revision.snapshot.productionIntent}</span></div>
              <div className="inline-actions">
                <button className="command-button" disabled={pending !== null} onClick={() => void run(`approve-execution:${revision.id}`, `/api/v1/content-factory/units/${unitId}/execution-revisions/${revision.id}/approve`)} type="button">Approve execution</button>
                <input aria-label={`Rejection reason for execution revision ${revision.revisionNumber}`} value={rejectionReasons[revision.id] ?? ""} onChange={(event) => setRejectionReasons((current) => ({ ...current, [revision.id]: event.target.value }))} placeholder="Reason for rejection" />
                <button className="command-button command-button-secondary" disabled={pending !== null || !(rejectionReasons[revision.id] ?? "").trim()} onClick={() => void run(`reject-execution:${revision.id}`, `/api/v1/content-factory/units/${unitId}/execution-revisions/${revision.id}/reject`, { reason: (rejectionReasons[revision.id] ?? "").trim() })} type="button">Reject revision</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {message && <p className="command-message" role="status">{message}</p>}
    </section>
  );
}
