# Identity Home

## 1. Metadata
- **Spec ID:** `IDN-HOME`
- **Domain:** `02_identity`
- **Feature:** Identity Home
- **Status:** REVIEW
- **Owner:** Product / Identity Engine
- **MASTER references:** 16–18, 53–57, 61, 69–91, 314–315, 321, 355, 360, 404, 450
- **Depends on:** ArtistIdentity, active ArtistIdentityVersion, EraIdentity, Identity constraints, BrandBookVersion
- **Used by:** Overview, Content Factory, Production, Song Identity Context, Brand/Identity Guard, Context Assembler

### 1.1 Normative basis
Identity is a first-class bounded context and the structured Identity data—not the generated Brand Book—is the source of truth. Identity Home is the operational summary of that context.

## 2. Purpose
Give the artist one place to understand the current active identity, its completeness, active era, constraints and outputs without editing every underlying subsystem at once.

## 3. User problem / job-to-be-done
**JTBD:** “Show me who the system currently understands me to be as an artist, what is confirmed versus incomplete, and where I should refine the identity next.”

## 4. Scope
### In scope
- active version and status;
- archetype summary;
- emotional territory;
- visual DNA summary;
- active era;
- symbolic anchors;
- mystique/interpretation summary;
- vertical-spec completeness;
- Identity constraints;
- Brand Book status;
- review/change entry points.

### Out of scope
- full editing of every Identity subsection;
- analytics-led automatic rebrand;
- a single brand score;
- psychological diagnosis.

## 5. Entry points
- `/identity`;
- Overview Identity summary;
- Command Palette → Identity;
- Content/Production Identity warnings → source link;
- Identity Review entry.

## 6. Preconditions and dependencies
`Artist` exists. If no `ArtistIdentity` exists, page becomes Identity onboarding/empty state and offers Discovery.

## 7. Information architecture
```text
Identity Home
├─ Active Identity Version
├─ Active Era
├─ Core Identity
│  ├─ Archetype
│  ├─ Emotional Territory
│  └─ Presence
├─ Visual DNA
├─ Narrative / Mystique
├─ Symbolic Anchors
├─ Constraints / Deviations
├─ Vertical Readiness
├─ Brand Book
└─ Review / Version History
```
Each summary card deep-links to its authoritative sub-feature.

## 8. User roles and permissions
Single-artist MVP: full read/edit entry points. Activation/archival remain explicit actions. Future team permissions must preserve explicit identity approval.

## 9. Core data model
Reads:
```text
ArtistIdentity
ArtistIdentityVersion
ArchetypeProfile
EmotionalTerritory
VisualIdentitySystem
PresenceProfile
IdentityNarrative
MystiquePolicy
InterpretationPolicy
SymbolicAnchor[]
IdentityConstraint[]
EraIdentity
BrandBookVersion[]
```
Derived `IdentityCompleteness` MAY exist as a checklist projection, but MUST NOT be a quality score.

## 10. Main happy-path workflow
1. User opens Identity Home.
2. System loads active version and active era.
3. Confirmed components render as summaries; incomplete components render as actionable setup cards.
4. User opens a subsection, edits a draft/current editable version according to versioning rules.
5. Changes requiring version review remain draft/review until explicitly approved.
6. After activation, Identity Home reflects the new active version and dependent Context Capsule invalidates/rebuilds.

## 11. Alternative workflows
- No Identity: start Identity Wizard.
- Draft exists while another version is active: show Active and Draft distinctly.
- No active Era: show base Identity with optional `Create Era` action.
- Brand Book stale relative to active Identity: mark `Regeneration available`.

## 12. User actions
- Start/Resume Discovery;
- open/edit subsection;
- create draft version;
- review version;
- activate approved version;
- open/create Era;
- generate/regenerate Brand Book;
- open constraints/deviations/history.

## 13. State model
Home projects underlying status:
```text
NO_IDENTITY
DRAFT_ONLY
ACTIVE
ACTIVE_WITH_DRAFT
ACTIVE_WITH_REVIEW_DUE
```
No separate authoritative Home status is required.

## 14. Business rules
- **IDN-HOME-001** — Identity Home MUST clearly distinguish Active Identity from Draft/Review versions.
- **IDN-HOME-002** — The page MUST NOT represent draft AI candidates as active identity facts.
- **IDN-HOME-003** — Identity completeness MAY show completed/missing components but MUST NOT be presented as a brand-quality score.
- **IDN-HOME-004** — Active Era overrides MUST be visually distinguished from base Identity values.
- **IDN-HOME-005** — Historical content remains linked to the Identity Version under which it was created; Home MUST NOT rewrite historical links.
- **IDN-HOME-006** — Archetype MUST be labeled as a creative model, not psychological diagnosis.
- **IDN-HOME-007** — Performance analytics MUST NOT directly mutate any Identity field from Home.
- **IDN-HOME-008** — Identity-change suggestions from analytics MUST route to Identity Hypothesis/Review.
- **IDN-HOME-009** — Brand Book status MUST indicate the Identity/Era version it was generated from.
- **IDN-HOME-010** — Structured Identity data remains source of truth even when Brand Book exists.
- **IDN-HOME-011** — Incomplete optional Identity components MUST not block unrelated manual workflows unless a source feature explicitly requires them.
- **IDN-HOME-012** — Identity Home MUST expose the reason/source for non-negotiable constraints.
- **IDN-HOME-013** — Active version change MUST require explicit human approval.
- **IDN-HOME-014** — Review reminders MUST follow infrequent/event-driven Identity Review policy, not weekly performance volatility.
- **IDN-HOME-015** — Identity Home MUST support a useful cold-start state with guided next action.
- **IDN-HOME-016** — No “94/100 identity strength” or equivalent unsupported certainty may be displayed.

## 15. AI behavior
AI may summarize confirmed Identity, point out missing components, and explain conflicts. It may not activate versions, infer psychological truth, or rewrite identity from engagement data.

Context: current active/draft Identity components + source refs. Output must distinguish `confirmed`, `candidate`, `missing`, `conflict`.

## 16. Human approval
Required for active version changes, protected narrative/mystique changes and non-negotiable constraint changes according to source workflows.

## 17. Validation
- activeVersionId resolves and belongs to Identity;
- at most one ACTIVE version per ArtistIdentity;
- active Era refers to compatible Identity Version;
- generated Brand Book version references valid Identity/Era;
- no orphan summary links.

## 18. UI states
First-use, partial, active, active+draft, stale Brand Book, review due, error. Missing data is shown as missing setup, never fabricated.

## 19. Edge cases
- Active version archived by migration error → block and require repair; do not silently choose another.
- Era references older identity → show compatibility warning/history.
- Conflicting constraints → surface conflict before guard/production use.
- Brand Book generated from previous version → label outdated, keep downloadable history.

## 20. Cross-module effects
Activation invalidates/rebuilds IdentityContextCapsule and affects future Strategy/Production/Guard outputs; does not rewrite existing Content Units.

Possible events: `IdentityVersionActivated`, `IdentityVersionArchived`, `EraActivated`, `BrandBookGenerated`.

## 21. Notifications and attention model
Surface review due, invalid/stale generated Brand Book, unresolved blocking constraint conflict. Avoid nagging for optional completion.

## 22. Search / filtering / sorting / bulk actions
Version history can sort by version/date/status. No bulk identity mutation.

## 23. Analytics and product telemetry
Track subsection opens, discovery completion, version creation/activation, Brand Book generation, guard-driven returns, time to Identity activation.

## 24. Learning feedback
Identity edits are decisions/evidence, not automatic Learnings. Performance signals follow Identity change pipeline.

## 25. Auditability / provenance
Show version, approver, timestamp, sources/evidence for confirmed components and constraints where applicable.

## 26. Desktop / mobile behavior
Desktop full summary/edit entry points. Mobile supports review/quick approvals and summary; deep Moodboard/Visual DNA work may recommend desktop.

## 27. Accessibility / usability
Status not color-only; version/era distinctions explicit; keyboard navigation; clear warning before activation/archive.

## 28. Security / privacy / rights
Protected internal canon and mystique facts are not exposed unnecessarily. Moodboard/reference rights remain in source records.

## 29. Performance / async jobs
Home loads structured summaries without AI. Brand Book/moodboard analysis status may be asynchronous.

## 30. Acceptance criteria
1. Active and Draft versions are visibly distinct.
2. No identity exists → guided Discovery action appears.
3. Activating a new version never rewrites historical Content Unit version links.
4. Brand Book generated from an older version is marked outdated.
5. Analytics cannot change Identity directly.
6. Identity Home works when AI is unavailable.

## 31. Test matrix
Unit: active/draft projection, era override labels, completeness checklist. Integration: version activation → context invalidation. E2E: discovery → active identity → draft refinement → activation. Agent eval: candidate vs confirmed wording.

## 32. Open questions
- Exact checklist components required for `Identity Minimum Ready` versus `Identity Complete` should be UX-tested.
- Whether multiple simultaneous active Eras are ever allowed; recommended v1.3: one active Era per artist time context.

## 33. Traceability
`IDN-HOME-001–016` → MASTER 53–57, 60–91, 314–315, 321, 360, 404, 450.
