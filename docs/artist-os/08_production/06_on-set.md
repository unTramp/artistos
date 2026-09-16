# On-Set Mobile Workflow

- **Status:** REVIEW COMPLETE
- **MASTER references:** §167–169, §166, §370, §428
- **Domain:** 08_production
- **Feature slug:** `on-set`
- **Requirement prefix:** `PRD-SET`

## 2. Purpose
Provide a distraction-minimized mobile/PWA execution mode for recording planned shots and takes while preserving enough metadata for later Smart Ingest and selection.

## 3. User problem / job-to-be-done
During a shoot the artist cannot navigate desktop-style forms. They need the current shot, audio cue, 3–5 critical constraints and large controls for takes/outcomes.

## 4. Scope
Route `/shoots/:id/on-set`, current shot, concise setup/audio/identity constraints, take counter, START TAKE / GOOD / BAD / SELECT / NEXT, progress and resilient local interaction.

## 5. Entry points
ShootSession Start, mobile deep link/QR, command palette Start Shoot.

## 6. Preconditions and dependencies
ShootSession exists. Planned Shot list recommended; spontaneous shot fallback available. Network/AI must not be a hard runtime dependency.

## 7. Information architecture
Header/session progress → current Shot → audio/constraints → take counter → primary controls → next/previous → compact session drawer.

## 8. User roles and permissions
Single artist/operator in MVP. Future crew collaboration out of scope.

## 9. Core data model
Reads ShootSession/Shot, creates take-event metadata, status transitions and selected markers. MASTER does not define formal Take entity; implementation must choose event/entity boundary during schema audit.

## 10. Main happy-path workflow
Open session → verify current shot → START TAKE increments/records take start marker → record externally → mark outcome GOOD/BAD and optionally SELECT → NEXT moves to next shot → finish session → ingest media later reconciles files to take/shot context.

## 11. Alternative workflows
No network; user forgets START TAKE; multiple external cameras; redo selected take; skip shot; add spontaneous shot; audio playback handled outside app.

## 12. User actions
Start/end take marker if supported, GOOD, BAD, SELECT, NEXT/PREVIOUS, skip, add note, add spontaneous shot, pause/finish session.

## 13. State model
On-Set reflects Shoot/Shot state plus take-event sequence. It must not create an incompatible independent state machine.

## 14. Business rules
- `PRD-SET-001` On-Set MUST be mobile-first and optimized for minimal interaction during recording.
- `PRD-SET-002` Current Shot MUST be immediately visible without navigating deep detail UI.
- `PRD-SET-003` On-Set MUST show no more than approximately 3–5 critical identity/production constraints by default, per MASTER intent.
- `PRD-SET-004` Full production brief MAY be expandable but MUST NOT dominate default view.
- `PRD-SET-005` START TAKE MUST create a deterministic temporal marker/counter usable by Smart Ingest where possible.
- `PRD-SET-006` GOOD and BAD MUST record operator judgment without deleting media/history.
- `PRD-SET-007` SELECT MUST identify preferred take/capture but MUST remain reversible.
- `PRD-SET-008` NEXT MUST not silently mark current shot complete if no outcome was recorded; prompt/allow intentional skip.
- `PRD-SET-009` Workflow MUST continue when AI services are unavailable.
- `PRD-SET-010` Core workflow SHOULD tolerate temporary network loss and sync later where implementation supports PWA offline state.
- `PRD-SET-011` On-Set MUST preserve exact event timestamps for ingest matching.
- `PRD-SET-012` Device-time offset settings MUST be available/known to downstream Smart Ingest; On-Set must not rewrite source file times.
- `PRD-SET-013` User MAY add spontaneous shots/takes without restarting the session.
- `PRD-SET-014` Audio segment/cue SHOULD be displayed when linked but app need not become a DAW/playback engine.
- `PRD-SET-015` Destructive deletion of take history MUST not be a primary on-set action.
- `PRD-SET-016` Finishing session MUST summarize incomplete/skipped shots rather than pretending all work is complete.
- `PRD-SET-017` Controls MUST be operable with large touch targets and strong visual state confirmation.

## 15. AI behavior
No AI required during core capture. AI may have prepared constraints/shot notes beforehand. Real-time generative suggestions should be absent by default to reduce distraction unless explicitly requested.

## 16. Human approval
All GOOD/BAD/SELECT/skip/finish actions are human. System may infer later ingest mapping but cannot rewrite these judgments silently.

## 17. Validation
Session active, shot valid, event ordering sensible, sync conflict resolution preserves both local/server evidence.

## 18. UI states
Ready, take active/marked, good/bad/selected confirmation, offline, syncing, conflict, incomplete shot, session finished.

## 19. Edge cases
App killed mid-take; clock changes; device battery/network loss; duplicate tap; same take marked GOOD then BAD; selected take superseded.

## 20. Cross-module effects
Provides temporal/context signals to Smart Ingest; updates Shot/Shoot progress; selection hints Assets/editing.

## 21. Notifications and attention model
No normal notifications while On-Set. Only critical sync/data-loss warning.

## 22. Search / filtering / sorting / bulk actions
Not appropriate during capture; compact shot navigator only.

## 23. Analytics and product telemetry
Take counts, control latency, accidental undo, incomplete shots, offline sync failures, time per shot. Do not record media itself through telemetry.

## 24. Learning feedback
On-set behavior can improve workflow design; not automatically creative learning.

## 25. Auditability / provenance
Timestamped operator events, device/session identifiers, sync history.

## 26. Desktop / mobile behavior
Mobile/PWA primary; desktop can show read-only/control fallback but not optimized capture UX.

## 27. Accessibility / usability
Large targets, haptics where available, text+icon feedback, safe one-handed use, prevent accidental destructive actions.

## 28. Security / privacy / rights
Local offline cache must protect unreleased production data. No unnecessary microphone/camera permission if app only tracks external recording events.

## 29. Performance / async jobs
Primary controls must respond locally/near-immediately; background sync. No blocking network call on START TAKE.

## 30. Acceptance criteria
- `PRD-SET-AC01` User can run a session with AI offline/unavailable.
- `PRD-SET-AC02` Current shot and 3–5 critical constraints are visible at a glance.
- `PRD-SET-AC03` Take markers preserve timestamps/counter.
- `PRD-SET-AC04` SELECT is reversible and auditable.
- `PRD-SET-AC05` Finish shows incomplete work truthfully.

## 31. Test matrix
Normal run; offline; double tap; app restart; skipped shot; spontaneous shot; selection change; sync conflict.

## 32. Open questions
Formal Take data model, whether app tracks explicit END TAKE, and offline/PWA persistence technology are engineering/schema decisions.

## 33. Traceability
MASTER §166–169, §370, §428.
