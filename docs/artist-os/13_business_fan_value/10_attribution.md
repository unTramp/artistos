# Business Attribution Confidence

- **Status:** REVIEW COMPLETE
- **MASTER references:** §284–285, §22, §291–315
- **Domain:** 13_business_fan_value
- **Feature slug:** `attribution`
- **Requirement prefix:** `BIZ-ATT`

## 2. Purpose
Make business attribution uncertainty explicit so the OS can connect revenue to campaigns/content when evidence supports it without claiming causation from temporal proximity.

## 3. User problem / job-to-be-done
Artists often credit a post or campaign for revenue simply because events happened near each other. The OS needs confidence labels and evidence paths to avoid false ROI conclusions.

## 4. Scope
### In scope
- DIRECT/PROBABLE/UNKNOWN confidence
- evidence/rationale
- links across Offer/Campaign/Content/Publication
- aggregate attributed vs unattributed reporting

### Out of scope / non-goals
- full multi-touch attribution model
- probabilistic user-level tracking
- causal inference without experiment/design

## 5. Entry points
- Revenue Event detail
- Campaign/Offer analytics
- Business home

## 6. Preconditions and dependencies
- RevenueEvent
- web/link/provider tracking
- campaign identifiers
- Analytics/Experiment evidence

## 7. Information architecture
Inspect revenue event → identify explicit source evidence → assign DIRECT/PROBABLE/UNKNOWN → show rationale → aggregate with confidence separation → use in Insights with caveats.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER AttributionConfidence enum only; detailed evidence record may be metadata/relationship pending schema.

## 10. Main happy-path workflow
1. Open event attribution
2. System displays available direct IDs/referrals/provider context
3. User/system assigns confidence conservatively
4. Rationale/provenance saved
5. Business analytics separate direct/probable/unknown
6. Hypothesis/experiment can test uncertain path

## 11. Alternative workflows
- no tracking parameter
- offline sale
- same fan exposed to many surfaces
- provider reports campaign directly
- revenue follows viral post with no link evidence

## 12. User actions
- inspect evidence
- downgrade/upgrade confidence with reason
- remove unsupported link
- create attribution hypothesis

## 13. State model
Confidence can change with new evidence; historical rationale/version should be retained.

## 14. Business rules
- `BIZ-ATT-001` AttributionConfidence MUST use MASTER enum DIRECT, PROBABLE, UNKNOWN.
- `BIZ-ATT-002` DIRECT requires explicit source evidence such as provider/campaign/order linkage, not mere timing.
- `BIZ-ATT-003` PROBABLE requires documented rationale and MUST be displayed separately from DIRECT.
- `BIZ-ATT-004` UNKNOWN MUST be the default when evidence is insufficient.
- `BIZ-ATT-005` Temporal proximity alone MUST NOT be treated as direct attribution.
- `BIZ-ATT-006` Campaign/content ROI using PROBABLE events MUST disclose confidence composition.
- `BIZ-ATT-007` Attribution MUST NOT imply causal effect unless experiment/evidence supports it.
- `BIZ-ATT-008` AI MUST prefer UNKNOWN over fabricated certainty.
- `BIZ-ATT-009` Changing confidence MUST preserve prior rationale/history where material.
- `BIZ-ATT-010` Person-level multi-touch tracking is out of scope by default.
- `BIZ-ATT-011` Aggregate unattributed revenue MUST remain visible rather than disappearing from totals.

## 15. AI behavior
Analytics Agent can summarize evidence and suggest conservative confidence labels; it must explain why and avoid causal language.

## 16. Human approval
User can override confidence only with rationale; validated Learning still follows shared evidence pipeline.

## 17. Validation
- confidence valid
- evidence reference/rationale for DIRECT/PROBABLE
- no unsupported person-level identifiers

## 18. UI states
- direct
- probable
- unknown
- evidence updated
- conflict

## 19. Edge cases
- offline merch sale
- provider reports campaign
- affiliate redirect lost
- multiple campaigns overlapping

## 20. Cross-module effects
- RevenueEvents
- Campaign Analytics
- Experiments
- Decision Memory

## 21. Notifications and attention model
- large probable/unknown share affects ROI interpretation
- evidence conflict

## 22. Search / filtering / sorting / bulk actions
Filter confidence/campaign/offer/source. No person-level journey UI.

## 23. Analytics and product telemetry
- confidence assigned/changed
- evidence opened
- attribution hypothesis created

## 24. Learning feedback
Attribution uncertainty can motivate better instrumentation or experiments; it is not itself a creative Learning.

## 25. Auditability / provenance
Preserve rationale/source/version and actor for confidence changes.

## 26. Desktop / mobile behavior
Desktop evidence detail; mobile confidence summary.

## 27. Accessibility / usability
Use explicit labels/tooltips; never blend probable into direct in headline metrics without disclosure.

## 28. Security / privacy / rights
No person-level tracking required; protect provider IDs if sensitive.

## 29. Performance / async jobs
Mostly synchronous; evidence imports async.

## 30. Acceptance criteria
- `BIZ-ATT-AC01` Temporal proximity alone yields UNKNOWN/at most justified PROBABLE, never automatic DIRECT.
- `BIZ-ATT-AC02` Unknown revenue remains in totals.
- `BIZ-ATT-AC03` Probable ROI is labelled.
- `BIZ-ATT-AC04` Confidence changes are audited.

## 31. Test matrix
- offline sale
- direct provider ID
- multiple campaigns
- lost referral

## 32. Open questions
- Whether attribution evidence becomes its own entity vs RevenueEvent metadata should be resolved in schema pass.

## 33. Traceability
MASTER §284–285, §22, §291–315
