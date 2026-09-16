# Smart Media Ingest

- **Status:** REVIEW COMPLETE
- **MASTER references:** §170–176, §349, §394, §411
- **Domain:** 09_assets_media_rights
- **Feature slug:** `smart-ingest`
- **Requirement prefix:** `AST-ING`

## 2. Purpose
Reduce manual post-shoot organization by suggesting how imported files map to Shoot, Shot, take and content context while keeping human confirmation and confidence visible.

## 3. User problem / job-to-be-done
After a shoot, dozens of similarly named files must be matched to what was planned and recorded. Manual organization is slow and error-prone, especially across multiple devices.

## 4. Scope
Batch import, signal extraction, candidate mapping, confidence, Accept/Change/Ignore, device offsets, auto-grouping handoff, idempotent processing and progress.

## 5. Entry points
Asset import after Shoot, Shoot “Import media”, Asset Library bulk import.

## 6. Preconditions and dependencies
Files available; Shoot context optional. On-Set timestamps improve mapping but are not required.

## 7. Information architecture
Import batch → processing progress → suggested groups/mappings → confidence/evidence → review queue → accepted Assets/links → unresolved bucket.

## 8. User roles and permissions
Single artist reviews mappings. System may precompute but not silently finalize low/ambiguous mappings.

## 9. Core data model
Asset + import batch/job + mapping suggestion(s) to Shoot/Shot/Take/ContentUnit with confidence/evidence; device offset configuration. Formal MappingSuggestion entity is implementation detail but provenance is required.

## 10. Main happy-path workflow
Select files/shoot → upload/extract metadata → apply device offsets as matching context → combine recordedAt/duration/orientation/device/shot schedule/transcript/audio/visual signals → generate suggestions → user Accept/Change/Ignore → links stored → unresolved remain searchable.

## 11. Alternative workflows
No Shoot; wrong clocks; multi-camera; missing EXIF; speech vs singing; one long file; historical batch; user imports only selected takes.

## 12. User actions
Start/cancel/retry ingest, set device offset, accept single/bulk high-confidence suggestions, change target, ignore/unmap, inspect evidence.

## 13. State model
Batch: queued/processing/review-ready/partial/done/failed/cancelled. Mapping: suggested/accepted/changed/ignored/unresolved. Exact enums may live in job/application layer.

## 14. Business rules
- `AST-ING-001` Smart Ingest MUST produce suggestions with confidence, not hidden automatic truth.
- `AST-ING-002` User MUST have Accept / Change / Ignore controls.
- `AST-ING-003` Mapping MAY target Shoot, Shot, take context and/or ContentUnit depending available evidence.
- `AST-ING-004` Signals SHOULD include MASTER recordedAt, creationTimestamp, duration, orientation, device, shoot window, shot schedule, transcript, audio similarity and visual similarity as capabilities become available.
- `AST-ING-005` No single signal MUST be treated as infallible.
- `AST-ING-006` Device time offset MUST adjust matching computation without destructively rewriting original file metadata.
- `AST-ING-007` Saved device offset MAY be reused for future imports but MUST be editable/traceable.
- `AST-ING-008` Speech transcription MAY support speech mapping; singing mapping MUST treat transcript as secondary signal.
- `AST-ING-009` Missing On-Set/take markers MUST NOT block ingest.
- `AST-ING-010` Low-confidence/ambiguous files MUST remain unresolved rather than force assignment.
- `AST-ING-011` Bulk accept SHOULD be restricted to explicit user selection and visible confidence/evidence threshold.
- `AST-ING-012` Changing a mapping MUST preserve previous suggestion/provenance for eval/debugging.
- `AST-ING-013` Smart Ingest MUST be idempotent for the same import batch/idempotency key.
- `AST-ING-014` Retry MUST not duplicate Asset records or accepted mappings.
- `AST-ING-015` Imported original files MUST be retained independent of mapping success.
- `AST-ING-016` Processing failures on one file SHOULD not fail entire batch when others can proceed.
- `AST-ING-017` Advanced visual/audio matching is progressive capability, not MVP dependency.
- `AST-ING-018` Smart Ingest success MUST be measured by actual reduction in manual organization time/corrections, not claimed percentage.
- `AST-ING-019` AI/provider unavailability SHOULD degrade to manual import/mapping.

## 15. AI behavior
AI/ML may assist transcripts/similarity/classification; mapping output structured with confidence and evidence. No opaque auto-selection of “best take.”

## 16. Human approval
Mapping finalization is human-confirmable. Configurable high-confidence assisted bulk acceptance still requires explicit action.

## 17. Validation
File uniqueness/import key, target exists, offsets sane, mapping no impossible cross-artist link, rights not inferred.

## 18. UI states
Uploading, queued, processing signals, partial, review-ready, ambiguous, accepted, ignored, failed, manual-only.

## 19. Edge cases
Timezone/clock drift; camera file creation date changed on copy; duplicate filenames; media spanning shots; multicam; app marker missing; same device offset changed during day.

## 20. Cross-module effects
Creates Asset context links, Take groups, Shot progress suggestions, Asset Library organization and later lineage.

## 21. Notifications and attention model
Batch completion/failure can notify lightly; unresolved critical selected media may surface inside Shoot/Assets, not global urgent by default.

## 22. Search / filtering / sorting / bulk actions
Filter confidence, device, file type, resolved state, suggested Shot; bulk accept/change/ignore with safeguards.

## 23. Analytics and product telemetry
Mapping acceptance/correction/ignore, confidence calibration, manual time, device-offset reuse, job failure/latency/cost.

## 24. Learning feedback
Corrections become training/eval evidence for ingest matching; never become artist creative learning.

## 25. Auditability / provenance
Signals used, confidence, model/config, offset, suggestion, user action, retry history.

## 26. Desktop / mobile behavior
Desktop primary review; mobile can import from device and accept simple mappings.

## 27. Accessibility / usability
Confidence text + evidence; keyboard bulk review; clear unresolved bucket.

## 28. Security / privacy / rights
Imported private media protected; providers receive minimum needed data under configured privacy scope.

## 29. Performance / async jobs
SMART_INGEST/ANALYZE_ASSET jobs, per-file progress, cancellation, retries, at-least-once safe.

## 30. Acceptance criteria
- `AST-ING-AC01` Low-confidence asset can remain unresolved.
- `AST-ING-AC02` Device offset does not rewrite raw metadata.
- `AST-ING-AC03` Retry does not duplicate assets/mappings.
- `AST-ING-AC04` User can inspect and change suggested mapping.
- `AST-ING-AC05` Manual fallback works if AI analysis fails.

## 31. Test matrix
Perfect timestamps; wrong offset; no shoot; multicam; duplicate file; partial job failure; singing; speech; bulk accept; retry.

## 32. Open questions
Default confidence thresholds and persistence shape of mapping suggestions must be calibrated in implementation/evals, not hardcoded in product spec.

## 33. Traceability
MASTER §170–176, §349, §394, §411.
