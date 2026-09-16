# Asset Library

- **Status:** REVIEW COMPLETE
- **MASTER references:** §178–190, §368, §411
- **Domain:** 09_assets_media_rights
- **Feature slug:** `asset-library`
- **Requirement prefix:** `AST-LIB`

## 2. Purpose
Provide a canonical, searchable media library for original, commissioned, licensed, reference and generated materials while preserving context, rights and lineage.

## 3. User problem / job-to-be-done
Media files quickly become a disconnected folder tree. The artist needs to know what an asset is, when/where it came from, which song/shoot/content it belongs to, whether it can be published and what derivatives came from it.

## 4. Scope
MASTER Asset fields/types/content type/origin, metadata, context links, rights summary, lineage, search/filter, upload/import, archive and detail view.

## 5. Entry points
Primary `/assets`, upload/import, Shoot completion, Voice Note, ContentUnit, Song, Smart Ingest, Brand Book/Moodboard references.

## 6. Preconditions and dependencies
Artist required. Asset may initially be unclassified/unlinked. StorageProvider required for persisted binary assets; reference-only URL items may use separate source records where appropriate.

## 7. Information architecture
Library grid/list → filters/search → asset detail → preview → metadata/context → rights → lineage/derivatives → usages.

## 8. User roles and permissions
Single artist uploads/edits/archives. AI may suggest metadata/mapping/tags; canonical changes with meaningful downstream effect require confirmation.

## 9. Core data model
MASTER `Asset {id, artistId, songId?, shootSessionId?, type, storageKey, createdAt, recordedAt, duration?, width?, height?, orientation?, device?, metadata}` plus AssetContentType, AssetOrigin, RightsStatus, AssetRights, derived lineage and usages.

## 10. Main happy-path workflow
Upload/import → binary stored → metadata extracted → Asset record created → optional Smart Ingest classification/mapping → user confirms context/rights → asset becomes available to Production/Content/Distribution while retaining source lineage.

## 11. Alternative workflows
Reference-only moodboard item; external licensed stock; generated artwork; document/transcript; no known Song/Shoot; duplicate file; missing metadata; asset imported after publication.

## 12. User actions
Upload/import, preview, edit metadata, link/unlink Song/Shoot/Content, set origin/rights, archive, download/export where supported, create derivative, open lineage/usages, bulk tag/map.

## 13. State model
Storage/processing availability should remain separate from rights and content lifecycle. Product states may include Uploading/Processing/Ready/Failed/Archived while RightsStatus is independent.

## 14. Business rules
- `AST-LIB-001` Every stored media/document object used by OS SHOULD have a stable canonical Asset id.
- `AST-LIB-002` Asset type MUST use MASTER types VIDEO, AUDIO, PHOTO, VOICE_NOTE, ARTWORK, DOCUMENT, TRANSCRIPT where applicable.
- `AST-LIB-003` AssetContentType MUST remain separate from file/media type.
- `AST-LIB-004` AssetOrigin MUST remain separate from RightsStatus.
- `AST-LIB-005` Unknown Song/Shoot/Content linkage MUST be allowed at ingest time.
- `AST-LIB-006` Missing metadata MUST remain unknown, not fabricated.
- `AST-LIB-007` Original file metadata SHOULD be preserved even when normalized fields are added/corrected.
- `AST-LIB-008` User corrections MUST not destructively overwrite raw extracted metadata without provenance.
- `AST-LIB-009` Asset archive MUST preserve references/lineage and SHOULD be preferred over destructive deletion when asset is historically referenced.
- `AST-LIB-010` Rights uncertainty MUST be visible in library/detail before publishable use.
- `AST-LIB-011` Asset usages across Reel/website/EPK/Brand Book/etc. SHOULD be traceable.
- `AST-LIB-012` Derived assets MUST link to parent rather than masquerade as unrelated originals.
- `AST-LIB-013` Duplicate detection MUST warn but MUST not assume same bytes always mean same semantic usage record.
- `AST-LIB-014` Asset Library MUST work without AI.
- `AST-LIB-015` Search/filter SHOULD include type, content type, origin, rights, Song, Shoot, date, orientation, device and linkage state.
- `AST-LIB-016` Internal/private assets MUST not be exposed to external export/integration without explicit scope.
- `AST-LIB-017` Binary deletion for referenced assets MUST require explicit destructive confirmation and lineage impact warning.
- `AST-LIB-018` Asset records SHOULD survive storage-provider migration through stable storage abstraction.

## 15. AI behavior
Optional classification, tags, content type, mapping and similarity suggestions. AI cannot invent rights or factual capture metadata. Suggestions expose confidence/source.

## 16. Human approval
Rights/origin, mapping, destructive deletion and permanent metadata corrections require user control. Low-risk tags may be accepted in bulk with review.

## 17. Validation
StorageKey valid for stored asset; normalized dimensions/duration sane; origin/rights enums valid; linked entities resolve; no impossible lineage cycles.

## 18. UI states
Uploading, processing, ready, partial metadata, unmapped, rights unknown, duplicate warning, archived, storage failure.

## 19. Edge cases
Same file uploaded twice; file copied and timestamp changed; HEIC/codec preview issue; storage object missing; asset referenced by published content; transcript treated as derived document.

## 20. Cross-module effects
Production/Smart Ingest, Song Brain, ContentUnit, Distribution, Website/Brand Book, Rights, Analytics lineage.

## 21. Notifications and attention model
Failed upload/processing, missing storage object and rights block on committed publication can surface. Unclassified casual assets do not require global alerts.

## 22. Search / filtering / sorting / bulk actions
Full-text tags/name/transcript where available; filters above; bulk tag, rights classification with caution, map, archive, move context.

## 23. Analytics and product telemetry
Time to classify assets, mapping acceptance, bulk usage, duplicate rate, preview failures, rights correction rate.

## 24. Learning feedback
Asset metadata/use can support production/content analysis; AI tag corrections improve classifiers, not Artist Brain automatically.

## 25. Auditability / provenance
Upload source, raw metadata, normalized edits, mapping changes, rights changes, archive/delete history.

## 26. Desktop / mobile behavior
Desktop library/management; mobile quick upload/preview/map from shoot.

## 27. Accessibility / usability
List view alternative to visual grid, keyboard selection, alt/text metadata for images where meaningful.

## 28. Security / privacy / rights
Private/unreleased assets protected; signed/authorized delivery where needed; rights metadata first-class; no public URL assumption.

## 29. Performance / async jobs
Upload direct/resumable where possible; metadata/preview/transcription/analysis async through JobService; library rendering never waits on AI.

## 30. Acceptance criteria
- `AST-LIB-AC01` Unmapped asset can be stored without invented context.
- `AST-LIB-AC02` Origin and RightsStatus are independent.
- `AST-LIB-AC03` Parent/derivative lineage is visible.
- `AST-LIB-AC04` Archived referenced asset remains resolvable.
- `AST-LIB-AC05` Library is useful with AI disabled.

## 31. Test matrix
Upload all types; duplicate; missing metadata; unknown rights; archive referenced; storage failure; private asset; derivative; bulk mapping.

## 32. Open questions
Canonical tagging taxonomy and whether user-facing folders/collections are needed beyond metadata/search in MVP.

## 33. Traceability
MASTER §178–190, §368, §411.
