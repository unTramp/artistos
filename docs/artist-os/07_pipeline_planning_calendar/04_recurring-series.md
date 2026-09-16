# Recurring Series

- **Status:** REVIEW COMPLETE
- **MASTER references:** §149–150, §144–146, §151–153
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `recurring-series`
- **Requirement prefix:** `PLN-SER`

## 2. Purpose
Define repeatable content concepts that reduce ideation overhead while preserving identity coherence and preventing execution fatigue.

## 3. User problem / job-to-be-done
Some formats deserve repetition because audiences recognize them and production becomes efficient, but repeating a format without fatigue awareness quickly becomes stale. The system needs to distinguish a healthy series from mechanical duplication.

## 4. Scope
Series definition, cadence preference, identity rules, Narrative/Pillar, platforms, episode lineage, pause/retire, fatigue observation.

## 5. Entry points
Evergreen Pool, Factory, Planning, Content History, Weekly Review.

## 6. Preconditions and dependencies
Artist required; active Identity recommended. NarrativeTrack optional. Series can be cross-song or song-specific by product configuration even though MASTER schema does not explicitly define song linkage.

## 7. Information architecture
Series library → series detail → concept/rules → episode history → cadence → fatigue/performance context → create next episode.

## 8. User roles and permissions
Single artist creates/edits/pauses/retires. AI suggestions require approval.

## 9. Core data model
Uses MASTER `RecurringSeries {id, artistId, name, concept, narrativeTrackId?, pillar, cadence, platforms[], identityRules, status}` plus episode references to ContentUnits. Exact status enum and episode relation need schema definition.

## 10. Main happy-path workflow
Create series → define recognizable concept and identity constraints → choose preferred cadence/platforms → create episode Angle/Unit → episode enters Pipeline → performance/history accumulates → review fatigue and continuation.

## 11. Alternative workflows
Series without fixed cadence; seasonal series; campaign-specific temporary series; paused series; format evolves; one episode intentionally deviates; platform-specific adaptation.

## 12. User actions
Create/edit/duplicate/pause/resume/retire, create episode, reorder guidance, link Narrative, inspect history, change cadence prospectively.

## 13. State model
Draft/Active/Paused/Retired recommended behavior; MASTER leaves `status` enum unspecified.

## 14. Business rules
- `PLN-SER-001` A RecurringSeries MUST represent a repeatable concept, not merely a tag applied to unrelated posts.
- `PLN-SER-002` Series concept MUST describe what remains stable across episodes and what is allowed to vary.
- `PLN-SER-003` Series identityRules MUST inherit hard/non-negotiable Identity constraints.
- `PLN-SER-004` Preferred cadence MUST remain advisory unless user makes an explicit operational commitment.
- `PLN-SER-005` Series MAY run without a fixed cadence.
- `PLN-SER-006` Every episode MUST remain a normal ContentUnit with its own lineage/status/publications.
- `PLN-SER-007` Series history MUST expose previous execution similarity to reduce accidental duplication.
- `PLN-SER-008` Repeated signature elements MUST NOT be penalized as fatigue merely because they are recognizable.
- `PLN-SER-009` Fatigue evaluation SHOULD focus on execution pattern, response trend, frequency, similarity, sample size and time window.
- `PLN-SER-010` A fatigue warning MUST NOT automatically retire a series.
- `PLN-SER-011` Series MAY be paused without losing history or future reactivation.
- `PLN-SER-012` Editing the series concept MUST NOT silently rewrite historical episode metadata.
- `PLN-SER-013` A major concept change SHOULD create a new version/series or explicit evolution event rather than pretending continuity is identical.
- `PLN-SER-014` AI MUST NOT generate an episode merely because cadence date arrived if no worthwhile idea exists.
- `PLN-SER-015` Series MUST remain usable without AI.

## 15. AI behavior
Can suggest next episode from available Songs/Assets/Narrative gaps while preserving invariant series identity. Must show novelty relative to previous episodes and fatigue context. Cannot auto-publish or auto-retire.

## 16. Human approval
Series activation, concept evolution and new committed episodes require user decision. AI fatigue findings remain recommendations/observations.

## 17. Validation
Name/concept required; identityRules cannot contradict non-negotiable Identity without explicit deviation; platforms valid; linked Narrative resolves.

## 18. UI states
No series; draft; active healthy; watch/saturated fatigue context; paused; retired; AI unavailable; no suitable next episode.

## 19. Edge cases
Series crosses Era transition; old visual rules conflict; platform removed; cadence missed; series is high-performing but artist dislikes it; one viral outlier distorts average.

## 20. Cross-module effects
Episodes feed Factory/Pipeline/Calendar; series appears in Evergreen Pool; performance feeds Fatigue/Analytics; identity changes may trigger review warning.

## 21. Notifications and attention model
Only explicit upcoming commitments or meaningful fatigue/identity conflicts should surface. Missed advisory cadence alone is low/no attention.

## 22. Search / filtering / sorting / bulk actions
Filter status, Pillar, Narrative, Platform, recent activity, fatigue state. No bulk episode generation.

## 23. Analytics and product telemetry
Episodes created/published, time saved proxies, series continuation, manual cadence changes, fatigue warning outcomes.

## 24. Learning feedback
Series performance can support format hypotheses only through standard evidence pipeline; no “series works” conclusion from one episode.

## 25. Auditability / provenance
Track series revisions, episode links, cadence changes, identity version at episode creation.

## 26. Desktop / mobile behavior
Desktop series configuration/history; mobile create-next/quick capture/history preview.

## 27. Accessibility / usability
Series invariants and variable parts should be human-readable. Avoid score-only health indicator.

## 28. Security / privacy / rights
Same rules as Content/Assets; private concept notes remain internal.

## 29. Performance / async jobs
History/fatigue aggregates can be cached; AI next-episode generation async.

## 30. Acceptance criteria
- `PLN-SER-AC01` Series defines stable concept and variable episode space.
- `PLN-SER-AC02` Episodes are canonical ContentUnits.
- `PLN-SER-AC03` Pause/retire preserves history.
- `PLN-SER-AC04` Fatigue is explainable and non-destructive.
- `PLN-SER-AC05` Cadence does not force filler generation.

## 31. Test matrix
Active; no cadence; missed cadence; fatigue watch; viral outlier; Era change; paused/resumed; major concept edit; AI outage.

## 32. Open questions
RecurringSeries `status` enum and whether major concept evolution requires formal version entity need schema/product freeze.

## 33. Traceability
MASTER §144–153.
