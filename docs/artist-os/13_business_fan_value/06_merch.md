# Merch Offers

- **Status:** REVIEW COMPLETE
- **MASTER references:** §275–278, §181–191
- **Domain:** 13_business_fan_value
- **Feature slug:** `merch`
- **Requirement prefix:** `BIZ-MER`

## 2. Purpose
Plan merch as an identity-aligned offer/content vertical with explicit costs, real availability constraints and rights-safe design lineage.

## 3. User problem / job-to-be-done
Merch can strengthen fan value but often fails through weak margins, operational load, fake scarcity or designs disconnected from the artist.

## 4. Scope
### In scope
- MerchOffer fields
- AvailabilityMode
- design assets/identity
- provider/unit cost/retail/fees/margin estimate
- launch/end
- rights

### Out of scope / non-goals
- inventory/accounting system
- fulfillment logistics engine
- fake sold-out mechanics

## 5. Entry points
- Offers
- Campaign
- Identity verticals
- Assets

## 6. Preconditions and dependencies
- Identity/Era
- Assets/Rights
- Unit Economics
- provider quotes
- Campaign

## 7. Information architecture
Create merch concept → choose song/campaign/design → record provider/unit cost/fees → choose truthful availability mode → calculate economics → Identity/Rights check → approve launch → link website/campaign → track events.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER MerchOffer fields and AvailabilityMode ALWAYS_AVAILABLE, TRUE_QUANTITY_LIMIT, TRUE_TIME_LIMIT, PREORDER_WINDOW, MADE_TO_ORDER.

## 10. Main happy-path workflow
1. Create merch offer
2. Attach design assets and identity context
3. Record actual provider economics
4. Choose availability mode/basis
5. Review margin/load
6. Approve launch externally/provider
7. Track revenue/events

## 11. Alternative workflows
- preorder
- made to order
- limited batch
- provider quote changes
- design references lyric/artwork rights

## 12. User actions
- edit design
- update provider quote
- change truthful availability before launch
- launch/end
- archive

## 13. State model
Status enum not defined; availability lifecycle should preserve historical price/cost/design context.

## 14. Business rules
- `BIZ-MER-001` AvailabilityMode MUST use MASTER enum.
- `BIZ-MER-002` TRUE_QUANTITY_LIMIT MUST correspond to a real quantity constraint.
- `BIZ-MER-003` TRUE_TIME_LIMIT/PREORDER_WINDOW MUST correspond to real time constraints.
- `BIZ-MER-004` OS MUST NOT recommend fake scarcity, fake sold-out pressure or fictitious countdowns.
- `BIZ-MER-005` Merch design SHOULD derive from Identity/Song/Era assets while allowing approved deviation.
- `BIZ-MER-006` Lyric/artwork/third-party design rights MUST be checked.
- `BIZ-MER-007` Estimated margin MUST expose estimated fees/cost assumptions.
- `BIZ-MER-008` Provider/unit cost SHOULD use actual current quote where possible, not stale course assumptions.
- `BIZ-MER-009` Changing provider quote MUST not rewrite historical unit economics for past sales periods.
- `BIZ-MER-010` AI can propose merch concept but MUST not fabricate production cost or demand.
- `BIZ-MER-011` MADE_TO_ORDER/PREORDER operational load SHOULD be surfaced, not hidden by margin alone.
- `BIZ-MER-012` Merch revenue must enter RevenueEvents with source/offer context rather than only a dashboard total.

## 15. AI behavior
AI can propose identity-aligned merch ideas and scenario economics only from provided/verified costs. It cannot create false scarcity or claim demand.

## 16. Human approval
User approves design, pricing, provider, availability and launch.

## 17. Validation
- design rights valid
- provider/cost currency known
- availability basis truthful
- launch/end coherent

## 18. UI states
- concept
- quote pending
- ready
- active
- preorder open
- ended
- provider changed

## 19. Edge cases
- provider price increase
- quantity exhausted
- returns
- design right expires
- preorder delayed

## 20. Cross-module effects
- Identity
- Assets/Rights
- Unit Economics
- Website
- Campaign
- Revenue Events

## 21. Notifications and attention model
- negative margin
- availability nearing end
- provider quote stale
- rights conflict

## 22. Search / filtering / sorting / bulk actions
Filter campaign/song/status/mode/provider. No fake urgency bulk actions.

## 23. Analytics and product telemetry
- quote recorded
- availability changed
- launch
- sellout/end
- rights warning

## 24. Learning feedback
Merch outcomes may inform offer hypotheses; demand is not inferred from clicks alone.

## 25. Auditability / provenance
Preserve design/version/provider quote/availability rationale and launch history.

## 26. Desktop / mobile behavior
Desktop planning; mobile status/end-date/quantity alerts if data available.

## 27. Accessibility / usability
Clearly label estimated vs actual costs/margins and real scarcity basis.

## 28. Security / privacy / rights
Protect provider contracts/customer PII; no order-level CRM by default.

## 29. Performance / async jobs
Provider sync/revenue import async optional.

## 30. Acceptance criteria
- `BIZ-MER-AC01` Fake scarcity is prohibited.
- `BIZ-MER-AC02` Availability mode has real basis.
- `BIZ-MER-AC03` Rights are checked.
- `BIZ-MER-AC04` Historical cost not rewritten by new quote.

## 31. Test matrix
- preorder
- made-to-order
- price increase
- returns
- rights issue

## 32. Open questions
- Inventory quantity representation and order-level integration are outside current MASTER scope.

## 33. Traceability
MASTER §275–278, §181–191
