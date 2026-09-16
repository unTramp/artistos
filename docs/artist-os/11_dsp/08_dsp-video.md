# DSP Video

- **Status:** REVIEW COMPLETE
- **MASTER references:** §217–228, §242, §181–191
- **Domain:** 11_dsp
- **Feature slug:** `dsp-video`
- **Requirement prefix:** `DSP-VID`

## 2. Purpose
Track DSP-native music/live/studio/cover video opportunities and publication state while reusing existing assets, rights and Identity context.

## 3. User problem / job-to-be-done
Some DSPs expose video surfaces or pitch flows distinct from social video. Artists need to know eligibility, prepare suitable assets and track pitch/publication without duplicating Production/Assets.

## 4. Scope
### In scope
- MASTER DSPVideo types/state
- opportunity/capability linkage
- asset/content reference
- pitch/publication tracking
- identity/rights checks

### Out of scope / non-goals
- video editing engine
- social video publication
- assumption that every DSP supports video

## 5. Entry points
- DSP opportunity
- Release plan
- Song detail
- Asset/Content detail

## 6. Preconditions and dependencies
- Song
- video Asset/ContentUnit
- Rights
- Identity/Era
- PlatformCapability/DSPOpportunity

## 7. Information architecture
Open DSP video opportunity → choose type/song/source asset → validate current platform requirements/rights/identity → prepare pitch/upload task → user executes/approves → record pitch/publication state and external reference.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `DSP Video {platform, songId, type: MUSIC_VIDEO|LIVE_PERFORMANCE|STUDIO_SESSION|COVER, pitchStatus, publicationStatus}`. Asset/content/external ID references should be added only through schema design, not hidden assumptions.

## 10. Main happy-path workflow
1. Verify capability/opportunity
2. Select song and approved video source
3. System validates rights/format requirements if known
4. Create pitch/publication task
5. Execute externally/provider
6. Record resulting state/URL/ID if available

## 11. Alternative workflows
- DSP accepts only distributor-delivered video
- video pitch unavailable
- existing social cut needs re-edit
- cover rights uncertain

## 12. User actions
- select source
- open format requirements
- create adaptation task
- mark pitched
- mark published
- attach external reference

## 13. State model
PitchStatus and publicationStatus are MASTER fields but enums undefined. They must distinguish unknown/pending/success/failure enough for operations without conflating pitch and publication.

## 14. Business rules
- `DSP-VID-001` DSPVideo type MUST use MASTER enum.
- `DSP-VID-002` Video capability/format requirements MUST come from current PlatformCapability/AssetRequirement evidence.
- `DSP-VID-003` DSP video MUST reference/reuse source media rather than duplicate binary assets.
- `DSP-VID-004` Rights MUST be checked for video/audio and cover use as applicable.
- `DSP-VID-005` Identity Guard MAY flag alignment but MUST NOT block historical/intentional deviations without policy basis.
- `DSP-VID-006` Pitch state and publication state MUST remain separate.
- `DSP-VID-007` No video pitch/publication outcome may be inferred from asset upload alone.
- `DSP-VID-008` Unsupported video capability MUST be N/A rather than failed.
- `DSP-VID-009` Platform-specific adaptation SHOULD preserve lineage to source Content/Asset.
- `DSP-VID-010` AI MUST NOT invent eligibility or platform format requirements.

## 15. AI behavior
AI can suggest which existing video asset best fits a verified DSP requirement and create an adaptation brief. It cannot upload/pitch/publish without approval.

## 16. Human approval
All external pitch/upload/publication actions human-controlled.

## 17. Validation
- song/source asset valid
- rights usable
- capability/requirements current
- format known or explicitly unknown

## 18. UI states
- not available
- candidate
- needs adaptation
- pitch pending
- published
- failed
- unknown external state

## 19. Edge cases
- video removed externally
- source rights expire
- different regional video availability
- pitch accepted but publication delayed

## 20. Cross-module effects
- Assets/Lineage
- Production/Repurposing
- DSP Opportunity
- Release Plan
- Identity

## 21. Notifications and attention model
- video deadline approaching
- rights issue on planned DSP video
- external state unresolved

## 22. Search / filtering / sorting / bulk actions
Filter platform/song/type/status. No bulk pitch/publish.

## 23. Analytics and product telemetry
- source selected
- adaptation created
- pitch/publication status changed
- external reference attached

## 24. Learning feedback
Video performance may later feed DSP/Content analytics if data available; operational state alone is not Learning.

## 25. Auditability / provenance
Preserve source asset/content lineage, requirement/source version and external status evidence.

## 26. Desktop / mobile behavior
Desktop preparation; mobile status/evidence capture.

## 27. Accessibility / usability
Show source thumbnail/type/rights and distinguish “pitched” from “published” clearly.

## 28. Security / privacy / rights
Respect video/audio rights and private asset access. Provider secrets server-side.

## 29. Performance / async jobs
Transcode/preview/adaptation jobs can be async; external task state polling via provider jobs if available.

## 30. Acceptance criteria
- `DSP-VID-AC01` Unsupported DSP video is N/A.
- `DSP-VID-AC02` Pitch and publication states are not conflated.
- `DSP-VID-AC03` Rights-blocked source is not silently used.
- `DSP-VID-AC04` Existing asset lineage is preserved.
- `DSP-VID-AC05` Stale format rules are labelled.

## 31. Test matrix
- no capability
- needs adaptation
- cover rights
- publication delay
- external removal

## 32. Open questions
- Define DSPVideo references/status enums and ownership relative to Publication entity in schema pass.

## 33. Traceability
MASTER §217–228, §242, §181–191
