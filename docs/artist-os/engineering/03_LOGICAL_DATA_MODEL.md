# Artist OS — Engineering Spec 03: Logical Data Model

**Status:** DRAFT / Pass 1  
**Purpose:** canonical ownership/cardinality map before physical PostgreSQL schema.  
**Important:** entities marked `PROVISIONAL[ACP-*]` are not MASTER-approved yet.

## 1. Modeling vocabulary

| Kind | Meaning |
|---|---|
| ROOT | independently addressable lifecycle/aggregate root |
| CHILD | relational child with its own identity/history/query need |
| VALUE | structured owned data; often JSONB or typed columns depending query needs |
| PROJECTION | derived/read model; rebuildable from source truth |
| EVIDENCE | immutable/imported/observed evidence record |
| CONFIG | versioned configuration / provider knowledge |

## 2. Ownership matrix

### 2.1 Artist / workspace

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| Artist | ROOT | artist | — | top-level artist scope |
| WorkspaceSettings | ROOT/CONFIG | settings | Artist 1:1 | timezone, reporting currency, locale/preferences; no secrets |

### 2.2 Identity

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| ArtistIdentity | ROOT | identity | Artist 1:1 | points to activeVersionId |
| ArtistIdentityVersion | ROOT/version | identity | ArtistIdentity 1:N | immutable-ish approved identity snapshot |
| ArchetypeProfile | VALUE/CHILD | identity | IdentityVersion 1:1 | evidence refs separated from final human choice |
| EmotionalTerritory | VALUE | identity | IdentityVersion 1:1 | structured arrays/rules |
| SensoryAssociation | CHILD | identity | IdentityVersion 1:N, Song? | visibility separate from status per AR-004 |
| Moodboard | ROOT | identity | IdentityVersion N:1 | independently edited collection |
| MoodboardItem | CHILD | identity | Moodboard 1:N, Asset? | source/rights/reference metadata |
| VisualPattern | CHILD | identity | IdentityVersion 1:N | pattern evidence and confidence |
| VisualIdentitySystem | VALUE | identity | IdentityVersion 1:1 | structured sections; not giant untyped blob |
| SymbolicAnchor | CHILD | identity | IdentityVersion 1:N | reusable cross-vertical anchor |
| IdentityNarrative | VALUE | identity | IdentityVersion 1:1 | fragments include truthMode per AR-033 |
| MystiquePolicy | VALUE | identity | IdentityVersion 1:1 | protected facts/disclosure rules |
| InterpretationPolicy | VALUE | identity | IdentityVersion 1:1 | inherited by SongIdentityContext |
| EraIdentity | ROOT | identity | Artist + IdentityVersion | one active per artist time context in MVP |
| IdentityConstraint | CHILD | identity | IdentityVersion/Era | typed priority/rule/source |
| IdentityDeviation | CHILD | identity | ContentUnit + IdentityVersion | explicit approved exception |
| BrandBookVersion | ROOT/version | identity | IdentityVersion + Era? | generated output; not source of truth |

### 2.3 Narrative

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| NarrativeTrack | ROOT | narrative | Artist + IdentityVersion/Era? | long-running storyline |
| NarrativeBeat | CHILD | narrative | NarrativeTrack 1:N | ordered/planned/told beat |
| SignatureDifferentiator | ROOT/CHILD | narrative | IdentityVersion | cross-content differentiator |
| NarrativeMixPlan | ROOT | narrative | Artist + period | target mix; actual is derived |
| ContentNarrativeLink | CHILD `PROVISIONAL[ACP-003]` | narrative/content boundary | Angle/ContentUnit ↔ Track | exactly one primary max; secondary optional |

### 2.4 Songs / releases

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| Song | ROOT | music | Artist | creative song identity / Brain namespace |
| SongBrainStatement | CHILD | music | Song 1:N | FACT / ARTIST_INTERPRETATION / AUDIENCE_INTERPRETATION |
| SongSegment | CHILD | music | Song 1:N | timed semantic/audio segment |
| AudioAsset | ROOT/CHILD | music | Song?, Asset? | audio-specific work/version metadata |
| AudioUsage | CHILD | music/content | AudioAsset + ContentUnit/Publication | records actual creative usage; incidental use ≠ primary Song |
| SongIdentityContext | CHILD/VALUE | music | Song + IdentityVersion | song-scoped visual/interpretation overrides |
| Release | ROOT `PROVISIONAL[ACP-002]` | music/release | Artist | canonical release lifecycle |
| ReleaseTrack | CHILD `PROVISIONAL[ACP-002]` | music/release | Release N:M Song | sequence/focus/version label |
| ReleaseExtension | CHILD/ROOT | music/release | parent Release → child Release | musical variants; VIDEO removed if ACP approved |

### 2.5 Campaigns

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| Campaign | ROOT | campaigns | Artist | orchestration only; never child-domain truth owner |
| CampaignTarget | CHILD `PROVISIONAL[ACP-002]` | campaigns | Campaign → Artist/Song/Release | one PRIMARY max + RELATED |
| CampaignGoal configuration | VALUE | campaigns | Campaign | primary/secondary goal vocabulary |
| LaunchActivationPlan | ROOT/CHILD | campaigns | Campaign + Release? | references actions/content/channels; does not own them |
| ReadinessSnapshot | EVIDENCE/PROJECTION | campaigns/distribution | source subject + time | optional milestone snapshot per AR-009 |
| OperationalAction | ROOT `PROVISIONAL[ACP-004]` | cross-cutting operations | source domain entity | human/external step, not Job |

### 2.6 Content / planning

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| ContentAngle | ROOT | content | Artist, Song?, Campaign? | idea/rationale before concrete execution |
| ContentUnit | ROOT | content | Angle?, Song?, Campaign?, IdentityVersion | concrete production unit |
| ContentExecutionRevision | CHILD/version | content | ContentUnit 1:N | execution-package snapshot per AR-011 |
| HookVariant | CHILD | content | ContentUnit/Experiment | hook variants under one base concept |
| RecurringSeries | ROOT | planning/content | Artist | DRAFT/ACTIVE/PAUSED/ARCHIVED |
| ContentRhythmTemplate | ROOT/CONFIG | planning | Artist | preferred cadence/mix; versionable |
| ContentSlot | ROOT | planning | Artist + optional ContentUnit | planning intent/date window only |
| PlanningObjective | ROOT `PROVISIONAL[ACP-001]` | planning | Artist + Campaign?/Release? | period operational focus |
| SeasonalOpportunity | ROOT/CHILD | growth | market/culture/date | Calendar consumes projection |

`EvergreenPool` and `StarterContentPack` are projections/plans, not permanent roots.

### 2.7 Production

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| ProductionCapabilityProfile | ROOT | production | Artist 1:1 | equipment/location/crew capability model |
| EquipmentItem | CHILD/ROOT | production | CapabilityProfile | reusable owned/available gear |
| ShootSession | ROOT | production | Artist, Campaign?, Songs? | batch execution context |
| Shot | CHILD | production | ShootSession + ContentUnit | planned instruction |
| Take | CHILD `PROVISIONAL[ACP-005]` | production | Shot 1:N | captured attempt |
| TakeAsset | CHILD `PROVISIONAL[ACP-005]` | production/assets boundary | Take N:M Asset | confirmed media links |
| ProductionCostEstimate | VALUE | production | ShootSession | planning estimate, not accounting root |

No standalone `ProductionPlan` root in MVP.

### 2.8 Assets / rights

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| Asset | ROOT | assets | Artist, Song?, ShootSession? | object-storage metadata |
| TranscriptData | CHILD/derived | assets | source Asset 1:N versions | machine-readable timestamps/language |
| AssetRights | CHILD | rights/assets | Asset 1:1/N | creator/license/commercial rules |
| ExternalAssetSource | CONFIG | assets | provider registry | source/license knowledge |
| AssetDerivation | CHILD `PROVISIONAL[ACP-006]` | assets | child Asset ↔ parent Asset | multi-parent lineage edge |
| RepurposingPlan | ROOT | assets/content | source Asset | derivative planning |
| RepurposingPlanItem | CHILD | assets/content | plan 1:N | becomes ContentUnit only after approval |

Rights Decision Policy is an application/domain service over AssetRights + derivation graph, not a giant permission field on every feature.

### 2.9 Distribution / owned media

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| Publication | ROOT | distribution | ContentUnit | one master unit → many platform publications |
| ProfileReadinessSnapshot | PROJECTION/EVIDENCE | distribution | platform/account/campaign? | current readiness derived; snapshots optional |
| LinkHub | ROOT/versioned | distribution | Artist + Campaign? | routing configuration |
| LinkDestination | CHILD | distribution | LinkHub 1:N | versioned child per AR-045 |
| WebExperience | ROOT | distribution | Artist + Identity/Era/Campaign? | owned web experience |
| WebExperienceVersion | CHILD/version | distribution | WebExperience 1:N | immutable published revision |
| WebSection | CHILD/VALUE | distribution | WebExperienceVersion 1:N | typed section blocks |
| AudienceCaptureConfig | CONFIG | distribution/integrations | WebExperience/provider | aggregate-only local boundary |
| WebAnalyticsEvent | EVIDENCE | distribution/analytics | WebExperience/Publication? | raw owned-media event |

### 2.10 DSP

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| DSPProfile | ROOT | dsp | Artist + platform | profile state/readiness |
| DSPReleasePlan | ROOT | dsp | Release + platform | references OperationalActions |
| DSPOpportunity | ROOT | dsp | Artist/Release + platform | source + eligibility + freshness |
| EditorialPitch | ROOT/versioned | dsp | Release/Song + platform | draft/submission/outcome history |
| DiscoveryChannelPerformance | EVIDENCE | dsp/analytics | platform + release/song + period | normalized source-of-streams observation |
| PlaylistOpportunity | ROOT/CHILD | dsp | platform/playlist | research opportunity; no CRM |
| ArtistPlaylist | ROOT | dsp | Artist + platform | external reference/purpose |
| DSPVideo | ROOT/CHILD | dsp | ContentUnit/Asset + platform | DSP-specific workflow, not duplicate Publication |
| RoyaltyImportRow | EVIDENCE | dsp/business | ImportBatch | normalized source-line evidence |
| DSPRevenueSnapshot | PROJECTION/EVIDENCE | dsp/business | platform + period | computed aggregate/effective rate |

### 2.11 Growth / market

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| AudienceSourceObservation | EVIDENCE | growth | market/platform/period | aggregate source attribution only |
| SearchIntent | ROOT/CHILD | growth | Artist/Song? | query/entity intent model |
| SearchOpportunity | ROOT | growth | SearchIntent/platform | official/observed opportunity data |
| MarketOpportunity | ROOT | growth | market + Song?/genre? | multi-signal evidence, no magic score |
| LiveSession | ROOT | growth | Artist/Campaign? | growth/community/revenue live activity |
| CreatorCollaboration | ROOT | growth | Campaign? | minimum creator reference, rights/cost/deliverables |
| CreatorReference | VALUE/CHILD | growth | Collaboration/LiveSession | lightweight; future Publicity mapping |

Geo testing uses shared Experiment; no separate GeoExperiment root.

### 2.12 Business / fan value

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| RevenueGoal | ROOT | business | Artist + period | strategic target/assumptions |
| RevenueScenarioArtifact | EVIDENCE/version | business | RevenueGoal/Decision | saved analysis, not primary root |
| Offer | ROOT | business | Artist/Campaign? | offer identity/lifecycle |
| OfferTermsRevision | CHILD/version | business | Offer 1:N | price/value/availability effective dates |
| MerchOffer details | VALUE | business | Offer | product-specific fields |
| UnitEconomicsSnapshot | EVIDENCE/VALUE | business | Offer | formula inputs/result/provenance |
| MembershipProgram | ROOT | business | Artist/provider | membership container |
| MembershipTier | CHILD | business | Program | logical tier identity |
| MembershipTierRevision | CHILD/version | business | Tier 1:N | effective-dated price/benefits |
| RevenueEvent | EVIDENCE | business | Offer?/Campaign?/Content?/Publication? | append-only monetary fact |

FanValueCohort is primarily an analytics/business classification over aggregate evidence unless a concrete persisted cohort definition is required.

### 2.13 Analytics / intelligence

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| ImportBatch | EVIDENCE | integrations/analytics | source | import provenance/validation |
| ImportRawRow | EVIDENCE | integrations | ImportBatch | optional raw evidence with retention policy |
| MetricSnapshot | EVIDENCE | analytics | Publication/platform/time | normalized metrics |
| BaselineProjection | PROJECTION | analytics | scope/window | rebuildable aggregates |
| Insight | ROOT | intelligence | evidence refs | bounded evidence statement |
| Hypothesis | ROOT | intelligence | Insight refs | testable claim |
| Experiment | ROOT | intelligence | Hypothesis? | experiment definition/lifecycle |
| ExperimentArm | CHILD | intelligence | Experiment 1:N | control/variant/market/etc. arms |
| Learning | ROOT | intelligence | evidence/experiment refs | candidate→validated→stale lifecycle |
| Decision | ROOT | intelligence | evidence/experiment refs | why/what decision memory |
| WeeklyReview | ROOT/versioned | intelligence | period + source refs | immutable review artifact |

Outlier/derived-rate results are projections or analysis results unless a product workflow needs persisted snapshots.

### 2.14 Knowledge / research / context

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| ArtistBrainSnapshot | PROJECTION/version | knowledge | Artist | compiled context projection |
| ToneCorpusItem | ROOT/CHILD | knowledge | Artist | authentic/quality labels |
| CandidateKnowledge | ROOT | knowledge | source → destination | promotion lifecycle per AR-062 |
| ResearchSource | ROOT/EVIDENCE | research | external source | provenance/snapshot/hash policy |
| ResearchClaim | ROOT | research | ResearchSource | authority/freshness/verification |
| KnowledgeDocument | ROOT/CHILD | knowledge | artist/song/domain | retrievable source text/document |
| KnowledgeChunk | PROJECTION/index | knowledge | source version | rebuildable retrieval chunk |
| EmbeddingRecord | PROJECTION/index | knowledge | chunk/entity version | model/version referenced |

ContextPack is runtime/AgentRun evidence, not long-lived canonical domain truth.

### 2.15 AI / jobs / platform knowledge

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| AgentConfiguration | ROOT/version | aiRuntime | agentType | DRAFT/CANARY/STABLE/RETIRED |
| AgentRun | EVIDENCE | aiRuntime | config + workflow | cost/latency/sources, no chain-of-thought |
| PromptVersion | CONFIG/version | aiRuntime | prompt key | immutable prompt/config history |
| EvalRun / EvalCaseResult | EVIDENCE | aiRuntime/quality | config/model | regression evidence |
| Job | ROOT/runtime | jobs | workflow/entity | retry/idempotency/progress |
| PlatformCapability | CONFIG/EVIDENCE | platforms | platform/region/account | sourced + freshness |
| PlatformAccountProfile | ROOT/CONFIG | platforms | Artist + platform | capabilities/restrictions |
| PlatformAssetRequirement | CONFIG/EVIDENCE | platforms | platform | sourced + freshness |
| PresenceRegistry | ROOT | platforms | Artist | names/domains/profiles |
| SocialHandleRecord | CHILD | platforms | PresenceRegistry | ownership/status |
| VerificationRecord | CHILD | platforms | Presence/platform | evidence/status |

### 2.16 Security / audit / telemetry

| Entity | Kind | Owner | Key relationships | Notes |
|---|---|---|---|---|
| IntegrationCredential | secure CONFIG | security/integrations | provider/account | encrypted; no domain secret copies |
| AuditEvent | EVIDENCE | audit | actor/entity/action | significant mutation history |
| ProductTelemetryEvent | EVIDENCE | telemetry | session/workflow | UX/product metrics, separate from artist analytics |
| StructuredLog | infrastructure | observability | trace/job/agent | retention-controlled, not product truth |

## 3. Core cardinality map

```text
Artist
├─ 1 ArtistIdentity ── N ArtistIdentityVersion
│                    ├─ N EraIdentity
│                    ├─ N IdentityConstraint
│                    └─ N SymbolicAnchor
├─ N Song ── N SongSegment
│      └─ N ReleaseTrack ── 1 Release [PROVISIONAL]
├─ N Campaign ── N CampaignTarget [PROVISIONAL]
├─ N NarrativeTrack
├─ N ContentAngle ── N ContentUnit
│                       ├─ N Publication
│                       ├─ N ContentExecutionRevision
│                       └─ N Shot ← 1 ShootSession
│                               └─ N Take [PROVISIONAL]
├─ N Asset
│    └─ N↔N AssetDerivation [PROVISIONAL]
├─ N MetricSnapshot
├─ N Experiment / Learning / Decision
└─ N ResearchClaim / Knowledge artifacts
```

## 4. Truth vs projection matrix

| Concept | Canonical truth | Projection / consumer |
|---|---|---|
| active identity | ArtistIdentity.activeVersionId + IdentityVersion | Artist Brain / Context Capsule / Brand Book |
| narrative actual mix | ContentUnit narrative links + published state | NarrativeMix actualMix |
| profile readiness | current profile/platform facts | readiness projection/snapshot |
| release readiness | source tasks/facts/capabilities | readiness projection/snapshot |
| pipeline bottleneck | ContentUnit/Production/Publication state | Overview attention projection |
| evergreen pool | Content/series/archive eligibility | Evergreen Pool view |
| artist brain | underlying canonical Identity/Knowledge/Learnings | versioned compiled snapshot |
| platform eligibility | PlatformCapability/DSPOpportunity evidence | readiness/action UI |
| business reporting currency | original money facts + FX evidence | converted dashboard view |

## 5. Physical-schema next step

Each ROOT/CHILD above must receive a table-level specification containing fields, constraints, indexes and transitions before implementation. ACP-dependent rows remain provisional until architecture freeze.
