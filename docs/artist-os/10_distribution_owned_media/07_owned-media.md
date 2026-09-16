# Owned Media / Artist Website

- **Status:** REVIEW COMPLETE
- **MASTER references:** §208–216, §69–92, §264–286, §407
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `owned-media`
- **Requirement prefix:** `DST-WEB`

## 2. Purpose
Define Artist Website as an owned, identity-aware campaign destination that can combine story, music, video, commerce and audience capture without requiring a full CMS/site-builder in MVP.

## 3. User problem / job-to-be-done
Social/DSP profiles constrain presentation and can change rules. The artist needs a controlled destination for campaigns and long-term identity, but building a generic website builder would distract from Artist OS.

## 4. Scope
### In scope
- WebExperience
- PrimaryWebObjective
- structured WebSections
- identity/era application
- campaign linkage
- preview/publish version concept
- cross-surface assets
- basic performance/analytics hooks

### Out of scope / non-goals
- general-purpose page builder
- hosting vendor lock-in
- full CRM/ecommerce backend
- unlimited custom code CMS

## 5. Entry points
- Distribution home
- Link Routing
- Campaign
- Identity Brand Book
- Release plan

## 6. Preconditions and dependencies
- Identity/Era
- Campaign/Release
- Assets/Rights
- WebStory
- Offers
- AudienceCaptureIntegration
- analytics

## 7. Information architecture
Web Experience home → objective → section outline → identity/theme → content sources → preview → guard/rights checks → publish/version → analytics.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `WebExperience {id, artistId, identityVersionId, eraIdentityId?, campaignId?, primaryObjective, status, publishedVersionId?}` and WebSection enum. Section content/version schema is implementation-level and intentionally not invented here.

## 10. Main happy-path workflow
1. Create WebExperience from artist/campaign
2. Choose primary objective
3. System proposes section outline appropriate to objective
4. User selects/edits structured sections and source assets/content
5. Identity/Guard and rights checks run
6. Preview responsive page
7. User approves publish/version
8. LinkHub may route to published experience
9. Web Analytics capture declared events

## 11. Alternative workflows
- evergreen artist home
- release landing page
- pre-save page
- merch/ticket objective
- minimal one-section experience
- provider/hosting unavailable

## 12. User actions
- create experience
- change objective
- add/remove/reorder allowed section
- bind source content/assets
- preview
- publish new version
- rollback/select previous published version where implementation supports
- unpublish

## 13. State model
MASTER provides `status` but not enum. Product lifecycle requires draft/review/published/archived-ish behavior; final enum/version model needs schema freeze. Published version must be immutable enough for audit/analytics context.

## 14. Business rules
- `DST-WEB-001` PrimaryWebObjective MUST use MASTER enum.
- `DST-WEB-002` Web sections MUST use MASTER WebSection types for structured core behavior; CUSTOM remains explicit escape hatch.
- `DST-WEB-003` Website MUST consume active/selected Identity/Era rather than create a separate contradictory brand source of truth.
- `DST-WEB-004` Identity changes MUST NOT silently mutate an already published historical web version.
- `DST-WEB-005` Primary objective SHOULD influence information hierarchy and CTA, not force every section onto the homepage.
- `DST-WEB-006` “Everything on homepage” and long-scroll design MUST remain testable IA hypotheses, not universal defaults.
- `DST-WEB-007` WebExperience MUST be useful with a minimal subset of sections; no mandatory full-site completeness.
- `DST-WEB-008` RightsStatus MUST be checked for audience-facing assets.
- `DST-WEB-009` Mystique/Interpretation policy MUST gate internal-canon story disclosure.
- `DST-WEB-010` Offers/commerce sections MUST reference Business entities rather than duplicate prices/inventory as independent truth.
- `DST-WEB-011` Audience capture MUST use provider integration boundary from MASTER unless explicit CRM scope is later added.
- `DST-WEB-012` Published versions SHOULD preserve objective, identity version, assets/content references and CTA configuration used at that time.
- `DST-WEB-013` LinkHub MAY route to the Website but Website MUST NOT assume it is always the primary destination.
- `DST-WEB-014` Custom section capability MUST NOT become arbitrary unsafe code execution in MVP.
- `DST-WEB-015` AI MUST NOT invent testimonials, press coverage, scarcity or audience data for website copy.

## 15. AI behavior
AI can propose IA/section order, draft copy grounded in Artist/Song/Campaign knowledge and suggest assets. It receives an Identity Context Capsule and disclosure/rights constraints. Output stays draft until user review.

## 16. Human approval
Publishing/unpublishing a web version and exposing protected narrative or offers requires human approval.

## 17. Validation
- primary objective present
- identity reference valid
- source assets rights valid
- CTA destination valid
- protected narrative not leaked
- offer references current

## 18. UI states
- first-use template
- draft
- preview
- guard warning
- rights block
- published
- provider/hosting failure
- analytics unavailable

## 19. Edge cases
- campaign ends but page remains live
- identity major version changes
- offer sells out/ends
- asset rights expire
- external video embed unavailable
- release date moves

## 20. Cross-module effects
- Identity
- Campaign
- Assets/Lineage
- Link Routing
- Business Offers
- Audience Capture
- Web Analytics

## 21. Notifications and attention model
- published page has broken primary CTA
- rights expiry affects live page
- offer/release state changed
- publishing failed

## 22. Search / filtering / sorting / bulk actions
Search experiences by campaign/objective/status. Sections support reorder; bulk asset swap only with review. No mass publish by default.

## 23. Analytics and product telemetry
- experience created
- section accepted/removed
- preview
- publish success/failure
- rollback/version switch
- CTA click via analytics

## 24. Learning feedback
Web performance can generate Insights about owned-media behavior; IA recommendations stay hypotheses unless tested.

## 25. Auditability / provenance
Every published version records identity/era/campaign/objective/source refs, actor/time and guard/rights state. Cross-surface usages remain traceable.

## 26. Desktop / mobile behavior
Desktop is authoring surface. Mobile provides preview/status/emergency CTA checks; not full page composition in MVP.

## 27. Accessibility / usability
Responsive layouts, semantic headings, keyboard navigation, alt-text workflow and contrast must be supported by rendered templates.

## 28. Security / privacy / rights
Internal canon stays private unless approved. Forms handled by explicit provider. No secrets/custom unsafe scripts exposed in page config.

## 29. Performance / async jobs
Preview generation/publish/deploy can be JobService work. Publish must be idempotent and preserve previous live version on failure.

## 30. Acceptance criteria
- `DST-WEB-AC01` A release page can be created with only relevant sections.
- `DST-WEB-AC02` Published version keeps its identity/version context.
- `DST-WEB-AC03` Internal mystique-protected story is not auto-exposed.
- `DST-WEB-AC04` Website does not require a smartlink or CRM.
- `DST-WEB-AC05` Publishing a new version does not destroy historical version context.

## 31. Test matrix
- evergreen home
- release landing
- minimal page
- rights expiry
- identity version change
- publish failure
- offer state change

## 32. Open questions
- WebSection content schema and WebExperience status/version lifecycle need schema design.
- Hosting/deployment provider abstraction is not specified by MASTER and should remain infrastructure-level.

## 33. Traceability
MASTER §208–216, §69–92, §264–286, §407
