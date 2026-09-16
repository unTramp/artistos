# Auto Group Takes

- **Status:** REVIEW COMPLETE
- **MASTER references:** §168, §173–176, §187
- **Domain:** 09_assets_media_rights
- **Feature slug:** `take-grouping`
- **Requirement prefix:** `AST-GRP`

## 2. Purpose
Group imported media into likely recording attempts/shot contexts to make selection and mapping manageable, while preserving uncertainty and multi-camera cases.

## 3. User problem / job-to-be-done
Raw imports may contain many near-identical files. The artist needs sensible clusters around what happened on set instead of reviewing a flat list.

## 4. Scope
Temporal/visual/audio/transcript grouping, On-Set marker use, multi-camera grouping, split/merge correction, confidence.

## 5. Entry points
Smart Ingest review, Shoot detail, Take view.

## 6. Preconditions and dependencies
Imported Assets. Shoot/Shot/take markers optional.

## 7. Information architecture
Suggested groups → group evidence/timeline → member assets → candidate Shot/Take → split/merge/confirm.

## 8. User roles and permissions
Single artist confirms/corrects.

## 9. Core data model
Group is a suggested/confirmed relationship among Assets and optional Take/Shot context. Formal Take entity is unresolved; grouping model must not assume it exists until schema freeze.

## 10. Main happy-path workflow
Analyze timestamps/device/audio/visual/context → propose groups → user reviews timeline/thumbnails → confirm or split/merge → mapping feeds take/shot context.

## 11. Alternative workflows
One long file contains multiple attempts; multicam files one take; no timestamps; historical imported footage.

## 12. User actions
Confirm, split, merge, move asset between groups, mark unrelated, assign group to Shot/Take.

## 13. State model
Suggested → Confirmed/Corrected/Ignored; confidence independent.

## 14. Business rules
- `AST-GRP-001` Grouping MUST be a suggestion until confirmed or explicitly auto-accepted by user action.
- `AST-GRP-002` Grouping SHOULD use timestamps, visual context, audio, transcript and Shoot context as available.
- `AST-GRP-003` Multiple camera files MAY belong to one take group.
- `AST-GRP-004` One file MAY require segmentation/annotation if it contains multiple takes; system MUST not force one-file=one-take.
- `AST-GRP-005` Group confidence MUST be visible.
- `AST-GRP-006` User MUST be able to split/merge/correct groups.
- `AST-GRP-007` Corrections MUST preserve original Asset membership history for eval/provenance.
- `AST-GRP-008` Missing timestamps MUST lower/use alternative evidence rather than block grouping.
- `AST-GRP-009` Speech transcript MUST not dominate singing grouping.
- `AST-GRP-010` Grouping MUST NOT decide artistic “best take.”
- `AST-GRP-011` Grouping errors MUST NOT delete/move binary originals.
- `AST-GRP-012` Manual organization remains available when analysis providers are unavailable.

## 15. AI behavior
Similarity/grouping suggestions only; structured evidence/confidence required.

## 16. Human approval
Confirmation/correction human-controlled.

## 17. Validation
Assets same artist/import context where expected; no group cycles; split/merge yields valid membership.

## 18. UI states
Ungrouped, suggested, low confidence, confirmed, corrected, multi-camera, long-file special case.

## 19. Edge cases
Near-duplicate exports vs raw captures; background music creates false audio similarity; camera clock gap; one continuous concert recording.

## 20. Cross-module effects
Takes, Smart Ingest, Shot mapping, Asset selection.

## 21. Notifications and attention model
None globally; unresolved grouping visible in ingest workflow.

## 22. Search / filtering / sorting / bulk actions
Sort timeline/device/confidence; bulk confirm explicit selection.

## 23. Analytics and product telemetry
Correction rate, split/merge, confidence calibration, time saved.

## 24. Learning feedback
Corrections improve ingest models/evals only.

## 25. Auditability / provenance
Model/signals/group versions/user corrections.

## 26. Desktop / mobile behavior
Desktop comparison primary; mobile lightweight review.

## 27. Accessibility / usability
Timeline and thumbnails with text metadata; non-visual alternative for audio/document assets.

## 28. Security / privacy / rights
No change to rights/private state.

## 29. Performance / async jobs
Async analyze/group; incremental results allowed.

## 30. Acceptance criteria
- `AST-GRP-AC01` Multi-camera files can group together.
- `AST-GRP-AC02` User can split/merge suggestions.
- `AST-GRP-AC03` Best-take judgment is not automated.
- `AST-GRP-AC04` Provider failure leaves manual grouping available.

## 31. Test matrix
Multicam; one long file; no timestamps; singing; false similarity; manual only.

## 32. Open questions
Relationship between confirmed group and future formal `Take` entity remains tied to Production schema audit.

## 33. Traceability
MASTER §168, §173–176, §187.
