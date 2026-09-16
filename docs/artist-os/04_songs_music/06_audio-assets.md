# Audio Assets & Audio Usage

## 1. Metadata
- **Spec ID:** `SNG-AUD`
- **Domain:** `04_songs_music`
- **Feature:** Audio Assets & Audio Usage
- **Status:** REVIEW
- **MASTER references:** 110–111, 175–183, 187–190, 406, 411
- **Depends on:** Song; Asset/Storage/Rights; optional Segment, Platform publication
- **Used by:** Factory, Production, On-Set, Content Units, Publications, Segment Analytics

## 2. Purpose
Model audio as first-class creative material and preserve exactly which audio source/version/segment was used in each execution.

## 3. User problem / job-to-be-done
**JTBD:** “Let me choose the right audio version and exact moment for content, and make the system remember what was actually used so later analytics are trustworthy.”

## 4. Scope
Audio asset types, source/version metadata, platform sound references, segment/timing usage, mix/foreground/background levels, rights status and content lineage.

Out: DAW editing, mastering, automatic fingerprinting, platform music licensing adjudication.

## 5. Entry points
Song Brain → Audio, Asset ingest, Segment editor, Factory execution package, Shoot/On-Set, Publication adaptation.

## 6. Preconditions and dependencies
Song or external-sound context as appropriate; stored Asset for local audio where available. Platform sound may be reference-only URL/ID.

## 7. Information architecture
Audio library grouped by type/version; detail metadata/rights; usage history; audition; `Use in Content`; platform sound mapping.

## 8. User roles and permissions
Artist controls own audio metadata/use. Rights warning/override requires explicit action where status insufficient.

## 9. Core data model
MASTER `AudioAsset` types:
`OFFICIAL_MASTER | LIVE | ACOUSTIC | DEMO | INSTRUMENTAL | VOCAL_ONLY | VOICE_NOTE | EXTERNAL_SOUND | PLATFORM_SOUND`.

MASTER `AudioUsage`:
```text
audioAssetId
songId
segmentStart
segmentEnd
segmentName
sourceType
mixVersion
platformSoundId?
platformSoundUrl?
usageMode
foregroundLevel
backgroundLevel
rightsStatus
```

## 10. Main happy-path workflow
1. User uploads/links audio and assigns type/song/version.
2. Rights/source metadata is recorded.
3. User selects audio in Factory/Production.
4. Selects Segment or custom start/end.
5. Configures usage mode/mix context if relevant.
6. Execution package records AudioUsage.
7. Publication adaptation may map to platform-native sound ID/URL.
8. Historical Content/Publication retains exact usage metadata.
9. Analytics can group performance by segment/source/version.

## 11. Alternative workflows
Platform-native sound only; external licensed sound; live performance audio; instrumental under spoken video; same Song master replaced by remaster.

## 12. User actions
Upload/link/edit metadata, audition, set rights, select Segment/range, create usage, map platform sound, inspect usages, archive audio version.

## 13. State model
Asset rights/lifecycle follows Asset domain. AudioUsage is immutable historical record after publication except corrective metadata with audit.

## 14. Business rules
- **SNG-AUD-001** — Audio MUST be represented as first-class asset/context, not a free-text Content field.
- **SNG-AUD-002** — Audio type MUST use MASTER enum.
- **SNG-AUD-003** — Multiple Audio Assets MAY belong to the same Song.
- **SNG-AUD-004** — Voice Note may be song-linked or general; song linkage MUST NOT be fabricated.
- **SNG-AUD-005** — External/Platform sound MUST be distinguishable from artist-owned Song audio.
- **SNG-AUD-006** — AudioUsage MUST preserve exact source/version/range when known.
- **SNG-AUD-007** — Historical AudioUsage MUST NOT change when SongSegment boundaries are later edited.
- **SNG-AUD-008** — `platformSoundId/url` are platform references and MUST NOT replace canonical local/source metadata.
- **SNG-AUD-009** — RightsStatus MUST be evaluated independently from giving credit.
- **SNG-AUD-010** — UNKNOWN/REFERENCE_ONLY rights MUST NOT be silently treated as publishable.
- **SNG-AUD-011** — Own master does not automatically imply all composition/performance/platform rights in every context; product should preserve rights metadata/warnings rather than legal certainty.
- **SNG-AUD-012** — Platform adaptation MAY require use of platform-native sound while preserving lineage to Song/AudioUsage.
- **SNG-AUD-013** — `foregroundLevel/backgroundLevel` are usage descriptors, not necessarily precise mastering measurements unless implementation defines units.
- **SNG-AUD-014** — Mix version changes MUST be versioned/referenceable rather than overwrite historical identity.
- **SNG-AUD-015** — Deleting/archive of an Audio Asset with historical usage MUST preserve lineage/reference metadata.
- **SNG-AUD-016** — Content Factory MUST not recommend unavailable/non-publishable audio without a visible fallback/warning.
- **SNG-AUD-017** — Production Agent must consider actual accessible audio assets and platform constraints.
- **SNG-AUD-018** — AudioUsage may reference custom range even if no durable SongSegment exists.
- **SNG-AUD-019** — Custom range MAY later be promoted to a SongSegment after human approval.
- **SNG-AUD-020** — Same Content concept adapted per platform MAY use different AudioUsage while retaining master concept lineage.
- **SNG-AUD-021** — Audio analytics MUST distinguish different versions/segments when data permits.
- **SNG-AUD-022** — Usage frequency MUST NOT be interpreted as performance success by itself.
- **SNG-AUD-023** — AI MUST NOT infer rights ownership from file possession alone.
- **SNG-AUD-024** — AI MUST NOT invent platform sound IDs/URLs.
- **SNG-AUD-025** — Asset ingestion metadata SHOULD capture duration/recordedAt/device where applicable.
- **SNG-AUD-026** — Singing identification MUST NOT rely solely on speech transcription.
- **SNG-AUD-027** — Platform sound mapping failures MUST not destroy original AudioUsage plan.
- **SNG-AUD-028** — Audio replacement after publication MUST be represented as new/updated Publication adaptation, not historical overwrite.
- **SNG-AUD-029** — Rights overrides MUST be explicit and auditable.
- **SNG-AUD-030** — AudioUsage data SHOULD remain exportable with Content lineage for portability/analysis.

## 15. AI behavior
Can classify likely audio type, suggest Segment/range and find similar usage context. Cannot determine legal rights conclusively, invent platform IDs or mutate published usage.

## 16. Human approval
Required for durable type corrections where ambiguous, rights override, custom-range→Segment promotion and publication choices.

## 17. Validation
Audio existence/reference, duration/range, Song ownership, platform URL/ID shape, rights status, linked Segment validity.

## 18. UI states
No audio, uploaded/unclassified, ready, rights unknown, platform mapping, archived version, missing file/reference.

## 19. Edge cases
Remastered file same title; platform sound unavailable regionally; live audio drifts from master timestamps; two tracks mixed in mashup (not first-class MVP).

## 20. Cross-module effects
Feeds Factory, Shoot, Asset lineage, Publication, Segment Analytics and rights checks.

## 21. Notifications and attention model
Rights unknown before planned publish, missing file, broken platform mapping. No generic “upload more versions” nag.

## 22. Search / filtering / sorting / bulk actions
Filter type/rights/version/usage; search name/source. Bulk metadata tagging safe; bulk rights override forbidden.

## 23. Analytics and product telemetry
Audio selection, range selection, platform mapping success, rights-warning override, AI classification corrections.

## 24. Learning feedback
Performance can create scoped segment/version hypotheses; never rights conclusions.

## 25. Auditability / provenance
Upload/source, metadata edits, rights changes, AudioUsage creation/corrections, platform mapping.

## 26. Desktop / mobile behavior
Desktop manage library; mobile audition/select during Shoot/Factory.

## 27. Accessibility / usability
Audio controls keyboard/screen-reader labels; exact timestamps text-accessible.

## 28. Security / privacy / rights
Private demos/voice notes access-controlled; storage signed URLs where relevant; rights metadata preserved.

## 29. Performance / async jobs
Waveform/transcoding/analysis async; playback/selection responsive.

## 30. Acceptance criteria
1. Multiple audio versions supported.
2. Exact historical usage survives Segment edits.
3. UNKNOWN rights is not treated as publishable.
4. Platform sound can map without replacing canonical audio lineage.
5. AI cannot infer ownership or invent IDs.
6. Custom ranges can exist without durable Segment.

## 31. Test matrix
Unit: range/rights/type. Integration: Assets/Segments/Publications. Agent eval: no rights hallucination. E2E: upload→usage→publish→analytics.

## 32. Open questions
Units/semantics for foreground/background levels need concrete UX/schema definition; MASTER names fields but not scale.

## 33. Traceability
`SNG-AUD-001–030` → MASTER 110–111, 175–183, 187–190, 406, 411.
