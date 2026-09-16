# Lyrics & References

## 1. Metadata
- **Spec ID:** `SNG-LYR`
- **Domain:** `04_songs_music`
- **Feature:** Lyrics & References
- **Status:** REVIEW
- **MASTER references:** 49, 104, 107, 141, 182–184, 406
- **Depends on:** Song; optional lyric document/asset, rights metadata
- **Used by:** Segments, Factory, Caption/Hook generation, Pitch/Website, Search

## 2. Purpose
Provide a reliable song-linked lyrics reference for internal creative/context workflows while preserving source, version and rights/ownership context.

## 3. User problem / job-to-be-done
**JTBD:** “Let the system know the actual words of this song and where they belong, so it can work with exact sections without hallucinating lyrics or mixing versions.”

## 4. Scope
Lyrics reference, versions, section/timestamp linkage, source/provenance, internal search and relation to SongSegments.

Out: public lyric licensing/distribution, lyric scraping, automatic assumptions that lyrics may be republished externally.

## 5. Entry points
Song Brain → Lyrics, upload/import asset, transcription review, Segment editor.

## 6. Preconditions and dependencies
Song exists. Lyrics may be absent. For covers/third-party compositions, external reuse rights may differ from internal reference rights.

## 7. Information architecture
Version selector, text/sections, timestamps/segment links, source/rights note, language, compare revisions.

## 8. User roles and permissions
Artist can add/edit internal reference. External publication/export follows rights scope.

## 9. Core data model
MASTER Song has `lyricsReference`; SongSegment can contain `lyrics`. Product should avoid uncontrolled duplication: canonical lyric source + segment excerpts/links where practical.

## 10. Main happy-path workflow
1. User adds/pastes/uploads lyrics source.
2. System stores source/provenance and optional language/version.
3. User reviews text.
4. Sections/timestamps may be linked manually or suggested from audio/transcription.
5. SongSegments reference corresponding lyric portions.
6. AI/Factory uses only supplied lyrics/reference and does not invent missing lines as exact lyrics.

## 11. Alternative workflows
No lyrics; instrumental; cover; alternate version; multilingual version; partial lyrics only.

## 12. User actions
Add/edit/version, mark canonical internal reference, link segment, compare, archive old version, search.

## 13. State model
`MISSING | PARTIAL | REVIEWED` as view readiness; versions retain history. No need for a global lyric approval workflow unless rights/use scope demands it.

## 14. Business rules
- **SNG-LYR-001** — Lyrics MAY be absent and this MUST NOT block Song creation.
- **SNG-LYR-002** — System MUST distinguish canonical internal lyric reference from generated/transcribed candidate text.
- **SNG-LYR-003** — AI MUST NOT invent missing lyric lines and present them as exact lyrics.
- **SNG-LYR-004** — Speech/singing transcription MAY create candidate lyric text but requires review before canonical use.
- **SNG-LYR-005** — Alternate lyric versions MUST remain versioned and attributable to the relevant audio/release context.
- **SNG-LYR-006** — Segment lyric excerpts SHOULD link to canonical reference where possible rather than create divergent copies.
- **SNG-LYR-007** — Editing canonical lyrics MUST surface affected Segment mappings.
- **SNG-LYR-008** — Cover/third-party lyrics MUST carry appropriate rights/use caution and MUST NOT be assumed freely republishable.
- **SNG-LYR-009** — Internal AI context access to lyrics does not itself imply external publication rights.
- **SNG-LYR-010** — Lyrics language MUST not be guessed as authoritative without review when detection confidence is low.
- **SNG-LYR-011** — Instrumental songs MUST support explicit `no lyrics` state rather than appear incomplete forever.
- **SNG-LYR-012** — Deleted/archived lyric source MUST not silently orphan historical Segment/Content provenance.
- **SNG-LYR-013** — Search/highlight can operate on internal lyrics where rights/privacy scope permits.
- **SNG-LYR-014** — Public-facing outputs that quote lyrics MUST respect applicable rights/artist ownership rules configured by the system.
- **SNG-LYR-015** — Lyrics text MUST not be treated as proof that described events are factual biography.
- **SNG-LYR-016** — AI semantic analysis of lyrics creates interpretation candidates, not factual artist psychology.
- **SNG-LYR-017** — Original-song artist-provided lyrics remain user-controlled source material and retain version history.
- **SNG-LYR-018** — Missing/partial lyrics MUST be explicitly represented in Context Pack so agents know uncertainty.

## 15. AI behavior
Can detect sections, align candidate timestamps, summarize themes and retrieve exact user-supplied lines internally. Must label transcription uncertainty and never fabricate exact text.

## 16. Human approval
Canonical lyrics/version and transcription correction require user confirmation.

## 17. Validation
Song ownership, version uniqueness, source/asset existence, language, timestamp bounds, rights metadata where relevant.

## 18. UI states
Missing, partial, transcription candidate, reviewed, alternate versions, rights warning.

## 19. Edge cases
Different live lyrics; repeated chorus; changed pronouns; multilingual lines; censored release version.

## 20. Cross-module effects
Feeds Segments, Hooks, Story/Meaning, Context and content generation. Does not change Song story automatically.

## 21. Notifications and attention model
Only mapping breakage/rights conflict/review pending from explicit transcription job.

## 22. Search / filtering / sorting / bulk actions
Search text; filter versions/sections. No bulk destructive rewrite.

## 23. Analytics and product telemetry
Alignment corrections, canonicalization, segment link usage.

## 24. Learning feedback
Lyrics themselves are source knowledge; performance of specific excerpts belongs to Segment Analytics/Learnings.

## 25. Auditability / provenance
Source, version, editor, transcription provider/run, corrections.

## 26. Desktop / mobile behavior
Desktop full edit/alignment; mobile read/search/quick correction.

## 27. Accessibility / usability
Readable typography, keyboard navigation, timestamps exposed textually.

## 28. Security / privacy / rights
Unreleased lyrics internal; rights boundary enforced for external publication/export.

## 29. Performance / async jobs
Transcription/alignment async; manual text immediate.

## 30. Acceptance criteria
1. Partial/no-lyrics songs are supported.
2. AI cannot fabricate exact missing lyrics.
3. Versions map to relevant audio context.
4. Cover lyrics are not assumed publishable.
5. Canonical edit warns affected Segment mappings.

## 31. Test matrix
Unit: version/timestamp validation. Integration: Segment mappings/rights. Agent eval: no lyric fabrication. E2E: upload→review→segment linkage.

## 32. Open questions
Whether canonical lyrics live as DOCUMENT Asset + structured section index or a dedicated LyricVersion entity; MASTER only specifies `lyricsReference`.

## 33. Traceability
`SNG-LYR-001–018` → MASTER 49, 104, 107, 141, 182–184, 406.
