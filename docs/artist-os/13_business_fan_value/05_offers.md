# Offers & Offer Fit

- **Status:** REVIEW COMPLETE
- **MASTER references:** §272–274, §26–27, §278
- **Domain:** 13_business_fan_value
- **Feature slug:** `offers`
- **Requirement prefix:** `BIZ-OFR`

## 2. Purpose
Define value exchanges the artist can offer and evaluate fit across audience, identity, campaign, economics and operational load without deceptive scarcity or magic scoring.

## 3. User problem / job-to-be-done
Artists can monetize in many ways but not every offer fits their audience, identity, campaign timing or capacity. The OS needs explainable trade-offs before launch.

## 4. Scope
### In scope
- Offer entity/types
- audience segment
- value proposition
- price/availability
- campaign/identity context
- Offer Fit dimensions

### Out of scope / non-goals
- opaque fit score
- fake scarcity
- automatic pricing optimization
- unsupported legal/tax advice

## 5. Entry points
- Business home
- Campaign
- Merch/Membership/Live

## 6. Preconditions and dependencies
- Identity/Era
- Fan cohorts
- Campaign
- Unit Economics
- production/operational capacity

## 7. Information architecture
Create offer → choose type/audience/value proposition → price/availability → evaluate fit dimensions → resolve blockers → approve/launch via owning provider/workflow → track events/outcome.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `Offer {type, audienceSegment, valueProposition, price, availability, campaignId?, identityVersionId, status}`; types MERCH, MEMBERSHIP, LIVE, TICKET, PHYSICAL_MUSIC, DIGITAL_PRODUCT.

## 10. Main happy-path workflow
1. Choose offer type
2. Define who/value/price/availability
3. System surfaces fit dimensions and missing inputs
4. User edits based on identity/capacity/economics
5. Approve offer
6. Link to campaign/web/publication
7. Track RevenueEvents

## 11. Alternative workflows
- free offer/lead magnet not in enum
- price unknown during concept phase
- limited capacity benefit
- no campaign linkage

## 12. User actions
- create/edit
- duplicate
- archive
- evaluate fit
- link campaign
- open unit economics

## 13. State model
Offer status enum not defined; concept/draft/active/ended/archive likely needed but schema freeze later.

## 14. Business rules
- `BIZ-OFR-001` Offer type MUST use MASTER enum.
- `BIZ-OFR-002` Offer Fit MUST use explainable dimensions, not a single magic score.
- `BIZ-OFR-003` Audience Fit, Identity Fit, Campaign Fit, Production Cost, Margin and Operational Load SHOULD remain separately inspectable.
- `BIZ-OFR-004` Identity fit warning MUST not automatically forbid an intentional approved experiment.
- `BIZ-OFR-005` Availability MUST reflect real constraints only; deceptive scarcity/countdowns are prohibited.
- `BIZ-OFR-006` Price MUST be displayed with currency in implementation even though MASTER field list omits explicit currency; schema must resolve this gap.
- `BIZ-OFR-007` Offer launch MUST not occur automatically from AI suggestion.
- `BIZ-OFR-008` Unknown cost/margin MUST be shown as missing, not assumed healthy.
- `BIZ-OFR-009` AI MUST not fabricate demand, conversion or “people will pay” certainty.
- `BIZ-OFR-010` Offer may exist without Campaign, but campaign-linked offers preserve lineage.
- `BIZ-OFR-011` Rights must be checked for merch/physical/digital assets as applicable.
- `BIZ-OFR-012` Offer performance feeds evidence; one outcome does not redefine Identity.

## 15. AI behavior
AI can generate offer concepts and scenario trade-offs grounded in identity/cohorts/campaign/capacity. It must state assumptions and missing evidence.

## 16. Human approval
User controls price, availability, launch and identity deviations.

## 17. Validation
- type valid
- price/currency coherent once schema defined
- real availability basis
- identity/rights references valid

## 18. UI states
- concept
- draft
- ready
- active
- ended
- archived
- economics incomplete

## 19. Edge cases
- preorder changes to made-to-order
- capacity reached
- campaign ends
- asset rights expire
- price changed mid-campaign

## 20. Cross-module effects
- Merch
- Membership
- Live
- Campaign
- Website
- Revenue Events
- Identity Guard

## 21. Notifications and attention model
- negative margin
- availability constraint nearing end
- rights issue
- active offer missing primary destination

## 22. Search / filtering / sorting / bulk actions
Filter type/status/campaign/cohort/identity. Bulk archive internal drafts possible; no bulk launch.

## 23. Analytics and product telemetry
- offer created
- fit dimension reviewed
- price/availability changed
- launched/ended

## 24. Learning feedback
Offer outcomes can become Business Insights/Hypotheses with scope.

## 25. Auditability / provenance
Version material price/availability/value changes and link RevenueEvents to the correct period/version where possible.

## 26. Desktop / mobile behavior
Desktop authoring/economics; mobile status and fulfillment-sensitive alerts.

## 27. Accessibility / usability
Show fit dimensions as text/rationale, not red/green score only.

## 28. Security / privacy / rights
No person-level targeting by default. Rights/provider secrets protected.

## 29. Performance / async jobs
Mostly synchronous; provider sync/revenue import async.

## 30. Acceptance criteria
- `BIZ-OFR-AC01` No magic fit score.
- `BIZ-OFR-AC02` Fake scarcity is never recommended.
- `BIZ-OFR-AC03` Missing margin remains visible.
- `BIZ-OFR-AC04` AI cannot launch an offer.
- `BIZ-OFR-AC05` Offer can link identity/campaign with history.

## 31. Test matrix
- no campaign
- limited capacity
- missing costs
- identity experiment
- rights expiry

## 32. Open questions
- Offer currency missing in MASTER schema must be resolved.
- Offer status enum and versioning boundary need schema design.

## 33. Traceability
MASTER §272–274, §26–27, §278
