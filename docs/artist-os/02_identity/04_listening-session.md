# Identity Listening Session

## 1. Metadata
- **Spec ID:** `IDN-LISTEN`
- **Domain:** `02_identity`
- **Feature:** Identity Listening Session
- **Status:** REVIEW
- **MASTER references:** 62, 92, 175–177, 404
- **Depends on:** Song/audio assets optional, TranscriptionProvider, draft Identity Version
- **Used by:** Sensory Associations, Narrative/Visual candidate discovery

## 2. Purpose
Create a guided reflective session in which the artist listens to their own music and captures spontaneous associations that can become evidence for identity candidates.

## 3. User problem / job-to-be-done
**JTBD:** “Help me notice what my own music evokes in me before I rationalize it into generic branding language.”

## 4. Scope
Session setup, song/audio selection, prompts, text/voice responses, transcription, association extraction as candidates. Out: psychological interpretation as fact, automatic Visual DNA update.

## 5. Entry points
`/identity/discovery/listening`, Wizard, Song → Identity context entry.

## 6. Preconditions and dependencies
Draft Identity Version. Song/audio optional: user can use selected original/relevant material. Voice transcription optional.

## 7. Information architecture
```text
Session setup
→ select audio/song(s)
→ guided listening rounds
→ capture text/voice
→ transcript review
→ extracted candidate associations
→ finish / continue to Candidate Review
```

## 8. User roles and permissions
Artist input is primary. AI extracts/summarizes only.

## 9. Core data model
Suggested `IdentityListeningSession`:
```text
id
identityVersionId
songIds[]
audioAssetIds[]
startedAt
completedAt?
promptVersion
responses[]
voiceAssetIds[]
transcriptAssetIds[]
status
```
Associations become `SensoryAssociation` candidates in source feature.

## 10. Main happy-path workflow
1. User selects one or more representative songs/audio.
2. System explains that there are no “correct” answers.
3. For each listening round, system prompts for emotions, colors, places, textures, memories, movement, light, symbols or free association.
4. User records voice or text.
5. Voice is transcribed and shown for correction.
6. AI extracts candidate associations with source spans/response refs.
7. User finishes and moves to Sensory Association review.

## 11. Alternative workflows
Text-only; single song; no Song entity but uploaded demo; user manually adds associations without AI; incomplete session resumes later.

## 12. User actions
Start, select audio, play/pause/seek, record voice, type, edit transcript, skip prompt, add free response, finish.

## 13. State model
`DRAFT → IN_PROGRESS → PROCESSING → REVIEW_READY → COMPLETED`, with `PAUSED` and recoverable `PROCESSING_FAILED`.

## 14. Business rules
- **IDN-LISTEN-001** — Session responses are artist statements/reflections, not objective psychological facts.
- **IDN-LISTEN-002** — Extracted associations MUST be candidates until reviewed.
- **IDN-LISTEN-003** — User MUST be able to edit transcription before using it as evidence.
- **IDN-LISTEN-004** — Speech transcription is primary for spoken reflection; singing transcription is not required for this workflow.
- **IDN-LISTEN-005** — Skipping prompts MUST be allowed; session is reflective, not a test.
- **IDN-LISTEN-006** — Prompt design MUST avoid leading the artist toward a predetermined archetype/style.
- **IDN-LISTEN-007** — Each extracted association SHOULD retain source response/session/song where applicable.
- **IDN-LISTEN-008** — Repeated associations MAY increase evidence weight but MUST not become confirmed automatically.
- **IDN-LISTEN-009** — Private memories/persons MAY be marked protected before downstream narrative use.
- **IDN-LISTEN-010** — Audio playback/capture failure MUST not discard written responses.
- **IDN-LISTEN-011** — AI extraction failure MUST allow manual association entry.
- **IDN-LISTEN-012** — Session can include more than one song but comparisons must preserve song source context.
- **IDN-LISTEN-013** — The system MUST not claim that associations reveal subconscious causal truths.
- **IDN-LISTEN-014** — Session data must remain linked to the Identity Version in which it was created.

## 15. AI behavior
Extract `{type, value, sourceResponseId, sourceQuoteRef, confidence}` and optionally cluster duplicates. No interpretation beyond candidate wording unless clearly labeled suggestion.

## 16. Human approval
Transcript edits and candidate confirmation remain human-controlled.

## 17. Validation
Audio assets exist/accessible; identity version valid; transcript language tracked; voice-note processing status explicit.

## 18. UI states
No audio, recording permission denied, recording, transcribing, transcript ready, extraction running, extraction failed, paused, review ready.

## 19. Edge cases
Multiple languages; instrumental music; emotionally sensitive memory; same association with contradictory meanings. Preserve nuance and allow protected flag.

## 20. Cross-module effects
Creates candidate associations; may create Voice Note/Transcript assets with lineage and privacy metadata.

## 21. Notifications and attention model
Background transcription completion can notify in-app if user left session; failure only surfaces when it blocks review.

## 22. Search / filtering / sorting / bulk actions
Not primary. Review phase filters candidates by type/song.

## 23. Analytics and product telemetry
Session completion, prompt skip, voice vs text, transcript correction rate, candidate acceptance downstream.

## 24. Learning feedback
Responses are `ARTIST_STATEMENT`/Identity evidence, not validated performance learnings.

## 25. Auditability / provenance
Preserve response/transcript version and extraction source refs.

## 26. Desktop / mobile behavior
Mobile excellent for voice capture/listening; desktop better for transcript/candidate review.

## 27. Accessibility / usability
Captions/transcripts, keyboard playback controls, text alternative to voice, no forced time limits.

## 28. Security / privacy / rights
Private voice/memories are internal; recording permission explicit; no external output by default.

## 29. Performance / async jobs
Transcription/extraction via JobService with resumable status.

## 30. Acceptance criteria
1. User can complete text-only.
2. Voice transcription is editable.
3. Extracted associations link to sources.
4. AI failure allows manual review/input.
5. Private associations can be protected.
6. No extracted association auto-confirms.

## 31. Test matrix
Unit: session state. Integration: voice asset→transcript→candidate. Agent eval: non-leading extraction. E2E: mobile voice session→desktop review.

## 32. Open questions
Prompt library/versioning belongs in UX/content design; should be eval-tested for leading bias.

## 33. Traceability
`IDN-LISTEN-001–014` → MASTER 62, 175–177, 404.
