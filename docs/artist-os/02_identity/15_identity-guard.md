# Identity Guard

## 1. Metadata
- **Spec ID:** `IDN-GUARD`
- **Domain:** `02_identity`
- **Feature:** Brand / Identity Guard
- **Status:** REVIEW
- **MASTER references:** 24–25, 89, 117, 145, 225, 278, 329–330, 336, 398–399, 410, 415
- **Depends on:** Identity Capsule, constraints, Era, vertical rules, Mystique, rights signals, Content/Production inputs
- **Used by:** Content Factory, Production, DSP profile assets, Website, Merch, Brand Book QA

## 2. Purpose
Provide explainable checks for identity alignment, tone/clichés/repetition, mystique and relevant rights warnings without reducing creative quality to a fake score or acting as an autonomous censor.

## 3. User problem / job-to-be-done
**JTBD:** “Before I publish or produce something, tell me where it conflicts with the identity I chose, why, and whether it is a hard issue or an intentional creative choice.”

## 4. Scope
Alignment result, violations/warnings, constraint priority, mystique leakage, Era/vertical consistency, anti-AI style/tone, intentional deviation handling, relevant rights warning links.

Out: guaranteed performance prediction; automatic rebrand; legal advice; automatic publish blocking beyond explicit hard policies.

## 5. Entry points
Content Angle/Execution review, Content Unit, Production package, publication/profile asset preview, Website/Brand Book generation.

## 6. Preconditions and dependencies
Identity Version; preferably active/referenced version. Guard can run in limited mode if components missing and must disclose coverage gaps.

## 7. Information architecture
```text
Guard result: ALIGNED | PARTIALLY_ALIGNED | OUTSIDE_IDENTITY
├─ Hard conflicts
├─ Soft tensions
├─ Mystique / disclosure
├─ Era / vertical fit
├─ Tone / anti-AI style
├─ Repetition / novelty context
├─ Rights warnings (linked)
└─ Actions: Edit | Approve Deviation | Keep As Is (if allowed)
```

## 8. User roles and permissions
Guard advises/checks; human chooses edit/deviation. It cannot publish/delete/change Identity.

## 9. Core data model
Suggested result projection:
```text
IdentityGuardResult
subjectType
subjectId
identityVersionId
eraIdentityId?
vertical?
result
findings[] { category, severity, constraintId?, explanation, sourceRefs[], suggestedFix? }
coverageGaps[]
configurationVersion
createdAt
```

## 10. Main happy-path workflow
1. Source workflow requests guard check with subject/context.
2. Context Assembler provides confirmed Identity Capsule + relevant vertical/Era/constraints/Mystique.
3. Deterministic rules evaluate explicit constraints/disclosure where possible.
4. AI evaluates qualitative tone/visual/narrative alignment using structured schema.
5. Guard combines findings without numeric fake score.
6. User edits, accepts soft variance, or creates approved IdentityDeviation for material intentional conflict.
7. Re-run check or proceed under source workflow rules.

## 11. Alternative workflows
Identity incomplete → limited coverage; AI unavailable → deterministic checks only; intentional experiment already has approved deviation → finding is contextualized/suppressed appropriately.

## 12. User actions
Run/re-run, inspect evidence, apply suggested edit manually, dismiss false positive with feedback, request/approve deviation, open Identity source rule.

## 13. State model
Guard run: `QUEUED | CHECKING | DONE | FAILED`. Result enum fixed by MASTER. Findings may be `OPEN | ACKNOWLEDGED | RESOLVED | DEVIATED` as UI projection.

## 14. Business rules
- **IDN-GUARD-001** — Guard output MUST use `ALIGNED | PARTIALLY_ALIGNED | OUTSIDE_IDENTITY` and explanations, not an unsupported numeric identity score.
- **IDN-GUARD-002** — Guard MUST evaluate against the Identity Version actually referenced by the subject/context, not always the latest version.
- **IDN-GUARD-003** — Active/relevant Era and Vertical Rules MUST be applied with explicit precedence.
- **IDN-GUARD-004** — Hard versus soft findings MUST reflect constraint priority.
- **IDN-GUARD-005** — Guard MUST distinguish identity repetition from execution repetition/fatigue.
- **IDN-GUARD-006** — Stable Symbolic Anchors MUST not be penalized merely for recurrence.
- **IDN-GUARD-007** — Mystique/protected-fact leakage MUST be flagged when output would violate policy.
- **IDN-GUARD-008** — Anti-AI style checks MUST identify generic clichés/corporate promo/repetitive patterns using Artist tone context where available.
- **IDN-GUARD-009** — Guard MUST support intentional deviations and MUST NOT force identity conformity when an approved deviation exists.
- **IDN-GUARD-010** — Guard cannot activate/change Identity, publish, delete or spend.
- **IDN-GUARD-011** — Rights warnings may be included, but rights source domain remains authoritative.
- **IDN-GUARD-012** — Missing Identity context MUST produce coverage gaps/limited confidence rather than fabricated alignment certainty.
- **IDN-GUARD-013** — A finding MUST state what rule/evidence it is based on where possible.
- **IDN-GUARD-014** — AI failure MUST not erase deterministic findings or block manual workflow automatically unless source hard rule independently blocks it.
- **IDN-GUARD-015** — User false-positive feedback MUST be logged for eval/config improvement, not silently rewrite Identity.
- **IDN-GUARD-016** — Guard MUST respect protected information and avoid repeating sensitive content unnecessarily in findings/logs.
- **IDN-GUARD-017** — Performance optimization must not be used by Guard to override Identity constraints.
- **IDN-GUARD-018** — Guard may suggest alternatives but must preserve the artist's right to intentionally make a less optimized creative choice.
- **IDN-GUARD-019** — Approved deviation should be recognized on subsequent runs for the same subject/version.
- **IDN-GUARD-020** — Guard configuration/prompt version MUST be recorded for audit/evals.

## 15. AI behavior
Structured output only. Inputs: HardRules, IdentityCapsule, relevant constraints, Era, vertical, Mystique, selected style examples, subject. Output findings with category/severity/ruleRefs/explanation/suggestedFix/uncertainty. Forbidden: score invention, missing facts, identity mutation, performance prediction.

## 16. Human approval
Guard does not approve its own deviations. Human decides exception/changes. Source feature enforces publication approval.

## 17. Validation
Subject exists; version refs valid; configuration stable; protected context handled; result enum valid; no finding without category/explanation.

## 18. UI states
Not checked, checking, aligned, partial, outside, limited coverage, failed, deviation approved.

## 19. Edge cases
Old content re-evaluated under current Identity: must offer `historical version` versus `current identity comparison` modes, never confuse. Platform crop violates composition preference only: soft warning or platform-required deviation depending rule.

## 20. Cross-module effects
Can create deviation proposal/false-positive feedback; source workflows consume result. Does not own rights or content status.

## 21. Notifications and attention model
Only blocking unresolved finding on active workflow may surface. Guard findings do not become global alerts by default.

## 22. Search / filtering / sorting / bulk actions
History can filter result/category/version. Bulk guard runs may exist later; must preserve individual results.

## 23. Analytics and product telemetry
Run count/cost/latency, result distribution, override/deviation rate, false positives, suggested-fix acceptance, configuration regression.

## 24. Learning feedback
Guard feedback improves agent evals; repeated creative deviations may feed Identity Hypothesis with normal evidence rules.

## 25. Auditability / provenance
Store AgentRun/config, context source refs, result/findings, user override/deviation.

## 26. Desktop / mobile behavior
Desktop detailed findings; mobile concise pass/warning plus critical details/actions.

## 27. Accessibility / usability
No result solely color-coded; finding hierarchy text; explain terms; suggested fixes optional.

## 28. Security / privacy / rights
Minimize protected text in logs; external tool calls follow permission/context minimization.

## 29. Performance / async jobs
Fast deterministic pre-check; AI can run interactively or background depending subject size. Timeout/failure returns deterministic result + AI unavailable qualifier.

## 30. Acceptance criteria
1. No numeric score.
2. Correct historical Identity Version can be checked.
3. Approved deviation prevents repeated false hard-block behavior.
4. Protected fact leakage is flagged.
5. AI outage leaves deterministic checks available.
6. Missing context yields limited coverage, not certainty.
7. Guard cannot publish or edit Identity.

## 31. Test matrix
Unit: precedence/result aggregation. Integration: Content/Deviation/Mystique/Rights. Agent eval: aligned/generic/cliché/leakage/intentional deviation. E2E: content→guard→deviation→recheck.

## 32. Open questions
Severity taxonomy for individual findings can reuse attention-style categorical levels, but should be domain-specific enough to distinguish hard constraint vs stylistic tension.

## 33. Traceability
`IDN-GUARD-001–020` → MASTER 24–25, 89, 117, 145, 329–330, 336, 398–399, 410, 415.
