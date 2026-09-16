# Voice Note Capture and Pipeline

- **Status:** REVIEW COMPLETE
- **MASTER references:** §177, §116, §118–123, §365, §370, §411
- **Domain:** 08_production
- **Feature slug:** `voice-notes`
- **Requirement prefix:** `PRD-VOI`

## 2. Purpose
Turn spontaneous spoken thoughts into durable, reviewable creative/story input without automatically publishing them or promoting them into permanent knowledge.

## 3. User problem / job-to-be-done
Artists often capture good stories, lyrics, content ideas or reflections away from desktop. These voice notes become lost files unless transcription and extraction connect them back to Song Brain, Artist Brain or Content Factory.

## 4. Scope
Quick mobile record/upload, Asset type VOICE_NOTE, transcription, language/timestamps, idea/story extraction, Candidate Knowledge and optional Content Angle creation.

## 5. Entry points
Mobile quick capture, command palette Record Voice Note, Song Brain, Production/Assets.

## 6. Preconditions and dependencies
Artist exists; recording permission only if native/browser capture used. Song/Campaign context optional and user-selectable.

## 7. Information architecture
Record/import → processing → transcript → extracted candidates → destinations/actions → source audio preserved.

## 8. User roles and permissions
Single artist records and reviews. AI may transcribe/extract candidates but cannot promote knowledge automatically.

## 9. Core data model
Asset(VOICE_NOTE, ORIGINAL_ARTIST), Transcript, CandidateKnowledge, optional ContentAngle/Song links, AgentRun/Job provenance.

## 10. Main happy-path workflow
Record note → Asset saved → transcription job → transcript available → extraction proposes ideas/stories/knowledge candidates → user accepts/edits/rejects destination → optional Angle created → source lineage retained.

## 11. Alternative workflows
No transcription provider; unsupported language; noisy audio; singing/mixed note; user wants transcript only; private note not eligible for AI; note linked to Song later.

## 12. User actions
Record/upload, rename, link context, transcribe/retry, edit transcript, accept/reject extracted candidate, create Angle, mark private/archive.

## 13. State model
Asset upload/processing states plus transcript/extraction status. CandidateKnowledge uses its own status.

## 14. Business rules
- `PRD-VOI-001` Original voice-note Asset MUST be preserved as source unless user explicitly deletes under rights/retention rules.
- `PRD-VOI-002` Transcription MUST preserve source linkage and language/timestamp metadata where provider supports it.
- `PRD-VOI-003` Transcript edits MUST be distinguishable from raw provider output.
- `PRD-VOI-004` Extracted ideas/stories MUST remain candidates until human review.
- `PRD-VOI-005` Voice note MUST NOT auto-promote content to Artist Brain/Song Brain/Identity.
- `PRD-VOI-006` User MAY create Content Angle directly from an extracted idea with source reference.
- `PRD-VOI-007` User MAY keep a note private/non-AI-processed.
- `PRD-VOI-008` Unsupported/low-confidence transcription MUST be labelled rather than silently corrected into invented content.
- `PRD-VOI-009` Singing identification/transcription MUST not rely on speech transcript as sole signal.
- `PRD-VOI-010` A note MAY be linked to Song/Campaign after capture without rewriting source timestamp.
- `PRD-VOI-011` AI extraction MUST respect Mystique/Internal Canon policies before suggesting audience-facing use.
- `PRD-VOI-012` Voice Note workflow MUST still allow manual notes/content creation if AI/transcription unavailable.
- `PRD-VOI-013` Deleting derived transcript/candidate MUST NOT automatically delete original Asset.
- `PRD-VOI-014` Deleting original Asset with derived knowledge requires explicit warning/lineage handling.

## 15. AI behavior
TranscriptionProvider for speech; extraction agent returns structured candidate type, statement/idea, suggested scope/destination, confidence and source span. No embellishment beyond transcript/source.

## 16. Human approval
Required for Candidate Knowledge promotion, Angle creation from suggestion if configured, and any public-facing content commitment.

## 17. Validation
Audio stored successfully before processing; transcript source range; destination references valid; privacy setting enforced.

## 18. UI states
Recording, uploading, processing, transcript ready, extraction ready, low-confidence, failed, private/no-AI, archived.

## 19. Edge cases
Interrupted recording; duplicate upload; multilingual note; contains copyrighted music in background; note is mostly singing; transcript provider outage.

## 20. Cross-module effects
Assets, Knowledge, Song Brain, Factory, Context Assembler.

## 21. Notifications and attention model
Processing completion may use lightweight inbox/badge; failed job retry optional. No global alert for unreviewed casual notes unless user configures.

## 22. Search / filtering / sorting / bulk actions
Filter processed/unprocessed/private/Song/date; bulk transcribe optional with cost preview.

## 23. Analytics and product telemetry
Capture→transcript→candidate→angle conversion, transcript correction, processing failures/cost/latency.

## 24. Learning feedback
Accepted/rejected extraction improves agent eval; content outcome later traces to source note but does not validate every statement in note.

## 25. Auditability / provenance
Original audio, raw/edited transcript, extraction config, accepted/rejected candidate history.

## 26. Desktop / mobile behavior
Mobile capture-first; desktop review/edit/knowledge routing.

## 27. Accessibility / usability
Visible recording status, captions/transcript, no audio-only controls, clear privacy toggle.

## 28. Security / privacy / rights
Voice notes may contain highly private Internal Canon. Default private; explicit processing/export. Storage/access controls required.

## 29. Performance / async jobs
Upload immediate/progressive; TRANSCRIBE_ASSET and extraction via JobService with retry/idempotency.

## 30. Acceptance criteria
- `PRD-VOI-AC01` Source audio survives transcription/extraction.
- `PRD-VOI-AC02` Candidate knowledge requires human review.
- `PRD-VOI-AC03` Low-confidence transcript is visibly uncertain.
- `PRD-VOI-AC04` User can keep note private/no-AI.
- `PRD-VOI-AC05` Manual fallback works when transcription unavailable.

## 31. Test matrix
Normal speech; multilingual; noisy; singing; private; provider failure; edited transcript; delete derived/source.

## 32. Open questions
Default retention/privacy policy and whether voice capture lives under Production, Assets or global quick-capture navigation; behavior remains cross-domain regardless.

## 33. Traceability
MASTER §116, §118–123, §177, §365, §370, §411.
