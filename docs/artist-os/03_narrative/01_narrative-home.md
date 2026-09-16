# Narrative Home

## 1. Metadata
- **Spec ID:** `NAR-HOME`
- **Domain:** `03_narrative`
- **Feature:** Narrative Home / Narrative Command Center
- **Status:** REVIEW
- **MASTER references:** 83–85, 93–102, 130–132, 145–147, 296, 319, 354, 361, 405, 450–455
- **Depends on:** Active Identity Version or explicit draft context; Narrative Tracks; optional Era, Campaign, Content Units, Publications and Metrics
- **Used by:** Content Factory, Planning, Calendar, Analytics, Weekly Review, Strategy Agent

## 2. Purpose
Provide one place where the artist can understand **what long-term stories are currently being told, what is planned next, how balanced the narrative is, and what evidence exists about audience response** without turning storytelling into a mechanical content quota.

Narrative Home is the operational bridge between the artist's internal Identity Narrative and audience-facing storytelling.

## 3. User problem / job-to-be-done
**JTBD:** “Show me which parts of my artist story I am actually telling right now, where the story is going, what has already been said, and where I may be repeating or neglecting something — without reducing my identity to a posting formula.”

The user should not need to inspect dozens of Content Units to answer:
- What narrative lines are active?
- What chapter/beat comes next?
- Am I telling only one side of myself?
- Which storylines are resonating, and with what confidence?
- What is a real learning vs a weak signal?

## 4. Scope
### In scope
- Active Narrative Tracks and roles.
- Current/next Narrative Beats.
- Narrative Mix target vs actual where the artist has chosen targets.
- High-level narrative performance summaries with sample size/confidence.
- Links to Identity Narrative, active Era, Campaigns and related Content Units.
- Narrative-specific attention items.
- AI-assisted recommendations grounded in Identity, Beats, Mix and evidence.

### Out of scope / non-goals
- Editing the underlying Identity Narrative in place.
- Replacing Content Factory or Calendar.
- Treating content pillars as narrative tracks.
- Universal 50/30/20 enforcement.
- “Narrative score”, virality score or automated rebranding.
- Declaring a story “bad” based on one post or one platform.

## 5. Entry points
- Primary navigation: `Narrative`.
- Identity → Narrative → `Open Narrative System`.
- Overview attention item.
- Campaign / Song contextual link.
- Weekly Review.
- Content Factory when selecting a Narrative Track.
- Command Palette: `Open Narrative`, `Create Narrative Track`, `Add Narrative Beat`.

## 6. Preconditions and dependencies
Narrative Home must remain usable in progressive states:
1. no Identity yet;
2. draft Identity only;
3. active Identity but no Narrative Tracks;
4. Tracks without publications;
5. mature state with metrics and learnings.

An active Identity Version improves recommendations but the user must be able to inspect historical Narrative data even when the referenced Identity Version is archived.

## 7. Information architecture
Recommended desktop composition:
1. **Narrative Context Header** — active Identity Version, Era, optional Campaign context.
2. **Active Tracks** — role, purpose, current beat, recent activity.
3. **Story Progression** — current and upcoming Beats.
4. **Narrative Coverage** — target vs actual, explicitly separate from Pillar mix.
5. **Response & Evidence** — track-level performance with sample size/confidence.
6. **Attention** — stalled tracks, over-concentration, contradictory evidence, missing beats.
7. **Next Narrative Actions** — contextual actions, not an opaque ranked score.
8. **Recent Narrative Decisions / Learnings** — links to evidence and Decision Memory.

Local navigation:
`Overview | Tracks | Beats | Differentiators | Mix | Analytics`

## 8. User roles and permissions
Single-artist MVP: the artist can create/edit/activate/archive tracks and beats.

Future collaborators may draft or suggest, but changes to protected disclosures, active Identity linkage or narrative canon remain approval-controlled.

## 9. Core data model
Reads:
- `ArtistIdentityVersion`
- `IdentityNarrative`
- `EraIdentity`
- `NarrativeTrack`
- `NarrativeBeat`
- `SignatureDifferentiator`
- `NarrativeMixPlan`
- `ContentUnit`
- `Publication`
- `MetricSnapshot`
- `Insight`
- `Learning`
- `Decision`

Derived view models may include:
- activeTrackCount;
- trackRoleDistribution;
- currentBeatByTrack;
- publicationCountByTrack;
- actualNarrativeMix;
- targetNarrativeMix;
- trackPerformanceSummary;
- evidenceConfidence;
- narrativeAttentionItems.

Derived values are not new truth-bearing domain entities unless separately specified.

## 10. Main happy-path workflow
1. User opens Narrative Home.
2. System resolves active Identity/Era context.
3. System loads active Narrative Tracks and current/next Beats.
4. System calculates actual narrative mix for the selected period from tagged Content Units/Publications.
5. If targets exist, system shows target vs actual as context, not failure grading.
6. System displays available performance summaries with sample sizes and confidence.
7. System surfaces narrative-specific attention items.
8. User opens a Track, Beat, Mix Plan or Analytics view.
9. User may ask Strategy AI for next narrative actions.
10. AI returns explainable suggestions linked to Identity, active story progression, recent executions and evidence.
11. User decides whether to create/edit a Beat, generate a Content Angle or take no action.

## 11. Alternative workflows
### No Narrative Tracks
Show the distinction between Identity Narrative and Narrative Tracks and offer `Create first Track` from confirmed themes or manual input.

### Identity incomplete
Allow manual tracks but mark Identity grounding as partial. Do not block narrative planning.

### No metrics
Show coverage/progression only. Analytics cards say `No evidence yet`, never `0 performance`.

### No target mix
Show actual distribution only. Do not invent equal targets.

### Historical context
User can switch to archived Era/Identity periods to understand previous narrative chapters without changing current state.

## 12. User actions
- Create Narrative Track.
- Open/edit/activate/pause/archive Track.
- Add/reorder/open Beat.
- Create/edit Mix Plan.
- Open track analytics.
- Generate narrative-aware Content Angles.
- Ask `Why is this attention item shown?`.
- Dismiss/snooze non-critical attention where appropriate.
- Open evidence/learning/decision provenance.

All state-changing actions must be reversible where logically possible and auditable.

## 13. State model
Narrative Home itself has view states rather than a persistent lifecycle:
`ONBOARDING | ACTIVE | PARTIAL_DATA | HISTORICAL_CONTEXT | ERROR`

It derives lifecycle state from its underlying Tracks, Beats, Identity/Era and data availability.

## 14. Business rules
- **NAR-HOME-001** — Narrative Home MUST distinguish Identity Narrative, Narrative Tracks, Content Pillars and Content Verticals in language and UI.
- **NAR-HOME-002** — Narrative Home MUST answer which storylines are active and where each active storyline currently sits in its Beat progression.
- **NAR-HOME-003** — Narrative coverage MUST be displayed separately from Content Pillar mix.
- **NAR-HOME-004** — The system MUST NOT impose a universal number of Narrative Tracks.
- **NAR-HOME-005** — The 50/30/20 model MAY be offered only as an optional template/heuristic and MUST NOT be treated as a default law.
- **NAR-HOME-006** — Target mix MUST be absent rather than fabricated when the user has not chosen targets.
- **NAR-HOME-007** — Deviation from a target mix MUST be contextualized as a signal/warning, not an error state.
- **NAR-HOME-008** — Narrative performance summaries MUST expose sample size and confidence/context where available.
- **NAR-HOME-009** — A single high-performing or low-performing Content Unit MUST NOT rewrite a Narrative Track, Identity Narrative or target mix automatically.
- **NAR-HOME-010** — Missing analytics MUST be represented as missing data, not zero.
- **NAR-HOME-011** — Archived/historical Narrative data MUST remain inspectable in its original Identity/Era context.
- **NAR-HOME-012** — The system MUST preserve the difference between story progression and posting frequency.
- **NAR-HOME-013** — Narrative Home MUST not require filler content to satisfy a narrative quota.
- **NAR-HOME-014** — Recommendations MUST state why they are suggested and what evidence or planning context they use.
- **NAR-HOME-015** — Recommendations based mainly on structural planning rather than performance evidence MUST say so.
- **NAR-HOME-016** — Protected facts or internal canon MUST NOT appear in audience-facing recommendation previews unless disclosure policy permits them.
- **NAR-HOME-017** — Narrative attention items MUST be explainable and link to the underlying Track/Beat/Mix/evidence.
- **NAR-HOME-018** — The Overview/Command Center MAY surface Narrative attention, but Narrative Home remains the detailed resolution surface.
- **NAR-HOME-019** — Track performance and Pillar/Format performance MUST NOT be conflated.
- **NAR-HOME-020** — The product MUST allow the artist to intentionally ignore an optimization signal without treating the narrative system as broken.

## 15. AI behavior
### Trigger
Explicit user request, contextual `Suggest next narrative actions`, or Strategy workflow.

### Context Request
Must include relevant `artistId`, `identityVersionId`, optional `eraIdentityId`, optional Campaign/Song, taskType and selected period.

### Context Pack
Minimum relevant set:
- Hard Rules;
- Identity Capsule;
- Identity Narrative summary filtered by disclosure policy;
- active Narrative Tracks and Beats;
- recent narrative-tagged Content Units;
- relevant validated Learnings;
- narrative analytics summaries;
- active experiments where applicable.

### Structured output
Each suggestion should include:
- proposed action;
- related Track/Beat;
- rationale;
- evidence/planning basis;
- uncertainty;
- production/content implication;
- learning opportunity if applicable.

### Allowed
Identify underused/overused storylines, suggest progression, suggest an adjacent Beat, propose content exploration.

### Forbidden
Invent artist biography, expose protected canon, auto-change Track role/Identity, claim causal audience psychology without evidence, enforce quotas.

### Insufficient evidence
Return `Insufficient performance evidence` and use structural/identity reasoning only if useful.

## 16. Human approval
Required for:
- creating/activating/archiving Tracks;
- changing Track role or disclosure scope;
- confirming Beats that reveal new narrative information;
- changing target mix;
- promoting narrative analytics to Learning/Decision where standard Learning rules require it.

AI may draft/suggest but not execute these changes silently.

## 17. Validation
- All Track references belong to the artist.
- Active Track Identity Version exists.
- Beat belongs to referenced Track.
- Tagged Content Unit references are valid.
- Target share fields follow Mix Plan rules.
- Protected disclosures are filtered before external/output contexts.
- Historical views do not mutate current state.

## 18. UI states
- First-use explanation.
- Identity exists / no Tracks.
- Tracks / no Beats.
- Tracks / no publications.
- Mature data state.
- Partial analytics import.
- Stale analytics warning.
- AI unavailable.
- Historical Era/Identity view.
- Deleted/missing dependency warning.

## 19. Edge cases
- One Content Unit intentionally belongs to multiple Narrative Tracks.
- A Track spans several Songs or no Song.
- Era changes while a long-running Track continues.
- A Campaign temporarily dominates the actual mix.
- Artist deliberately tells contradictory sides of the same story.
- Archived Track has current high-performing historical content.
- Track target is zero/paused but old publications remain in selected period.

The system must preserve history and scope instead of flattening these cases into one “correct” mix.

## 20. Cross-module effects
Consumes Identity, Era, Content, Publication, Metrics, Insight/Learning/Decision data.

Provides context to:
- Content Factory;
- Calendar/Planning;
- Campaign strategy;
- Weekly Review;
- Strategy Agent;
- Analytics.

No cross-module mutation occurs solely from opening Narrative Home.

## 21. Notifications and attention model
Eligible attention examples:
- active Track has no planned/current Beat;
- significant target-vs-actual drift over a meaningful window;
- Track marked active but has no recent executions for a user-defined/planning-relevant period;
- contradictory performance evidence requiring review;
- active Beat depends on protected disclosure conflict.

Do not create attention merely because the artist has not posted on a fixed cadence.

## 22. Search / filtering / sorting / bulk actions
Period, Era, Campaign, Song, Track role, Track status, platform where analytics supports it.

No bulk destructive Track state changes from Home.

## 23. Analytics and product telemetry
Track:
- Narrative Home opens;
- Track/Beat creation entry source;
- target mix adoption/change;
- recommendation acceptance/rejection;
- attention open/dismiss/snooze;
- navigation to Content Factory/Analytics;
- time to first Narrative Track.

Do not measure or optimize an artist's private narrative “quality score”.

## 24. Learning feedback
Narrative Home can surface existing Insights/Learnings and create pathways to new hypotheses. It MUST NOT itself convert raw performance into validated learning.

## 25. Auditability / provenance
State-changing actions store actor, timestamp, old/new values and source/context where relevant. AI recommendations preserve AgentRun/config and context provenance.

## 26. Desktop / mobile behavior
Desktop: full command-center experience.
Mobile: simplified active Tracks, current Beats, attention and quick actions; deep analytics may open a reduced or dedicated view.

## 27. Accessibility / usability
- Track roles/statuses must not rely on color alone.
- Coverage chart must have textual/tabular equivalent.
- Keyboard navigation for track cards/tabs.
- Clear distinction between current and historical context.
- No guilt-inducing quota language.

## 28. Security / privacy / rights
Internal canon shown only according to Mystique/Interpretation/visibility rules. External references and collaborators must receive minimum necessary context.

## 29. Performance / async jobs
Core page should load from structured data without AI. Heavy analytics aggregation and AI recommendations may run asynchronously through JobService and must not block navigation.

## 30. Acceptance criteria
1. User can identify all active Tracks and current/next Beats from Narrative Home.
2. Actual narrative mix is visibly distinct from Content Pillar mix.
3. No target is shown if user has not configured one.
4. One outlier post does not mutate narrative structure.
5. Missing analytics is shown as unavailable, not zero.
6. AI recommendations expose rationale and uncertainty.
7. Protected internal canon does not leak into recommendation output.
8. Historical Narrative context remains inspectable without modifying current Identity/Tracks.

## 31. Test matrix
- **Unit:** mix derivation, missing-data behavior, visibility filtering.
- **Integration:** Identity/Era context, Content tags, Analytics summaries, attention generation.
- **Agent eval:** no invented biography; no forced quota; evidence-aware recommendation.
- **E2E:** Identity → Track → Beat → Content → Publication → Metrics → Narrative Home.
- **Manual smoke:** first-use, mature state, historical view, AI unavailable.

## 32. Open questions
1. Whether one Content Unit may have multiple first-class Narrative Track links or one primary + secondary tags; MASTER only defines `narrativeTrackId?` on Content Angle. Schema pass must resolve without losing multi-story historical cases.
2. Whether Narrative Home needs a first-class `NarrativeAttentionItem` persistence model or can derive attention from domain state like Overview does.

## 33. Traceability
`NAR-HOME-001–020` → MASTER 83–85, 93–102, 130–132, 145–147, 296, 319, 354, 361, 405, 450–455.
