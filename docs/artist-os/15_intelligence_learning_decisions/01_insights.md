# Insights

- **Status:** REVIEW COMPLETE
- **MASTER references:** §301–302, §22, §287–315
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `insights`
- **Requirement prefix:** `INT-INS`

## 2. Purpose
Capture bounded, evidence-linked statements about what appears to have happened, without turning observations into universal truth.

## 3. User problem / job-to-be-done
Artists need conclusions that are more useful than raw metrics but less overconfident than “this always works.” Insight is the disciplined bridge.

## 4. Scope
### In scope
- Insight entity
- scope/evidence/sample/confidence/status
- wording discipline
- evidence links
- contradictions

### Out of scope / non-goals
- automatic validated rule
- causal conclusion without evidence

## 5. Entry points
- Analytics handoff
- Weekly Review
- Song/Campaign/Market/Business views

## 6. Preconditions and dependencies
- structured evidence
- MetricSnapshots/decisions/research where relevant

## 7. Information architecture
Select evidence → draft bounded statement → set scope/sample/confidence → review wording/alternatives → save Insight → optionally create Hypothesis.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `Insight {statement, scope, evidence, sampleSize, confidence, createdAt, status}`. Status enum not defined.

## 10. Main happy-path workflow
1. create from selected evidence
2. edit statement/scope
3. open evidence
4. mark contradicted/archived when implementation supports
5. create hypothesis

## 11. Alternative workflows
- qualitative observation only
- mixed contradictory evidence
- small sample
- research vs own-data evidence

## 12. User actions
- create
- edit
- link evidence
- create hypothesis
- review stale/conflicting

## 13. State model
Lifecycle needs draft/active/superseded-ish semantics; final enum open. Insight itself is not VALIDATED Learning.

## 14. Business rules
- `INT-INS-001` Insight statement MUST be bounded by actual evidence and scope.
- `INT-INS-002` Wording SHOULD include sample/context when material, e.g. “among last 8…” rather than “best format”.
- `INT-INS-003` Insight MUST link evidence sufficient to inspect the claim basis.
- `INT-INS-004` Confidence MUST not hide contradictions/sample limitations.
- `INT-INS-005` Correlation MUST not be phrased as causation without design/evidence.
- `INT-INS-006` One outlier MUST not by itself justify a broad Insight.
- `INT-INS-007` Insight MAY be created manually or proposed by AI, but human review is required before strategic use.
- `INT-INS-008` Insight MUST remain distinct from Hypothesis and Learning.
- `INT-INS-009` Contradictory new evidence SHOULD trigger review rather than silent deletion.
- `INT-INS-010` AI MUST output insufficient evidence when no bounded claim is supportable.

## 15. AI behavior
Analytics Agent proposes structured Insight with evidence IDs, sample size, confidence rationale and alternative explanations. It cannot invent evidence.

## 16. Human approval
Human reviews/promotes proposed Insight and decides whether it warrants a Hypothesis.

## 17. Validation
- statement/evidence nonempty
- scope valid
- sample reconciles with evidence where measurable

## 18. UI states
- proposed
- active
- conflicted
- stale/superseded if schema chooses

## 19. Edge cases
- evidence corrected
- outlier removed as invalid
- same metric definition changes

## 20. Cross-module effects
- Hypotheses
- Weekly Review
- Decision Memory
- Learning

## 21. Notifications and attention model
- active Insight contradicted
- Insight old/stale

## 22. Search / filtering / sorting / bulk actions
Filter scope/confidence/status/evidence type/date.

## 23. Analytics and product telemetry
- Insight proposed/approved/edited
- evidence opened
- hypothesis created

## 24. Learning feedback
Insight is the first explicit interpretation step; no rule promotion without further testing/evidence.

## 25. Auditability / provenance
Store evidence IDs, analysis/config version, author/AI run, edits and confidence rationale.

## 26. Desktop / mobile behavior
Desktop authoring/review; mobile read/approve concise insight.

## 27. Accessibility / usability
Statement and evidence visible together.

## 28. Security / privacy / rights
May contain private business/identity evidence; respect scope/access.

## 29. Performance / async jobs
AI proposal can be async; manual creation synchronous.

## 30. Acceptance criteria
- `INT-INS-AC01` Insight cannot exist as unsupported broad claim.
- `INT-INS-AC02` Correlation language remains qualified.
- `INT-INS-AC03` Insight is not Learning.
- `INT-INS-AC04` Contradiction triggers review.

## 31. Test matrix
- small sample
- outlier
- contradictory evidence
- qualitative evidence

## 32. Open questions
- Insight status enum/confidence scale exact values need schema alignment; MASTER only defines fields.

## 33. Traceability
MASTER §301–302, §22, §287–315
