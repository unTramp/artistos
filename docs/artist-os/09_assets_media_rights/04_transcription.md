# Transcription and Media Speech Analysis

- **Status:** REVIEW COMPLETE
- **MASTER references:** §175–177, §179–180, §349, §411
- **Domain:** 09_assets_media_rights
- **Feature slug:** `transcription`
- **Requirement prefix:** `AST-TRN`

## 2. Purpose
Create time-aligned text/language metadata for speech-heavy media and voice notes so assets can be searched, mapped and reused, while explicitly handling singing/mixed audio limitations.

## 3. User problem / job-to-be-done
Spoken footage and voice notes are hard to search and repurpose. Transcripts unlock ideas, quotes and mapping, but speech ASR is not reliable enough to treat singing lyrics as equivalent transcription evidence.

## 4. Scope
TranscriptionProvider operations, language detection, timestamps, diarization when available, raw vs edited transcript, confidence, speech/singing/mixed handling.

## 5. Entry points
Asset detail, Voice Note pipeline, Smart Ingest, batch actions.

## 6. Preconditions and dependencies
Audio-bearing Asset and provider/manual path. User may opt out/private.

## 7. Information architecture
Asset → transcription status → transcript timeline → language/speakers → corrections → search/reuse actions.

## 8. User roles and permissions
Single artist initiates/reviews/edits. Provider processes according to privacy scope.

## 9. Core data model
Transcript as Asset or dedicated transcript data linked to source Asset; raw provider output/provenance, edited text, timestamps, language, diarization/confidence. MASTER includes TRANSCRIPT Asset type.

## 10. Main happy-path workflow
Request transcript → JobService → provider detect language/transcribe/timestamps → store raw result → render → user edits if needed → downstream indexing/extraction uses appropriate version with provenance.

## 11. Alternative workflows
Manual transcript; no provider; singing; mixed speech/music; multilingual; diarization unsupported; low confidence.

## 12. User actions
Transcribe/retry/cancel, edit transcript, select language override, mark content type, export, use excerpt to candidate/angle.

## 13. State model
Not requested/queued/processing/ready/low-confidence/failed/stale-after-source-change where applicable.

## 14. Business rules
- `AST-TRN-001` Transcription MUST preserve source Asset linkage.
- `AST-TRN-002` Raw provider output MUST remain distinguishable from human-edited transcript.
- `AST-TRN-003` Timecodes SHOULD be preserved when provider supports them.
- `AST-TRN-004` Language detection MUST expose uncertainty/override.
- `AST-TRN-005` Diarization is optional capability; absence MUST not be presented as one verified speaker.
- `AST-TRN-006` Speech transcription is primary for SPEECH content.
- `AST-TRN-007` Singing identification/mapping MUST use audio/segment/context signals with transcript only secondary.
- `AST-TRN-008` Low-confidence/inaudible text MUST not be “cleaned up” into invented factual statements without marking editorial inference.
- `AST-TRN-009` User MAY keep an Asset untranscribed/private.
- `AST-TRN-010` Transcript edits MUST be auditable.
- `AST-TRN-011` Downstream Candidate Knowledge MUST cite source span/time where practical.
- `AST-TRN-012` Transcript deletion MUST not automatically delete source Asset.
- `AST-TRN-013` Provider failure MUST leave manual metadata/search use possible.
- `AST-TRN-014` Batch transcription SHOULD expose cost/volume before expensive processing where applicable.
- `AST-TRN-015` Transcription MUST NOT imply copyright ownership of spoken/sung material.

## 15. AI behavior
Provider output must be grounded in source. Optional cleanup/extraction is separate step with provenance and no silent semantic changes.

## 16. Human approval
Manual corrections and knowledge/content promotion human-controlled.

## 17. Validation
Source has audio; timestamps monotonic; language code valid; transcript version tied to provider/config/source hash where possible.

## 18. UI states
Untranscribed, queued, ready, low confidence, mixed/singing warning, edited, failed, private/no-provider.

## 19. Edge cases
Music loud over speech; multiple languages; copyrighted lyrics; source media replaced; provider returns no timestamps.

## 20. Cross-module effects
Voice Notes, Smart Ingest, Search, Knowledge, Content Atomization.

## 21. Notifications and attention model
Job completion/failure lightweight; no global urgent state.

## 22. Search / filtering / sorting / bulk actions
Search transcript; filter transcribed/language/content type; batch transcribe selected.

## 23. Analytics and product telemetry
Job success, correction rate, language override, downstream use, cost/latency.

## 24. Learning feedback
Corrections inform provider/eval selection; transcript content itself only becomes knowledge after Candidate review.

## 25. Auditability / provenance
Provider/model/config, raw response reference, edits, timestamps.

## 26. Desktop / mobile behavior
Desktop editing/search; mobile playback+read/quick correction.

## 27. Accessibility / usability
Transcript synchronized where useful; keyboard editing; clear uncertain tokens/segments.

## 28. Security / privacy / rights
Private recordings protected; external provider scope disclosed/configured; avoid sending unnecessary full media where alternative available.

## 29. Performance / async jobs
TRANSCRIBE_ASSET via JobService, idempotent source/config key, retryable provider errors.

## 30. Acceptance criteria
- `AST-TRN-AC01` Raw and edited transcripts remain distinguishable.
- `AST-TRN-AC02` Singing is not treated as reliable speech transcript mapping alone.
- `AST-TRN-AC03` User can opt out/private.
- `AST-TRN-AC04` Low confidence remains explicit.
- `AST-TRN-AC05` Source Asset survives transcript deletion.

## 31. Test matrix
Speech; singing; mixed; multilingual; low confidence; no timestamps; provider outage; manual edit; privacy opt-out.

## 32. Open questions
Canonical Transcript persistence as derived Asset vs structured transcript entity plus optional exported Asset.

## 33. Traceability
MASTER §175–180, §349, §411.
