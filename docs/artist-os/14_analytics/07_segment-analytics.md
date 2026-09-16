# Song Segment Analytics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §107–109, §298
- **Domain:** 14_analytics
- **Feature slug:** `segment-analytics`
- **Requirement prefix:** `ANA-SEG`

## 2. Purpose
Compare repeated uses of SongSegments across executions/platforms to identify promising moments without declaring a segment effective after one use.

## 3. User problem / job-to-be-done
Artists repeatedly choose song clips based on intuition. The OS can accumulate evidence about chorus/verse/bridge moments, but only if executions and confounders are handled carefully.

## 4. Scope
### In scope
- SongSegment usage count
- views/share/save/follow/music conversion distributions
- platform/context scope
- experiment links
- confidence

### Out of scope / non-goals
- automatic “best 15 seconds” from one post
- audio fingerprinting in MVP

## 5. Entry points
- Song Brain
- Analytics
- Factory audio selection

## 6. Preconditions and dependencies
- SongSegment
- AudioUsage
- Content/Publications
- metrics

## 7. Information architecture
Select song → view segments/usage count → choose platform/context → compare median/distributions → inspect executions/outliers → create segment hypothesis/recommendation.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Projection from SongSegment/AudioUsage/Publication metrics.

## 10. Main happy-path workflow
1. open song segment analytics
2. filter platform/format
3. inspect repeated uses
4. compare segments only with sample context
5. send promising segment to Factory as hypothesis

## 11. Alternative workflows
- one use only
- segments overlap
- different mixes/live version
- usage timestamps approximate

## 12. User actions
- filter
- open examples
- correct AudioUsage mapping
- create hypothesis

## 13. State model
No lifecycle.

## 14. Business rules
- `ANA-SEG-001` Segment analysis MUST use repeated executions when making comparative claims.
- `ANA-SEG-002` One use MUST NOT be sufficient to declare a segment best.
- `ANA-SEG-003` Usage count/sample size MUST be visible.
- `ANA-SEG-004` Platform/format/context SHOULD be controlled or disclosed.
- `ANA-SEG-005` Different audio versions/mixes MUST remain distinguishable when material.
- `ANA-SEG-006` Overlapping/custom segments MUST not be silently merged.
- `ANA-SEG-007` Outliers MUST be handled explicitly.
- `ANA-SEG-008` AI MUST not infer exact segment usage if AudioUsage mapping is uncertain.
- `ANA-SEG-009` Promising segment result SHOULD create a hypothesis/retest, not automatic rule.

## 15. AI behavior
AI summarizes segment evidence and recommends retests with confidence.

## 16. Human approval
Mapping corrections and Learning promotion human-reviewed.

## 17. Validation
- segment references valid
- AudioUsage mapping confidence adequate
- sample count known

## 18. UI states
- single use
- multi-use
- mapping uncertain
- outlier-heavy
- version split

## 19. Edge cases
- same chorus different live/master
- platform sound trims start
- overlap

## 20. Cross-module effects
- Song Brain
- Factory
- Experiments
- Insights

## 21. Notifications and attention model
- segment mapping uncertainty affects analysis

## 22. Search / filtering / sorting / bulk actions
Filter song/segment/platform/format/audio version/period.

## 23. Analytics and product telemetry
- segment comparison viewed
- mapping corrected
- hypothesis created

## 24. Learning feedback
Validated evidence can become AUDIO_SEGMENT scoped Learning.

## 25. Auditability / provenance
Preserve AudioUsage and execution references.

## 26. Desktop / mobile behavior
Desktop song chart/table; mobile top evidence summary.

## 27. Accessibility / usability
Use waveform/labels plus text; no implied precision beyond source timestamps.

## 28. Security / privacy / rights
No extra privacy.

## 29. Performance / async jobs
Aggregation async optional.

## 30. Acceptance criteria
- `ANA-SEG-AC01` One-use segment is not declared best.
- `ANA-SEG-AC02` Version/context is visible.
- `ANA-SEG-AC03` Outliers handled.
- `ANA-SEG-AC04` Hypothesis can be created.

## 31. Test matrix
- single use
- live vs master
- overlap
- uncertain mapping

## 32. Open questions
- Segment-comparison minimum observations should be calibrated.

## 33. Traceability
MASTER §107–109, §298
