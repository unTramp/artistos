# Artist OS — Architecture Resolution Pass 1

**Status:** PROPOSED CONTRACTS — review/freeze layer between Full Product Spec and Engineering Spec.
**MASTER v1.3:** unchanged and still authoritative.
**Purpose:** resolve high-impact cross-domain ambiguities without silently adding entities or implementation detail to MASTER.

## 1. Resolution policy

Every open question is routed to exactly one primary resolution layer:

```text
MASTER architecture change        → ACP
cross-domain semantic contract    → Architecture Resolution / ADR
schema/provider/retention detail  → Engineering Spec
UX/default behavior               → UX / Interaction Spec
threshold/model behavior          → Calibration / Evals
future module                     → Deferred Scope Register
```

A resolution in this document is **PROPOSED** until explicitly frozen. If a proposal conflicts with MASTER v1.3, MASTER wins and an ACP is required.

## 2. Proposed architecture contracts

### AR-001 — One active Era per artist time context

**Questions:** OQ-014.
**Resolution:** MVP supports one ACTIVE `EraIdentity` for a given artist at a given time. Historic/future planned Eras may coexist, but two overlapping ACTIVE Eras are not supported in v1.3.

**Why:** downstream Context, Guard, Website and Campaign reasoning otherwise become ambiguous. A future collaboration/persona mode can revisit this without polluting the MVP.

---

### AR-002 — Identity precedence and intentional deviation

**Questions:** OQ-047, OQ-069.
**Resolution order:**

```text
Safety / legal / rights hard constraints
↓
NON_NEGOTIABLE Identity constraints
↓
Base active Identity Version
↓
Active Era overrides
↓
SongIdentityContext allowed overrides
↓
Content-specific approved IdentityDeviation
↓
platform execution adaptation
```

Notes:
- an IdentityDeviation may intentionally diverge from stylistic rules but does not override safety/rights;
- NON_NEGOTIABLE identity rules require explicit identity review/change rather than an invisible content override;
- platform adaptation may change crop/duration/packaging, not protected narrative truth.

---

### AR-003 — Song-specific interpretation policy lives in SongIdentityContext

**Questions:** OQ-024, OQ-048.
**Resolution:** do **not** introduce a separate SongInterpretationPolicy entity in MVP. Add optional song-scoped interpretation/mystique overrides inside `SongIdentityContext`, inheriting the active Identity policy by default.

**Why:** it is contextual identity behavior, not an independent lifecycle.

---

### AR-004 — Sensory association visibility is separate from epistemic/status state

**Questions:** OQ-018.
**Resolution:** use a separate visibility/protection attribute rather than overloading SensoryAssociation status. Example: `visibility = INTERNAL|CONTEXT_ALLOWED|AUDIENCE_ALLOWED`.

**Why:** whether an association is approved/confirmed and whether it may be exposed externally are different dimensions.

---

### AR-005 — Narrative Mix counts published Content Units, not Publications

**Questions:** OQ-037, OQ-038, OQ-040.
**Resolution:** default Narrative Mix denominator is distinct **published Content Units** in the selected period. Multi-platform Publications of one master unit count once. Primary narrative track determines default mix; secondary overlap is shown separately.

**Dependency:** ACP-003 for primary/secondary attribution.

---

### AR-006 — Track-to-Song/Campaign affinity is usage-derived in MVP

**Questions:** OQ-034.
**Resolution:** do not create static NarrativeTrack↔Song/Campaign affinity joins in MVP. Derive relationships from Beats, ContentAngles/Units, Campaign references and analytics. Add explicit affinity only if a concrete planning workflow later needs it.

**Why:** avoids duplicating evidence and prevents a Track from becoming artificially locked to a Song.

---

### AR-007 — Canonical lyrics remain a versioned document asset in MVP

**Questions:** OQ-044.
**Resolution:** canonical lyrics are stored as a versioned `DOCUMENT`/structured text Asset referenced by `Song.lyricsReference`; SongSegments may snapshot relevant text plus source/version reference. Do not add `LyricVersion` as a separate top-level domain entity in MVP.

**Why:** MASTER already makes documents/assets first-class and the product does not yet require an independent lyric-publishing lifecycle.

---

### AR-008 — No dedicated Performance entity in MVP

**Questions:** OQ-049.
**Resolution:** represent performance context through `LiveSession`, `ShootSession`, AudioAsset/Asset and ContentUnit relationships. Introduce a dedicated Performance entity only if setlist/performance history requires identity independent from those workflows.

**Why:** prevents premature overlap with Live, Production and DSPVideo.

---

### AR-009 — Readiness is current projection + milestone snapshot

**Questions:** OQ-060, OQ-100.
**Resolution:** readiness is computed from current source facts for live UI. The system may persist immutable **ReadinessSnapshot** artifacts at meaningful events (campaign activation, pitch submission, launch, postmortem) for audit/comparison.

**Why:** current truth must not become stale because a stored score was not recomputed, while historical “what was ready at launch?” remains valuable.

---

### AR-010 — One workspace timezone; UTC for observations

**Questions:** OQ-061, OQ-079.
**Resolution:** Artist workspace has a canonical IANA timezone. Planning/release day boundaries use that timezone unless a platform/market event explicitly carries another local timezone. System timestamps/`observedAt` are stored as UTC instants.

**Why:** avoids day-window drift in Release Momentum, Calendar and analytics imports.

---

### AR-011 — ExecutionPackage is a versioned ContentUnit execution snapshot, not a new root entity

**Questions:** OQ-066.
**Resolution:** once an Angle is approved for execution, create/attach a ContentUnit and persist versioned execution-package structured data under that unit (or a subordinate revision table). Do not create an independently addressable top-level ExecutionPackage in MVP.

**Why:** the package exists to execute a concrete production unit and does not need independent ownership/lifecycle.

---

### AR-012 — No separate ProductionPlan root in MVP

**Questions:** OQ-083.
**Resolution:** Production intent/brief stays in the versioned ContentUnit ExecutionPackage; batching/location/setup belongs to ShootSession. A separate ProductionPlan entity is deferred until a workflow appears that cannot be represented by those two layers.

---

### AR-013 — Evergreen Pool is a projection, not an EvergreenItem entity

**Questions:** OQ-075.
**Resolution:** Evergreen Pool queries existing approved/ready content, RecurringSeries, archive candidates and ideas tagged with evergreen eligibility. No duplicate EvergreenItem entity.

**Why:** “evergreen” is planning suitability, not a new content object.

---

### AR-014 — ContentSlot is planning intent, never publication truth

**Questions:** OQ-077.
**Resolution:** ContentSlot is first-class planning state with an optional `contentUnitId` assignment and date window. It may later produce scheduling intent, but actual Publication/publishedAt always remains Distribution-owned.

**Why:** preserves the already-frozen Calendar ≠ Publication distinction.

---

### AR-015 — SeasonalOpportunity is Growth/Research-owned; Calendar consumes it

**Questions:** OQ-080.
**Resolution:** opportunity discovery/evidence is owned by Growth/Market (with ResearchClaim provenance where external). Calendar renders eligible opportunities as planning suggestions without becoming their source of truth.

---

### AR-016 — Voice Note is an Asset with a cross-cutting capture entry point

**Questions:** OQ-088.
**Resolution:** the captured file is an `Asset(type=VOICE_NOTE)`. Quick Capture may live globally in UI; transcription/idea extraction is a workflow spanning Production/Knowledge. Navigation placement does not change domain ownership.

---

### AR-017 — Transcript truth is structured derived data; exported transcript may also be an Asset

**Questions:** OQ-093.
**Resolution:** retain structured transcript segments/timestamps/language tied to the source Asset as canonical machine-readable data. A `TRANSCRIPT` Asset may be generated/exported for portability, but should not become a conflicting second source of truth.

---

### AR-018 — Centralized Rights Decision Policy

**Questions:** OQ-094.
**Resolution:** maintain one rights decision service/policy matrix that evaluates intended usage surface against AssetRights, source restrictions and derivation lineage. Feature UIs consume explanations/results rather than hardcoding their own allow/deny rules.

**Why:** Distribution, Web, Brand Book, DSP and Content all reuse the same assets.

---

### AR-019 — StarterContentPack is a computed plan/projection

**Questions:** OQ-102.
**Resolution:** StarterContentPack is computed from profile readiness, representative role coverage and existing ContentUnits/Publications; persist an optional accepted plan snapshot only when the user chooses to act on it. Do not create a permanent duplicate content inventory.

---

### AR-020 — Platform adaptation snapshot belongs to Publication; master concept stays ContentUnit

**Questions:** OQ-105.
**Resolution:** Publication stores the exact platform execution snapshot (caption/crop/duration/CTA/audio/metadata) used or intended for that publication. ContentUnit remains the master creative concept. If an adaptation changes the creative premise materially, the user/system creates a new ContentUnit rather than silently rewriting the original.

**Calibration:** “materially” is supported by heuristics/evals, never a magic numeric threshold.

---

### AR-021 — Timed Link Routing uses effective configuration, not scheduler state as truth

**Questions:** OQ-108.
**Resolution:** `activeFrom/activeUntil` and versioned LinkHub configuration determine which destination is effective at request time. JobService may warm caches/send reminders but a missed job must not leave routing semantically incorrect.

---

### AR-022 — WebStory is embedded/versioned within WebExperience in MVP

**Questions:** OQ-111.
**Resolution:** do not add a separate independently managed WebStory root initially. Store story blocks as versioned WebExperience content referencing canonical Song/Campaign/Identity facts and Assets. If story reuse across multiple owned surfaces becomes operationally significant, promote later.

---

### AR-023 — DSPVideo is not a second Publication model

**Questions:** OQ-121.
**Resolution:** DSPVideo represents DSP-specific eligibility/pitch/publication state for a video work and references its canonical ContentUnit/Asset. Actual platform publication identity/url belongs to Publication/provider data where available.

---

### AR-024 — Preserve raw royalty line evidence, compute DSPRevenueSnapshot

**Questions:** OQ-122.
**Resolution:** import provider/statement rows at the most reliable available granularity into immutable normalized evidence records; compute `DSPRevenueSnapshot` aggregates from them. Do not store only aggregates if source lines are available.

**Why:** corrections, currency and effective-rate calculations require auditability.

---

### AR-025 — Geo testing reuses the shared Experiment model

**Questions:** OQ-129.
**Resolution:** do not introduce a separate GeoExperiment root unless Stage 0 proves the generic Experiment arms cannot represent market variants. Market is an experiment scope/dimension.

---

### AR-026 — Creator/Contact data stays lightweight until Publicity boundary is approved

**Questions:** OQ-125, OQ-131.
**Resolution:** Growth stores the minimum creator/collaborator identity/reference required for collaboration execution. It does not build relationship CRM. Future Publicity Contact/Organization becomes the canonical relationship owner and migrations/references must avoid duplicate people records.

---

### AR-027 — Workspace base currency is a view/decision currency, never a rewrite of source money

**Questions:** OQ-132, OQ-136, OQ-139.
**Resolution:** Settings stores preferred reporting/base currency. Every monetary fact (`RevenueEvent`, royalty evidence, cost quote, Offer price) retains original currency and amount. Converted values are derived with FX source/date provenance.

---

### AR-028 — RevenueScenario remains an analysis artifact in MVP

**Questions:** OQ-133.
**Resolution:** scenario generation is versioned output attached to RevenueGoal/Decision evidence rather than a new primary business entity. Promote to first-class only when users need independent scenario lifecycle/comparison beyond saved analyses.

---

### AR-029 — Attribution evidence stays attached to the event/analysis, not a new root entity in MVP

**Questions:** OQ-126, OQ-142.
**Resolution:** store attribution confidence plus evidence references on the relevant aggregate/RevenueEvent/analysis record. Do not create a universal Attribution entity before Advertising/advanced attribution scope exists.

---

### AR-030 — Artist Brain is a versioned projection, not duplicate canonical identity storage

**Questions:** OQ-161.
**Resolution:** Artist Brain is compiled from canonical Identity, Story, Values, hard rules, Tone Corpus and validated learnings into a versioned snapshot for context/retrieval. Manual edits must route to the owning source or explicit knowledge item rather than silently diverging the projection.

---

### AR-031 — Research evidence used for promotion must remain reproducible

**Questions:** OQ-166.
**Resolution:** when a ResearchClaim is promoted into domain knowledge/validated external constraint, preserve source reference, retrieval date, quoted/extracted evidence boundaries and, where legally/technically appropriate, a content snapshot/hash sufficient to understand what was verified at that time.

---

### AR-032 — Context debug payloads are short-lived; provenance is long-lived

**Questions:** OQ-169.
**Resolution:** retain compact source IDs/rule IDs/config versions and token/cost metadata with AgentRun longer-term. Full assembled prompts/chunks/debug payloads use configurable short retention because they may contain private artist canon and incur storage/privacy cost.

---

## 3. Architecture-change proposals produced in this pass

| ACP | Topic | Trigger questions | Proposed direction |
|---|---|---|---|
| ACP-001 | PlanningObjective | 1, 78 | generic period objective; “monthly” as UX preset |
| ACP-002 | Release + Campaign targets | 52, 55, 58 | first-class Release/ReleaseTrack; explicit campaign target |
| ACP-003 | Narrative attribution | 31, 38, 40 | one primary + optional secondary narrative links |
| ACP-004 | OperationalAction | 59, 103, 106, 114, 116 | shared human/external action primitive, separate from Job |
| ACP-005 | Take | 85–87, 92 | first-class Take; Shot returns to planning/execution state |
| ACP-006 | Asset derivation graph | 96–99 | multi-parent typed derivation edges |

## 4. Explicitly rejected architecture expansion in this pass

The following are **not** promoted to new root entities for MVP:

```text
LyricVersion
Performance
ExecutionPackage (root)
ProductionPlan
EvergreenItem
StarterContentPack (permanent root)
WebStory (independent root)
RevenueScenario (primary business root)
Universal Attribution entity
GeoExperiment
Creator/Contact CRM
```

This is deliberate scope control, not a statement that these concepts can never become first-class later.

## 5. Remaining resolution flow

```text
203 open questions
↓
6 unique ACP packages drafted
32 architecture contracts proposed here
↓
Engineering/schema questions → Engineering Spec
UX defaults → UX/Interaction Spec
calibration questions → Eval/Calibration Spec
future boundaries → Deferred Register
↓
Architecture Freeze Candidate
↓
Engineering Specification
```

## 6. Freeze rule

No proposal in this pass edits `MASTER_ARCHITECTURE_v1.3.md`. The next architecture version should be produced only after ACP review and consistency checks against all 2,334 product requirements.

# Appendix A — Architecture Resolution Pass 1B

The following contracts close the remaining architecture-review questions left after the first routing pass.

### AR-033 — Fictional / real narrative truth is field-level metadata, not a new root entity

**Question:** OQ-022.
Identity Narrative fragments that can be mistaken for factual biography must carry explicit `truthMode` metadata such as `REAL|FICTIONAL|AMBIGUOUS|PRIVATE_INTERNAL`. This metadata stays on the narrative fragment/field; no separate “fiction facts” domain is introduced.

**Guard rule:** audience-facing generation must respect `truthMode` and MystiquePolicy; `PRIVATE_INTERNAL` cannot leak simply because a model asks for richer context.

---

### AR-034 — Song meaning/interpretation statements are Song Brain-owned subordinate records

**Question:** OQ-043.
Structured statements about a Song remain in Song Brain with labels `FACT|ARTIST_INTERPRETATION|AUDIENCE_INTERPRETATION`, provenance and status. Do not create a universal generic “knowledge statement” root solely for this use case. Validated learnings and external claims keep their existing Intelligence/Research ownership.

---

### AR-035 — Cross-version SongSegment equivalence is explicit and optional

**Question:** OQ-045.
Equivalent segments across remixes/acoustic/live variants are not inferred as canonical truth. Allow an optional manually/AI-suggested `equivalentToSegmentId` relation with human confirmation. Absence of mapping is valid.

---

### AR-036 — Incidental AudioUsage does not automatically make a Song the ContentUnit’s primary Song

**Question:** OQ-050.
`ContentUnit.songId` means the Song is materially represented by the creative concept (performance, story, lyric, release discovery, etc.). `AudioUsage.songId` may reference a background/incidental Song without changing primary ContentUnit attribution. Multi-song concepts require explicit related-song metadata rather than accidental attribution through background audio.

---

### AR-037 — VIDEO is not a ReleaseExtension

**Question:** OQ-053.
Resolved by ACP-002: remove `VIDEO` from ReleaseExtension in the next MASTER revision. Video works are owned by Content/DSPVideo/Publication.

---

### AR-038 — Strategy changes use AuditEvent + Decision, not a new event root

**Question:** OQ-056.
A strategy change emits an `AuditEvent` subtype. If it represents a meaningful human strategic commitment, it also creates/links a `Decision`. Do not create a separate StrategyChange entity.

---

### AR-039 — Campaign Goal Definition is configuration/history, not a new root entity

**Question:** OQ-057.
Campaign retains primary/secondary goal fields and audit/version history. A dedicated GoalDefinition entity is not introduced in MVP. Reusable goal taxonomies live in product configuration/enum registries.

---

### AR-040 — Canonical ContentUnit identity is opaque; display keys are convenience only

**Question:** OQ-068.
Canonical ContentUnit ID is UUID/opaque. Human-readable display keys may use `[SONG]-[TYPE]-[NUMBER]` when a Song exists and an artist-scoped fallback when it does not, but no business logic parses or depends on the display key.

---

### AR-041 — RecurringSeries has lightweight lifecycle; major concept change creates a successor

**Question:** OQ-076.
Use `DRAFT|ACTIVE|PAUSED|ARCHIVED`. Minor edits are audited in place. A materially different premise creates a new/successor RecurringSeries linked to the predecessor rather than an elaborate version graph in MVP.

---

### AR-042 — Locations and crew remain embedded capabilities in single-artist MVP

**Question:** OQ-081.
Equipment remains first-class as MASTER specifies. Production locations and crew capabilities stay as structured objects inside ProductionCapabilityProfile until scheduling, booking, availability history or multi-user ownership creates a real query/lifecycle need.

---

### AR-043 — Production economics attaches to the ShootSession as an estimate snapshot

**Question:** OQ-089.
Store estimated production cost/time assumptions as a subordinate snapshot on ShootSession/production planning context. Actual external spend may later enter Business evidence; do not create a separate ProductionEconomics root or full cost-accounting domain.

---

### AR-044 — Repurposing derivative items stay subordinate to RepurposingPlan

**Question:** OQ-098.
`derivatives[]` are structured child rows/records owned by RepurposingPlan. Promote an item to an independent ContentUnit only when approved for actual creative execution. This avoids duplicating idea/planning objects prematurely.

---

### AR-045 — LinkDestination is a versioned child of LinkHub

**Question:** OQ-107.
A LinkDestination has stable child identity within LinkHub, type, target URL/provider reference, label, status `ENABLED|DISABLED`, optional effective window and ordering/priority. LinkHub version history preserves what routing configuration was active. Destination is not a global top-level content object.

---

### AR-046 — WebExperience uses immutable versions and typed WebSection blocks

**Question:** OQ-109.
`WebExperience.status = DRAFT|REVIEW|PUBLISHED|ARCHIVED`. Editable work produces a new `WebExperienceVersion`; `publishedVersionId` points at the immutable published version. WebSection is a typed child block whose content schema is validated by section type, with controlled `CUSTOM` escape hatch.

---

### AR-047 — Audience Capture remains aggregate and provider-owned for PII

**Question:** OQ-112.
Artist OS stores provider/form/campaign identifiers plus aggregate conversion events/counters. Person-level email/contact records remain at the specialist provider until an explicit CRM/privacy ACP exists. Provider adapters normalize aggregate events without copying hidden PII into generic metadata.

---

### AR-048 — Web analytics raw events are distinct from normalized metric snapshots

**Question:** OQ-113.
Web/owned-media may retain event-level observations (`page_view`, `cta_click`, etc.) in a generic/raw event store. Analytics derives compatible aggregate MetricSnapshots/metrics for cross-surface analysis. Do not force every event into MetricSnapshot nor duplicate rollups as raw truth.

---

### AR-049 — DSPOpportunity is hybrid-source with explicit eligibility uncertainty

**Question:** OQ-117.
DSPOpportunity instances may be `MANUAL|IMPORTED|COMPUTED`, always preserving source/freshness. Eligibility is `ELIGIBLE|INELIGIBLE|CONDITIONAL|UNKNOWN`; operational status is separate (`DISCOVERED|PLANNED|IN_PROGRESS|SUBMITTED|COMPLETED|MISSED|DISMISSED`). Computed eligibility never masquerades as platform-confirmed fact.

---

### AR-050 — DiscoveryChannelPerformance is a normalized observation series

**Question:** OQ-119.
Persist source-of-streams observations by platform + release/song scope + observation/period + source category, preserving NULL/unknown. Aggregates are analytical views; imported source categories map to canonical categories with source metadata.

---

### AR-051 — ArtistPlaylist is externally referenced in MVP; track contents are not mirrored by default

**Question:** OQ-123.
Store purpose, external playlist ID/URL, Identity version and lifecycle `DRAFT|ACTIVE|ARCHIVED|UNKNOWN_EXTERNAL`. Do not mirror every playlist item unless a concrete API/workflow requires it; external platform remains source of truth for contents.

---

### AR-052 — SearchOpportunity is a Growth-owned operational record

**Question:** OQ-127.
SearchOpportunity may be first-class inside Growth with query, source platform, demand/gap signals, relevance, source/freshness and status. It does not become a hidden SEO rule engine; unsupported demand remains unknown.

---

### AR-053 — LiveSession participant references stay lightweight in MVP

**Question:** OQ-130.
LiveSession uses lifecycle `PLANNED|SCHEDULED|LIVE|COMPLETED|CANCELLED|ARCHIVED`. Guests/collaborators are lightweight participant references compatible with future Contact/Organization mapping, but Growth does not own a relationship CRM.

---

### AR-054 — RevenueEvent.source uses canonical RevenuePortfolio vocabulary

**Question:** OQ-134.
`RevenueEvent.source` maps directly to RevenuePortfolio categories; provider/channel/detail is stored separately (`sourceDetail/providerRef`). This keeps business rollups stable while preserving source specificity.

---

### AR-055 — Offer changes require effective-dated terms, not historical overwrite

**Question:** OQ-137.
Offer lifecycle is `DRAFT|ACTIVE|PAUSED|ENDED|ARCHIVED`. Material changes to price/value proposition/availability create an effective-dated Offer terms revision so historic RevenueEvents remain interpretable. Non-material copy corrections may update current presentation with audit history.

---

### AR-056 — Membership tier changes are effective-dated and provider-aware

**Question:** OQ-140.
MembershipTier revisions preserve historical price/benefits. Whether existing members are grandfathered/migrated is explicit provider/policy metadata; the OS must not assume new terms retroactively apply to existing members.

---

### AR-057 — Revenue corrections are append-only

**Question:** OQ-141.
Imported/recorded RevenueEvents are not destructively edited after reconciliation. Refund/reversal/adjustment records reference the original event and preserve original currency/amount. Aggregates compute net effect from the event chain.

---

### AR-058 — Analytics audience scope is evidence-bounded

**Question:** OQ-148.
Analytics may use only audience segmentation actually available from aggregate provider/import data. Scope labels must name the observable population; person-level traits are never inferred to fill missing segmentation.

---

### AR-059 — Decision scope reuses an extensible domain/scope vocabulary

**Question:** OQ-158.
Decision scope aligns with Learning scopes where appropriate and allows namespaced domain scopes rather than a brittle mega-enum. Scope describes where a decision applies; references to concrete entities remain explicit.

---

### AR-060 — WeeklyReview is a persisted immutable review artifact

**Question:** OQ-159.
Persist WeeklyReview with period, generatedAt, source snapshot/insight IDs, labeled sections and configuration version. A rerun creates a new version/artifact rather than overwriting history. Decisions created from a review reference that review artifact.

---

### AR-061 — Anti-AI Style rules and IdentityConstraints remain distinct rule families

**Question:** OQ-164.
IdentityConstraint expresses artist-specific creative identity commitments. Anti-AI Style rules express generic/output-style anti-patterns. Context/Guard merges them by priority at runtime but they are not stored as one entity. Conflicts favor safety/hard Identity constraints, then explicit task request, then style guidance.

---

### AR-062 — CandidateKnowledge has explicit merge/promotion lifecycle

**Question:** OQ-165.
Use `PENDING|ACCEPTED|REJECTED|MERGED|EXPIRED`. ACCEPTED requires a destination and creates/updates the owning knowledge record; MERGED references the destination/target candidate. CandidateKnowledge itself is not permanent truth after promotion.
