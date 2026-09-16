# Narrative Tracks

## 1. Metadata
- **Spec ID:** `NAR-TRK`
- **Domain:** `03_narrative`
- **Feature:** Narrative Tracks
- **Status:** REVIEW
- **MASTER references:** 83–85, 93–98, 100–102, 130–132, 145, 308, 319, 405, 450–455
- **Depends on:** Artist, Identity Version; optional Era, Identity Narrative, Anchors, Campaign, Song
- **Used by:** Beats, Mix Plan, Content Factory, Calendar, Analytics, Strategy, Weekly Review

## 2. Purpose
Represent durable audience-facing storylines that organize **which part of the artist's larger story is being told over time**.

A Narrative Track is not a content category, posting format or campaign. It is a persistent storytelling lane such as a core artistic conflict, human journey, secondary world/theme, or deliberate experiment.

## 3. User problem / job-to-be-done
**JTBD:** “Help me keep several meaningful storylines coherent over months without turning every post into an isolated idea or forcing all content into one autobiographical storyline.”

## 4. Scope
### In scope
- Track creation/editing.
- Role, purpose, themes, narrative questions, anchors, allowed disclosures.
- Identity/Era linkage.
- Optional target share.
- Track lifecycle.
- Contextual Song/Campaign usage.
- Historical continuity.

### Out of scope
- Identity Narrative editing.
- Beat sequencing details.
- Content Pillar definitions.
- Performance scoring/optimization.
- Automatic track creation from analytics without approval.

## 5. Entry points
- Narrative Home → `New Track`.
- Identity Narrative → `Create Track from theme`.
- Era → `Add narrative line`.
- Content Factory → Track picker → `Create new`.
- Weekly Review recommendation.
- Command Palette.

## 6. Preconditions and dependencies
Artist exists. Identity Version is strongly preferred and required by MASTER `NarrativeTrack.identityVersionId`.

A Track may reference an active or historical Identity Version; changing active Identity does not mutate historical Track lineage.

## 7. Information architecture
Track detail recommended sections:
1. Overview.
2. Role & Purpose.
3. Themes / Narrative Questions.
4. Symbolic Anchors.
5. Disclosure Rules.
6. Beats.
7. Related Content.
8. Performance / Evidence.
9. History / Decisions.

Track card:
`Name | Role | Status | Current Beat | Recent executions | optional target share | evidence state`.

## 8. User roles and permissions
Single-artist MVP: full edit with explicit confirmation for sensitive disclosure changes and archive.

Future collaborators may draft Beats/content but should not expand allowed disclosures without artist approval.

## 9. Core data model
MASTER `NarrativeTrack`:
```text
id
artistId
identityVersionId
eraIdentityId?
role
name
purpose
themes[]
narrativeQuestions[]
symbolicAnchors[]
allowedDisclosures[]
targetShare?
status
```

Product-level lifecycle uses the generic `status` field. Recommended initial behavior:
`DRAFT | ACTIVE | PAUSED | ARCHIVED`.
This enum is a product-spec proposal within the existing MASTER status field and must be confirmed during schema freeze.

## 10. Main happy-path workflow
1. User chooses `New Narrative Track`.
2. System asks whether to start manually or from an Identity Narrative theme/artist journey.
3. User sets Name, Role and Purpose.
4. User adds themes and narrative questions.
5. User optionally attaches Symbolic Anchors and Era.
6. User reviews allowed disclosures; system applies Mystique/Interpretation constraints.
7. User optionally defines target share.
8. System previews how this Track differs from existing Tracks.
9. User saves Draft.
10. User adds at least one planned Beat or intentionally activates without one.
11. User explicitly activates the Track.
12. Track becomes selectable in Content Factory/Planning.

## 11. Alternative workflows
### Track from Identity theme
System pre-fills purpose/themes and cites source Identity fields; user edits and confirms.

### Human Journey track
May be grounded in actual artist journey and must respect protected personal facts.

### Experimental track
Can be intentionally temporary and excluded from stable target mix.

### Track continuing across Era change
User can keep Track linked to original Identity/Era history or create successor/derived Track. System must not silently relink historical content.

## 12. User actions
Create, edit metadata, change role, link/unlink Era, attach/detach Anchor, edit disclosure set, set/unset target share, activate, pause, archive, duplicate-as-draft, add Beat, generate Content Angle, inspect analytics/history.

Sensitive changes must show downstream impact before confirmation.

## 13. State model
Recommended:
```text
DRAFT → ACTIVE → PAUSED → ACTIVE
DRAFT → ARCHIVED
ACTIVE → ARCHIVED
PAUSED → ARCHIVED
ARCHIVED → DRAFT_COPY (new entity), not destructive resurrection by default
```

Historical references remain valid regardless of current status.

## 14. Business rules
- **NAR-TRK-001** — A Narrative Track MUST answer `which part of the larger story are we telling?` and MUST NOT be modeled as a Content Pillar or Vertical.
- **NAR-TRK-002** — Every Track MUST belong to exactly one Artist and reference an Identity Version.
- **NAR-TRK-003** — Era linkage is optional and MUST NOT overwrite Identity Version lineage.
- **NAR-TRK-004** — Track `role` MUST use the MASTER roles `CORE_NARRATIVE | HUMAN_JOURNEY | SECONDARY | EXPERIMENTAL`.
- **NAR-TRK-005** — The system MUST NOT require exactly three Tracks.
- **NAR-TRK-006** — The system MUST NOT require a Secondary/Experimental Track solely to satisfy an A/B/C template.
- **NAR-TRK-007** — Role describes storytelling function and MUST NOT automatically determine posting quota.
- **NAR-TRK-008** — Track purpose MUST be editable prose and distinct from performance objective/metric.
- **NAR-TRK-009** — Narrative questions SHOULD remain open-ended prompts that a sequence of Beats/content can explore; they MUST NOT be treated as facts.
- **NAR-TRK-010** — Symbolic Anchors attached to a Track MUST reference existing compatible anchors; attaching does not change Anchor identity-wide rules.
- **NAR-TRK-011** — Allowed disclosures MUST be a subset of what Identity Mystique/Interpretation/constraint policy permits.
- **NAR-TRK-012** — A Track MUST NOT widen protected disclosure scope implicitly.
- **NAR-TRK-013** — Target share MUST remain optional.
- **NAR-TRK-014** — If target share is set, it is a planning target, not a publishing obligation.
- **NAR-TRK-015** — Paused/Archived Tracks MUST remain attached to historical Content Units and analytics.
- **NAR-TRK-016** — Archiving a Track MUST NOT archive or delete its Content Units, Beats, Insights or Decisions.
- **NAR-TRK-017** — Changing Track role MUST create an audit event and MUST NOT rewrite historical snapshots/decisions that referenced the prior role.
- **NAR-TRK-018** — Analytics MAY create a hypothesis about changing emphasis, but MUST NOT auto-change Track role, purpose, status or target share.
- **NAR-TRK-019** — Multiple Tracks MAY share themes or Anchors when their purpose/questions differ.
- **NAR-TRK-020** — The system SHOULD warn about near-duplicate Tracks but MUST allow intentional overlap after confirmation.
- **NAR-TRK-021** — A Track MAY span multiple Songs, Campaigns and platforms.
- **NAR-TRK-022** — A Track MAY exist without a Song or Campaign.
- **NAR-TRK-023** — Campaign association MUST NOT become Track ownership; Campaign remains an orchestration boundary.
- **NAR-TRK-024** — Track content suggestions MUST respect Identity Version, Era, disclosure and protected-canon rules.
- **NAR-TRK-025** — Experimental Tracks MUST be distinguishable from durable Tracks in planning/analytics.
- **NAR-TRK-026** — The user MUST be able to inspect why a Track was created and what sources/decisions shaped it.
- **NAR-TRK-027** — If source Identity content becomes archived, the Track remains valid historically but MUST surface review context when used for new work.
- **NAR-TRK-028** — Track names/roles MUST NOT be used as psychological labels about the artist or audience.

## 15. AI behavior
AI can propose Track candidates from confirmed Identity Narrative, artist statements and existing storytelling history.

Structured proposal:
- name;
- proposed role;
- purpose;
- themes;
- narrative questions;
- candidate anchors;
- disclosure notes;
- source references;
- overlap with existing Tracks;
- uncertainty.

AI must not invent biography, declare a universal best mix, expose protected information or activate the Track.

If evidence is thin, proposals should be framed as creative options, not “detected true storylines”.

## 16. Human approval
Explicit approval required for activation, role change, disclosure expansion, archive and target-share change when used in active Mix Plan.

## 17. Validation
- valid artist/Identity linkage;
- role enum;
- non-empty name and purpose for ACTIVE;
- anchor ownership/compatibility;
- disclosure policy compatibility;
- targetShare numeric range when present;
- archived/deleted dependency handling.

## 18. UI states
Draft, active, paused, archived, privacy conflict, missing source Identity, no Beats, no executions, partial analytics.

## 19. Edge cases
- Artist has two Core tracks.
- One Track intentionally has no fixed target share.
- Track purpose shifts but historical name/content should remain traceable.
- A protected relationship/location is central to Track but cannot be explicitly named.
- Similar Track already exists in archived Era.

## 20. Cross-module effects
Activation makes Track selectable by Content Factory and Planning. Archive removes it from default new-work pickers but preserves history. Role/target changes affect Mix views prospectively.

## 21. Notifications and attention model
Track may create attention for privacy conflict, missing current Beat, prolonged stalled active state, or unresolved review after Identity change. No universal cadence reminders.

## 22. Search / filtering / sorting / bulk actions
Filter by role/status/Era/Identity Version. Sort by recent activity/name/createdAt. Bulk archive is not recommended in MVP; bulk tagging can be deferred.

## 23. Analytics and product telemetry
Create→activate conversion, time to first Track, AI proposal acceptance/edit distance, role changes, archive reason, track selection in Content Factory.

## 24. Learning feedback
Track performance feeds scoped Insights/Hypotheses/Learnings under `NARRATIVE`. Learning does not alter Track state automatically.

## 25. Auditability / provenance
Store creator/actor, source Identity fields, AI AgentRun if proposed, role/status/disclosure/target changes and decision rationale.

## 26. Desktop / mobile behavior
Desktop full editor. Mobile quick view, status, current Beat and lightweight edits; sensitive disclosure/structural changes may require full review surface.

## 27. Accessibility / usability
Explain role semantics in plain language. Avoid “A/B/C” labels as primary UI. Privacy/disclosure states require text/icon, not color only.

## 28. Security / privacy / rights
Protected facts must remain filtered. Track data may contain sensitive internal narrative; minimum necessary context to integrations.

## 29. Performance / async jobs
Manual create/edit synchronous. AI proposal generation async when needed. Similarity check may use embeddings asynchronously but cannot block manual save.

## 30. Acceptance criteria
1. User can create and activate a Track with role/purpose/themes/questions.
2. No exact number of Tracks is required.
3. Allowed disclosures cannot exceed Identity disclosure policy silently.
4. Track can span Songs/Campaigns without belonging to them.
5. Archive preserves historical content/analytics.
6. AI cannot auto-activate or auto-change role/target.
7. Duplicate warning does not prevent intentional overlap.
8. Historical Identity linkage remains traceable after Era/Identity changes.

## 31. Test matrix
Unit: lifecycle, disclosure subset, target validation. Integration: Identity/Anchors/Content picker. Agent eval: grounded Track proposals. E2E: Identity Narrative → Track → Beat → Content. Manual: pause/archive/history.

## 32. Open questions
1. Confirm concrete enum behind generic MASTER `NarrativeTrack.status` during schema pass.
2. Decide whether Track-to-Song/Campaign associations need explicit join entities or remain usage-derived from Beats/Content/Campaign references.

## 33. Traceability
`NAR-TRK-001–028` → MASTER 83–85, 93–98, 100–102, 130–132, 145, 308, 319, 405, 450–455.
