# Artist OS — Engineering Spec 04: Domain Commands & Events

**Status:** DRAFT / Pass 1
**Architecture baseline:** MASTER v1.3 + Architecture Resolution Pass 1 + Architecture Freeze Candidate.
**Product baseline:** Full Product Spec Pass 1.

## 1. Purpose

Define the only supported mutation entry points and the durable facts emitted after successful state transitions. Commands express **intent**; events express **facts that already happened**. Neither UI nor AI may bypass these contracts.

## 2. Global command contract

### ENG-CMD-001 — Every mutation is a command

Every state-changing use case enters through an application command/service method with:

```text
commandId
artistId
actor
requestedAt
idempotencyKey?
expectedVersion?
payload
approvalContext?
traceId
```

### ENG-CMD-002 — Actor model

MVP actor types:

```text
USER
SYSTEM
AGENT
WORKER
INTEGRATION
```

`AGENT` and `WORKER` never imply approval authority.

### ENG-CMD-003 — Optimistic concurrency

Mutable roots that can be edited from multiple workflows expose a monotonic version/revision. Commands with stale `expectedVersion` return `CONFLICT` rather than silently overwriting newer changes.

### ENG-CMD-004 — Human approval is explicit

Commands that activate/publish/promote/delete/spend/change protected identity state require an explicit approval artifact or user actor according to the product policy. AI proposals use separate `Propose*` commands where necessary.

### ENG-CMD-005 — No repository writes from presentation layer

Route handlers/server actions validate transport shape, then invoke application commands. They cannot call repository `save()` directly.

### ENG-CMD-006 — Command outcomes

Standard result envelope:

```text
SUCCESS
VALIDATION_ERROR
CONFLICT
FORBIDDEN
NOT_FOUND
BLOCKED
RETRYABLE_FAILURE
EXTERNAL_FAILURE
```

Every non-success result carries machine-readable code + user-safe message + optional field errors.

### ENG-CMD-007 — Idempotency

Commands that trigger external side effects, imports, publishing, jobs, or duplicate-prone actions require idempotency keys. Repeating the same key returns the original outcome or current operation state.

### ENG-CMD-008 — Audit linkage

Security/product-significant commands emit `AuditEvent` metadata containing commandId, actor, entity references, old/new revision refs where applicable and reason/approval evidence.

## 3. Global event contract

### ENG-EVT-001 — Events are immutable facts

Event envelope:

```text
eventId
eventType
occurredAt
recordedAt
artistId
aggregateType
aggregateId
aggregateVersion
actorType
actorId?
correlationId
causationId?
payloadVersion
payload
```

### ENG-EVT-002 — No imperative event names

Allowed: `IdentityVersionActivated`.
Forbidden: `ActivateIdentityVersion` as an event.

### ENG-EVT-003 — Event evolution

Payload schema changes require `payloadVersion`; consumers must support at least current + previous version during rolling migration.

### ENG-EVT-004 — Outbox

Events needed by jobs/projections/integrations are written to an outbox in the same transaction as the owning state mutation.

### ENG-EVT-005 — At-least-once delivery

Consumers must be idempotent by `eventId`/consumer key. No consumer may assume exactly-once delivery.

## 4. Command catalog by domain

### 4.1 Artist / Identity

```text
CreateArtist
UpdateArtistProfile
StartIdentityDiscovery
RecordListeningSession
AddSensoryAssociationCandidate
ReviewSensoryAssociationCandidate
CreateMoodboard
AddMoodboardItem
AnalyzeMoodboard
AcceptVisualPattern
RejectVisualPattern
UpdateVisualIdentityDraft
SetIdentityConstraint
CreateIdentityDeviation
CreateIdentityVersion
SubmitIdentityVersionForReview
ActivateIdentityVersion
ArchiveIdentityVersion
CreateEra
ActivateEra
EndEra
GenerateBrandBook
RunIdentityCheck
OverrideIdentityGuardFinding
```

Rules:
- `ActivateIdentityVersion` is USER-approved only.
- `AnalyzeMoodboard`, `GenerateBrandBook`, `RunIdentityCheck` may enqueue jobs but cannot auto-activate identity state.
- `OverrideIdentityGuardFinding` requires reason and emits audit evidence.

Events:

```text
ArtistCreated
ArtistProfileUpdated
IdentityDiscoveryStarted
ListeningSessionRecorded
IdentityCandidateReviewed
MoodboardItemAdded
MoodboardAnalysisCompleted
VisualPatternAccepted
IdentityConstraintChanged
IdentityDeviationApproved
IdentityVersionCreated
IdentityVersionSubmitted
IdentityVersionActivated
IdentityVersionArchived
EraActivated
EraEnded
BrandBookGenerated
IdentityCheckCompleted
IdentityGuardOverridden
```

### 4.2 Narrative

```text
CreateNarrativeTrack
UpdateNarrativeTrack
ArchiveNarrativeTrack
CreateNarrativeBeat
AdvanceNarrativeBeat
CreateNarrativeMixPlan
AssignNarrativeToAngle
AssignNarrativeToContentUnit
SetPrimaryNarrativeLink
AddSecondaryNarrativeLink
RemoveNarrativeLink
CreateSignatureDifferentiator
```

**ARCHITECTURE STATUS: PROVISIONAL — ACP-003** for primary/secondary link cardinality.

Events include `NarrativeTrackCreated`, `NarrativeBeatAdvanced`, `NarrativeAssignmentChanged`, `NarrativeMixPlanCreated`.

### 4.3 Music / Release

```text
CreateSong
UpdateSongBrain
AddSongSegment
UpdateSongSegment
LinkEquivalentSongSegment
AddAudioAsset
RecordAudioUsage
CreateRelease
UpdateRelease
AddReleaseTrack
RemoveReleaseTrack
ScheduleRelease
DelayRelease
MarkReleaseReleased
CancelRelease
CreateReleaseExtension
```

**ARCHITECTURE STATUS: PROVISIONAL — ACP-002** for Release/ReleaseTrack.

Rules:
- Song meaning/lyrics/segments remain Song-owned.
- Release lifecycle mutations never rewrite Song Brain.

Events include `SongCreated`, `SongBrainUpdated`, `SongSegmentCreated`, `AudioUsageRecorded`, `ReleaseCreated`, `ReleaseScheduled`, `ReleaseDateChanged`, `ReleaseReleased`.

### 4.4 Campaign / Planning

```text
CreateCampaign
UpdateCampaign
SetCampaignPrimaryTarget
AddCampaignRelatedTarget
RemoveCampaignTarget
SetCampaignGoals
ChangeCampaignPhase
PauseCampaign
ArchiveCampaign
CreatePlanningObjective
ActivatePlanningObjective
CompletePlanningObjective
CancelPlanningObjective
CreateContentSlot
MoveContentSlot
CreateRecurringSeries
UpdateRecurringSeries
ArchiveRecurringSeries
```

**ARCHITECTURE STATUS: PROVISIONAL — ACP-001/ACP-002**.

Events include `CampaignCreated`, `CampaignTargetChanged`, `CampaignPhaseChanged`, `PlanningObjectiveActivated`, `PlanningObjectiveCompleted`, `ContentSlotChanged`.

### 4.5 Content Factory / Pipeline

```text
GenerateContentAngles
CreateContentAngle
EditContentAngle
ApproveContentAngle
RejectContentAngle
GenerateExecutionPackage
CreateContentUnitFromAngle
UpdateContentUnit
ChangeContentUnitStatus
AddHookVariant
SelectHookVariant
CreatePlatformAdaptationDraft
RunNoveltyCheck
RunFatigueCheck
```

Rules:
- generation commands create proposals/drafts only;
- `ApproveContentAngle` is explicit user action;
- execution package is not a new root unless architecture changes later;
- status transitions obey Content state machine.

Events include `ContentAngleGenerated`, `ContentAngleApproved`, `ContentAngleRejected`, `ContentUnitCreated`, `ContentUnitStatusChanged`, `NoveltyCheckCompleted`, `FatigueCheckCompleted`.

### 4.6 Production / Takes

```text
CreateProductionCapabilityProfile
UpdateEquipmentItem
CreateShootSession
UpdateShootSession
CreateShot
ReorderShots
StartShot
SkipShot
StartTake
CloseTake
RateTakeGood
RateTakeBad
SelectTake
UnselectTake
CompleteShootSession
```

**ARCHITECTURE STATUS: PROVISIONAL — ACP-005** for Take/TakeAsset.

Rules:
- Shot holds plan/execution status only;
- quality/selection belongs to Take;
- On-Set commands must support offline idempotency.

Events include `ShootSessionCreated`, `ShotStarted`, `TakeStarted`, `TakeClosed`, `TakeRated`, `TakeSelected`, `ShootSessionCompleted`.

### 4.7 Assets / Rights

```text
RegisterAsset
UpdateAssetMetadata
ConfirmAssetMapping
RejectAssetMapping
LinkAssetToTake
CreateAssetDerivation
RemoveAssetDerivation
SetAssetRights
AttachRightsProof
CreateRepurposingPlan
ApproveRepurposingItem
EvaluateRightsForUsage
OverrideRightsBlock
```

**ARCHITECTURE STATUS: PROVISIONAL — ACP-006** for AssetDerivation.

Rules:
- original metadata is append-only/immutable where possible;
- derivation cycles are rejected;
- rights override requires explicit user approval + audit reason.

Events include `AssetRegistered`, `AssetMappingConfirmed`, `AssetDerivationCreated`, `AssetRightsChanged`, `RightsEvaluationCompleted`, `RightsBlockOverridden`.

### 4.8 Distribution / DSP

```text
CreatePublication
UpdatePublicationDraft
SchedulePublication
MarkPublicationPublished
MarkPublicationFailed
CreateLinkHub
PublishLinkHubVersion
CreateWebExperience
PublishWebExperienceVersion
CreateDSPReleasePlan
RecordDSPOpportunity
CreateEditorialPitch
SubmitEditorialPitch
RecordEditorialPitchOutcome
RefreshDSPProfile
```

Rules:
- `MarkPublicationPublished` requires provider evidence or user confirmation;
- publishing external side effects use idempotency;
- DSP opportunity eligibility must preserve source/freshness.

Events include `PublicationScheduled`, `PublicationPublished`, `LinkHubVersionActivated`, `WebExperiencePublished`, `EditorialPitchSubmitted`, `DSPProfileRefreshed`.

### 4.9 Operational actions

```text
CreateOperationalAction
StartOperationalAction
BlockOperationalAction
CompleteOperationalAction
SkipOperationalAction
ExpireOperationalAction
ReopenOperationalAction
```

**ARCHITECTURE STATUS: PROVISIONAL — ACP-004**.

Rule: completion does not directly mutate foreign domain truth; a separate validated domain command performs that mutation.

### 4.10 Analytics / Intelligence / Business

```text
ImportMetricBatch
NormalizeMetricBatch
CreateInsight
ReviewInsight
CreateHypothesis
CreateExperiment
StartExperiment
RecordExperimentObservation
CompleteExperiment
SetExperimentDecision
CreateLearning
PromoteLearning
MarkLearningStale
DeprecateLearning
RecordDecision
ReverseDecision
CreateWeeklyReview
CreateRevenueGoal
CreateOffer
ReviseOfferTerms
RecordRevenueEvent
CorrectRevenueEvent
```

Rules:
- imported missing metric = NULL, never 0;
- validated Learning promotion requires approval/evidence policy;
- monetary corrections are append-only compensating facts, not destructive edits.

### 4.11 Knowledge / Research / AI

```text
AddToneCorpusItem
CreateCandidateKnowledge
PromoteCandidateKnowledge
RejectCandidateKnowledge
CreateResearchSource
ExtractResearchClaims
VerifyResearchClaim
MarkResearchClaimStale
AssembleContextPack
CreateAgentConfiguration
PromoteAgentConfigurationToCanary
PromoteAgentConfigurationToStable
RetireAgentConfiguration
RunAgentWorkflow
CancelAgentRun
```

Rules:
- Context Assembler is the only component allowed to decide retrieval composition;
- AgentRun never persists chain-of-thought;
- claim promotion preserves provenance.

## 5. Cross-domain orchestration rules

### ENG-CMD-009 — Orchestrators call domain commands, not repositories

Example `PublishContentWorkflow` may invoke Content validation → Rights evaluation → Publication create/schedule → provider adapter. It cannot directly mutate ContentUnit and Publication tables in one ad-hoc service.

### ENG-CMD-010 — Partial failure is explicit

If an external publish succeeds but local acknowledgement fails, recovery reconciles provider state using external ID/idempotency key. The system must not blindly retry and create duplicate posts.

### ENG-CMD-011 — Compensation over rollback for external effects

Once an external effect occurs, use reconciliation/compensating action rather than pretending the whole distributed workflow can be transactionally rolled back.

### ENG-CMD-012 — Protected state matrix

At minimum, explicit human approval is required for:

```text
IdentityVersion activation
Era activation/termination when strategic
validated knowledge promotion
Learning VALIDATED
publishing / scheduling where external post will occur
rights override
Decision reversal with material strategy impact
destructive archival/deletion where data becomes inaccessible
future spend actions
```

## 6. Acceptance criteria

- Every Product Spec mutation maps to at least one named command.
- Every externally observable lifecycle change maps to a named event or documented reason not to emit one.
- No event name is imperative.
- No ACP-dependent command is marked final before architecture approval.
- External side-effect commands define idempotency and reconciliation.
- AI-triggered mutations cannot bypass approval rules.
