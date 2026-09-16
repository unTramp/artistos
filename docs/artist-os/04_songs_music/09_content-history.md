# Song Content History

## 1. Metadata
- **Spec ID:** `SNG-HIST`
- **Domain:** `04_songs_music`
- **Feature:** Song Content History
- **Status:** REVIEW
- **MASTER references:** 104, 130–147, 187–190, 197–202, 287–300, 406
- **Depends on:** Song, Content Units, Publications, AudioUsage, Assets, Metrics
- **Used by:** Song Brain, Factory, Novelty/Fatigue, Analytics, Strategy

## 2. Purpose
Provide a complete lineage-aware history of what has already been created and published around a Song so future ideas can avoid accidental repetition and reuse proven/raw material intentionally.

## 3. User problem / job-to-be-done
**JTBD:** “Before I make another post for this song, show me what I have already tried — concept, hook, setup, segment, format and result — so I can repeat on purpose, not by accident.”

## 4. Scope
Song-linked Content Units, publication adaptations, concepts/angles/hooks, audio segments, production setups, statuses, metrics summary and similarity/repetition context.

Out: replacing Pipeline or global Analytics.

## 5. Entry points
Song Brain → Content History, Factory novelty check, Analytics drill-down, Campaign history.

## 6. Preconditions and dependencies
Song exists. History derives from Content lineage and may be empty.

## 7. Information architecture
Timeline/table/grid with filters for Pillar, Narrative, format, platform, status, Segment, hook, date, Campaign. Similarity clusters and performance summary optional.

## 8. User roles and permissions
Read history; safe metadata corrections through owning entities.

## 9. Core data model
Projection over `ContentAngle`, `ContentUnit`, `AudioUsage`, `ShootSession/Assets`, `Publication`, `MetricSnapshot`, Identity/Era lineage and experiments.

## 10. Main happy-path workflow
1. User opens history.
2. System shows all song-linked Content Units and their Publications.
3. User filters by concept/format/segment/platform/time.
4. Opens item to inspect Angle, Hook, production setup, audio, metrics and learnings.
5. Factory can query similarity/recency before proposing new Angle.
6. User chooses deliberate reuse, adaptation or novel direction.

## 11. Alternative workflows
Content manually linked after publication; one Content Unit spans songs (rare/mashup); historical import has incomplete metadata; duplicate publication import.

## 12. User actions
Filter/search/open, compare executions, start derivative/repurpose, correct Song link through owning workflow, create experiment from similar executions.

## 13. State model
History items follow their source Content/Publication states. Historical records remain visible after archive.

## 14. Business rules
- **SNG-HIST-001** — Song Content History MUST derive from source Content/Publication lineage and MUST NOT maintain a second mutable copy.
- **SNG-HIST-002** — One Content Unit MAY have multiple platform-specific Publications.
- **SNG-HIST-003** — History MUST distinguish Content Unit from Publication.
- **SNG-HIST-004** — History SHOULD expose concept/Angle, Hook, Segment/AudioUsage, production setup and Identity/Era where available.
- **SNG-HIST-005** — Archived/rejected/paused Content MAY be included via filters and MUST not vanish from decision memory.
- **SNG-HIST-006** — Missing historical metadata MUST remain unknown rather than reverse-engineered as fact.
- **SNG-HIST-007** — Similarity/Novelty analysis MUST distinguish identity repetition from execution repetition.
- **SNG-HIST-008** — Reusing a successful concept MUST be allowed intentionally and should preserve parent/derivation relation when appropriate.
- **SNG-HIST-009** — Repetition warning MUST NOT block creation.
- **SNG-HIST-010** — Similarity result MUST expose which dimensions matched: concept, visual setup, hook style, Segment, format or Narrative.
- **SNG-HIST-011** — One viral outlier MUST not cause all future Song content to converge on that execution.
- **SNG-HIST-012** — Historical performance MUST retain platform/time context.
- **SNG-HIST-013** — Raw cross-platform metrics MUST not be naively compared in history summaries.
- **SNG-HIST-014** — History MUST preserve historical Identity Version/Era links.
- **SNG-HIST-015** — Content deleted from active planning but retained by audit/history SHOULD remain referentially visible when allowed.
- **SNG-HIST-016** — Factory SHOULD consult relevant recent/similar history under context budgets before new Angle generation.
- **SNG-HIST-017** — Song History MUST not be the sole source of strategy; Identity/Campaign/Learnings remain separate inputs.
- **SNG-HIST-018** — Historical import confidence/provenance MUST be distinguishable from native lineage.
- **SNG-HIST-019** — Duplicate Publication imports MUST not double-count performance/history.
- **SNG-HIST-020** — User MUST be able to inspect why a new idea was flagged as similar.

## 15. AI behavior
Can summarize patterns and find similar executions. Must cite items/dimensions and avoid claiming causal best practices.

## 16. Human approval
No approval for read-only history; corrections/merges/links through owning domain require explicit action.

## 17. Validation
Song linkage, duplicate IDs/import keys, lineage references, metric scope.

## 18. UI states
Empty, native rich history, partial imported history, similarity available/unavailable, stale metrics.

## 19. Edge cases
Same concept posted on three platforms; repost/crop vs distinct unit; song snippet appears in personal post but Song not primary subject.

## 20. Cross-module effects
Provides novelty/fatigue/history context to Factory/Strategy and evidence drill-down to Analytics.

## 21. Notifications and attention model
No history notifications by default; fatigue/similarity attention belongs to relevant planning/Factory context.

## 22. Search / filtering / sorting / bulk actions
Rich filters above; sort date/performance within valid scope/status. Bulk metadata correction only with source ownership rules.

## 23. Analytics and product telemetry
Filter usage, similarity opens, deliberate reuse actions, correction rate.

## 24. Learning feedback
History supplies evidence, but Learning creation happens through Insight/Hypothesis/Experiment workflow.

## 25. Auditability / provenance
Native/imported source, linkage changes, duplicates/merges and similarity model/config provenance.

## 26. Desktop / mobile behavior
Desktop deep history/comparison; mobile recent items and search.

## 27. Accessibility / usability
List/table alternative to visual grid; thumbnails described by metadata.

## 28. Security / privacy / rights
Private/unpublished Content visible only internally.

## 29. Performance / async jobs
Similarity embeddings/indexing async; timeline/query paginated/cached.

## 30. Acceptance criteria
1. Content Unit and Publication are distinct.
2. History preserves archived and historical Identity context.
3. Similarity explains dimensions and never blocks creation.
4. Missing import metadata remains unknown.
5. Duplicate imports do not double-count.
6. Factory can retrieve relevant history under context limits.

## 31. Test matrix
Unit: dedupe/history grouping. Integration: Content/Publications/Identity/metrics. Agent eval: evidence-bounded summary. E2E: create→publish→history→similarity-aware new Angle.

## 32. Open questions
Precise rule for song attribution on Content Units that use a Song only as secondary/background audio should be centralized with Content/AudioUsage schema.

## 33. Traceability
`SNG-HIST-001–020` → MASTER 104, 130–147, 187–190, 197–202, 287–300, 406.
