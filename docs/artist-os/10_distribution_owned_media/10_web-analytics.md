# Web Analytics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §215–216, §284–300, §371–373
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `web-analytics`
- **Requirement prefix:** `DST-WAN`

## 2. Purpose
Measure owned-media behavior with a small canonical event vocabulary that connects website usage to campaigns/content/offers without overstating attribution.

## 3. User problem / job-to-be-done
Website traffic is useful only if the artist can tell which sections/actions receive attention. Raw pageviews alone do not explain whether listeners clicked music, joined a list or explored an offer.

## 4. Scope
### In scope
- MASTER web events
- experience/version/campaign context
- aggregate counts/funnels
- event import/collection health
- cross-surface lineage
- conversion handoff to canonical analytics

### Out of scope / non-goals
- surveillance analytics
- person-level behavioral profiles
- session replay by default
- causal attribution claims without evidence

## 5. Entry points
- WebExperience analytics tab
- Campaign analytics
- Analytics domain
- Link Routing

## 6. Preconditions and dependencies
- published WebExperience/version
- event collector/provider
- Campaign/Offer/Content references where relevant
- privacy configuration

## 7. Information architecture
Collect/import event → validate canonical type/context → aggregate by experience/version/period → show objective funnel and section/CTA behavior → forward normalized evidence to Analytics/Insights.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER events: page_view, scroll_depth, section_view, cta_click, music_click, social_click, email_signup, merch_click, ticket_click. Implementation should preserve event time, experience/version, campaign/referrer context where available and privacy-safe.

## 10. Main happy-path workflow
1. Open analytics for a WebExperience
2. Choose period/version/campaign
3. System shows primary-objective funnel and supporting events
4. Inspect sections/CTAs
5. Compare versions only with context/sample caution
6. Create Insight/Hypothesis through Analytics workflow

## 11. Alternative workflows
- no collector configured
- events delayed
- version changed mid-campaign
- multiple CTAs share destination
- privacy mode limits referrer/context

## 12. User actions
- change period
- filter event/section/version
- open source page/CTA
- export aggregate
- send observation to Insight workflow

## 13. State model
Raw/imported events → normalized valid events → aggregates. Missing instrumentation/data is unknown, never zero by assumption.

## 14. Business rules
- `DST-WAN-001` Canonical event names MUST use MASTER vocabulary for core web analytics.
- `DST-WAN-002` No event availability MUST be represented as NULL/unknown, not zero performance.
- `DST-WAN-003` Events SHOULD reference the published WebExperience version active when they occurred.
- `DST-WAN-004` CTA/music/merch/ticket clicks measure interaction, not completed downstream outcome unless a separate verified conversion event exists.
- `DST-WAN-005` Email signup MAY be counted from provider aggregate/event but person identity MUST not be required.
- `DST-WAN-006` Cross-surface lineage SHOULD connect CTA/content/offer references where available without inventing attribution.
- `DST-WAN-007` Web metrics MUST be analyzed within their own surface/context rather than raw-ranked against social views.
- `DST-WAN-008` Bot/internal/test traffic SHOULD be filterable where evidence allows; filters must be transparent.
- `DST-WAN-009` Changing analytics configuration MUST preserve history and mark discontinuities.
- `DST-WAN-010` Comparison across page versions SHOULD show sample size/time/campaign differences.
- `DST-WAN-011` AI MUST phrase findings as observations/associations unless experiment/evidence supports stronger inference.
- `DST-WAN-012` Privacy configuration MUST take precedence over richer analytics collection.

## 15. AI behavior
Analytics Agent may summarize patterns and propose testable hypotheses from structured events. It cannot fabricate missing downstream purchases/signups or identify anonymous users.

## 16. Human approval
Insights/Hypotheses promotion follows the shared intelligence workflow; web tracking configuration changes require user approval where they affect privacy/public behavior.

## 17. Validation
- event type valid
- experience/version resolvable when possible
- timestamp/timezone normalized
- test/internal marker handled
- duplicate provider event IDs deduplicated

## 18. UI states
- no data
- collecting
- partial/delayed
- healthy
- instrumentation changed
- provider unavailable

## 19. Edge cases
- SPA navigation
- ad blocker/privacy browser
- duplicate webhook
- website version switch
- external checkout not instrumented
- same user clicks repeatedly

## 20. Cross-module effects
- Owned Media
- Campaign
- Link Routing
- Audience Capture
- Business Offers
- Analytics/Insights

## 21. Notifications and attention model
- analytics collector failing during active campaign
- primary objective has no measurable event
- instrumentation configuration changed

## 22. Search / filtering / sorting / bulk actions
Filter by period/version/campaign/event/section. Aggregate export allowed. No person-level search/profile in v1.3.

## 23. Analytics and product telemetry
- collector health
- event received/deduped
- analytics view opened
- insight handoff
- instrumentation change

## 24. Learning feedback
Validated observations move through Insight → Hypothesis → Experiment → Learning. Raw event spikes do not become rules automatically.

## 25. Auditability / provenance
Preserve event source/provider, schema/version, collection config, dedupe identity and aggregation provenance.

## 26. Desktop / mobile behavior
Desktop analytics exploration; mobile summary for campaign health and broken instrumentation.

## 27. Accessibility / usability
Charts require text alternatives/tooltips and clear denominators. Missing/partial data labels are explicit.

## 28. Security / privacy / rights
Minimize cookies/identifiers; do not store person-level identity by default. Respect audience-capture privacy boundary.

## 29. Performance / async jobs
Event ingestion/aggregation asynchronous, idempotent and resilient. Imports reuse duplicate-detection principles.

## 30. Acceptance criteria
- `DST-WAN-AC01` Missing analytics is not displayed as zero.
- `DST-WAN-AC02` music_click is not labelled a stream.
- `DST-WAN-AC03` Events retain WebExperience version context.
- `DST-WAN-AC04` Aggregate email signup can be shown without subscriber PII.
- `DST-WAN-AC05` AI observation uses qualified language and sample context.

## 31. Test matrix
- no instrumentation
- healthy collection
- version switch
- duplicate events
- privacy-limited context
- external checkout

## 32. Open questions
- Canonical web-event storage vs generic Metric/Event infrastructure should be resolved in Analytics/Engineering pass.

## 33. Traceability
MASTER §215–216, §284–300, §371–373
