# Identity Versioning & Review

## 1. Metadata
- **Spec ID:** `IDN-VERS`
- **Domain:** `02_identity`
- **Feature:** Identity Versioning & Review
- **Status:** REVIEW
- **MASTER references:** 54–57, 86, 88, 314–315, 321, 388–390, 404, 415
- **Depends on:** all Identity subcomponents, Decision Memory, analytics/identity hypotheses
- **Used by:** entire Artist OS

## 2. Purpose
Preserve stable identity history, support deliberate evolution and prevent short-term analytics noise from silently rewriting the artist’s creative system.

## 3. User problem / job-to-be-done
**JTBD:** “Let my identity evolve intentionally over time while keeping a reliable history of what was active, why it changed, and which work used which version.”

## 4. Scope
Version lifecycle, semantic major/minor intent, compare/diff, activation, archival, review cadence, Identity Hypothesis path, historical references.

Out: automatic rebrand, git-like arbitrary merge complexity, team approvals beyond single-user MVP.

## 5. Entry points
Identity Home history/review, Wizard new version, Identity Hypothesis review, event-driven attention.

## 6. Preconditions and dependencies
ArtistIdentity root. Initial Identity Wizard creates first draft version.

## 7. Information architecture
```text
Current Active Version
Draft / Review Version
Version History
Compare Versions
Identity Review
Evidence / Hypotheses
Decision rationale
Activate / Archive
```

## 8. User roles and permissions
Single artist is approver. Future roles may separate editor/approver but cannot remove explicit human approval requirement.

## 9. Core data model
MASTER:
```text
ArtistIdentity { id, artistId, activeVersionId, status, createdAt, updatedAt }
ArtistIdentityVersion { id, artistIdentityId, version, name, status, createdAt, approvedAt? }
status = DRAFT | REVIEW | ACTIVE | ARCHIVED
```
Version-specific component relationships are required in detailed DB design.

## 10. Main happy-path workflow
1. Active v1.0 exists.
2. User creates draft from active version.
3. Edits Identity components with tracked diff.
4. System classifies/suggests minor vs major based on nature of change, but user/review decides.
5. Draft moves to REVIEW.
6. Review shows changes, rationale, evidence/hypotheses and downstream impact.
7. User approves and activates v1.1 or v2.0.
8. Previous ACTIVE becomes ARCHIVED/historical according to transactional rule.
9. Context caches regenerate; future work uses new version; old work retains old version IDs.

## 11. Alternative workflows
Draft abandoned/archived; review requests changes → DRAFT; emergency correction still follows versioning; event-driven review with no change leaves active version unchanged.

## 12. User actions
Create draft from active, rename draft, compare, add decision rationale, request review, return to draft, activate, archive non-active draft/history, start Identity Review from hypothesis.

## 13. State model
```text
DRAFT → REVIEW → ACTIVE → ARCHIVED
REVIEW → DRAFT
DRAFT → ARCHIVED
```
Only one ACTIVE per ArtistIdentity under v1 policy. ACTIVE cannot return to DRAFT; changes create a new version.

## 14. Business rules
- **IDN-VERS-001** — Identity Versions MUST use `DRAFT | REVIEW | ACTIVE | ARCHIVED` lifecycle.
- **IDN-VERS-002** — Only one version SHOULD be ACTIVE per ArtistIdentity in v1.3.
- **IDN-VERS-003** — Activating a version MUST be explicit human action.
- **IDN-VERS-004** — ACTIVE version MUST NOT be edited in place for material identity changes; create a new draft version.
- **IDN-VERS-005** — Minor refinements may use `1.0 → 1.1`; substantial rebrand/creative reset uses major `2.0` semantics as defined by MASTER.
- **IDN-VERS-006** — Semantic version suggestion MUST be explainable and MUST NOT be an automatic hidden judgment.
- **IDN-VERS-007** — Historical Content Units and other linked entities MUST keep their original `identityVersionId`.
- **IDN-VERS-008** — Activation MUST NOT retroactively re-run or mutate past content/metrics.
- **IDN-VERS-009** — Performance Signal → Insight → Identity Hypothesis → Repeated Tests → Evidence → Human Review → Era Evolution / Identity Update is the required analytics-driven change path.
- **IDN-VERS-010** — A single successful/failed post MUST NOT trigger identity change.
- **IDN-VERS-011** — Identity evidence threshold MUST be stronger than tactical content learning threshold.
- **IDN-VERS-012** — Identity Review SHOULD occur monthly/quarterly or event-driven, not as weekly automatic rebranding.
- **IDN-VERS-013** — Review MAY result in `no change`, Era evolution, minor version or major version.
- **IDN-VERS-014** — Archiving an old version MUST preserve exportability and historical references.
- **IDN-VERS-015** — Knowledge export MUST include Identity versions and critical metadata.
- **IDN-VERS-016** — Activation must write an audit event with old/new active version and approver.
- **IDN-VERS-017** — Draft/Review changes MAY invalidate generated Brand Book/context caches, but cannot affect active production unless explicitly using the draft.
- **IDN-VERS-018** — Intentional creative exceptions SHOULD use deviations rather than unnecessary new versions when core identity is unchanged.
- **IDN-VERS-019** — Era evolution SHOULD be preferred over major rebrand when the change is chapter-specific and base identity remains coherent.
- **IDN-VERS-020** — System MUST never automatically change archetype, protected narrative or non-negotiable constraints from engagement data.
- **IDN-VERS-021** — Activation transaction MUST prevent two active versions due to concurrency/race.
- **IDN-VERS-022** — Archived version remains readable and usable for historical Guard/comparison context.

## 15. AI behavior
Can summarize diff, classify likely minor/major with rationale, synthesize evidence/hypotheses and identify downstream impact. Cannot activate, rebrand or decide fitness/identity truth.

## 16. Human approval
Version activation and protected/non-negotiable changes require human approval.

## 17. Validation
Version string/order valid; one active; component refs belong to version; active transition atomic; approvedAt set; old active handled transactionally.

## 18. UI states
No version, draft, review, active, active+draft, review due, archived history, activation conflict.

## 19. Edge cases
Concurrent activation attempts; imported legacy identity with no semantic version; draft based on non-current historical version; Era tied to previous version. UI must show basis clearly.

## 20. Cross-module effects
Activation updates ArtistIdentity.activeVersionId, invalidates Identity Capsule/Brand Book currentness, changes future default context. Emits `IdentityVersionActivated`.

## 21. Notifications and attention model
Review due only on configured cadence/event/evidence; draft existence alone is not urgent. Conflicting blocking identity hypotheses may appear in review, not as auto-change.

## 22. Search / filtering / sorting / bulk actions
Version history chronological/semantic; no bulk activation/archive of historical versions without explicit admin recovery scope.

## 23. Analytics and product telemetry
Time between versions, review outcome, activation frequency, hypothesis→change conversion, guard override rate before/after (descriptive, not causal by default).

## 24. Learning feedback
Identity change decisions reference validated/relevant evidence and Decision entity where appropriate.

## 25. Auditability / provenance
Full diff, actor, approval, evidence IDs, decision rationale, old/new version, generated artifacts affected.

## 26. Desktop / mobile behavior
Desktop compare/review primary; mobile can review summary and approve only if sufficient diff/context is accessible.

## 27. Accessibility / usability
Diff accessible beyond color, clear destructive consequences, confirmation names versions explicitly.

## 28. Security / privacy / rights
Exports respect protected data; audit logs do not leak private narrative unnecessarily.

## 29. Performance / async jobs
Activation transaction synchronous; context/Brand Book regeneration asynchronous after commit. Failure of downstream jobs does not roll back valid activation but surfaces degraded follow-up.

## 30. Acceptance criteria
1. Only one active version after concurrent-safe activation.
2. Active material identity cannot be edited in place.
3. Old content keeps old version link.
4. Single post cannot auto-trigger version change.
5. Review can end with no change/Era/minor/major.
6. Activation audit records rationale/actor.
7. Context cache refresh failure does not corrupt version state.

## 31. Test matrix
Unit: transitions/version semantics. Integration: activation transaction/cache invalidation. E2E: v1 active→v1.1 draft→review→active; hypothesis→Era instead of rebrand. Concurrency test: double activation.

## 32. Open questions
Whether version labels are user-editable or system-suggested with confirmation; recommended: system proposes semantic next version, user confirms during review.

## 33. Traceability
`IDN-VERS-001–022` → MASTER 54–57, 314–315, 321, 388–390, 404, 415.
