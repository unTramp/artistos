# Narrative Mix Plan & Coverage

## 1. Metadata
- **Spec ID:** `NAR-MIX`
- **Domain:** `03_narrative`
- **Feature:** Narrative Mix Plan & Coverage
- **Status:** REVIEW
- **MASTER references:** 94–96, 100–101, 151–159, 296, 319, 361, 405
- **Depends on:** Narrative Tracks, Content Units/Publications, selected period; optional Campaign/Era
- **Used by:** Narrative Home, Planning, Calendar, Weekly Review, Strategy Agent

## 2. Purpose
Let the artist intentionally plan and inspect the relative presence of Narrative Tracks over a period while preserving flexibility, spontaneous content and artistic exceptions.

## 3. User problem / job-to-be-done
**JTBD:** “Help me notice when my public story has become unintentionally one-dimensional, while letting me deliberately focus on one storyline when a release, life moment or creative phase calls for it.”

## 4. Scope
Target mix, actual mix, period/context, target-vs-actual comparison, coverage explanation and planning integration.

Out: mandatory quotas, auto-scheduling, Content Pillar mix, judgment of artistic quality.

## 5. Entry points
Narrative → Mix, Narrative Home, Calendar planning, Monthly planning, Weekly Review.

## 6. Preconditions and dependencies
At least one Narrative Track for target planning. Actual mix can be computed when narrative-tagged Content/Publication data exists.

## 7. Information architecture
- Period/context selector.
- Target mix editor.
- Actual coverage visualization + accessible table.
- Target vs actual deltas.
- Untagged content bucket.
- Explanation panel.
- Context notes (Campaign focus, planned exception, Era transition).

## 8. User roles and permissions
Artist sets/changes targets. Future strategy collaborator may propose targets; approval required.

## 9. Core data model
MASTER `NarrativeMixPlan`:
```text
period
trackTargets[]
actualMix[]
notes
```

Product derivation must preserve counts and denominator definition alongside percentages to avoid misleading coverage.

## 10. Main happy-path workflow
1. User selects planning period.
2. System shows active Tracks and any prior/current target plan.
3. User either leaves targets unset, sets custom target shares or applies an optional template.
4. System validates the chosen target configuration.
5. User adds context note if the period intentionally favors a Track.
6. Actual coverage is derived from qualifying narrative-tagged content/publications.
7. UI shows target vs actual, underlying counts and untagged share.
8. System may surface a gentle drift signal when meaningful.
9. User may adjust future Calendar/Content planning, keep current plan, or explicitly accept the deviation.

## 11. Alternative workflows
No target plan; partial targets; campaign-specific temporary plan; Era-transition plan; experimental Track excluded from target; insufficient execution count.

## 12. User actions
Create plan, set/unset target, apply optional template, edit note, change period, compare actual, mark deviation intentional, open Track/content, copy plan to next period as draft.

## 13. State model
`DRAFT | ACTIVE_PERIOD | CLOSED/HISTORICAL` may be implementation states if needed, but MASTER does not define them. A plan MUST remain historically immutable enough to reconstruct what target existed during a past period; later edits should version or audit changes.

## 14. Business rules
- **NAR-MIX-001** — Narrative Mix MUST be distinct from Content Pillar mix.
- **NAR-MIX-002** — Target mix MUST be optional.
- **NAR-MIX-003** — The product MUST NOT create equal/default target shares without user action or an explicitly selected template.
- **NAR-MIX-004** — The 50/30/20 model MAY be offered as an optional practitioner heuristic only.
- **NAR-MIX-005** — The system MUST NOT require exactly three Tracks to use a Mix Plan.
- **NAR-MIX-006** — Target share is a planning preference, not a hard quota.
- **NAR-MIX-007** — Deviation from target MUST NOT create an error or block publishing.
- **NAR-MIX-008** — User MUST be able to record an intentional deviation/context note.
- **NAR-MIX-009** — Actual mix MUST expose the denominator and underlying execution count.
- **NAR-MIX-010** — Missing/untagged Narrative assignments MUST be visible rather than silently excluded if exclusion materially changes interpretation.
- **NAR-MIX-011** — Actual mix computation MUST define whether it uses Content Units, Publications, or another unit and MUST remain consistent within a view.
- **NAR-MIX-012** — Platform-specific multiple Publications of one Content Unit MUST NOT accidentally multiply narrative representation unless the selected view explicitly uses publications.
- **NAR-MIX-013** — Historical target plans MUST remain reconstructable after target changes.
- **NAR-MIX-014** — Paused/Archived Track treatment MUST depend on whether it was active during the selected historical period, not only current status.
- **NAR-MIX-015** — Experimental Tracks MAY be included with explicit targets, left untargeted, or reported separately.
- **NAR-MIX-016** — Short-term campaign dominance SHOULD be contextualized before being flagged as problematic.
- **NAR-MIX-017** — Drift attention SHOULD require a meaningful window/sample rather than one or two executions.
- **NAR-MIX-018** — Mix Plan MUST preserve flexible/spontaneous content capacity and MUST NOT force 100% schedule filling.
- **NAR-MIX-019** — AI target suggestions MUST explain whether they come from artist intent, current campaign/era, historical mix or performance evidence.
- **NAR-MIX-020** — AI MUST NOT optimize target mix solely for reach/engagement if that conflicts with artist intent or Identity priorities.
- **NAR-MIX-021** — A high-performing Track MUST NOT automatically receive a larger target share.
- **NAR-MIX-022** — A low-performing Track MUST NOT automatically be suppressed if it is artistically important.
- **NAR-MIX-023** — Coverage charts MUST offer non-visual/tabular interpretation.
- **NAR-MIX-024** — Mix decisions that materially change strategy SHOULD be recordable in Decision Memory with rationale.

## 15. AI behavior
AI can suggest a draft mix based on artist goal, Narrative roles, Era/Campaign context, historical coverage, production capacity and evidence. Every suggestion must expose assumptions.

It must not present mathematically precise percentages as scientifically optimal unless backed by an actual model/evidence, which MASTER does not currently define.

## 16. Human approval
Target creation/change is human-approved. AI may draft only. Intentional deviation marking is user-controlled.

## 17. Validation
Period valid; referenced Tracks valid; share ranges valid; sum rules depend on whether all active Tracks are explicitly targeted. If the user chooses a complete mix, total must equal 100%. Partial targeting must be labeled partial rather than normalized silently.

## 18. UI states
No Tracks, no plan, draft plan, active plan/no data, partial actual data, meaningful drift, intentional deviation, historical.

## 19. Edge cases
One Track receives 100% during launch week; untagged spontaneous content; content linked to multiple Tracks; Campaign spans period boundary; actual publications differ greatly by platform.

## 20. Cross-module effects
Feeds Calendar/Strategy recommendations and Weekly Review. Does not schedule or publish automatically.

## 21. Notifications and attention model
Possible attention: sustained unexplained drift, large untagged share, missing narrative metadata preventing interpretation. No daily quota reminders.

## 22. Search / filtering / sorting / bulk actions
Period, Era, Campaign, platform/measurement unit. No bulk destructive action.

## 23. Analytics and product telemetry
Plan creation, template use, target edits, drift acknowledgment, navigation to planning, AI suggestion acceptance.

## 24. Learning feedback
Mix outcomes can generate hypotheses about narrative portfolio effects but must account for Track, format, Song, campaign and sample confounds.

## 25. Auditability / provenance
Target history, template source, context notes, AI suggestion provenance, intentional deviation record.

## 26. Desktop / mobile behavior
Desktop visual/editor. Mobile read summary + simple adjustment/acknowledgment; complex planning may open desktop/full view.

## 27. Accessibility / usability
Charts accompanied by values/counts; percentages never without denominator context; neutral language for drift.

## 28. Security / privacy / rights
No special rights beyond linked Narrative privacy constraints.

## 29. Performance / async jobs
Actual mix aggregation may be cached/async for large histories. Manual target edits immediate.

## 30. Acceptance criteria
1. User can operate with no target mix.
2. Optional 50/30/20 template is never treated as universal.
3. Actual mix exposes underlying counts/measurement unit.
4. Campaign-focused 100% period can be intentionally accepted.
5. Drift never blocks publishing.
6. Historical targets remain auditable.
7. AI does not silently convert performance into new target shares.

## 31. Test matrix
Unit: share validation/denominator rules. Integration: Content/Publications/Calendar. Agent eval: non-prescriptive mix suggestion. E2E: target → content → actual mix → weekly review.

## 32. Open questions
1. Primary actual-mix unit for default UX: Content Units vs published Content Units vs Publications. MASTER says `actualMix[]` but does not resolve denominator semantics.
2. Multi-Track Content Unit weighting if supported (full count vs primary track + secondary tags vs fractional); must be decided with schema model.

## 33. Traceability
`NAR-MIX-001–024` → MASTER 94–96, 100–101, 151–159, 296, 319, 361, 405.
