# Song Segments

## 1. Metadata
- **Spec ID:** `SNG-SEG`
- **Domain:** `04_songs_music`
- **Feature:** Song Segments & Segment Intelligence
- **Status:** REVIEW
- **MASTER references:** 104, 107–109, 111, 138–141, 297–298, 308, 406, 451
- **Depends on:** Song; optional Audio Asset, Lyrics, Content/Publications/Metrics
- **Used by:** Factory, AudioUsage, Production, Segment Analytics, Experiments

## 2. Purpose
Represent reusable time-bounded musical/lyrical moments so Artist OS can plan content around specific sections and learn which segments work for which objectives/platforms without reducing a song to one “best hook”.

## 3. User problem / job-to-be-done
**JTBD:** “Help me identify and reuse specific moments of a song intentionally, track how often each one is used, and learn what each moment seems good for.”

## 4. Scope
Create/edit time ranges, musical section, lyrics excerpt, emotional/energy/story metadata, hook potential, usage count and evidence-aware Segment Intelligence.

Out: automatic audio fingerprinting (deferred), declaring one universal best segment, destructive audio editing.

## 5. Entry points
Song Brain → Segments, audio waveform, Lyrics, Factory audio selector, Analytics drill-down.

## 6. Preconditions and dependencies
Song exists. Segment can be defined without uploaded master if timestamps are known conceptually; exact playback requires accessible Audio Asset.

## 7. Information architecture
Waveform/list, segment cards with start/end/section/lyrics/emotion/energy/story meaning/hook potential/usage count. Analytics panel per segment.

## 8. User roles and permissions
Artist can define/confirm segments. AI can suggest boundaries/tags but not finalize truth-bearing meaning automatically.

## 9. Core data model
MASTER `SongSegment`:
```text
id
songId
startTime
endTime
section
lyrics
emotionalTags[]
energyLevel
storyMeaning
hookPotential
previousUsageCount
```
Sections:
`INTRO | VERSE | PRE_CHORUS | CHORUS | BRIDGE | OUTRO | CUSTOM`.

## 10. Main happy-path workflow
1. User opens Segments and selects audio/version context.
2. Defines or accepts suggested start/end.
3. Selects section type.
4. Links/reviews lyrics excerpt.
5. Adds emotional/energy/story context.
6. Optionally flags hook potential as artist judgment/candidate.
7. Saves segment.
8. Factory can select it for AudioUsage.
9. Publications linked to usages accumulate evidence.
10. Segment Analytics compares executions with sample/context.

## 11. Alternative workflows
No audio file; instrumental; overlapping segments; custom micro-hook inside chorus; alternate audio version with timing shift.

## 12. User actions
Create, edit boundaries/metadata, duplicate/derive, archive, audition, select for content, open usages/analytics, create experiment.

## 13. State model
Segments are active records with historical usage. MASTER does not define status; archive/deprecation may be repository behavior without changing past usages.

## 14. Business rules
- **SNG-SEG-001** — Every Segment MUST belong to exactly one Song.
- **SNG-SEG-002** — `startTime < endTime` and both MUST be non-negative.
- **SNG-SEG-003** — Segment section MUST use MASTER enum or `CUSTOM`.
- **SNG-SEG-004** — Overlapping Segments MUST be allowed when they represent different useful cuts/concepts.
- **SNG-SEG-005** — Segment lyrics MUST remain linked/reconcilable with canonical Lyrics where available.
- **SNG-SEG-006** — Segment emotional/story tags are contextual metadata and MUST NOT be presented as objective psychology.
- **SNG-SEG-007** — `hookPotential` MUST expose whether it is artist judgment, AI suggestion or evidence-informed inference if implementation supports provenance.
- **SNG-SEG-008** — Previous usage count MUST derive from linked AudioUsage/Content lineage rather than manual counter where feasible.
- **SNG-SEG-009** — Usage count alone MUST NOT imply performance quality.
- **SNG-SEG-010** — Segment Intelligence MUST compare multiple executions/platforms with sample context.
- **SNG-SEG-011** — One execution MUST NOT establish a validated “best segment” rule.
- **SNG-SEG-012** — Segment performance MUST be analyzed by relevant objectives/metrics, not views only.
- **SNG-SEG-013** — Cross-platform raw performance MUST respect platform baselines/context.
- **SNG-SEG-014** — Segment Analytics SHOULD distinguish format/hook/campaign confounds where data permits.
- **SNG-SEG-015** — A strong segment for discovery MAY differ from a strong segment for saves/follows/music conversion.
- **SNG-SEG-016** — System MUST support repeated use of a Segment while tracking fatigue/repetition context.
- **SNG-SEG-017** — Frequent use MUST NOT automatically prohibit future use.
- **SNG-SEG-018** — Segment boundaries tied to a specific Audio Asset/version MUST not silently shift when another version differs in timing.
- **SNG-SEG-019** — Alternate versions SHOULD support mapping/relationship to analogous musical sections without assuming identical timestamps.
- **SNG-SEG-020** — Speech/singing transcription may assist lyric alignment but MUST NOT be sole identification method for singing.
- **SNG-SEG-021** — AI can suggest candidate Segments from musical/lyric context but requires human confirmation before durable use.
- **SNG-SEG-022** — Segment storyMeaning MUST not overwrite Song-level meaning.
- **SNG-SEG-023** — Segment may intentionally omit lyrics for instrumental moments.
- **SNG-SEG-024** — Content Unit/Publication history MUST preserve exact segment start/end/version used when known.
- **SNG-SEG-025** — Editing Segment boundaries after historical use MUST NOT retroactively change historical AudioUsage parameters.
- **SNG-SEG-026** — Deleting a Segment with usage history SHOULD be replaced by archive/deprecation and preserve references.
- **SNG-SEG-027** — Segment-level Learnings MUST use `AUDIO_SEGMENT`/SONG scope and not auto-generalize globally.
- **SNG-SEG-028** — The system MUST support “insufficient evidence” rather than fabricate segment recommendations.

## 15. AI behavior
Suggest boundaries/tags/hook candidates from available audio/lyrics/context; summarize evidence. Must state uncertainty and source. No automatic “viral part” claim.

## 16. Human approval
Required to confirm durable Segment boundaries/meaning tags and any permanent candidate promotion.

## 17. Validation
Time bounds, song/audio mapping, lyrics reference, enum, version consistency.

## 18. UI states
No segments, manual-only/no audio, suggested candidates, mature usage data, insufficient evidence, stale/partial metrics.

## 19. Edge cases
Same chorus repeated at different timestamps; live arrangement changes order; micro-segment nested within chorus; remix changes structure.

## 20. Cross-module effects
Feeds Factory/Production/AudioUsage/Analytics/Experiments and Context Assembler.

## 21. Notifications and attention model
Only mapping breakage or meaningful experiment/learning result; no pressure to define all sections.

## 22. Search / filtering / sorting / bulk actions
Filter section/tags/usage/evidence; sort timeline/usage/recent. Bulk tag candidates may be allowed.

## 23. Analytics and product telemetry
Segment creation method, AI suggestion acceptance, usage selections, boundary corrections.

## 24. Learning feedback
Executions feed Segment Insights/Hypotheses/Experiments/Learnings with scoped confidence.

## 25. Auditability / provenance
Boundary/tag changes, source audio, AI run, historical usage snapshot.

## 26. Desktop / mobile behavior
Desktop waveform/editor; mobile audition/list/select in Factory/On-Set.

## 27. Accessibility / usability
Textual timestamp controls and keyboard adjustment; waveform not sole representation.

## 28. Security / privacy / rights
Audio/lyrics rights apply. External sounds handled separately through AudioAsset/Usage rights.

## 29. Performance / async jobs
Waveform/analysis jobs async; CRUD/playback immediate where asset available.

## 30. Acceptance criteria
1. Overlapping/custom segments supported.
2. Historical AudioUsage keeps original timing after edits.
3. One execution cannot create validated best-segment rule.
4. Segment recommendations show evidence/uncertainty.
5. Alternate versions do not share timestamps blindly.
6. Segment learnings stay scoped.

## 31. Test matrix
Unit: time/enum/history. Integration: Lyrics/AudioUsage/Analytics. Agent eval: no viral certainty. E2E: Segment→Content→Publication→metrics→Learning.

## 32. Open questions
Whether analogous Segment mapping across Release Extensions needs first-class relation (`equivalentSegmentId`) or stays manual metadata.

## 33. Traceability
`SNG-SEG-001–028` → MASTER 104, 107–109, 111, 138–141, 297–298, 308, 406, 451.
