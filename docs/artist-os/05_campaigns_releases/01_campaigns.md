# Campaign Management

- **Status:** REVIEW COMPLETE
- **MASTER references:** §14, §50–52, §130–141, §156, §197–206, §226–233, §262, §272–285, §448
- **Domain:** 05_campaigns_releases
- **Feature slug:** `campaigns`
- **Requirement prefix:** `CMP-CAM`

## 2. Purpose

Campaign is the orchestration boundary that converts an artist objective into a coordinated, time-bounded or evergreen set of actions across Song/Release, Narrative, Content, Production, Distribution, DSP, Growth, Owned Media and Business without absorbing those domains into a single god-object.

## 3. User problem / job-to-be-done

An independent artist usually manages a release as disconnected checklists, posts, links, DSP tasks and ideas. The user needs one place that answers: **what are we trying to achieve, what is connected to this effort, what is blocked, what is next, and what did we learn?**

## 4. Scope

In scope: create/edit/archive campaigns; type, goal, dates/window, linked Song/Release, Identity/Era, Narrative Tracks, domain references, readiness summary, attention, progress and decision context. Out of scope: owning ContentUnit, Publication, DSP opportunity, Offer, CreatorCollaboration, AdvertisingCampaign or PublicityCampaign internals.

## 5. Entry points

- Primary navigation / campaign context from Overview.
- Song/Release page: `Create campaign` / `Open campaign`.
- Factory, Calendar, DSP, Distribution and Business may deep-link to active Campaign.
- Command Palette may create/open a Campaign.

## 6. Preconditions and dependencies

Only Artist is required. Song/Release and Identity may be linked later. Campaign behavior must remain usable with manual/CSV workflows and AI unavailable.

## 7. Information architecture

Campaign detail contains: **Overview, Objective, Timeline, Narrative, Content, Production, Distribution, DSP, Growth, Business, Experiments/Learnings, Decisions**. Tabs are projections/references into owning domains, not duplicate stores.

## 8. User roles and permissions

MVP single-artist: user can create/edit/archive. Future team permissions must preserve explicit approval for significant strategy changes, publishing and spend.

## 9. Core data model

MASTER defines type/goals/linkage but not a complete Campaign schema. Product layer requires at minimum: `id`, `artistId`, `name`, `type`, `status`, `primaryGoal`, optional secondary goals, optional `songId/releaseId`, optional `identityVersionId/eraIdentityId`, timing mode/window, narrative references, notes, created/updated timestamps. Final relational schema is deferred to Stage-0/schema audit.

## 10. Main happy-path workflow

1. User creates Campaign.
2. Chooses campaign type and primary goal.
3. Links Song/Release when applicable.
4. Confirms active Identity/Era context.
5. Selects/accepts Narrative Track context.
6. Defines timing or Evergreen mode.
7. System assembles current readiness and missing dependencies.
8. User creates/links downstream work in owning modules.
9. Overview tracks blockers, progress, experiments and key decisions.
10. Campaign ends/archives with outcome summary and learnings retained.

## 11. Alternative workflows

- Artist introduction / identity-building campaign with no Song.
- Evergreen campaign with no fixed end date.
- Experiment campaign focused primarily on learning.
- Business campaign centered on an Offer rather than release.
- Campaign starts before Identity is complete: system warns but does not block unless a dependent action requires it.

## 12. User actions

Create, duplicate as draft, rename, change type/goal with audit trail, link/unlink supported entities, pause/resume, archive, add note, open linked work, request strategy suggestions, run readiness review.

## 13. State model

Product recommendation: `DRAFT → ACTIVE → PAUSED → COMPLETED → ARCHIVED`, with `CANCELLED` as terminal alternative. **MASTER does not define Campaign status enum; schema freeze requires explicit approval.**

## 14. Business rules

- `CMP-CAM-001` Campaign MUST remain an orchestration boundary and MUST NOT become owner of domain-specific entities.
- `CMP-CAM-002` Every Campaign MUST have one explicit primary goal.
- `CMP-CAM-003` Secondary goals MAY exist but MUST NOT obscure the primary goal in UI/analytics.
- `CMP-CAM-004` Song/Release linkage MUST be optional for non-release campaign types.
- `CMP-CAM-005` Historical linked entities MUST remain traceable after Campaign completion.
- `CMP-CAM-006` Archiving a Campaign MUST NOT delete linked Content, Publications, Metrics, Experiments, Learnings or Decisions.
- `CMP-CAM-007` Campaign MUST reference active Identity/Era context used for strategy at the time; later identity changes MUST NOT silently rewrite history.
- `CMP-CAM-008` Campaign MAY surface domain readiness but MUST delegate canonical readiness data to owning domain.
- `CMP-CAM-009` Future Advertising/Publicity links MUST be extension references only until their bounded contexts are normative.
- `CMP-CAM-010` Campaign progress MUST distinguish `not planned`, `planned`, `blocked`, `done`, and `not applicable` where possible; missing work is not automatically failure.
- `CMP-CAM-011` AI MUST NOT auto-activate, complete, archive, publish, spend or materially change strategy without human approval.
- `CMP-CAM-012` An Evergreen Campaign MUST not be forced into artificial release-style deadlines.
- `CMP-CAM-013` A Campaign may be successful on learning outcomes even when reach/revenue goals are not met, if its primary goal is learning/experiment.
- `CMP-CAM-014` Campaign summaries MUST separate facts, observations, hypotheses and recommendations.
- `CMP-CAM-015` Changes to primary goal/type after ACTIVE MUST create an auditable strategy-change event.
- `CMP-CAM-016` Campaign deletion should be soft-delete/archive in MVP; destructive delete requires explicit confirmation and dependency checks.

## 15. AI behavior

AI may propose campaign framing, missing work, next actions and risk explanations from current context. It must cite the relevant context/evidence and expose uncertainty. It must not invent completed tasks, platform capabilities, dates or metrics.

## 16. Human approval

Required for activation of significant strategy, goal changes after activation, publication/spend actions, permanent learning promotion and destructive actions.

## 17. Validation

Name and primary goal required. Song/Release required only when campaign type/flow depends on one. Date ranges cannot be invalid. Archived entities cannot be newly mutated through campaign projection without reopening in owning domain.

## 18. UI states

Empty/new, Draft, Active healthy, Active attention required, Paused, Completed, Archived, Partial data, AI unavailable, linked-domain unavailable/error.

## 19. Edge cases

Release date changes; song removed/replaced; campaign spans identity era transition; duplicated campaign; overlapping campaigns for same song; campaign has no content yet; campaign completed before all optional work; linked provider data goes stale.

## 20. Cross-module effects

Campaign context informs Factory, Calendar, Context Assembler, Link Routing, DSP plan, Website experience, Growth experiments and Offers. Those modules retain ownership.

## 21. Notifications and attention model

Only actionable items: approaching hard deadlines, blocked critical dependency, release date mismatch, stale capability affecting plan, unresolved approval, missing required asset. Avoid generic “campaign behind schedule” without reason.

## 22. Search / filtering / sorting / bulk actions

Filter by status/type/goal/song/release/era/date. Sort by attention, start/release date, updated date. Bulk archive may be supported only with dependency-safe confirmation.

## 23. Analytics and product telemetry

Track campaign create-to-activate time, linked-domain completion, manual corrections to AI recommendations, goal changes, completion reasons and campaign outcome review usage.

## 24. Learning feedback

Campaign outcome produces scoped observations/insights/hypotheses; no automatic validated learning from aggregate success alone.

## 25. Auditability / provenance

Log creation, activation, goal/type changes, timing changes, link/unlink events, pause/complete/archive and AI strategy proposals accepted/rejected.

## 26. Desktop / mobile behavior

Desktop is primary strategy view. Mobile exposes current focus, blockers, approvals and quick links; avoid full dense orchestration editing on small screens in MVP.

## 27. Accessibility / usability

Status and blockers cannot rely on color alone. Cross-domain references must clearly indicate source module and open in context.

## 28. Security / privacy / rights

Campaign must not expose Internal Canon/private identity data to external integrations unless explicitly required and approved.

## 29. Performance / async jobs

Campaign page loads from persisted projections first; AI strategy and readiness refresh can run async. The page must not block on AI.

## 30. Acceptance criteria

- `CMP-CAM-AC01` User can create a Campaign with only Artist + primary goal and later enrich it.
- `CMP-CAM-AC02` Release Campaign can link Song/Release, Identity/Era and downstream domain work without duplicating canonical entities.
- `CMP-CAM-AC03` Campaign clearly shows blockers and source domain.
- `CMP-CAM-AC04` Historical identity/campaign context is preserved after later edits.
- `CMP-CAM-AC05` Archiving Campaign leaves linked historical data intact.
- `CMP-CAM-AC06` AI unavailable state preserves all manual campaign management.
- `CMP-CAM-AC07` Goal/type mutation on active campaign is auditable.
- `CMP-CAM-AC08` Future Advertising/Publicity can be linked through extension references without embedding their future schema.

## 31. Test matrix

Create minimal campaign; create release campaign; no-song campaign; overlapping campaigns; pause/resume; archive; release date change; stale capability; AI outage; identity era transition; permission/destructive-action guard.

## 32. Open questions

1. Final Campaign persistence schema and status enum.
2. Whether Campaign allows multiple Songs/Releases in MVP or one primary release plus related references.
3. Canonical strategy-change event entity vs AuditEvent subtype.

## 33. Traceability

MASTER §14, §50–52, §20 Human Approval, §24 Explainability, §52 linkage, §448 extension points.
