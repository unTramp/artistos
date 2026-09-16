# Weekly Review

- **Status:** REVIEW COMPLETE
- **MASTER references:** §319–320, §301–318
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `weekly-review`
- **Requirement prefix:** `INT-WKR`

## 2. Purpose
Create a recurring evidence-grounded operating review that separates facts, observations, hypotheses and recommendations and converts the week into focused next actions.

## 3. User problem / job-to-be-done
Artists can collect data without learning from it. A weekly review should synthesize what happened and what remains uncertain without overreacting to short-term volatility.

## 4. Scope
### In scope
- MASTER review sections
- FACT/OBSERVATION/HYPOTHESIS/RECOMMENDATION labels
- experiments/fatigue/narrative/market/production next actions
- decision creation

### Out of scope / non-goals
- weekly identity rebrand
- automatic strategy execution

## 5. Entry points
- Overview
- Analytics
- Command palette
- scheduled job

## 6. Preconditions and dependencies
- Metrics/Insights/Experiments/Learnings/Planning/Narrative/Markets/Production

## 7. Information architecture
Run review → assemble structured week context → generate deterministic data summary + AI synthesis → user reviews labels/evidence → accept/edit next actions → create/update Insights/Hypotheses/Decisions/Planning items.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Review artifact/version may be persisted; schema not defined in MASTER. Content sections exactly reflect §319 and labels §320.

## 10. Main happy-path workflow
1. start review
2. open evidence
3. relabel/edit statement
4. accept/reject recommendation
5. create experiment/decision/task
6. finalize review

## 11. Alternative workflows
- week has little data
- release week with outlier
- AI unavailable
- data imports stale

## 12. User actions
- run
- refresh before finalize
- edit
- finalize
- reopen/addendum if implementation supports

## 13. State model
Draft → finalized review behavior likely; final schema open.

## 14. Business rules
- `INT-WKR-001` Weekly Review MUST include what happened/worked/underperformed/learned/uncertain plus fatigue, experiments, narrative coverage, market signals, next actions and production requirements where relevant.
- `INT-WKR-002` Each synthesized statement MUST be labelled FACT, OBSERVATION, HYPOTHESIS or RECOMMENDATION.
- `INT-WKR-003` FACT MUST be directly supported by structured evidence/source.
- `INT-WKR-004` OBSERVATION MUST not be phrased as causal rule.
- `INT-WKR-005` HYPOTHESIS remains testable/unproven.
- `INT-WKR-006` RECOMMENDATION MUST explain evidence/uncertainty and be user-editable/rejectable.
- `INT-WKR-007` Weekly Review MUST NOT auto-change Identity from weekly volatility.
- `INT-WKR-008` AI unavailability MUST not block deterministic metric/experiment summaries.
- `INT-WKR-009` Stale/missing data MUST be disclosed before conclusions.
- `INT-WKR-010` Accepted next actions SHOULD create references in owning modules rather than live only as prose.
- `INT-WKR-011` Finalized review SHOULD preserve evidence/context version used.

## 15. AI behavior
AI synthesis uses Context Assembler + structured metrics and must preserve epistemic labels. It cannot invent events or silently promote Learning/Decision.

## 16. Human approval
User finalizes review and approves created Decisions/Learnings/Identity-related actions.

## 17. Validation
- week/timezone explicit
- data freshness visible
- labels valid
- evidence links for facts

## 18. UI states
- cold week
- partial/stale data
- AI unavailable
- draft
- finalized

## 19. Edge cases
- late metric backfill
- viral outlier
- release spans timezone boundary
- week intentionally off

## 20. Cross-module effects
- Overview
- Planning
- Insights
- Experiments
- Decision Memory
- Production

## 21. Notifications and attention model
- weekly review due
- stale imports before review
- unresolved experiment

## 22. Search / filtering / sorting / bulk actions
Review history searchable by week/campaign/release. No bulk finalize without inspection.

## 23. Analytics and product telemetry
- review run
- statement accepted/edited
- recommendation rejected
- action created
- finalized

## 24. Learning feedback
Weekly review orchestrates the learning loop but does not itself validate rules.

## 25. Auditability / provenance
Preserve source snapshot IDs/config/AI run and user edits.

## 26. Desktop / mobile behavior
Desktop primary; mobile summary/review approvals.

## 27. Accessibility / usability
Labels visually/textually explicit. Each recommendation expandable to “why?”.

## 28. Security / privacy / rights
May include private strategy/business data; no public export by default.

## 29. Performance / async jobs
WEEKLY_REVIEW Job may precompute context/synthesis; UI remains usable without AI.

## 30. Acceptance criteria
- `INT-WKR-AC01` Every statement has epistemic label.
- `INT-WKR-AC02` AI outage still shows factual summary.
- `INT-WKR-AC03` Weekly volatility cannot auto-rebrand Identity.
- `INT-WKR-AC04` Accepted action links to owning module.

## 31. Test matrix
- low data
- viral week
- stale imports
- AI outage
- late backfill

## 32. Open questions
- Persisted WeeklyReview entity/version schema is not defined.

## 33. Traceability
MASTER §319–320, §301–318
