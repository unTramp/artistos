# Audience Capture Integration

- **Status:** REVIEW COMPLETE
- **MASTER references:** §214, §271, §279–285, §387
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `audience-capture`
- **Requirement prefix:** `DST-CAP`

## 2. Purpose
Connect website/campaign forms to specialized audience-capture providers while keeping Artist OS focused on aggregated outcomes rather than becoming an implicit CRM/PII store.

## 3. User problem / job-to-be-done
Artists need email/member lead capture, but storing arbitrary fan PII expands security/privacy scope dramatically. The OS should know which provider/form/campaign is used and how it performs without copying contact databases by default.

## 4. Scope
### In scope
- provider/form reference
- campaign/WebExperience linkage
- consent/declared purpose metadata where available
- aggregated conversion metrics
- health/status/manual mode

### Out of scope / non-goals
- full CRM/contact database
- email sending platform
- person-level fan profiling
- hidden enrichment/psychological targeting

## 5. Entry points
- WebExperience MAILING_LIST section
- Campaign
- Link Routing
- Business membership/offer context

## 6. Preconditions and dependencies
- provider integration/config
- WebExperience
- Campaign
- privacy scope
- Web Analytics

## 7. Information architecture
Connect/configure provider → choose existing form/reference → bind to experience/campaign → preview consent/CTA → publish → import/receive aggregated conversions → monitor health.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER says OS stores provider/form/campaign and aggregated conversion metrics while PII remains with specialized provider absent explicit CRM scope. Exact integration entity schema is open.

## 10. Main happy-path workflow
1. Connect or select provider
2. Select form/list reference without importing contacts
3. Bind to page/campaign
4. Validate embed/action and declared analytics
5. Publish page
6. Receive aggregate signup count/conversion events
7. Investigate provider failure without exposing subscriber records

## 11. Alternative workflows
- no provider; external link only
- provider API unavailable but embed works
- manual aggregate import
- membership provider handles capture
- consent requirements differ by market

## 12. User actions
- connect/disconnect integration
- select form
- test form
- bind/unbind
- view aggregate metrics
- refresh status

## 13. State model
Connected/healthy/degraded/disconnected may be integration states; final enum belongs to integration schema. Subscriber/person records are explicitly outside default state model.

## 14. Business rules
- `DST-CAP-001` Artist OS MUST NOT store fan PII by default under v1.3 audience-capture scope.
- `DST-CAP-002` Provider/form/campaign linkage MAY be stored along with aggregated counts/events.
- `DST-CAP-003` Person-level contacts MUST require an explicit future CRM/privacy scope, not emerge accidentally through webhook payload retention.
- `DST-CAP-004` UI MUST make clear which provider receives the submitted data.
- `DST-CAP-005` Capture forms MUST NOT use deceptive consent or hidden preselected marketing consent recommended by the OS.
- `DST-CAP-006` Aggregate email_signup events MUST not imply identity of the individual fan in Artist OS.
- `DST-CAP-007` Disconnecting a provider MUST preserve historical aggregate campaign metrics.
- `DST-CAP-008` Provider outage MUST not be represented as zero demand/conversions.
- `DST-CAP-009` Web Experience preview SHOULD support test submissions without contaminating production metrics where provider supports it.
- `DST-CAP-010` Campaign attribution MUST preserve confidence/measurement limitations.
- `DST-CAP-011` AI MUST NOT infer sensitive fan traits from aggregate capture metrics.
- `DST-CAP-012` Secrets/API keys MUST follow server-side encrypted integration rules.

## 15. AI behavior
AI may recommend whether capture fits the campaign objective and summarize aggregate conversion results. It cannot inspect unavailable contact lists or infer individuals.

## 16. Human approval
Connecting/disconnecting providers and publishing a live capture form are human-controlled.

## 17. Validation
- provider/form reference valid
- no PII persisted unintentionally
- test vs production mode distinguished
- campaign/experience link valid

## 18. UI states
- not configured
- configured
- test
- live
- degraded
- disconnected
- aggregate data delayed

## 19. Edge cases
- provider webhook includes PII unexpectedly
- duplicate signup events
- bot/spam signups
- form replaced externally
- market-specific consent text

## 20. Cross-module effects
- Owned Media
- Web Analytics
- Campaign
- Business/Membership
- Privacy/Security

## 21. Notifications and attention model
- live form broken
- provider auth expires
- conversion import stale during active campaign

## 22. Search / filtering / sorting / bulk actions
Filter integrations by provider/status/campaign. No subscriber search in v1.3 because person-level contacts are out of scope.

## 23. Analytics and product telemetry
- integration connected
- form test
- aggregate signup event/import
- provider failure
- disconnect

## 24. Learning feedback
Aggregate conversion can feed campaign/business Insights while respecting attribution uncertainty.

## 25. Auditability / provenance
Store provider/form IDs, configuration changes, campaign binding, aggregated event provenance and test-vs-production markers; avoid raw webhook bodies containing PII.

## 26. Desktop / mobile behavior
Desktop configuration; mobile health/status and test link. Contact management is intentionally absent.

## 27. Accessibility / usability
Consent/recipient-provider language must be legible. Do not imply Artist OS stores/manages subscribers when it does not.

## 28. Security / privacy / rights
PII minimization is primary. Secrets encrypted. Webhook handlers should discard/redact person-level fields unless future approved scope explicitly requires them.

## 29. Performance / async jobs
Provider refresh/webhook processing can be async and idempotent; aggregate counters must deduplicate provider event IDs where available.

## 30. Acceptance criteria
- `DST-CAP-AC01` No subscriber list is created in Artist OS by default.
- `DST-CAP-AC02` Disconnect preserves aggregate history.
- `DST-CAP-AC03` Provider outage is not converted into zero signups.
- `DST-CAP-AC04` Live capture identifies destination/provider appropriately.
- `DST-CAP-AC05` Webhook PII is not persisted by default.

## 31. Test matrix
- external form
- embedded form
- provider outage
- duplicate webhook
- test signup
- manual aggregate import

## 32. Open questions
- Exact aggregate event schema and provider abstraction belong to Integrations pass; preserve strict PII boundary.

## 33. Traceability
MASTER §214, §271, §279–285, §387
