# Narrative Beats

## 1. Metadata
- **Spec ID:** `NAR-BEAT`
- **Domain:** `03_narrative`
- **Feature:** Narrative Beats
- **Status:** REVIEW
- **MASTER references:** 99, 130–141, 148–159, 319, 405, 451
- **Depends on:** Narrative Track; optional Identity/Era, Song, Campaign, Content Units
- **Used by:** Content Factory, Calendar, Narrative Home, Weekly Review

## 2. Purpose
Represent discrete story developments inside a Narrative Track so storytelling can progress over time instead of repeating the same premise indefinitely.

## 3. User problem / job-to-be-done
**JTBD:** “Help me know what the next meaningful step in a story is, what has already been told, and which content pieces belong to that step.”

## 4. Scope
Beat planning, sequencing, lifecycle, Content Unit linkage, progression visibility and Beat-aware content generation.

Out: script/caption details, publication schedule, automatic dramatic-story formulas.

## 5. Entry points
Track detail, Narrative Home, Calendar contextual action, Content Factory, Command Palette.

## 6. Preconditions and dependencies
A Beat must belong to a valid Narrative Track. It can exist before any Content Unit and can remain intentionally unsequenced.

## 7. Information architecture
Track → Beat timeline/list.
Each Beat shows title, description, status, optional sequence, linked Content Units, disclosure warning and execution state.

## 8. User roles and permissions
Artist creates/edits/reorders/status-changes. Future collaborators may draft; sensitive disclosure changes require artist approval.

## 9. Core data model
MASTER `NarrativeBeat`:
```text
trackId
title
description
status: PLANNED|ACTIVE|TOLD|ARCHIVED
sequence?
contentUnitIds[]
```

## 10. Main happy-path workflow
1. User opens Track and chooses `Add Beat`.
2. Writes a concrete story development/outcome/question to explore.
3. Optionally asks AI for candidate Beat sequence based on Track purpose/questions and already told content.
4. User edits/selects candidate.
5. Saves as PLANNED.
6. When actively producing content around it, marks ACTIVE.
7. Content Units are linked as they are created/approved.
8. After the Beat has been sufficiently communicated, user marks TOLD.
9. System preserves its executions and analytics for history.

## 11. Alternative workflows
Unsequenced anthology Track; one Beat represented by several Content Units; one Content Unit contributes to more than one Beat if schema supports it; Beat intentionally skipped/archived.

## 12. User actions
Create, edit, reorder, activate, mark told, archive, duplicate as new draft concept, link/unlink Content Unit, generate Angle, open related publications/evidence.

## 13. State model
MASTER states:
```text
PLANNED → ACTIVE → TOLD → ARCHIVED
PLANNED → ARCHIVED
ACTIVE → ARCHIVED
```
Reopening a TOLD Beat for new storytelling should preserve history; implementation may either return to ACTIVE with audit or create a follow-up Beat. Product UI must make the difference explicit.

## 14. Business rules
- **NAR-BEAT-001** — Every Beat MUST belong to exactly one Narrative Track.
- **NAR-BEAT-002** — A Beat represents a story development/question/chapter step, not a content format or publishing slot.
- **NAR-BEAT-003** — `sequence` MUST remain optional.
- **NAR-BEAT-004** — The system MUST support Tracks whose Beats are intentionally non-linear.
- **NAR-BEAT-005** — Beat status MUST use MASTER `PLANNED | ACTIVE | TOLD | ARCHIVED`.
- **NAR-BEAT-006** — A Beat MAY exist with zero linked Content Units.
- **NAR-BEAT-007** — A Beat MAY link multiple Content Units across platforms/formats.
- **NAR-BEAT-008** — Marking a Beat TOLD MUST NOT require a fixed number of Content Units.
- **NAR-BEAT-009** — The artist is final authority on whether a Beat is sufficiently told.
- **NAR-BEAT-010** — Publication metrics MUST NOT automatically move a Beat to TOLD.
- **NAR-BEAT-011** — Archiving a Beat MUST preserve linked Content/Publication history.
- **NAR-BEAT-012** — Reordering Beats MUST not rewrite historical publication timestamps or imply content was published in the new order.
- **NAR-BEAT-013** — Content Factory SHOULD use the active/planned Beat to reduce repetitive storytelling where relevant.
- **NAR-BEAT-014** — AI Beat proposals MUST consider already told Beats and recent similar executions.
- **NAR-BEAT-015** — AI MUST NOT force classic three-act/hero-journey structure unless the user explicitly chooses such a framework.
- **NAR-BEAT-016** — Beat description MUST respect Track allowed disclosures and Identity Mystique/Interpretation policy.
- **NAR-BEAT-017** — A private/internal Beat MAY exist without being eligible for audience-facing Content generation until disclosure is permitted.
- **NAR-BEAT-018** — If a linked Content Unit is deleted/archived, Beat history MUST show the missing/archived reference rather than silently recalculating story history.
- **NAR-BEAT-019** — Multiple active Beats MAY exist when the artist intentionally runs parallel subplots; UI must make this visible.
- **NAR-BEAT-020** — “Next Beat” recommendations MUST be suggestions, not mandatory progression.
- **NAR-BEAT-021** — Beat-level content performance can generate Insights but MUST NOT redefine the Track purpose automatically.
- **NAR-BEAT-022** — Beat progression MUST remain independent from platform posting cadence.

## 15. AI behavior
AI may propose next Beats, alternate Beats or consolidation based on Track purpose, narrative questions, Identity context, already told Beats and relevant Content history.

Output includes title, description, why now, source context, disclosure risk, novelty/repetition note, uncertainty.

Forbidden: invented biography, protected disclosure, deterministic storytelling formulas, auto-status changes.

## 16. Human approval
All Beat creation/activation/TOLD/archive actions are user-controlled. AI can draft only.

## 17. Validation
Valid Track, title required, allowed status, sequence uniqueness policy if ordered, linked Content Units belong to artist, disclosure compatibility.

## 18. UI states
No Beats, planned-only, active, told history, archived, privacy blocked, missing linked content.

## 19. Edge cases
Parallel active Beats; nonlinear order; returning to an old Beat; a Beat never published but artist considers it resolved privately; public response unexpectedly revives interest in old Beat.

## 20. Cross-module effects
Active/planned Beats feed Factory/Calendar/Strategy. Linked Content contributes to coverage and analytics. TOLD status informs repetition/novelty context.

## 21. Notifications and attention model
Optional attention when an active Track has no active/planned Beat, privacy conflict blocks planned work, or user-created deadline is approaching. No generic “Beat overdue” without a plan/deadline.

## 22. Search / filtering / sorting / bulk actions
Filter by Track/status; ordered/manual sort; search title/description. Bulk status change is risky and deferred unless proven useful.

## 23. Analytics and product telemetry
Beat creation source, AI proposal acceptance, time in active state, number of linked Content Units, reorder frequency. No “dramatic quality” score.

## 24. Learning feedback
Performance around a Beat may create scoped observation/insight about the specific story development, not a universal artist rule.

## 25. Auditability / provenance
Track source, creator, AI proposal provenance, status/reorder changes, linked/unlinked Content history.

## 26. Desktop / mobile behavior
Desktop timeline/editor. Mobile current Beat, quick add/edit/status/link actions.

## 27. Accessibility / usability
Timeline has list/table equivalent; reorder keyboard controls; clear current vs historical states.

## 28. Security / privacy / rights
Beat text can contain internal canon/private people; apply same minimum-disclosure rules as Identity Narrative/Track.

## 29. Performance / async jobs
Core Beat CRUD synchronous; AI proposals async if needed.

## 30. Acceptance criteria
1. User can create sequential or non-linear Beats.
2. Beat can exist without content.
3. TOLD is human-controlled and has no fixed content count.
4. Reordering does not falsify historical chronology.
5. AI considers prior Beats and does not force a narrative formula.
6. Protected Beats cannot silently become public content prompts.

## 31. Test matrix
Unit: state transitions, sequence, disclosure. Integration: Track/Content links. Agent eval: progression without invented facts. E2E: Track → Beat → Angle → Content → Beat told.

## 32. Open questions
Whether reopening TOLD should be a direct state transition or create a successor Beat; decide after UX prototyping and event-history design.

## 33. Traceability
`NAR-BEAT-001–022` → MASTER 99, 130–141, 148–159, 319, 405, 451.
