# Revenue Events

- **Status:** REVIEW COMPLETE
- **MASTER references:** §284–286, §243–244
- **Domain:** 13_business_fan_value
- **Feature slug:** `revenue-events`
- **Requirement prefix:** `BIZ-REV`

## 2. Purpose
Store normalized revenue evidence linked to offers/campaign/content where known, with gross/fees/net/currency and explicit attribution confidence.

## 3. User problem / job-to-be-done
Business analysis needs actual transaction/royalty/event evidence, but v1.3 must avoid becoming a ledger or pretending attribution is more precise than source data.

## 4. Scope
### In scope
- RevenueEvent fields
- manual/imported events
- source links
- gross/fees/net/currency
- attribution confidence
- dedupe/provenance

### Out of scope / non-goals
- double-entry ledger
- tax treatment
- order/customer records by default

## 5. Entry points
- Business home
- Offer
- DSP revenue import
- Live/Membership/Merch import

## 6. Preconditions and dependencies
- source import/provider/manual evidence
- Offer/Campaign/Content/Publication references
- currency

## 7. Information architecture
Import/record revenue → map gross/fees/net/source → link contextual entities where evidence supports → set attribution confidence → validate/dedupe → aggregate in Business views.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `RevenueEvent {source, offerId?, campaignId?, contentUnitId?, publicationId?, grossAmount, fees, netAmount, currency, occurredAt, attributionConfidence}` with DIRECT/PROBABLE/UNKNOWN.

## 10. Main happy-path workflow
1. Import or manually record event
2. Validate amounts/currency/date
3. Attach known source/offer/campaign/content references
4. Set attribution confidence based on evidence
5. Save with provenance
6. Aggregate by period/portfolio/goal

## 11. Alternative workflows
- royalty statement covers period not transaction date
- negative refund
- fees unknown
- campaign relationship probable only
- multi-source revenue

## 12. User actions
- create/import
- correct with audit
- attach/detach context with reason
- export aggregate

## 13. State model
Events are append/correction-oriented evidence, not mutable ledger entries. Reversal/adjustment semantics need schema design.

## 14. Business rules
- `BIZ-REV-001` AttributionConfidence MUST use DIRECT, PROBABLE or UNKNOWN.
- `BIZ-REV-002` UNKNOWN attribution MUST remain valid and MUST NOT be forced to a campaign/content source.
- `BIZ-REV-003` Gross, fees and net MUST remain distinct.
- `BIZ-REV-004` Missing fees MUST not be silently set to zero unless source explicitly reports zero.
- `BIZ-REV-005` Negative events/adjustments MUST be representable.
- `BIZ-REV-006` Currency MUST be stored with each event.
- `BIZ-REV-007` Event links to Offer/Campaign/Content/Publication MUST reflect evidence, not nearest-time guesswork.
- `BIZ-REV-008` PROBABLE attribution MUST be labelled as such in analytics.
- `BIZ-REV-009` Event import MUST be idempotent/deduplicated where source identifiers exist.
- `BIZ-REV-010` RevenueEvent is not a debit/credit accounting ledger and MUST NOT imply tax-complete books.
- `BIZ-REV-011` AI MUST not assign attribution confidence unsupported by source evidence.

## 15. AI behavior
AI can help map provider fields and summarize events; core amount/attribution calculations are deterministic/evidence-based.

## 16. Human approval
Manual event corrections and attribution overrides require explicit user action/audit.

## 17. Validation
- currency/date valid
- gross/net/fees consistency rules tolerate source-specific cases
- confidence valid
- duplicate key checked

## 18. UI states
- imported
- manual
- partial fees
- negative adjustment
- unknown attribution
- corrected

## 19. Edge cases
- refund months later
- royalty period aggregate
- affiliate/provider payout net-only
- duplicate import

## 20. Cross-module effects
- Revenue Portfolio
- Goals
- Offers
- Analytics
- DSP/Live/Membership

## 21. Notifications and attention model
- import anomaly
- large unknown-attribution share
- duplicate/conflict

## 22. Search / filtering / sorting / bulk actions
Filter source/offer/campaign/confidence/currency/period. Bulk import through mapping wizard.

## 23. Analytics and product telemetry
- event imported
- duplicate prevented
- attribution changed
- correction recorded

## 24. Learning feedback
Revenue evidence supports business Insights/scenarios; actual event facts stay immutable-ish evidence.

## 25. Auditability / provenance
Source ID/file, mapping version, actor/time, corrections and attribution rationale preserved.

## 26. Desktop / mobile behavior
Desktop import/reconciliation; mobile summary/manual small event entry if enabled.

## 27. Accessibility / usability
Always label currency and attribution confidence.

## 28. Security / privacy / rights
Financial data sensitive; no customer PII needed by default.

## 29. Performance / async jobs
Imports async/idempotent; manual entries synchronous.

## 30. Acceptance criteria
- `BIZ-REV-AC01` Unknown attribution remains possible.
- `BIZ-REV-AC02` Missing fee is not automatically zero.
- `BIZ-REV-AC03` Negative adjustment is representable.
- `BIZ-REV-AC04` Duplicate import is prevented.

## 31. Test matrix
- net-only source
- refund
- unknown attribution
- duplicate
- period aggregate

## 32. Open questions
- Correction/reversal data model and exact amount consistency rules need accounting-light schema design.

## 33. Traceability
MASTER §284–286, §243–244
