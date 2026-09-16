# Learnings

- **Status:** REVIEW COMPLETE
- **MASTER references:** §307–315, §28–35
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `learnings`
- **Requirement prefix:** `INT-LRN`

## 2. Purpose
Maintain scoped, confidence-rated knowledge distilled from repeated evidence/tests, with explicit lifecycle and freshness.

## 3. User problem / job-to-be-done
Artists need the system to remember what has actually been learned, but not freeze temporary platform behavior or one-off successes into permanent rules.

## 4. Scope
### In scope
- Learning states/scopes/confidence
- evidence/confirmations/contradictions
- freshness/time decay
- promotion/retest/deprecation
- context retrieval

### Out of scope / non-goals
- automatic universal truth
- identity changes from weak evidence

## 5. Entry points
- Experiment outcome
- Weekly Review
- Knowledge/Context Assembler
- Strategy

## 6. Preconditions and dependencies
- Experiments
- Insights
- evidence
- ResearchClaim only when appropriate

## 7. Information architecture
Candidate learning from evidence → set scope/confidence → review contradictions → TESTING → repeated support → human VALIDATED → time decay/retest → STALE/DEPRECATED as warranted.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER states CANDIDATE, TESTING, VALIDATED, STALE, DEPRECATED; scopes ARTIST_GLOBAL, PLATFORM, SONG, PILLAR, FORMAT, AUDIENCE, CAMPAIGN, AUDIO_SEGMENT, NARRATIVE, MARKET, BUSINESS, IDENTITY; confidence LOW/MEDIUM/HIGH.

## 10. Main happy-path workflow
1. create/promote candidate
2. link evidence
3. set scope/confidence
4. start retest
5. validate
6. mark stale/deprecate
7. open contradictions

## 11. Alternative workflows
- external heuristic candidate
- platform rule superseded
- identity learning
- contradictory new evidence

## 12. User actions
- promote
- demote/review
- retest
- deprecate
- supersede

## 13. State model
CANDIDATE → TESTING → VALIDATED; VALIDATED may become STALE; any may become DEPRECATED with rationale. Exact transition permissions should be enforced.

## 14. Business rules
- `INT-LRN-001` Learning state MUST use MASTER enum.
- `INT-LRN-002` Learning scope MUST use MASTER enum.
- `INT-LRN-003` Confidence MUST use LOW/MEDIUM/HIGH and expose evidence rationale.
- `INT-LRN-004` VALIDATED requires stronger evidence than a single observation/outlier.
- `INT-LRN-005` Identity-scoped Learning requires stronger threshold and explicit human approval.
- `INT-LRN-006` Platform-scoped learning MUST consider freshness/time decay.
- `INT-LRN-007` Old evidence MUST not be deleted solely because weight decays.
- `INT-LRN-008` Contradictions MUST remain visible and may lower confidence or trigger retest.
- `INT-LRN-009` STALE means revalidation needed, not “false”.
- `INT-LRN-010` DEPRECATED must preserve historical reason/evidence.
- `INT-LRN-011` Generic creator advice MUST not outrank own validated evidence except authoritative current hard constraints.
- `INT-LRN-012` AI MUST not autonomously promote to VALIDATED.
- `INT-LRN-013` Context Assembler SHOULD prioritize relevant validated own-data learning over heuristics.

## 15. AI behavior
AI can propose candidate learning, confidence rationale and stale/retest suggestions. It cannot validate identity/rules autonomously.

## 16. Human approval
VALIDATED promotion, identity changes and deprecation of important knowledge require human approval.

## 17. Validation
- scope valid
- evidence linked
- confidence rationale present
- state transition valid

## 18. UI states
- candidate
- testing
- validated
- stale
- deprecated
- contradicted

## 19. Edge cases
- old but still useful
- platform rule changes
- two experiments disagree
- identity exception

## 20. Cross-module effects
- Context Assembler
- Strategy
- Identity Review
- Decision Memory
- Knowledge

## 21. Notifications and attention model
- validated learning becomes stale
- contradiction appears
- identity learning awaiting review

## 22. Search / filtering / sorting / bulk actions
Filter state/scope/confidence/age/platform/song.

## 23. Analytics and product telemetry
- candidate created
- promoted
- confidence changed
- staled
- deprecated
- retest started

## 24. Learning feedback
This is the durable learning store itself; provenance and scope are essential.

## 25. Auditability / provenance
Preserve evidence IDs, experiment IDs, confirmation/contradiction history, author/approval and state transitions.

## 26. Desktop / mobile behavior
Desktop evidence/review; mobile read/approve simple transitions.

## 27. Accessibility / usability
Always show scope/confidence/age near statement to prevent overgeneralization.

## 28. Security / privacy / rights
May include private business/identity knowledge; access/export rules apply.

## 29. Performance / async jobs
Staleness evaluation can be scheduled job; retrieval fast from stored state.

## 30. Acceptance criteria
- `INT-LRN-AC01` Single viral post cannot yield VALIDATED.
- `INT-LRN-AC02` Identity learning needs explicit approval.
- `INT-LRN-AC03` Old evidence preserved when stale.
- `INT-LRN-AC04` Contradictions remain visible.
- `INT-LRN-AC05` Validated own evidence can outrank heuristics.

## 31. Test matrix
- single success
- contradiction
- platform stale
- identity scope
- retest

## 32. Open questions
- Exact evidence threshold is intentionally not universal; needs per-scope calibration/evals.

## 33. Traceability
MASTER §307–315, §28–35
