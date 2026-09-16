# Creator Collaboration

- **Status:** REVIEW COMPLETE
- **MASTER references:** §262–263, §181–186, §287–315
- **Domain:** 12_growth_market
- **Feature slug:** `creator-collaboration`
- **Requirement prefix:** `GRO-COL`

## 2. Purpose
Plan and measure UGC/influencer/musician/producer collaborations with clear briefs, costs, usage rights and outcomes using actual quotes rather than stale rate-card folklore.

## 3. User problem / job-to-be-done
Creator collaborations combine creative, commercial and rights decisions. Artists need to know what is being delivered, what it costs, what can be reused and what happened afterward.

## 4. Scope
### In scope
- CreatorCollaboration entity
- type/brief/assets/cost/usageRights/metrics/status
- campaign linkage
- actual quote/deliverables
- rights/lineage
- outcome evidence

### Out of scope / non-goals
- influencer discovery marketplace
- mass outreach CRM
- fixed historical creator pricing
- autonomous contracting/payment

## 5. Entry points
- Growth home
- Campaign
- Content Factory
- Asset/rights

## 6. Preconditions and dependencies
- Campaign
- Content/Assets
- Rights
- Business cost context
- metrics

## 7. Information architecture
Create collaboration → choose type/campaign/objective → write brief/deliverables → record actual quote/cost/usage rights → approve → execute externally → ingest/link assets → record metrics/outcome → review learnings.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `CreatorCollaboration {creatorId, type: UGC|INFLUENCER|MUSICIAN|PRODUCER, campaignId, brief, assetIds[], cost?, usageRights, metrics, status}`. Creator/contact entity boundary is intentionally deferred from v1.3 Publicity scope.

## 10. Main happy-path workflow
1. Create collaboration record
2. Select type/objective/campaign
3. Define brief and deliverables
4. Record quote/cost/rights
5. User approves arrangement externally
6. Attach delivered assets
7. Track usage/publications/metrics
8. Review outcome

## 11. Alternative workflows
- barter/no cost
- musician feature without promotional deliverable
- creator grants limited-term usage
- no metrics provided
- creator owns posting account

## 12. User actions
- create/edit brief
- record quote
- attach rights proof
- accept/reject deliverable
- link asset/publication
- record outcome

## 13. State model
Status enum not defined; needs proposal/agreed/in-progress/delivered/completed/cancelled-like behavior in schema.

## 14. Business rules
- `GRO-COL-001` CreatorCollaboration type MUST use MASTER enum.
- `GRO-COL-002` Creator pricing MUST use actual quotes/deliverables and MUST NOT treat historical course rates as truth.
- `GRO-COL-003` Usage rights MUST be recorded before recommending reuse of delivered assets.
- `GRO-COL-004` Cost alone MUST NOT determine collaboration success; objective/metrics/quality/context matter.
- `GRO-COL-005` Collaboration assets MUST retain origin/rights/lineage.
- `GRO-COL-006` Creator-controlled publications MUST be distinguishable from artist-controlled Publications.
- `GRO-COL-007` AI MUST NOT fabricate creator quotes, audience metrics or contractual permissions.
- `GRO-COL-008` Briefs SHOULD include objective, deliverables and identity constraints appropriate to collaboration type.
- `GRO-COL-009` Outcome metrics may be partial/unknown and MUST not be coerced to zero.
- `GRO-COL-010` One creator result MUST NOT generalize to an audience/market rule automatically.
- `GRO-COL-011` Collaboration decision may create Business cost/RevenueEvent linkage only when relevant, not full accounting.
- `GRO-COL-012` Autonomous contracts/payments/outreach are outside scope.

## 15. AI behavior
AI can draft briefs from Campaign/Identity, compare actual structured quotes/deliverables and summarize outcomes. It cannot negotiate/send/contract/pay autonomously.

## 16. Human approval
User approves collaboration terms, spend, public use and rights assumptions.

## 17. Validation
- type valid
- campaign/objective known
- cost currency when cost entered
- rights evidence for reuse
- asset refs valid

## 18. UI states
- idea/proposed
- agreed
- in progress
- delivered
- completed
- cancelled
- rights incomplete
- metrics pending

## 19. Edge cases
- barter
- partial delivery
- creator deletes post
- usage right expires
- creator changes scope
- collab spans campaigns

## 20. Cross-module effects
- Campaign
- Assets/Rights
- Content Factory
- Analytics
- Business
- Future Publicity/Outreach

## 21. Notifications and attention model
- rights missing on delivered asset
- deliverable overdue
- usage expiry near active reuse

## 22. Search / filtering / sorting / bulk actions
Filter type/campaign/status/cost/rights/market. No bulk creator outreach.

## 23. Analytics and product telemetry
- collab created
- quote recorded
- rights confirmed
- deliverable accepted
- metrics linked

## 24. Learning feedback
Repeated collaboration evidence can feed source/market/content hypotheses with proper scope.

## 25. Auditability / provenance
Store actual quote, terms/rights proof, deliverables, linked assets/publications and outcome evidence.

## 26. Desktop / mobile behavior
Desktop planning/comparison; mobile deliverable review/evidence capture.

## 27. Accessibility / usability
Make cost/rights/deliverables visible together; avoid engagement-only success framing.

## 28. Security / privacy / rights
Creator contact/private contract data requires access controls/minimization. Do not silently become a broad CRM.

## 29. Performance / async jobs
Asset ingest/metrics imports async optional.

## 30. Acceptance criteria
- `GRO-COL-AC01` Historical rate card is never used as factual creator price.
- `GRO-COL-AC02` Delivered asset cannot be assumed reusable without rights.
- `GRO-COL-AC03` Unknown metrics stay unknown.
- `GRO-COL-AC04` Creator-controlled post is distinguished from artist Publication.

## 31. Test matrix
- barter
- limited rights
- partial delivery
- post deleted
- unknown metrics

## 32. Open questions
- Creator identity/contact representation should align with future Publicity Contact/Organization architecture rather than duplicate it.

## 33. Traceability
MASTER §262–263, §181–186, §287–315
