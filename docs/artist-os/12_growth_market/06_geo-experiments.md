# Geo Experiments

- **Status:** REVIEW COMPLETE
- **MASTER references:** §255, §301–315
- **Domain:** 12_growth_market
- **Feature slug:** `geo-experiments`
- **Requirement prefix:** `GRO-GEO`

## 2. Purpose
Provide an experiment wrapper for comparing market response with explicit metrics, context and uncertainty rather than informal “this country seems cheaper/better” judgments.

## 3. User problem / job-to-be-done
Market tests are easy to confound by different content, timing, spend and audience sizes. The OS needs a structured comparison that makes limitations visible.

## 4. Scope
### In scope
- market experiment setup
- control/variant markets or repeated market tests
- relevant metrics
- content/period comparability
- result → Insight/Learning flow

### Out of scope / non-goals
- election-style market prediction
- automatic budget allocation
- paid ad execution

## 5. Entry points
- Market Opportunity
- Experiments
- Campaign

## 6. Preconditions and dependencies
- Experiment entity
- MarketOpportunity
- Content/Publication/DSP metrics
- future ad cost evidence optional

## 7. Information architecture
Choose hypothesis/markets → define primary metric and comparable execution → record constraints/confounders → run via organic/operational actions → collect observations → analyze → KEEP/RETEST/REJECT/INCONCLUSIVE via shared Experiment model.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Use shared `Experiment` plus market scope rather than duplicating an independent experiment engine. Geo experiment is a domain-specific setup/preset.

## 10. Main happy-path workflow
1. Create from MarketOpportunity
2. Write testable hypothesis
3. Choose markets and comparable exposure/content
4. Select primary/secondary metrics
5. Run planned executions
6. Import metrics
7. Review sample/confounders
8. Decide outcome via shared Experiment

## 11. Alternative workflows
- markets cannot receive comparable content
- one market has release availability issue
- paid cost data only in one arm
- sample insufficient

## 12. User actions
- create experiment
- link content/publications
- record confounder
- extend/retest
- close inconclusive

## 13. State model
Shared Experiment state/decision model applies.

## 14. Business rules
- `GRO-GEO-001` Geo Experiment MUST use the shared hypothesis/experiment/learning architecture.
- `GRO-GEO-002` Primary metric MUST be declared before result interpretation where practical.
- `GRO-GEO-003` Market comparison SHOULD keep content/timing/exposure as comparable as feasible and record deviations.
- `GRO-GEO-004` Cost signals alone MUST NOT define success.
- `GRO-GEO-005` Organic response, retention/music conversion and audience quality dimensions MAY be primary/secondary metrics depending objective.
- `GRO-GEO-006` Insufficient observations MUST produce INCONCLUSIVE rather than forced winner.
- `GRO-GEO-007` Cross-market cultural/language adaptation differences are confounders to record, not noise to hide.
- `GRO-GEO-008` Future Advertising data may support a geo experiment but execution remains outside v1.3 Growth core.
- `GRO-GEO-009` AI MUST not assign causal market superiority when design is observational.
- `GRO-GEO-010` Validated result scope MUST remain market/context specific.

## 15. AI behavior
AI helps design comparable tests and summarizes result limitations using structured evidence. It must label observational comparisons as such.

## 16. Human approval
User approves experiment design and final Learning promotion.

## 17. Validation
- hypothesis testable
- primary metric set
- market scopes explicit
- confounders recordable
- sample threshold not fabricated

## 18. UI states
- draft
- running
- partial
- inconclusive
- retest
- closed

## 19. Edge cases
- release unavailable in one market
- different language creative
- viral outlier
- unequal exposure
- missing retention data

## 20. Cross-module effects
- Experiments
- Markets
- Analytics
- Campaign
- Decision Memory

## 21. Notifications and attention model
- experiment observation target reached
- data missing
- major confounder introduced

## 22. Search / filtering / sorting / bulk actions
Filter experiments by market/song/campaign/status. No bulk “winner” designation.

## 23. Analytics and product telemetry
- geo experiment created
- confounder added
- analysis run
- decision recorded

## 24. Learning feedback
Flows into shared Learning with market-specific scope and confidence.

## 25. Auditability / provenance
Preserve design, linked executions, deviations, evidence and decision rationale.

## 26. Desktop / mobile behavior
Desktop setup/analysis; mobile status and notes.

## 27. Accessibility / usability
Show limitations prominently; avoid green/red market labeling that implies certainty.

## 28. Security / privacy / rights
Only aggregate market data; future ad integrations follow their own privacy scope.

## 29. Performance / async jobs
Analytics aggregation can run async.

## 30. Acceptance criteria
- `GRO-GEO-AC01` Insufficient sample returns INCONCLUSIVE.
- `GRO-GEO-AC02` Cost alone is not default success metric.
- `GRO-GEO-AC03` Confounders are preserved.
- `GRO-GEO-AC04` Result scope remains market-specific.

## 31. Test matrix
- unequal exposure
- language adaptation
- viral outlier
- partial metrics

## 32. Open questions
- No new entity required unless shared Experiment cannot represent market arms cleanly; verify in schema pass.

## 33. Traceability
MASTER §255, §301–315
