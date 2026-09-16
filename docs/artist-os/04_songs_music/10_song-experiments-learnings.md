# Song Experiments & Learnings

## 1. Metadata
- **Spec ID:** `SNG-LEARN`
- **Domain:** `04_songs_music`
- **Feature:** Song Experiments & Learnings
- **Status:** REVIEW
- **MASTER references:** 104, 109, 301–315, 316–321, 342–346, 406, 454–455
- **Depends on:** Song, Metrics/Analytics, Insight/Hypothesis/Experiment/Learning/Decision domains
- **Used by:** Song Brain, Context Assembler, Factory, Strategy, Weekly Review

## 2. Purpose
Give each Song a scoped evidence memory of what has been tested, what seems true, what remains uncertain and why future strategy should or should not reuse a tactic.

## 3. User problem / job-to-be-done
**JTBD:** “Remember what we have actually learned about this song so I do not keep guessing from one good post or repeating failed tests without context.”

## 4. Scope
Song-scoped views of Insights, Hypotheses, Experiments, Learnings, contradictions, freshness and Decisions.

Out: separate duplicate intelligence entities; auto-generalization to global artist rules.

## 5. Entry points
Song Brain → Experiments & Learnings, Analytics, Segment analytics, Weekly Review, Factory rationale.

## 6. Preconditions and dependencies
Song exists. Intelligence entities remain owned by shared Intelligence domain with `SONG`/`AUDIO_SEGMENT` or related scopes.

## 7. Information architecture
- Active experiments.
- Candidate/testing/validated/stale learnings.
- Open hypotheses.
- Recent Insights.
- Contradictions.
- Decisions and next retests.

## 8. User roles and permissions
Artist approves decisions/learning promotion according to shared rules. Analytics/Strategy agents propose only.

## 9. Core data model
Projection over shared `Insight`, `Hypothesis`, `Experiment`, `Learning`, `Decision` filtered by song/segment scope and evidence linkage.

## 10. Main happy-path workflow
1. Metrics create bounded observation/Insight.
2. User/Agent formulates testable hypothesis scoped to Song/Segment.
3. Experiment is designed with metric/min observations.
4. Content executions collect evidence.
5. Experiment resolves KEEP/RETEST/REJECT/INCONCLUSIVE.
6. Learning remains CANDIDATE/TESTING or becomes VALIDATED with explainable confidence.
7. Song Brain surfaces the Learning in future Context Packs.
8. Time/contradiction can move it to STALE/DEPRECATED through shared rules.

## 11. Alternative workflows
Observational learning without controlled experiment; contradictory platforms; sparse evidence; historical imported results; global Learning tested on this Song.

## 12. User actions
Open evidence, create hypothesis/experiment, approve decision, promote/retest/deprecate Learning, compare contradiction, ask why recommendation uses it.

## 13. State model
Uses MASTER shared states:
Learning `CANDIDATE | TESTING | VALIDATED | STALE | DEPRECATED`.
Experiment decision `KEEP | RETEST | REJECT | INCONCLUSIVE` plus Experiment status from shared domain.

## 14. Business rules
- **SNG-LEARN-001** — Song Experiments/Learnings MUST reuse shared Intelligence entities, not duplicate them locally.
- **SNG-LEARN-002** — Song-scoped evidence MUST retain `SONG` or narrower relevant scope.
- **SNG-LEARN-003** — AUDIO_SEGMENT learning MUST remain segment-scoped unless separately validated/generalized.
- **SNG-LEARN-004** — A Song Learning MUST NOT automatically become ARTIST_GLOBAL.
- **SNG-LEARN-005** — One successful post MUST NOT create a VALIDATED Learning by itself without adequate evidence path.
- **SNG-LEARN-006** — Observation/association MUST be distinguishable from causation.
- **SNG-LEARN-007** — Experiment design SHOULD isolate one important variable where possible.
- **SNG-LEARN-008** — Multi-factor creative tests MUST be labeled as such.
- **SNG-LEARN-009** — Learning confidence MUST expose sample size/confirmations/contradictions/freshness.
- **SNG-LEARN-010** — Old evidence MUST not be deleted solely because its weight decays.
- **SNG-LEARN-011** — Contradictory evidence MUST remain visible.
- **SNG-LEARN-012** — A Learning MAY be platform-specific even for one Song.
- **SNG-LEARN-013** — Factory/Strategy SHOULD prefer validated own-data Song Learnings over generic heuristics when scopes match.
- **SNG-LEARN-014** — Generic external advice MUST remain labeled heuristic/claim and not appear as personal Song Learning.
- **SNG-LEARN-015** — Recommendation using a Learning MUST expose why it applies to the current scope.
- **SNG-LEARN-016** — If current context differs materially from Learning scope, system MUST surface mismatch/uncertainty.
- **SNG-LEARN-017** — Learning about performance SHOULD NOT override artistic intent automatically.
- **SNG-LEARN-018** — Content/Segment fatigue can invalidate or stale previously useful Song Learnings.
- **SNG-LEARN-019** — Experiment result MUST preserve primary/secondary metric definitions and observation count.
- **SNG-LEARN-020** — INCONCLUSIVE result MUST remain a valid outcome and MUST NOT be forced into success/failure.
- **SNG-LEARN-021** — User can deliberately choose creative exception against a Learning; Decision Memory SHOULD record rationale when significant.
- **SNG-LEARN-022** — Song-level Decisions MUST link supporting evidence where available.
- **SNG-LEARN-023** — AI MUST NOT fabricate experiments/observations that were not recorded.
- **SNG-LEARN-024** — Song Brain MUST distinguish current actionable Learnings from stale/historical ones.

## 15. AI behavior
Analytics Agent proposes bounded Insights; Strategy Agent proposes hypotheses/tests and applies validated Learnings with scope checks. No fabricated evidence or automatic promotion.

## 16. Human approval
Required for significant Experiment setup, Learning promotion/deprecation and Decision acceptance according to shared domain policy.

## 17. Validation
Evidence references valid; song/segment scope; metric availability; experiment observations; stale/conflict handling.

## 18. UI states
No evidence, active tests, candidate learnings, validated, stale, contradictory, insufficient sample.

## 19. Edge cases
Same Segment works on one platform only; old campaign learning no longer applies; two experiments conflict; creative exception intentionally ignores result.

## 20. Cross-module effects
Context Assembler uses relevant current Learnings; Factory/Strategy explain recommendations; Weekly Review includes uncertainty/retests.

## 21. Notifications and attention model
Experiment result ready, Learning becoming stale/retest due, meaningful contradiction. Avoid noisy metric alerts.

## 22. Search / filtering / sorting / bulk actions
Filter state/scope/platform/segment/date/confidence. No bulk validation.

## 23. Analytics and product telemetry
Experiment completion, Learning promotion/retest, recommendation use/override, stale handling.

## 24. Learning feedback
This is the Song-scoped view of the learning loop itself.

## 25. Auditability / provenance
Evidence, agent proposal, human decision, state transitions, configuration/version.

## 26. Desktop / mobile behavior
Desktop full evidence/test management; mobile read/approve/simple review.

## 27. Accessibility / usability
Confidence explained textually; contradictions visible; no winner-only UI.

## 28. Security / privacy / rights
No special data beyond linked content; protected narrative evidence remains filtered.

## 29. Performance / async jobs
Analytics/Agent computation async; stored intelligence query fast.

## 30. Acceptance criteria
1. Song view reuses shared Intelligence entities.
2. Song Learning does not auto-globalize.
3. Inconclusive/contradictory evidence remains first-class.
4. Recommendations show scope match.
5. Old evidence retained through time decay.
6. Creative exception is allowed and auditable.

## 31. Test matrix
Unit: scope/state/time decay. Integration: Context/Factory. Agent eval: no fabricated evidence/generalization. E2E: metrics→Insight→Experiment→Learning→next Strategy.

## 32. Open questions
Cross-domain confidence computation and minimum-observation policy remain owned by Intelligence/Analytics specs, not Song domain.

## 33. Traceability
`SNG-LEARN-001–024` → MASTER 104, 109, 301–321, 342–346, 406, 454–455.
