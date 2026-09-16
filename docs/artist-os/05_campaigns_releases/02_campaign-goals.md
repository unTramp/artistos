# Campaign Goals & Objectives

- **Status:** REVIEW COMPLETE
- **MASTER references:** §50–52, §156, §264–285, §449–456
- **Domain:** 05_campaigns_releases
- **Feature slug:** `campaign-goals`
- **Requirement prefix:** `CMP-GOAL`

## 2. Purpose
Define what success means for a Campaign without collapsing distinct outcomes into a vanity-score.

## 3. User problem / job-to-be-done
Artists often launch activity with vague intent (“promote the song”). The system must force enough clarity to coordinate actions and later evaluate what was actually learned or achieved.

## 4. Scope
Primary/secondary goals, success indicators, target ranges where user chooses them, objective rationale, goal-specific recommended metrics and review. No magic score or guaranteed outcome.

## 5. Entry points
Campaign creation/edit, release planner, experiment setup, business campaign, campaign review.

## 6. Preconditions and dependencies
Campaign required. Metrics availability is optional and platform-dependent.

## 7. Information architecture
Goal card: Goal → Why → Success signals → Optional target → Measurement source → Time window → Caveats.

## 8. User roles and permissions
MVP user edits. Future collaborators may propose; strategy owner approves material change.

## 9. Core data model
MASTER goal enum: `FOLLOWERS, REACH, ENGAGEMENT, PROFILE_VISITS, MUSIC_DISCOVERY, STREAMS, SAVES, AUDIENCE_LEARNING, MARKET_LEARNING, REVENUE, MEMBERSHIP`. Product layer should support one primary and optional secondary goals plus explicit measurement metadata; final schema TBD.

## 10. Main happy-path workflow
Select primary goal → system proposes relevant indicators → user accepts/edits → optional target/window → campaign actions use goal context → review compares observed evidence with target/context.

## 11. Alternative workflows
Learning goal with no numeric target; mixed revenue + audience objective; metric unavailable from platform; target changed mid-campaign with reason.

## 12. User actions
Set/change primary goal, add/remove secondary, set optional target, choose measurement source, annotate assumptions, review outcome.

## 13. State model
Goal definition: `DRAFT / ACTIVE / SUPERSEDED / REVIEWED` is product recommendation; persistence enum not frozen.

## 14. Business rules
- `CMP-GOAL-001` Exactly one primary goal MUST be visually dominant for an active Campaign.
- `CMP-GOAL-002` Secondary goals MUST be clearly labeled secondary.
- `CMP-GOAL-003` Goal selection MUST NOT manufacture unsupported metrics.
- `CMP-GOAL-004` Missing metric MUST be represented as unavailable/NULL, never zero.
- `CMP-GOAL-005` Learning goals MAY use evidence quality and completed experiments as outcome signals instead of reach/revenue targets.
- `CMP-GOAL-006` System MUST NOT rank campaigns with a universal success score.
- `CMP-GOAL-007` Cross-platform raw views MUST NOT be treated as directly comparable success.
- `CMP-GOAL-008` User-set targets MUST record unit, period and scope.
- `CMP-GOAL-009` AI-suggested target MUST be labeled suggestion and grounded in available own history or external evidence.
- `CMP-GOAL-010` If there is insufficient historical evidence, AI MUST say so instead of fabricating a “reasonable” precision target.
- `CMP-GOAL-011` Changing primary goal after activation MUST preserve previous goal and reason.
- `CMP-GOAL-012` Revenue goal MUST distinguish gross/net/take-home terminology where applicable.
- `CMP-GOAL-013` Streams MUST NOT be automatically treated as the only music-discovery success signal.
- `CMP-GOAL-014` Audience growth and audience depth/fan value MUST remain distinct dimensions.
- `CMP-GOAL-015` Goal-specific recommendations MUST remain subordinate to Identity constraints and human creative choice.

## 15. AI behavior
Suggest goal framing and measurements, explain tradeoffs, detect conflict between primary goal and planned actions. Never claim causality from correlation.

## 16. Human approval
User confirms primary goal and any material change after campaign activation.

## 17. Validation
Targets require valid unit and nonnegative values where numeric. Date/window must align with campaign timing or be explicitly scoped otherwise.

## 18. UI states
No goal, configured, insufficient measurement data, target met/not met/inconclusive, changed goal, unavailable source.

## 19. Edge cases
Goal metric discontinued by platform; campaign pivots; multi-market campaign; secondary goal conflicts with primary; target impossible to measure.

## 20. Cross-module effects
Context Assembler, Factory, Analytics, Experiments, Overview and Weekly Review consume goal context.

## 21. Notifications and attention model
Warn on primary goal with no measurable indicator where measurement is expected; do not nag learning campaigns for missing vanity KPIs.

## 22. Search / filtering / sorting / bulk actions
Campaign list can filter by primary goal; bulk goal changes are not allowed in MVP.

## 23. Analytics and product telemetry
Goal completion rate is not a product-quality score. Track goal selection distribution, later changes, measurement availability and review completion.

## 24. Learning feedback
Outcome review can create scoped Insight/Hypothesis; target miss alone does not produce a validated learning.

## 25. Auditability / provenance
Persist target/source changes and assumptions.

## 26. Desktop / mobile behavior
Mobile shows primary goal and key indicator compactly; detailed configuration desktop-first.

## 27. Accessibility / usability
Use plain-language goal descriptions and units; explain unfamiliar metrics.

## 28. Security / privacy / rights
Business metrics may be private; external share/export excludes them unless selected.

## 29. Performance / async jobs
Metric refresh may be async; goal UI uses last-known timestamp.

## 30. Acceptance criteria
- `CMP-GOAL-AC01` User cannot activate a Campaign without explicit primary goal.
- `CMP-GOAL-AC02` Learning campaign works without arbitrary numeric target.
- `CMP-GOAL-AC03` Missing metric is not displayed as zero.
- `CMP-GOAL-AC04` Mid-campaign goal change preserves history/reason.
- `CMP-GOAL-AC05` UI never emits one universal campaign success score.
- `CMP-GOAL-AC06` AI can explain why planned actions are weakly aligned with the selected goal.

## 31. Test matrix
All MASTER goal types; missing metrics; target edit; goal pivot; learning-only campaign; revenue terminology; AI no-evidence case.

## 32. Open questions
Whether Goal Definition deserves a dedicated entity or remains Campaign fields + history/event records.

## 33. Traceability
MASTER §51 Campaign Goals, §25 no fake certainty, §287–300 Analytics, §449–456 success principles.
