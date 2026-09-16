# Artist Playlists

- **Status:** REVIEW COMPLETE
- **MASTER references:** §238–241, §225, §406
- **Domain:** 11_dsp
- **Feature slug:** `artist-playlists`
- **Requirement prefix:** `DSP-APL`

## 2. Purpose
Manage artist-owned/curated playlists as identity/campaign assets with clear purpose and current platform state, without embedding unsupported ranking myths.

## 3. User problem / job-to-be-done
Artist playlists can communicate influences, mood, era or campaign context, but advice around track order and algorithm effects is often anecdotal. The OS should manage intent, identity fit and operational state rather than pretend playlist hacks are facts.

## 4. Scope
### In scope
- ArtistPlaylist purpose enum
- identity version linkage
- platform playlist ID/state
- content/curation intent
- campaign/era context
- research-backed operational guidance

### Out of scope / non-goals
- playlist growth hacks as platform facts
- autonomous playlist manipulation
- third-party curator CRM

## 5. Entry points
- DSP profile
- Identity/Era
- Campaign
- Playlist Research

## 6. Preconditions and dependencies
- Identity/Era
- platform playlist capability
- playlist external ID
- Song/catalog references where curated

## 7. Information architecture
Create/import artist playlist → choose purpose → link Identity/Era/campaign → curate/reference playlist externally → verify platform state → optionally feature/use in profile/campaign → review when era/context changes.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `ArtistPlaylist {purpose: INFLUENCES|MOOD|ERA|GENRE|CAMPAIGN, identityVersionId, playlistId, status}`. Platform/artistId and exact contents/state may be implementation references; do not silently invent ordering rules.

## 10. Main happy-path workflow
1. Create/import playlist record
2. Choose purpose and identity context
3. System suggests description/positioning or relevant songs only as draft
4. User curates externally/provider
5. Record/refresh playlist state
6. Link to DSP profile/campaign where useful
7. Review on Identity/Era change

## 11. Alternative workflows
- playlist contains mostly external artists
- campaign playlist expires conceptually
- platform does not support profile featuring
- playlist ID becomes inaccessible

## 12. User actions
- create/import
- set purpose
- link era/campaign
- draft description
- open playlist
- mark archived/stale
- refresh

## 13. State model
Status enum not defined. Product requires active/archive/stale-ish behavior but final schema remains open.

## 14. Business rules
- `DSP-APL-001` ArtistPlaylist purpose MUST use MASTER enum.
- `DSP-APL-002` Playlist identity linkage MUST not imply every track must stylistically match the artist.
- `DSP-APL-003` External influence playlists MAY intentionally contain other artists and should preserve curatorial purpose.
- `DSP-APL-004` Claims that own track must be placed at a particular rank/order MUST NOT be presented as platform facts without credible evidence.
- `DSP-APL-005` Claims that repeated artists cause de-ranking MUST remain unverified unless authoritative evidence exists.
- `DSP-APL-006` Playlist featuring/profile use MUST respect current platform capability.
- `DSP-APL-007` Changing Identity/Era SHOULD trigger review of playlist fit/description but MUST NOT auto-delete or reorder it.
- `DSP-APL-008` Playlist ID/state MUST retain external verification/provenance when possible.
- `DSP-APL-009` Campaign-purpose playlist MAY outlive campaign historically; archival state should not erase history.
- `DSP-APL-010` AI can suggest curation themes/descriptions but MUST NOT fabricate platform optimization claims.

## 15. AI behavior
AI uses Identity/Era/Campaign context to draft purpose-aligned description/curation ideas and labels external heuristics. It cannot reorder external playlists autonomously or claim ranking benefit.

## 16. Human approval
User controls playlist creation/editing/feature actions on DSP.

## 17. Validation
- playlist ID/platform valid when provided
- purpose valid
- identity version exists
- capability checked before feature recommendation

## 18. UI states
- draft/imported
- active
- stale/unverified
- archived
- external unavailable

## 19. Edge cases
- playlist renamed externally
- identity major version changes
- playlist belongs to wrong account
- campaign ended
- external tracks removed

## 20. Cross-module effects
- Identity
- DSP Profile
- Campaign
- Playlist Research

## 21. Notifications and attention model
- featured playlist becomes unavailable
- era changes and playlist is prominent

## 22. Search / filtering / sorting / bulk actions
Filter purpose/era/campaign/platform/status. Bulk archive internal records may be allowed with confirmation; external edits are not bulk automated.

## 23. Analytics and product telemetry
- playlist linked
- purpose changed
- external state verified
- feature task created
- archived

## 24. Learning feedback
Playlist outcomes may be observed through available DSP metrics but are not assumed causal growth mechanics.

## 25. Auditability / provenance
Record playlist ID, purpose, identity version, verification time, external state and material decisions.

## 26. Desktop / mobile behavior
Desktop curation context; mobile quick open/verify.

## 27. Accessibility / usability
Use plain purpose labels and external-link clarity. Avoid implying algorithmic benefit where unknown.

## 28. Security / privacy / rights
Do not ingest unnecessary external listener/user data. Respect platform terms and provider credentials.

## 29. Performance / async jobs
External state refresh can be async; manual mode remains available.

## 30. Acceptance criteria
- `DSP-APL-AC01` No unsupported ordering hack appears as fact.
- `DSP-APL-AC02` Era change triggers review, not auto-reorder.
- `DSP-APL-AC03` Purpose enum is respected.
- `DSP-APL-AC04` External state can be stale/unknown.
- `DSP-APL-AC05` Playlist record survives campaign end as history.

## 31. Test matrix
- influences playlist
- campaign playlist
- renamed externally
- era change
- feature unavailable

## 32. Open questions
- ArtistPlaylist status enum and whether contents are modeled or only external reference need schema decision.

## 33. Traceability
MASTER §238–241, §225, §406
