# Identity Constraints & Deviations

## 1. Metadata
- **Spec ID:** `IDN-CNST`
- **Domain:** `02_identity`
- **Feature:** Identity Constraints & Deviations
- **Status:** REVIEW
- **MASTER references:** 16–20, 87–89, 122–124, 132, 145, 314–315, 415
- **Depends on:** Identity Version, Era, Content Unit
- **Used by:** Guard, Strategy, Production, Content Factory, Context Assembler

## 2. Purpose
Express identity rules with explicit priority and allow intentional, auditable exceptions without either rigidly blocking creativity or silently eroding identity.

## 3. User problem / job-to-be-done
**JTBD:** “Let me say which parts of my identity are truly non-negotiable and which are preferences, while still allowing intentional experiments and creative exceptions.”

## 4. Scope
Constraint creation/edit, scope/priority/reason/source, conflict detection, Content Unit deviations, approval/reason/history.

Out: global platform technical rules; rights rules; automatic enforcement without explanation.

## 5. Entry points
Identity Home/Visual DNA/Vertical Rules, Guard warning, Content Unit review.

## 6. Preconditions and dependencies
Identity Version. Deviations additionally require Content Unit and relevant version.

## 7. Information architecture
Constraint list by priority/scope → detail/provenance → conflict view → deviation requests/history.

## 8. User roles and permissions
Artist defines/approves. AI may suggest constraint candidates but cannot create non-negotiable rules silently.

## 9. Core data model
MASTER:
```text
IdentityConstraint { type, scope, priority, rule, reason, source }
priority = NON_NEGOTIABLE | STRONG | PREFERRED | OPTIONAL | EXPERIMENTAL
IdentityDeviation {
 contentUnitId identityVersionId
 reason: EXPERIMENT | ERA_TRANSITION | CREATIVE_EXCEPTION | PLATFORM_REQUIREMENT
 notes approvedBy createdAt
}
```

## 10. Main happy-path workflow
1. User turns a confirmed identity decision into a constraint or creates manually.
2. Chooses scope and priority.
3. Adds reason/source.
4. Guard/Strategy/Production consumes constraint.
5. If planned content violates it, Guard explains conflict.
6. User edits content, changes constraint through versioning, or creates an approved deviation for that Content Unit.

## 11. Alternative workflows
Experimental preference; platform requirement deviation; Era transition; global rule replaced in new Identity Version.

## 12. User actions
Create/edit/retire constraint in draft version; change priority; inspect source; request/approve deviation; revoke planned deviation before publication where applicable.

## 13. State model
Constraint follows version; suggested product state `DRAFT | ACTIVE_IN_VERSION | RETIRED_IN_NEW_VERSION`. Deviation: `PROPOSED | APPROVED | REJECTED | SUPERSEDED` if persisted with workflow.

## 14. Business rules
- **IDN-CNST-001** — Every constraint MUST have an explicit priority from MASTER enum.
- **IDN-CNST-002** — NON_NEGOTIABLE constraints MUST require explicit human confirmation; AI cannot silently create them.
- **IDN-CNST-003** — Constraint MUST have scope and reason/source sufficient for explainability.
- **IDN-CNST-004** — PREFERRED/OPTIONAL/EXPERIMENTAL constraints MUST NOT be treated as hard blockers by Guard/Production.
- **IDN-CNST-005** — A Content Unit may intentionally deviate only through a traceable IdentityDeviation when the variance is material.
- **IDN-CNST-006** — Deviation MUST reference the Identity Version being deviated from.
- **IDN-CNST-007** — Deviation approval MUST NOT modify the underlying constraint.
- **IDN-CNST-008** — Deviation reason MUST use MASTER reason enum and may include notes.
- **IDN-CNST-009** — Platform requirement deviations MUST not be generalized into new Identity rules automatically.
- **IDN-CNST-010** — Repeated successful deviations MAY create an Identity Hypothesis but cannot auto-change Identity.
- **IDN-CNST-011** — Conflicting constraints MUST be surfaced rather than resolved silently by arbitrary priority if both claim equal scope/priority.
- **IDN-CNST-012** — More specific valid scope MAY override a broader lower-priority preference; precedence must be explainable.
- **IDN-CNST-013** — Historical deviations remain linked to historical content even if future Identity versions change.
- **IDN-CNST-014** — Constraint deletion from a new draft/version does not erase old-version history.
- **IDN-CNST-015** — AI recommendations MUST state which constraints are hard versus preferred.
- **IDN-CNST-016** — Creative exception is a supported product behavior, not an error state.
- **IDN-CNST-017** — Rights/safety/legal-like constraints must not be mislabeled as mere Identity preferences; those domains remain authoritative.
- **IDN-CNST-018** — The system MUST avoid using a single alignment score to decide constraint compliance.

## 15. AI behavior
Can propose candidates/conflicts and suggest ways to satisfy constraints. Must respect priority, cite source, and never autonomously approve deviation or edit identity.

## 16. Human approval
Non-negotiable/strong changes and all deviations that intentionally violate hard constraints require explicit approval.

## 17. Validation
Enum/scope valid; content/version relationship valid; approver recorded; no orphan deviation; conflicting duplicates flagged.

## 18. UI states
No constraints, draft, active, conflict, deviation proposed/approved/rejected.

## 19. Edge cases
Platform crop makes composition impossible → PLATFORM_REQUIREMENT deviation. Experimental new look violates preferred color only → may not need formal deviation if below materiality threshold; Guard explains soft variance.

## 20. Cross-module effects
Guard/Context/Strategy/Production consume priorities. Approved deviation changes assessment for that Content Unit only.

## 21. Notifications and attention model
Blocking unresolved non-negotiable conflict in active production/review can surface. Soft preferences do not create urgent alerts.

## 22. Search / filtering / sorting / bulk actions
Filter priority/scope/type/version; no bulk promotion to NON_NEGOTIABLE.

## 23. Analytics and product telemetry
Constraint triggers, override/deviation frequency, Guard false-positive/override reasons.

## 24. Learning feedback
Repeated deviations → candidate Identity hypothesis, with evidence/sample size; never automatic rule promotion.

## 25. Auditability / provenance
Rule/reason/source, priority changes, version, deviation approver/time/reason.

## 26. Desktop / mobile behavior
Desktop management; mobile approve/review deviation with concise context.

## 27. Accessibility / usability
Priority labels textual; warnings explain consequences; approval confirmation clear.

## 28. Security / privacy / rights
Constraint reasons may include private narrative; external outputs should include only necessary operational wording.

## 29. Performance / async jobs
Deterministic constraint retrieval fast; Guard AI analysis may async but basic rule checks synchronous where possible.

## 30. Acceptance criteria
1. Constraint has priority/scope/reason.
2. AI cannot create non-negotiable silently.
3. Approved deviation affects one Content Unit, not base Identity.
4. Repeated deviations do not auto-update identity.
5. Historical deviations persist.
6. Soft preferences are not hard blockers.

## 31. Test matrix
Unit: precedence/conflict/deviation. Integration: Guard/Content Unit. Agent eval: priority adherence. E2E: hard constraint→conflict→approved creative exception.

## 32. Open questions
Materiality threshold for requiring formal deviation versus simple soft Guard warning should be UX-defined by constraint priority/type, not a universal numerical score.

## 33. Traceability
`IDN-CNST-001–018` → MASTER 87–89, 122–124, 314–315, 415.
