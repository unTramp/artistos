# Release Momentum Windows

- **Status:** REVIEW COMPLETE
- **MASTER references:** §231–237, §288–299, §319, §401
- **Domain:** 05_campaigns_releases
- **Feature slug:** `momentum-windows`
- **Requirement prefix:** `CMP-MOM`

## 2. Purpose
Give phase-aware context before and after release so actions and analysis reflect time since release without turning arbitrary windows into deterministic algorithm rules.

## 3. User problem / job-to-be-done
Artists need different actions on pre-release, launch week and catalog periods. They also need protection from myths such as “if day one failed, the song is dead.”

## 4. Scope
MASTER windows: `PRE_RELEASE`, `DAY_0`, `DAY_1_7`, `DAY_8_30`, `DAY_31_90`, `CATALOG`; phase-aware recommendations, summaries and comparison context.

## 5. Entry points
Release detail, Campaign, Overview, Analytics, Weekly Review.

## 6. Preconditions and dependencies
Known or inferred release date required for automatic window; user may correct it.

## 7. Information architecture
Current window → objective/context → active actions → metrics available → observations → uncertainty → next transition.

## 8. User roles and permissions
User can correct release date/window assumptions and choose actions.

## 9. Core data model
Momentum window can be computed from release date, not necessarily persisted as mutable entity. Historical metrics stay timestamped independently.

## 10. Main happy-path workflow
Release date establishes window → UI changes phase framing → relevant activation/readiness/metrics surface → user reviews outcome → window advances automatically by date → catalog retains history.

## 11. Alternative workflows
Unknown date, postponed release, regional dates, historical release import, catalog song reactivated by new campaign/extension.

## 12. User actions
View window context, change/correct date, start phase-specific review, create action/experiment, compare windows.

## 13. State model
Fixed MASTER labels; window is contextual classification, not release status.

## 14. Business rules
- `CMP-MOM-001` Momentum Window MUST be separate from Release status.
- `CMP-MOM-002` Window assignment SHOULD derive from canonical release date and current/reference date.
- `CMP-MOM-003` System MUST preserve all historical metrics across window transitions.
- `CMP-MOM-004` System MUST NOT state that DAY_0 or first 24 hours determine release fate.
- `CMP-MOM-005` Recommendations MAY vary by window but MUST remain evidence/goal/identity aware.
- `CMP-MOM-006` PRE_RELEASE actions MUST not assume pre-save or specific DSP tool is universally available.
- `CMP-MOM-007` DAY_1_7 analysis MUST distinguish early signal from validated learning.
- `CMP-MOM-008` DAY_8_30 and DAY_31_90 MUST support continued testing/evergreen work, not only decline monitoring.
- `CMP-MOM-009` CATALOG MUST support reactivation campaigns, extensions and new market/content opportunities.
- `CMP-MOM-010` Comparing windows MUST account for metric availability/snapshot timing.
- `CMP-MOM-011` A date correction MUST recompute window classification without rewriting metric timestamps.
- `CMP-MOM-012` Regional platform delays MAY be noted without fragmenting canonical artist release date unless product later supports regional release entities.
- `CMP-MOM-013` AI MUST frame observations with sample size/confidence where metrics are involved.
- `CMP-MOM-014` User may intentionally continue launch-style activity into later window; windows guide context, not hard-limit behavior.

## 15. AI behavior
Generate phase-aware recommendations and reviews based on actual available evidence; avoid generic countdown hype and deterministic algorithm claims.

## 16. Human approval
Any action creation/publication remains user-controlled; window transition itself can be automatic/date-derived.

## 17. Validation
Date required for deterministic window; otherwise state `UNKNOWN/TBD` outside MASTER enum as UI condition, not persisted momentum type.

## 18. UI states
Pre-release, launch day, first week, first month, 31–90, catalog, date unknown, historical import.

## 19. Edge cases
Timezone; release at midnight local vs platform; postponed on day zero; backfilled release; re-release.

## 20. Cross-module effects
Overview focus, Campaign, LaunchActivation, Analytics comparison, Calendar and Weekly Review.

## 21. Notifications and attention model
Window transition itself need not notify; only associated actionable deadlines/reviews.

## 22. Search / filtering / sorting / bulk actions
Analytics/release lists may filter by current window. No bulk mutation because window is derived.

## 23. Analytics and product telemetry
Track use of window reviews and recommendation acceptance, not “performance score by window” as product success.

## 24. Learning feedback
Window-scoped insights preserve time context; later catalog evidence may contradict early observations without deleting them.

## 25. Auditability / provenance
Release date changes explain reclassification. Analysis stores observation date and source snapshots.

## 26. Desktop / mobile behavior
Both show current phase; desktop offers deeper comparisons.

## 27. Accessibility / usability
Always show concrete dates alongside labels such as DAY_8_30.

## 28. Security / privacy / rights
No special additional constraints.

## 29. Performance / async jobs
Window calculation synchronous/local; analytics refresh async.

## 30. Acceptance criteria
- `CMP-MOM-AC01` Window derives correctly from release date.
- `CMP-MOM-AC02` Date correction reclassifies phase without altering historical metrics.
- `CMP-MOM-AC03` Catalog releases remain actionable in OS.
- `CMP-MOM-AC04` Early-window language never presents deterministic fate claims.
- `CMP-MOM-AC05` Phase review labels observation vs hypothesis vs learning correctly.
- `CMP-MOM-AC06` Unknown date produces explicit unknown state.

## 31. Test matrix
Boundary dates, timezone, postponement, historical import, catalog reactivation, missing metrics, regional discrepancy.

## 32. Open questions
Canonical day-boundary/timezone policy for release date calculations requires engineering decision.

## 33. Traceability
MASTER §231 Release Momentum Windows, §232 no 24-hour destiny rule, §287–315 analytics/learning principles.
