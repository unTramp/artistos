# Derived Assets

- **Status:** REVIEW COMPLETE
- **MASTER references:** §188, §181–184, §187
- **Domain:** 09_assets_media_rights
- **Feature slug:** `derived-assets`
- **Requirement prefix:** `AST-DER`

## 2. Purpose
Represent edits/exports/remixes as new traceable Assets while preserving the original source and inherited rights/context.

## 3. User problem / job-to-be-done
A single raw clip may become trimmed, cropped, color-graded, captioned and platform exports. If these overwrite each other or lose the parent, later reuse and rights reasoning become unreliable.

## 4. Scope
`parentAssetId`, derivation types TRIM/CROP/COLOR_GRADE/CAPTIONED/MIXED/EXPORT/REMIX, metadata inheritance/override, rights propagation and version history.

## 5. Entry points
Asset detail, editor/export import, Smart Ingest, ContentUnit/Publication prep.

## 6. Preconditions and dependencies
Parent Asset or multiple parents for MIXED/REMIX use case; MASTER field is singular parentAssetId, multi-parent boundary may need separate relationship.

## 7. Information architecture
Parent → derivation operation → derived Asset detail → further derivatives/usages.

## 8. User roles and permissions
Single artist creates/imports derived outputs; system can identify probable derivative as suggestion.

## 9. Core data model
Derived Asset with parentAssetId + derivationType; inherited context/rights with explicit derived metadata. MIXED/REMIX may logically need multi-parent source links beyond singular parent field.

## 10. Main happy-path workflow
Select/source Asset → create/import edited output → choose/derive operation → new Asset created linked to parent → rights/context inherited with overrides → downstream Content/Publication uses derivative.

## 11. Alternative workflows
External editor export; combined media; caption burn-in; crop variants; final platform export; remix uses several sources.

## 12. User actions
Create/import derivative, set derivation type, compare parent, mark final/use, archive, view chain.

## 13. State model
Normal Asset processing lifecycle; derivation is relationship/type, not status.

## 14. Business rules
- `AST-DER-001` Editing/exporting MUST create a derived Asset rather than overwrite canonical original when output is materially distinct/reused.
- `AST-DER-002` Derived Asset MUST reference parent source(s) and derivation type.
- `AST-DER-003` Derivation types MUST support MASTER TRIM, CROP, COLOR_GRADE, CAPTIONED, MIXED, EXPORT, REMIX.
- `AST-DER-004` Original Asset MUST remain unchanged unless user explicitly replaces binary under a correction workflow.
- `AST-DER-005` Rights constraints MUST propagate from parent; derivation MUST NOT create new rights automatically.
- `AST-DER-006` Derived metadata MAY override dimensions/duration/orientation while preserving provenance.
- `AST-DER-007` Identity/Content context SHOULD inherit where appropriate but historical creation context remains explicit.
- `AST-DER-008` Multiple platform exports MAY share same parent/edit and remain distinct Assets when binaries differ.
- `AST-DER-009` Duplicate exports MAY be deduplicated at storage layer only if semantic records/usages remain correct.
- `AST-DER-010` Derivation graph MUST prevent cycles.
- `AST-DER-011` Deleting a parent binary MUST warn if derivatives/history depend on it.
- `AST-DER-012` AI MAY infer likely derivation but uncertain relationship requires confirmation.
- `AST-DER-013` MIXED/REMIX multi-source provenance MUST not be lost even if schema needs additional edge model.

## 15. AI behavior
Optional derivative matching/classification only; cannot invent source lineage.

## 16. Human approval
Uncertain inferred parent/operation reviewed; explicit export workflow creates deterministic relation.

## 17. Validation
Parent exists/same artist, no cycles, derivation type valid, multi-source provenance where relevant.

## 18. UI states
Original, derivative, chain, probable/inferred parent, missing binary, archived.

## 19. Edge cases
Nested exports, same binary different semantic use, remix with multiple parents, parent archived, edit project file not media output.

## 20. Cross-module effects
Lineage, Rights, ContentUnit/Publication, Repurposing.

## 21. Notifications and attention model
Rights/parent deletion impacts only.

## 22. Search / filtering / sorting / bulk actions
Filter original/derived/type/final; bulk archive exports where safe.

## 23. Analytics and product telemetry
Derivative count/source, reuse, inferred correction.

## 24. Learning feedback
Production efficiency/atomization metrics, not creative causality alone.

## 25. Auditability / provenance
Creation/import source, parent(s), operation, tool where known.

## 26. Desktop / mobile behavior
Desktop chain/manage; mobile preview/simple derivation upload.

## 27. Accessibility / usability
Text derivation labels; compare metadata accessible without visual diff.

## 28. Security / privacy / rights
Inherited private/rights restrictions preserved.

## 29. Performance / async jobs
Preview generation async; relationship creation immediate.

## 30. Acceptance criteria
- `AST-DER-AC01` Raw original is not overwritten by normal edit/export.
- `AST-DER-AC02` Rights propagate to derivative.
- `AST-DER-AC03` Derivation cycle impossible.
- `AST-DER-AC04` Multi-source remix provenance is preserved conceptually.

## 31. Test matrix
Trim; crop; nested export; multiple platform exports; remix; parent archived; inferred relation.

## 32. Open questions
MASTER singular `parentAssetId` conflicts with true multi-source MIXED/REMIX. Schema must add generalized parent-source relation or constrain semantics explicitly.

## 33. Traceability
MASTER §181–188.
