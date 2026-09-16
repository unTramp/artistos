# Equipment Items

- **Status:** REVIEW COMPLETE
- **MASTER references:** §160–162, §171, §178
- **Domain:** 08_production
- **Feature slug:** `equipment`
- **Requirement prefix:** `PRD-EQP`

## 2. Purpose
Provide traceable equipment records used by capability planning and historical shoot/asset metadata without turning Artist OS into an inventory-management system.

## 3. User problem / job-to-be-done
The artist needs recommendations and shot instructions that reference the actual camera, microphone, light or stand available, and later needs to know which setup produced an asset.

## 4. Scope
MASTER EquipmentItem fields, availability, strengths/limitations, historical use, quick selection in Shoot/Shot.

## 5. Entry points
Capability Profile, Shoot setup, Shot editor, Asset metadata, Settings.

## 6. Preconditions and dependencies
Artist exists. Brand/model can be unknown. Item type is required enough to make resource useful.

## 7. Information architecture
Equipment library → type groups → item detail → availability/strengths/limitations → historical usage.

## 8. User roles and permissions
Single artist manages equipment records.

## 9. Core data model
`EquipmentItem {type, brand, model, owned, available, qualityTier, strengths[], limitations[]}` plus stable id/artist ownership/history fields required by implementation. `qualityTier` must not become an artistic-quality score.

## 10. Main happy-path workflow
Add item → classify type → set owned/availability → add practical notes → select in Shoot setup → resulting Shot/Asset lineage retains reference.

## 11. Alternative workflows
Unknown brand/model, generic stand/background, borrowed/rented item, item replaced by newer model, item used only once.

## 12. User actions
Create/edit/archive, availability toggle, duplicate similar item, select for shoot, view usage.

## 13. State model
Active/Unavailable/Archived projection; owned is independent boolean.

## 14. Business rules
- `PRD-EQP-001` EquipmentItem MUST have stable identity so historical references survive name/model edits.
- `PRD-EQP-002` Type MUST be explicit enough for feasibility logic.
- `PRD-EQP-003` Brand/model MAY be unknown.
- `PRD-EQP-004` `qualityTier` MUST NOT be used as a universal proxy for creative quality.
- `PRD-EQP-005` Strengths/limitations MUST be allowed to override generic model assumptions.
- `PRD-EQP-006` Availability changes MUST be prospective and MUST NOT rewrite history.
- `PRD-EQP-007` Historical equipment references SHOULD remain readable after archive.
- `PRD-EQP-008` Duplicate detection SHOULD warn on obvious duplicate records but not block legitimate multiples.
- `PRD-EQP-009` Device metadata MAY assist matching but MUST NOT auto-create canonical equipment without review.
- `PRD-EQP-010` System MUST support non-electronic support items such as stands/backgrounds.
- `PRD-EQP-011` Equipment data MUST be usable in manual workflows without AI.

## 15. AI behavior
Optional metadata parsing/normalization and practical setup suggestions. No unsupported technical specifications should be invented when model unknown.

## 16. Human approval
Canonical add/edit remains human-controlled; metadata candidate confirmation required.

## 17. Validation
Type required; brand/model text safe; no destructive deletion if referenced historically without migration/archival behavior.

## 18. UI states
Empty by type, active, unavailable, archived, duplicate warning, unknown model.

## 19. Edge cases
Two identical lights; same device renamed; imported Asset identifies device string not matching item; equipment temporarily borrowed.

## 20. Cross-module effects
Capability Profile, ShootSession, Shot and Asset metadata.

## 21. Notifications and attention model
Only availability conflict for upcoming Shoot needs attention.

## 22. Search / filtering / sorting / bulk actions
Type, available, owned, archived; bulk availability/archive optional.

## 23. Analytics and product telemetry
Selection frequency and missing-item corrections; no gear-performance ranking by default.

## 24. Learning feedback
Can support operational observations about setup reliability only with evidence.

## 25. Auditability / provenance
Changes, archive, metadata source.

## 26. Desktop / mobile behavior
Desktop library; mobile quick picker.

## 27. Accessibility / usability
Human-friendly labels; do not require specs irrelevant to actual use.

## 28. Security / privacy / rights
No special rights; serial numbers should not be required/exposed.

## 29. Performance / async jobs
CRUD immediate; metadata reconciliation async if needed.

## 30. Acceptance criteria
- `PRD-EQP-AC01` Historical references survive archive/edit.
- `PRD-EQP-AC02` Unknown brand/model is valid.
- `PRD-EQP-AC03` Two identical physical items can coexist.
- `PRD-EQP-AC04` QualityTier is never surfaced as artistic score.

## 31. Test matrix
Unknown model; duplicates; archive referenced item; temporary unavailable; device metadata mismatch.

## 32. Open questions
Equipment `type` and `qualityTier` enums are not frozen in MASTER.

## 33. Traceability
MASTER §160–162, §171, §178.
