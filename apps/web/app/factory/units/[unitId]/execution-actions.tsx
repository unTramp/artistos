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

type AuthoringSection = "creative" | "production" | "edit" | "publish" | "constraints";

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

const sectionMeta: Array<{ id: AuthoringSection; label: string; note: string }> = [
  { id: "creative", label: "Creative Core", note: "Hook · structure · performance" },
  { id: "production", label: "Production", note: "Shots · feasibility · fallback" },
  { id: "edit", label: "Edit", note: "Edit brief · platform adaptation" },
  { id: "publish", label: "Publish Prep", note: "Caption · CTA" },
  { id: "constraints", label: "Constraints", note: "Rights · known boundaries" }
];

export function ExecutionActions({ unitId, revisions }: { unitId: string; revisions: RevisionAction[] }) {
  const router = useRouter();
  const keys = useRef(new Map<string, string>());
  const latest = revisions[0]?.snapshot;
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AuthoringSection>("creative");
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

    if (!format.trim() || !structure.trim() || !concept.trim()) {
      setActiveSection("creative");
      setMessage("Complete Format, Structure and Script / performance concept before saving the revision.");
      return;
    }
    if (!feasibility.trim()) {
      setActiveSection("production");
      setMessage("Complete Feasibility notes before saving the revision.");
      return;
    }
    if (!editBrief.trim()) {
      setActiveSection("edit");
      setMessage("Complete the Edit brief before saving the revision.");
      return;
    }

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
        <p className="muted-note">One canonical snapshot, edited by working context. Switching sections never discards fields; saving creates a new immutable revision.</p>
      </div>

      <form className="execution-form" onSubmit={createRevision}>
        <nav className="execution-authoring-nav" aria-label="Execution authoring sections">
          {sectionMeta.map((section) => (
            <button
              className={activeSection === section.id ? "active" : undefined}
              key={section.id}
              type="button"
              onClick={() => { setActiveSection(section.id); setMessage(null); }}
            >
              <strong>{section.label}</strong>
              <small>{section.note}</small>
            </button>
          ))}
        </nav>

        <div className="execution-section-shell">
          {activeSection === "creative" && (
            <section className="execution-work-section" aria-labelledby="execution-section-creative">
              <div className="execution-section-heading">
                <span>01 · CREATIVE CORE</span>
                <h3 id="execution-section-creative">What is the viewer meant to experience?</h3>
                <p>Define the creative spine first. Production and editing should serve this rather than invent a second concept.</p>
              </div>
              <div className="execution-form-grid">
                <label>Format<input aria-label="Execution format" value={format} onChange={(event) => setFormat(event.target.value)} /></label>
                <label>Production intent<select aria-label="Production intent" value={intent} onChange={(event) => setIntent(event.target.value as ProductionIntent)}>{intents.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
                <label>Hook type<input aria-label="Hook type" value={hookType} onChange={(event) => setHookType(event.target.value)} /></label>
                <label>Hook text<input aria-label="Hook text" value={hookText} onChange={(event) => setHookText(event.target.value)} /></label>
                <label className="execution-wide">Structure<textarea aria-label="Execution structure" value={structure} onChange={(event) => setStructure(event.target.value)} /></label>
                <label className="execution-wide">Script / performance concept<textarea aria-label="Script or performance concept" value={concept} onChange={(event) => setConcept(event.target.value)} /></label>
              </div>
            </section>
          )}

          {activeSection === "production" && (
            <section className="execution-work-section" aria-labelledby="execution-section-production">
              <div className="execution-section-heading">
                <span>02 · PRODUCTION</span>
                <h3 id="execution-section-production">Can this be captured with the real setup?</h3>
                <p>Turn the concept into shootable instructions and preserve fallback thinking instead of hiding production risk.</p>
              </div>
              <div className="execution-form-grid">
                <label className="execution-wide">Shot list · one instruction per line<textarea aria-label="Shot list" value={shots} onChange={(event) => setShots(event.target.value)} placeholder="Locked waist-up opening\nStay in the same setup for the first phrase" /></label>
                <label className="execution-wide">Feasibility notes<textarea aria-label="Feasibility notes" value={feasibility} onChange={(event) => setFeasibility(event.target.value)} /></label>
                <label className="execution-wide">Fallback plan<textarea aria-label="Fallback plan" value={fallback} onChange={(event) => setFallback(event.target.value)} /></label>
              </div>
            </section>
          )}

          {activeSection === "edit" && (
            <section className="execution-work-section" aria-labelledby="execution-section-edit">
              <div className="execution-section-heading">
                <span>03 · EDIT</span>
                <h3 id="execution-section-edit">How should the captured material become the final asset?</h3>
                <p>Keep the edit brief distinct from platform adaptations so one source execution can survive multiple outputs.</p>
              </div>
              <div className="execution-form-grid">
                <label className="execution-wide">Edit brief<textarea aria-label="Edit brief" value={editBrief} onChange={(event) => setEditBrief(event.target.value)} /></label>
                <label className="execution-wide">Platform notes · one PLATFORM: note per line<textarea aria-label="Platform notes" value={platformNotes} onChange={(event) => setPlatformNotes(event.target.value)} /></label>
              </div>
            </section>
          )}

          {activeSection === "publish" && (
            <section className="execution-work-section" aria-labelledby="execution-section-publish">
              <div className="execution-section-heading">
                <span>04 · PUBLISH PREP</span>
                <h3 id="execution-section-publish">What accompanies the finished asset?</h3>
                <p>Caption and CTA remain optional execution fields. Leaving them blank is explicit; Artist OS does not invent missing publish copy.</p>
              </div>
              <div className="execution-form-grid">
                <label>Caption<textarea aria-label="Execution caption" value={caption} onChange={(event) => setCaption(event.target.value)} /></label>
                <label>CTA<textarea aria-label="Execution CTA" value={cta} onChange={(event) => setCta(event.target.value)} /></label>
              </div>
            </section>
          )}

          {activeSection === "constraints" && (
            <section className="execution-work-section" aria-labelledby="execution-section-constraints">
              <div className="execution-section-heading">
                <span>05 · CONSTRAINTS</span>
                <h3 id="execution-section-constraints">What must not be silently assumed?</h3>
                <p>This surface exposes only constraints with a real owner today. Future Audio Segment, Identity Constraint and Production Capability references should appear here when their canonical owners exist.</p>
              </div>
              <div className="execution-governance-note">
                <strong>Rights: UNKNOWN</strong>
                <span>Rights domain is not connected yet. Execution approval never implies publishability.</span>
              </div>
              <div className="execution-constraint-summary">
                <div><span>Format</span><strong>{format || "UNKNOWN"}</strong></div>
                <div><span>Production intent</span><strong>{intent}</strong></div>
                <div><span>Fallback</span><strong>{fallback.trim() ? "RECORDED" : "UNKNOWN"}</strong></div>
              </div>
            </section>
          )}
        </div>

        {message && <p className="command-message" role="status">{message}</p>}

        <footer className="execution-authoring-footer">
          <div>
            <span>IMMUTABLE SNAPSHOT</span>
            <small>All five sections belong to one revision. Save does not rewrite earlier snapshots.</small>
          </div>
          <button className="command-button" disabled={pending !== null} type="submit">{pending === "create-execution-revision" ? "Saving revision…" : "Save new execution revision"}</button>
        </footer>
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
    </section>
  );
}
