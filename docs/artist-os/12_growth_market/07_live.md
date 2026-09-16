# LIVE Sessions

- **Status:** REVIEW COMPLETE
- **MASTER references:** §256–261, §283
- **Domain:** 12_growth_market
- **Feature slug:** `live`
- **Requirement prefix:** `GRO-LIV`

## 2. Purpose
Plan, run and evaluate live sessions as a flexible growth/community/revenue/release/membership format without importing unsupported “algorithm test-wave” folklore.

## 3. User problem / job-to-be-done
Live can serve very different goals and platforms. Artists need format/setlist/access planning and post-session metrics, not one growth-only playbook.

## 4. Scope
### In scope
- LiveSession fields/enums
- format/goal/access mode
- setlist
- platform capability
- analytics
- revenue linkage
- campaign context

### Out of scope / non-goals
- universal live frequency rule
- fake scarcity
- unverified viewer-wave algorithm claims

## 5. Entry points
- Growth home
- Campaign
- Calendar
- Business

## 6. Preconditions and dependencies
- PlatformCapability LIVE
- Song/setlist
- Campaign
- Business Offer/Membership when paid
- metrics import

## 7. Information architecture
Create session → choose platform/time/format/goal/access → setlist/CTA prep → verify platform capability → run externally → record metrics/revenue → create observations/next test.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `LiveSession {platform, scheduledAt, duration, format, setlist[], goal, accessMode, ticketPrice?, status}` with format JAM/ACOUSTIC/REQUESTS/BTS/Q_AND_A/RELEASE/REHEARSAL; goals GROWTH/COMMUNITY/REVENUE/RELEASE/MEMBERSHIP; access FREE/PAID/DONATION/MEMBERSHIP_INCLUDED.

## 10. Main happy-path workflow
1. Create LIVE
2. Select format/goal/access
3. Plan setlist and CTA
4. Check capability/requirements
5. Schedule in Calendar
6. Run session externally
7. Import/manual metrics and revenue
8. Review against stated goal

## 11. Alternative workflows
- free community live
- paid ticketed live
- membership-only
- no analytics available
- rehearsal intentionally not growth-focused

## 12. User actions
- create/edit
- duplicate plan
- mark started/completed
- record cancellation
- import metrics
- link revenue

## 13. State model
Status enum is not defined by MASTER; needs scheduled/live/completed/cancelled-like semantics in schema.

## 14. Business rules
- `GRO-LIV-001` Live format/goal/accessMode MUST use MASTER enums.
- `GRO-LIV-002` A FREE live with COMMUNITY/GROWTH/RELEASE goal MUST NOT be treated as monetization failure.
- `GRO-LIV-003` Platform LIVE capability/requirements MUST be current/source-backed.
- `GRO-LIV-004` Claims such as “first 50–100 viewers decide distribution” MUST remain practitioner hypotheses unless verified.
- `GRO-LIV-005` TicketPrice is relevant only to compatible access models and MUST not be fabricated for FREE/DONATION.
- `GRO-LIV-006` Setlist MAY reference Songs but must preserve flexibility for requests/spontaneous moments.
- `GRO-LIV-007` Analytics MUST use only platform metrics actually available; absent metric is NULL/unknown.
- `GRO-LIV-008` Live revenue MAY link ticket/gift/merch/replay revenue without redefining Business accounting.
- `GRO-LIV-009` Goal determines evaluation context; one universal engagement threshold is prohibited.
- `GRO-LIV-010` AI may suggest format/setlist/CTA but MUST not promise algorithmic reach.
- `GRO-LIV-011` Live session history SHOULD feed Content/Asset atomization opportunities when recordings exist.
- `GRO-LIV-012` Rights/capability constraints apply to streamed music/content.

## 15. AI behavior
AI can propose goal-aligned run-of-show/setlist and summarize metrics. It must label platform folklore as heuristic/unverified and never promise discovery.

## 16. Human approval
Scheduling/public announcements/access pricing and platform execution human-controlled.

## 17. Validation
- format/goal/access valid
- platform live capability not known-invalid
- ticket/access consistency
- setlist refs valid

## 18. UI states
- draft
- scheduled
- live/manual running
- completed
- cancelled
- metrics pending
- partial analytics

## 19. Edge cases
- platform disables live
- session overruns
- guest/collab rights
- donation metrics unavailable
- recording not saved

## 20. Cross-module effects
- Calendar
- Campaign
- Business/Revenue
- Assets/Atomization
- Analytics

## 21. Notifications and attention model
- live capability changes
- session starting soon incomplete
- metrics import pending

## 22. Search / filtering / sorting / bulk actions
Filter goal/format/platform/status/period. Reuse/duplicate plan allowed.

## 23. Analytics and product telemetry
- session scheduled
- completed
- metrics imported
- revenue linked
- clip plan created

## 24. Learning feedback
Repeated session evidence can inform format/cadence hypotheses through shared Learning.

## 25. Auditability / provenance
Preserve plan, actual duration, metrics source, goal/access settings and revenue links.

## 26. Desktop / mobile behavior
Desktop planning/analytics; mobile run checklist/status/quick metrics note.

## 27. Accessibility / usability
Large touch targets for live-adjacent checklist; clear timezone and access labels.

## 28. Security / privacy / rights
Respect platform/content rights and do not expose private membership data.

## 29. Performance / async jobs
Metrics imports/clip-analysis async; planning works offline/manual.

## 30. Acceptance criteria
- `GRO-LIV-AC01` Free community live is not labelled failure for zero revenue.
- `GRO-LIV-AC02` Unsupported test-wave claim is not fact.
- `GRO-LIV-AC03` Absent metrics stay unknown.
- `GRO-LIV-AC04` Goal changes evaluation context.
- `GRO-LIV-AC05` Revenue links to Business without becoming accounting.

## 31. Test matrix
- free community
- paid
- membership
- analytics missing
- platform capability change

## 32. Open questions
- LiveSession status enum and guest/collaborator modeling are not defined.

## 33. Traceability
MASTER §256–261, §283
