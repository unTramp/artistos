# Asset Atomization

- **Status:** REVIEW COMPLETE
- **MASTER references:** §189–191, §127–146
- **Domain:** 09_assets_media_rights
- **Feature slug:** `atomization`
- **Requirement prefix:** `AST-ATM`

## 2. Purpose
Turn long-form/live/source assets into a structured set of possible derivative content opportunities without automatically generating/publishing everything.

## 3. User problem / job-to-be-done
A live performance, interview or studio session contains many usable moments. Artists often underuse source material because identifying derivatives manually is tedious, yet automatic clipping can create repetitive low-value spam.

## 4. Scope
Source analysis, derivative opportunity plan, target formats/platforms, candidate segments, effort/rights/identity checks, priority/status.

## 5. Entry points
Asset detail, Shoot summary, LiveSession, Content Factory, Evergreen Pool.

## 6. Preconditions and dependencies
Source Asset usable and rights allow intended transformations; transcript/audio analysis optional.

## 7. Information architecture
Source → detected/candidate moments → derivative plan → preview rationale/effort → approve to Angle/ContentUnit/Derived Asset workflow.

## 8. User roles and permissions
Single artist reviews opportunities. AI may analyze/propose, never mass-publish.

## 9. Core data model
MASTER RepurposingPlan/derivatives plus source Asset, candidate time ranges, target formats/platforms, priority/status and links to created Angles/Units/Assets.

## 10. Main happy-path workflow
Select source → analyze transcript/audio/timeline/context → propose full performances/shorts/lyrics/spoken/recap candidates → user selects → creates structured derivative work → normal Factory/Production/Edit/Publication flow.

## 11. Alternative workflows
Manual marker selection; no transcript; instrumental/live; rights restrict clipping; source already atomized; one segment used repeatedly.

## 12. User actions
Analyze, add manual moment, accept/reject candidate, adjust range, set target, create Angle/Unit, mark already used.

## 13. State model
Candidate → Approved/Rejected → In Progress → Produced/Archived at plan-item level; formal schema open.

## 14. Business rules
- `AST-ATM-001` Atomization MUST create opportunities/plans, not automatic publication.
- `AST-ATM-002` Source Asset MUST remain canonical and linked to all accepted derivatives.
- `AST-ATM-003` Candidate derivative SHOULD specify source time range or semantic source reference where applicable.
- `AST-ATM-004` Rights/modification permissions MUST be checked before accepted derivative proceeds.
- `AST-ATM-005` Identity/Mystique constraints MUST be considered for spoken/private/BTS source material.
- `AST-ATM-006` System SHOULD detect/communicate previous use of same/similar source segment.
- `AST-ATM-007` Stable identity anchors are not repetition by themselves, but repeated identical segment/execution SHOULD affect novelty/fatigue context.
- `AST-ATM-008` Candidate set MUST be bounded; system MUST NOT create dozens of filler clips simply because source is long.
- `AST-ATM-009` AI SHOULD rank/organize by goal fit, required effort, novelty and learning value—not opaque virality score.
- `AST-ATM-010` “No valuable derivatives found” is a valid outcome.
- `AST-ATM-011` Accepted candidate SHOULD enter normal Content Angle/Unit lifecycle rather than bypass it.
- `AST-ATM-012` Actual edit/export becomes Derived Asset with lineage.
- `AST-ATM-013` User MAY manually create derivative without AI analysis.
- `AST-ATM-014` Atomization MUST distinguish content opportunity from actual media export.
- `AST-ATM-015` Production economics MAY compare source-session yield but MUST not reduce artistic value to derivative count.

## 15. AI behavior
Analyzes source using available transcript/audio/metadata and Context Pack. Structured candidates include moment/rationale/goal/format/effort/rights or identity warnings. No guaranteed-performance claims.

## 16. Human approval
Required before candidate becomes committed work/public-facing derivative.

## 17. Validation
Source exists; ranges valid; rights allow modification/use; linked outputs traceable.

## 18. UI states
Not analyzed, analyzing, candidates, no candidates, rights blocked, selected/in progress, used/saturated.

## 19. Edge cases
One-hour concert; private conversation inside BTS; repeated chorus clips; source already cut externally; transcript inaccurate.

## 20. Cross-module effects
Evergreen Pool, Factory, Pipeline, Derived Assets, Rights, Content History.

## 21. Notifications and attention model
None unless user has approved atomization work with deadline.

## 22. Search / filtering / sorting / bulk actions
Filter candidate type/goal/effort/used/rights; bulk create only explicit selected items.

## 23. Analytics and product telemetry
Candidate acceptance, derivative yield, time saved, repeated-use warnings, downstream publication conversion.

## 24. Learning feedback
Performance of derivatives feeds normal analytics; source-level conclusions require multiple executions/context.

## 25. Auditability / provenance
Analysis config/source ranges, accepted/rejected candidates, outputs.

## 26. Desktop / mobile behavior
Desktop analysis/review; mobile mark moments while reviewing source.

## 27. Accessibility / usability
Transcript/text alternatives, keyboard timeline controls, clear source timestamps.

## 28. Security / privacy / rights
Private moments must not be surfaced as audience-facing without policy checks.

## 29. Performance / async jobs
Analysis async and bounded; progressive candidates possible; manual workflow independent.

## 30. Acceptance criteria
- `AST-ATM-AC01` Analysis produces candidates, not publications.
- `AST-ATM-AC02` Rights/identity can block candidate.
- `AST-ATM-AC03` Same segment previous usage is visible.
- `AST-ATM-AC04` No-candidate result is valid.
- `AST-ATM-AC05` Accepted derivative preserves source lineage.

## 31. Test matrix
Long interview; live performance; no transcript; rights blocked; private BTS; repeated segment; manual-only; no useful derivative.

## 32. Open questions
Whether derivative plan items are own entity or embedded structured rows inside RepurposingPlan.

## 33. Traceability
MASTER §127–146, §189–191.
