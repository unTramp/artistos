# Song Brain Knowledge Namespace

- **Status:** REVIEW COMPLETE
- **MASTER references:** §103–112, §113–126
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `song-brains`
- **Requirement prefix:** `KNW-SNG`

## 2. Purpose
Expose the relevant Song Brain as a scoped knowledge namespace for tasks without copying Artist Identity or unrelated catalog context.

## 3. User problem / job-to-be-done
Generation and strategy around one song often gets polluted by generic artist context or another song’s story. The OS needs song-specific retrieval boundaries.

## 4. Scope
### In scope
- Song Brain sections
- retrieval/indexing
- song-scoped learnings/history
- identity context reference

### Out of scope / non-goals
- duplicating Artist Brain
- global retrieval of all songs by default

## 5. Entry points
- Song detail
- Context Assembler
- Factory
- Research

## 6. Preconditions and dependencies
- Song entities/segments/audio/history/learnings

## 7. Information architecture
Song data maintained in owning domain → indexed/summarized for knowledge retrieval → Context Assembler selects only task-relevant sections.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Knowledge namespace over existing Song domain, not separate duplicate source of truth.

## 10. Main happy-path workflow
1. open Brain
2. inspect sources
3. refresh summary/index
4. correct source domain data

## 11. Alternative workflows
- cover song
- lyrics unavailable
- song has multiple interpretations
- old experiments stale

## 12. User actions
- search within song
- open source
- refresh embeddings/summary

## 13. State model
Follows Song source entities; retrieval metadata may stale when source changes.

## 14. Business rules
- `KNW-SNG-001` Song Brain MUST be scoped by songId.
- `KNW-SNG-002` It MUST NOT copy full Artist Identity; use SongIdentityContext/reference.
- `KNW-SNG-003` FACT / ARTIST_INTERPRETATION / AUDIENCE_INTERPRETATION distinctions MUST survive retrieval.
- `KNW-SNG-004` Historical Content/Experiment/Learning sections MUST retain dates/scope.
- `KNW-SNG-005` Unrelated songs MUST not enter context unless task explicitly requests catalog comparison.
- `KNW-SNG-006` Stale/deprecated learnings MUST be marked/downweighted.
- `KNW-SNG-007` AI summary MUST not merge audience theory into artist-authored meaning.
- `KNW-SNG-008` Retrieval should prefer exact song references over semantic similarity when songId is explicit.

## 15. AI behavior
AI can summarize/retrieve sections but source domain remains authoritative.

## 16. Human approval
Permanent Song Brain source edits occur through Song domain workflows.

## 17. Validation
- songId valid
- source version indexed
- interpretation labels preserved

## 18. UI states
- complete
- partial
- index stale
- no lyrics
- archived song

## 19. Edge cases
- same song title duplicates
- cover vs original
- release extension

## 20. Cross-module effects
- Song domain
- Context Assembler
- Factory
- Analytics

## 21. Notifications and attention model
- index stale after source edit

## 22. Search / filtering / sorting / bulk actions
Search scoped to song; catalog search only explicit.

## 23. Analytics and product telemetry
- retrieval used
- source opened
- index refreshed

## 24. Learning feedback
Uses existing song learnings; no independent promotion.

## 25. Auditability / provenance
Source IDs/versions returned with chunks.

## 26. Desktop / mobile behavior
Desktop rich Brain; mobile concise summary.

## 27. Accessibility / usability
Labels interpretation provenance clearly.

## 28. Security / privacy / rights
Private demos/voice notes obey rights/privacy.

## 29. Performance / async jobs
Embedding/summary refresh async.

## 30. Acceptance criteria
- `KNW-SNG-AC01` Explicit song task excludes unrelated songs.
- `KNW-SNG-AC02` Interpretation labels survive retrieval.
- `KNW-SNG-AC03` Stale learning marked.
- `KNW-SNG-AC04` Source remains Song domain.

## 31. Test matrix
- cover
- duplicate title
- stale index
- no lyrics

## 32. Open questions
- Knowledge indexing granularity/chunk schema to define during engineering.

## 33. Traceability
MASTER §103–112, §113–126
