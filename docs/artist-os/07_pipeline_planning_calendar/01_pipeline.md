# Content Pipeline

- **Status:** REVIEW COMPLETE
- **MASTER references:** §131–133, §156–159, §354, §362–364, §366–367, §403
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `pipeline`
- **Requirement prefix:** `PLN-PIP`

## 2. Purpose
Provide one operational view of committed content work from approved idea through publication, so the artist can see what is moving, what is blocked and what should happen next without using memory or disconnected task lists.

## 3. User problem / job-to-be-done
Once ideas are approved, independent artists quickly accumulate scripts, shoots, edits, exports and scheduled posts across multiple songs/platforms. The problem is not lack of ideas; it is losing execution state, dependencies and priorities. The Pipeline must turn creative intent into visible operational flow without making the artist behave like a factory line.

## 4. Scope
### In scope
- Kanban projection of ContentUnit lifecycle;
- operational ownership of next action, priority and blockers;
- filtering by Song, Campaign, Pillar, Narrative, Mode, Platform, Status and Priority;
- bottleneck detection and Overview attention signals;
- controlled bulk operations;
- link-outs to Content Factory, Shoot, Asset, Calendar and Publication contexts.

### Out of scope / non-goals
- full project-management suite;
- team resource planning in single-artist MVP;
- automatic publication;
- replacing canonical ContentUnit state machine with UI-only statuses;
- inventing deadlines merely to fill the board.

## 5. Entry points
Primary navigation `/pipeline`; Overview bottleneck cards; Factory approval; Song content history; Campaign workspace; Calendar card; Shoot session; command palette.

## 6. Preconditions and dependencies
Artist exists. ContentUnit can enter Pipeline when it exists as a canonical production unit. Identity/Song/Campaign links are optional where MASTER allows them. Calendar date, Shoot, Asset and Publication may not yet exist.

## 7. Information architecture
Desktop: filter bar → summary strip → Kanban columns → optional item detail drawer. Default columns mirror MASTER operational stages: Ideas / Approved / To Shoot / Shot / Editing / Review / Ready / Scheduled / Published. Terminal/exception states remain filterable and visible through item badges or dedicated views, not silently dropped.

## 8. User roles and permissions
Single-artist MVP: user can create, edit, move, pause, block and archive own ContentUnits. Destructive deletion, publishing and permanent knowledge changes follow their own approval rules.

## 9. Core data model
Reads/writes ContentUnit and its canonical status; references ContentAngle, ExecutionPackage fields, Song, Campaign, IdentityVersion/Era, NarrativeTrack, ShootSession/Shot, Asset lineage, Publication, Experiment and Calendar slot/date. Pipeline-specific presentation metadata may include priority, blocker reason, nextAction and optional planning window, but MUST NOT duplicate canonical domain state without explicit need.

## 10. Main happy-path workflow
1. User approves an Angle and creates/commits a ContentUnit.
2. Unit appears in `APPROVED` or equivalent canonical state.
3. User reviews next action and optionally assigns priority/planning slot.
4. Unit progresses through preparation, shoot, edit, review and readiness.
5. Calendar scheduling creates/links planned publication timing without changing the unit into `PUBLISHED` prematurely.
6. Publication moves the canonical lifecycle into measuring/analysis states outside the visible production lane where appropriate.
7. Pipeline retains historical traceability and links to metrics after publication.

## 11. Alternative workflows
Manual ContentUnit creation; content with no shoot required; photo/editorial content; spontaneous content created and published same day; experiment variants; blocked rights; campaign cancelled; content paused; evergreen item reused/repackaged; platform adaptation linked to same master concept.

## 12. User actions
Open details, change status when transition is valid, mark blocked/unblocked, set priority, assign/remove planning slot, link Shoot, open Assets, duplicate as deliberate variant, pause/resume, archive, bulk tag/status where safe, open related Campaign/Song/Experiment.

## 13. State model
Pipeline MUST use MASTER Content State Machine as source of truth: `IDEA → APPROVED → SCRIPT_READY → TO_SHOOT → SHOT → EDITING → REVIEW → READY → SCHEDULED → PUBLISHED → MEASURING → ANALYZED → ARCHIVED`, plus `BLOCKED | REJECTED | PAUSED`. UI columns are a simplified projection and may group adjacent canonical states; grouping must never erase exact state in detail/audit views.

## 14. Business rules
- `PLN-PIP-001` Pipeline MUST be a projection over canonical ContentUnit lifecycle, not a separate incompatible workflow engine.
- `PLN-PIP-002` A Pipeline card MUST expose exact canonical state even when multiple states are grouped into one visual column.
- `PLN-PIP-003` Status transitions MUST be validated against allowed lifecycle transitions; drag-and-drop MUST NOT bypass domain rules.
- `PLN-PIP-004` User MAY intentionally skip non-required production stages where content type does not need them, but skip must be explicit and auditable.
- `PLN-PIP-005` `BLOCKED` MUST preserve previous/underlying workflow context and a reason; unblocking returns the item to an appropriate actionable state rather than restarting it.
- `PLN-PIP-006` `PAUSED` MUST be semantically distinct from `BLOCKED`: paused is intentional deprioritization, blocked is dependency/constraint failure.
- `PLN-PIP-007` Pipeline MUST show the next meaningful action when derivable; it MUST NOT fabricate work when no next action is known.
- `PLN-PIP-008` Priority MUST be explicit/configurable and MUST NOT be inferred solely from predicted performance.
- `PLN-PIP-009` Campaign urgency, release deadlines, production dependencies and human commitments MAY influence attention ranking but MUST remain explainable.
- `PLN-PIP-010` Missing calendar date MUST NOT make an otherwise healthy unit an error.
- `PLN-PIP-011` A scheduled date MUST NOT imply publication occurred; publication status requires actual/manual/API publication evidence.
- `PLN-PIP-012` A ContentUnit MAY exist without a Song or Campaign where MASTER allows evergreen/personal/experimental content.
- `PLN-PIP-013` Experiment-controlled variants MUST display shared experiment context and the variable intended to change.
- `PLN-PIP-014` Pipeline MUST not compare artistic value or identity fit through a single numeric score.
- `PLN-PIP-015` Bulk status changes MUST be limited to transitions valid for every selected item; partial success must be explicit.
- `PLN-PIP-016` Historical published/analyzed units MUST remain traceable even after archive.
- `PLN-PIP-017` Pipeline filtering MUST support MASTER dimensions Song, Campaign, Pillar, Narrative, Mode, Platform, Status and Priority.
- `PLN-PIP-018` Bottleneck detection MUST use operational evidence such as queue accumulation, age, deadlines or missing dependencies and MUST explain why an item/group is flagged.
- `PLN-PIP-019` Pipeline MUST remain fully usable when AI providers are unavailable.
- `PLN-PIP-020` Spontaneous same-day content MUST be supported without forcing full long-form planning ceremony.

## 15. AI behavior
AI is optional. Strategy/Production agents may suggest next action, priority rationale, missing dependency or grouping; they may not change status, schedule, publish or delete autonomously. Suggestions should use current Campaign/Identity/Production context and explicit deadlines. If evidence is insufficient, return no recommendation.

## 16. Human approval
Human approval is required for committed status-changing actions that imply work completion, scheduling/publishing actions, identity deviations and destructive archive/delete behavior where applicable. AI may never silently mark Shot/Ready/Published.

## 17. Validation
References must resolve; exact status transition valid; schedule date valid; platform-specific readiness validated elsewhere; blocked reason required when manually blocking; publication evidence required for PUBLISHED.

## 18. UI states
First-use with CTA to create/approve content; empty by filter; loading; partial linked data; healthy flow; bottleneck warning; blocked/paused; stale external dependency; drag rejection with reason; offline local/read mode where available.

## 19. Edge cases
Unit linked to archived Campaign; Identity version changed mid-production; Shoot deleted; Publication failed after scheduled state; item has several platform Publications; imported historical content lacks intermediate states; ContentUnit intentionally jumps from APPROVED to READY because existing asset already satisfies production.

## 20. Cross-module effects
Status and blockers surface on Overview. TO_SHOOT/SHOT connects to Production. Assets/lineage update card readiness. Calendar links dates/slots. Publication feeds Distribution. Published content later feeds Analytics and Intelligence.

## 21. Notifications and attention model
Attention is justified for deadline risk, prolonged blockage, unresolved review, ready-but-unscheduled content during active campaign, and scheduled publication failure. Merely having many ideas is not itself an alert.

## 22. Search / filtering / sorting / bulk actions
Text search plus MASTER filters. Sort by priority, age in state, planned date, release proximity, recently updated. Bulk tag, priority, archive and safe state moves; no blind bulk publish.

## 23. Analytics and product telemetry
Time in state, cycle time, blocked time, reopen/rework frequency, approval-to-publish time, drag rejection, bulk-action usage, bottleneck resolution time, percentage of committed units reaching publication.

## 24. Learning feedback
Pipeline telemetry informs operational observations (e.g., editing bottleneck), not creative performance learnings by itself. Repeated operational constraints may become Production/Process hypotheses after review.

## 25. Auditability / provenance
Store actor, old/new state, timestamp, blocker changes, schedule links and related system/AI suggestion where relevant.

## 26. Desktop / mobile behavior
Desktop is primary Kanban workspace. Mobile provides list/compact board, quick status/blocker updates and contextual actions; no requirement to render a dense multi-column board on small screens.

## 27. Accessibility / usability
Keyboard-accessible state changes, non-color status labels, undo where safe, clear drag targets, confirmation for destructive/bulk actions.

## 28. Security / privacy / rights
Pipeline may expose private/internal titles and campaign plans; obey workspace privacy. Rights issues appear as constraints from Asset/Rights domain rather than copied legal logic.

## 29. Performance / async jobs
Board load must not wait for AI. Aggregated bottleneck projections may be cached. Long-running AI suggestions use JobService and update asynchronously.

## 30. Acceptance criteria
- `PLN-PIP-AC01` Exact ContentUnit state remains visible and canonical after board movement.
- `PLN-PIP-AC02` Invalid drag transition is rejected with an explanation.
- `PLN-PIP-AC03` BLOCKED and PAUSED remain distinct and reversible.
- `PLN-PIP-AC04` User can filter by all MASTER pipeline dimensions.
- `PLN-PIP-AC05` Ready-but-unscheduled and prolonged-blocked work can surface to Overview with rationale.
- `PLN-PIP-AC06` Pipeline works with AI disabled.
- `PLN-PIP-AC07` Spontaneous content can enter and progress without creating unnecessary Campaign/Shoot records.

## 31. Test matrix
Canonical state transitions; invalid drag; grouped columns; blocked/unblocked; paused/resumed; no Song; no Campaign; existing asset shortcut; publication failure; experiment variants; stale Identity reference; bulk partial-invalid transition; AI unavailable; mobile list.

## 32. Open questions
Whether `priority`, `nextAction` and `blocker` belong directly on ContentUnit or in separate operational projection requires schema audit. Exact grouping of canonical states into default Kanban columns is UX-configurable.

## 33. Traceability
MASTER §131–133, §156–159, §354, §362–364, §366–367, §403; Product Principles §16–27.
