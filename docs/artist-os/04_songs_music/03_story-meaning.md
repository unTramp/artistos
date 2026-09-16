# Story, Meaning & Interpretation

## 1. Metadata
- **Spec ID:** `SNG-MEAN`
- **Domain:** `04_songs_music`
- **Feature:** Story, Meaning & Interpretation
- **Status:** REVIEW
- **MASTER references:** 49, 103–106, 117–123, 212, 386, 406, 450–451
- **Depends on:** Song; optional Artist statements, lyrics, Identity/Mystique
- **Used by:** Song Brain, Factory, Narrative, Owned Media, Editorial Pitch, Context Assembler

## 2. Purpose
Capture what the song is about, how the artist understands it, and how audiences may interpret it without collapsing factual history, artist intent and audience readings into one “truth”.

## 3. User problem / job-to-be-done
**JTBD:** “Preserve the real story and meanings behind my song so I can tell it consistently when useful, while keeping private parts private and allowing listeners to interpret it differently.”

## 4. Scope
Story, meaning, interpretations, provenance, disclosure/protection, optional evidence links and audience interpretation collection.

Out: psychotherapy/psychological diagnosis, invented biography, forcing one official explanation, replacing Mystique policy.

## 5. Entry points
Song Brain → Story & Meaning; voice-note extraction; Identity/Narrative contextual links; Campaign/Press/DSP pitch preparation.

## 6. Preconditions and dependencies
Song exists. Can be built manually with no lyrics/audio available.

## 7. Information architecture
Sections:
- Song story / factual background.
- Artist meaning/interpretation.
- Protected/private notes.
- Audience interpretations.
- What may be publicly said.
- Sources/evidence.

## 8. User roles and permissions
Artist is final authority over artist statements, private story and intended disclosure. Audience interpretations remain attributed/observational.

## 9. Core data model
MASTER gives Song `story`, `meaning` and interpretation labels:
```text
FACT
ARTIST_INTERPRETATION
AUDIENCE_INTERPRETATION
```
Detailed implementation may normalize statements into records with label, text, sourceId, visibility/protection and timestamps instead of relying solely on free-text Song fields.

## 10. Main happy-path workflow
1. User opens Story & Meaning.
2. Adds factual background and/or artist interpretation.
3. Marks sensitive/private elements.
4. Optionally records voice note; pipeline extracts candidate statements.
5. User reviews each candidate and assigns FACT or ARTIST_INTERPRETATION where appropriate.
6. Audience interpretations can be captured separately with source/context.
7. Mystique/Interpretation policy determines what can be exposed to downstream external outputs.
8. Context Assembler selects only task-relevant allowed material.

## 11. Alternative workflows
Song intentionally ambiguous; fictional story; cover with personal interpretation; no public explanation; changing artist interpretation over time.

## 12. User actions
Add/edit/archive statement, label type, protect/unprotect, attach source, approve/reject extracted candidate, create public fragment, compare history.

## 13. State model
Individual statements may use knowledge/candidate states rather than a separate local lifecycle. Public disclosure status is orthogonal to epistemic label.

## 14. Business rules
- **SNG-MEAN-001** — FACT, ARTIST_INTERPRETATION and AUDIENCE_INTERPRETATION MUST remain distinguishable.
- **SNG-MEAN-002** — AI MUST NOT convert an inference into FACT without artist/source confirmation.
- **SNG-MEAN-003** — AI MUST NOT invent biographical events to make the song story more compelling.
- **SNG-MEAN-004** — Artist meaning MUST NOT be overwritten by audience interpretation or performance data.
- **SNG-MEAN-005** — Audience interpretations MUST retain attribution/source context when available.
- **SNG-MEAN-006** — Multiple contradictory audience interpretations MAY coexist.
- **SNG-MEAN-007** — Multiple artist interpretations MAY coexist across time if version/provenance is preserved.
- **SNG-MEAN-008** — The artist MAY intentionally choose `ambiguous / prefer not to explain` without reducing Song readiness.
- **SNG-MEAN-009** — Private story elements MUST be filterable from external Context Packs and exports.
- **SNG-MEAN-010** — Publicly usable story fragments MUST still respect Identity Mystique/Interpretation policy.
- **SNG-MEAN-011** — Fictional narrative elements MUST not be represented as factual biography when factual status matters.
- **SNG-MEAN-012** — Cover-song personal meaning MUST be separable from claims about the original writer/artist's intent.
- **SNG-MEAN-013** — External facts about a song/composition require source/provenance appropriate to claim type.
- **SNG-MEAN-014** — Voice-note extraction creates Candidate Knowledge, not permanent meaning automatically.
- **SNG-MEAN-015** — Content captions/scripts may draw from approved story fragments but MUST NOT mutate the Song story source-of-truth.
- **SNG-MEAN-016** — A high-performing explanatory post MUST NOT force the artist to explain the song more explicitly in future.
- **SNG-MEAN-017** — Song story/meaning can evolve, but edits MUST preserve change history for historically published content.
- **SNG-MEAN-018** — The system SHOULD distinguish what is known, what the artist believes/means, and what listeners inferred.
- **SNG-MEAN-019** — Protected people/locations/relationships SHOULD support abstraction/redaction for public use rather than all-or-nothing deletion.
- **SNG-MEAN-020** — AI summaries MUST cite the underlying approved statements used.
- **SNG-MEAN-021** — “Meaning” MUST NOT be reduced to a single marketing tagline.
- **SNG-MEAN-022** — The user MUST be able to store internal nuance that is never exposed publicly.
- **SNG-MEAN-023** — Song meaning MUST not be treated as psychological diagnosis of the artist.
- **SNG-MEAN-024** — If factual statements conflict, the system MUST surface conflict rather than merge them into a synthetic fact.
- **SNG-MEAN-025** — Downstream Pitch/Website/Content outputs MUST use only disclosure-eligible statements for their audience/surface.

## 15. AI behavior
AI may summarize, structure and extract candidate statements from user material. Structured output must include candidate label, source, confidence and disclosure warning. It cannot invent facts, resolve contested meaning silently or expose protected content.

## 16. Human approval
Required for FACT/ARTIST_INTERPRETATION confirmation, protection/disclosure changes and promotion from candidates.

## 17. Validation
Song ownership, source existence where referenced, allowed labels, protection policy, conflicting fact detection.

## 18. UI states
Empty, candidate review, confirmed, ambiguous/no-explanation, protected-heavy, conflict, source missing.

## 19. Edge cases
Fictional first-person lyric mistaken for biography; artist changes interpretation years later; audience meme interpretation becomes popular; original/cover intent confusion.

## 20. Cross-module effects
Feeds Context Assembler, Factory, Editorial Pitch, Narrative/Website story and Brand/Identity Guard filtering.

## 21. Notifications and attention model
Only factual conflicts, disclosure conflicts, candidate review when explicitly created. No prompt to “explain your song” by default.

## 22. Search / filtering / sorting / bulk actions
Filter by label/protection/source; search text. No bulk unprotect/public action.

## 23. Analytics and product telemetry
Candidate acceptance/relabeling, public-fragment use, AI summary corrections. Do not optimize private disclosure level.

## 24. Learning feedback
Audience reaction may create observations/hypotheses about communication, not alter source meaning.

## 25. Auditability / provenance
Every statement: actor, source, label, visibility, created/updated, previous values.

## 26. Desktop / mobile behavior
Desktop rich editor; mobile voice-note capture/candidate review/quick edit.

## 27. Accessibility / usability
Clear labels with explanations; protection badges not color-only; autosave long text.

## 28. Security / privacy / rights
High-sensitivity internal story; strict context minimization and export filtering.

## 29. Performance / async jobs
Voice transcription/extraction async. Manual editing immediate.

## 30. Acceptance criteria
1. Three interpretation labels remain distinct.
2. AI cannot invent biography or promote inference to fact.
3. Protected details are excluded downstream.
4. Cover personal meaning is distinct from original creator intent.
5. Conflicting facts remain unresolved until reviewed.
6. Artist can choose ambiguity/no explanation.

## 31. Test matrix
Unit: label/protection/conflict. Integration: Context/Pitch/Website filtering. Agent eval: no biography invention. E2E: voice note→candidate→approved story→content context.

## 32. Open questions
Whether statement-level normalized entity belongs in Song Brain schema or generic Knowledge system. MASTER gives labels but not storage granularity; schema pass should choose one canonical model.

## 33. Traceability
`SNG-MEAN-001–025` → MASTER 49, 103–106, 117–123, 212, 386, 406, 450–451.
