# Identity Wizard

## 1. Metadata
- **Spec ID:** `IDN-WIZ`
- **Domain:** `02_identity`
- **Feature:** Identity Wizard
- **Status:** REVIEW
- **Owner:** Product / Identity Engine
- **MASTER references:** 16–18, 20, 53–92, 404, 450
- **Depends on:** Identity versioning, Archetype Discovery, Listening Session, Moodboard, Visual DNA, Narrative, Anchors, Mystique, Vertical Rules
- **Used by:** onboarding, Identity Home

## 2. Purpose
Provide a guided but resumable path from little/no structured identity to a human-approved Identity Version and Brand Book-ready structured system.

## 3. User problem / job-to-be-done
**JTBD:** “Help me articulate and structure my artistic identity without turning me into a template or asking me to design a brand system from scratch.”

## 4. Scope
### In scope
MASTER sequence:
```text
Archetype Discovery
→ Listening Session
→ Sensory Associations
→ Candidate Review
→ Moodboard
→ Pattern Analysis
→ Visual DNA
→ Narrative
→ Symbolic Anchors
→ Mystique
→ Vertical Rules
→ Approval
→ Identity Version
→ Brand Book
```
Supports resume, backtracking, optional deferral and review.

### Out of scope
- forcing every field before any useful work;
- automatic archetype/identity activation;
- marketing campaign setup;
- performance-based auto-rebrand.

## 5. Entry points
`/identity/discovery`, Identity Home `Start/Resume`, onboarding, Version `Create major/minor draft` where the same workflows are reused.

## 6. Preconditions and dependencies
Artist exists. Wizard may create the root `ArtistIdentity` and initial draft version if absent.

## 7. Information architecture
Persistent progress sidebar/stepper on desktop; simplified step progress on mobile. Each step is an actual feature route, not hidden wizard-only duplicated logic.

## 8. User roles and permissions
Single artist MVP. Final approval/activation is human-only.

## 9. Core data model
Uses source entities. Optional `IdentityWizardProgress` projection:
```text
artistIdentityId
draftVersionId
currentStep
completedSteps[]
deferredSteps[]
startedAt
updatedAt
```
No identity knowledge should exist only inside wizard state.

## 10. Main happy-path workflow
1. Create/resume DRAFT Identity Version.
2. Archetype Discovery produces candidates; user confirms or defers.
3. Listening Session captures artist associations.
4. Sensory Association candidates are reviewed.
5. User builds Moodboard; AI extracts patterns as candidates.
6. User confirms Visual DNA.
7. User defines Identity Narrative.
8. User defines Symbolic Anchors.
9. User sets Mystique/Interpretation policies.
10. User reviews Vertical Rules derived from confirmed Identity.
11. System presents final Identity Review with unresolved candidates/conflicts.
12. User approves version → REVIEW/ACTIVE per versioning workflow.
13. Brand Book can be compiled from structured data.

## 11. Alternative workflows
- Skip/defer Archetype while continuing with other evidence.
- Import existing brand references/moodboard.
- Create a new version from existing active identity, prefilled with current values.
- User stops after minimum context; content creation remains possible with limited identity context.

## 12. User actions
Start, resume, save, defer optional step, go back, accept/edit/reject candidate, mark step reviewed, request final review, activate approved version, exit without activation.

## 13. State model
```text
NOT_STARTED → IN_PROGRESS → READY_FOR_REVIEW → REVIEW → ACTIVE
                       ↘ PAUSED
REVIEW → IN_PROGRESS (changes requested)
```
Underlying version statuses remain DRAFT/REVIEW/ACTIVE/ARCHIVED.

## 14. Business rules
- **IDN-WIZ-001** — Wizard MUST operate on a specific draft Identity Version.
- **IDN-WIZ-002** — Each step MUST write to its authoritative structured entity, not opaque wizard JSON.
- **IDN-WIZ-003** — AI output MUST enter as candidate/suggestion until human confirmation when the source concept requires confirmation.
- **IDN-WIZ-004** — User MUST be able to pause and resume without losing confirmed or draft work.
- **IDN-WIZ-005** — Wizard MUST NOT require completion of all optional subfields to allow exit/use of Artist OS.
- **IDN-WIZ-006** — Final activation MUST require an explicit review/approval action.
- **IDN-WIZ-007** — Returning to an earlier step MUST not silently erase downstream confirmed data; conflicts are flagged for re-review.
- **IDN-WIZ-008** — Significant changes after downstream steps MAY invalidate/reopen dependent step review status.
- **IDN-WIZ-009** — Existing active Identity remains active until the draft version is explicitly activated.
- **IDN-WIZ-010** — Existing historical content remains linked to its original Identity Version.
- **IDN-WIZ-011** — Archetype is optional creative framing and cannot block identity completion solely because no archetype is chosen.
- **IDN-WIZ-012** — Moodboard AI patterns MUST show supporting source items.
- **IDN-WIZ-013** — Protected/private narrative content MUST be marked before external Brand Book generation.
- **IDN-WIZ-014** — Wizard MUST present unresolved constraint conflicts before final approval.
- **IDN-WIZ-015** — The system MUST distinguish `deferred`, `not applicable`, `incomplete`, and `complete` where meaningful.
- **IDN-WIZ-016** — No identity quality score may gate approval.
- **IDN-WIZ-017** — Wizard may suggest next step but MUST preserve creative exceptions and user-directed order when dependencies allow.
- **IDN-WIZ-018** — Failure of an AI analysis job MUST not corrupt or roll back manually saved identity data.

## 15. AI behavior
AI supports candidate extraction, pattern analysis, summarization and draft formulation. Context includes current draft version, artist statements and relevant source assets. Every output needs source references/confidence where inference occurs. Forbidden: psychological diagnosis, automatic activation, invented memories/story, unsupported causal symbolism.

## 16. Human approval
Candidate acceptance and final Identity Version activation are human-controlled. AI may mark fields “ready for review,” not approve them.

## 17. Validation
Version exists/draft; required source references exist; step writes are consistent; unresolved hard conflicts block final activation only when they violate non-negotiable constraints or schema integrity.

## 18. UI states
First use, in progress, paused, step complete, deferred, AI analyzing, AI failed, review ready, conflict, active.

## 19. Edge cases
- User changes primary archetype late: flag downstream narrative/visual suggestions for review, don't reset.
- Delete Moodboard item supporting a pattern: pattern evidence count updates; confirmed pattern remains but gets evidence warning if support disappears.
- Draft version abandoned: retain as DRAFT/archivable.

## 20. Cross-module effects
Activation rebuilds Identity Capsule and affects future Strategy/Production/Guard. Brand Book generation follows activation or explicit draft preview mode.

## 21. Notifications and attention model
Only meaningful blockers/conflicts and review-ready state surface. Incomplete optional steps are not urgent alerts.

## 22. Search / filtering / sorting / bulk actions
Candidate-review steps may bulk accept/reject only when each item remains individually inspectable; no bulk activation.

## 23. Analytics and product telemetry
Time per step, completion/defer rate, AI candidate acceptance/edit/reject reasons, backtracking, time to activation.

## 24. Learning feedback
Wizard evidence becomes Identity knowledge/artist statements, not performance Learning.

## 25. Auditability / provenance
Every accepted candidate records source, actor, timestamp, and prior value where changed.

## 26. Desktop / mobile behavior
Desktop primary for Moodboard/Visual DNA. Mobile supports listening/voice capture, candidate review and simple fields.

## 27. Accessibility / usability
Resume state clear; no long unbroken form; keyboard navigation; optional steps labeled; progress not framed as gamified “identity score.”

## 28. Security / privacy / rights
Internal canon protected; external references retain rights status; external Brand Book mode excludes protected facts.

## 29. Performance / async jobs
Transcription, Moodboard analysis and Brand Book compilation use jobs. Step UI saves independently and can continue where dependencies allow.

## 30. Acceptance criteria
1. Wizard creates/resumes a draft version.
2. AI candidates never become confirmed identity silently.
3. User can pause/resume.
4. Active identity remains unchanged during draft work.
5. Changing upstream data flags dependencies instead of destructive reset.
6. Final activation is explicit.
7. AI job failure preserves manual work.

## 31. Test matrix
Unit: progress/dependency invalidation. Integration: step entities/version. Agent eval: grounded candidate extraction. E2E: blank → full Identity Version → Brand Book; active v1 → draft v1.1 → activate.

## 32. Open questions
Exact required vs optional step matrix for initial activation should be decided after UX prototyping; MASTER gives sequence but not mandatory completeness thresholds.

## 33. Traceability
`IDN-WIZ-001–018` → MASTER 20, 53–92, 404, 450.
