# Typography System

## 1. Metadata
- **Spec ID:** `IDN-TYPE`
- **Domain:** `02_identity`
- **Feature:** Typography System
- **Status:** REVIEW
- **MASTER references:** 76, 128, 183–185, 278, 404
- **Depends on:** draft Identity Version, optional font asset/license records
- **Used by:** Visual DNA, Brand Book, Website, Cover Art/Merch/Packaging/other vertical rules

## 2. Purpose
Define a reusable typography language that can be applied consistently across relevant visual surfaces while respecting licensing and context-specific exceptions.

## 3. User problem / job-to-be-done
**JTBD:** “Give me a clear type system for my artist world so titles, captions and designed assets feel related without forcing one font everywhere.”

## 4. Scope
Headline/body/fallback fonts, rules, case, tracking, weights, usage previews, rights metadata linking and vertical-specific overrides.

Out: distributing font binaries, acquiring licenses automatically, replacing platform-native UI fonts.

## 5. Entry points
`/identity/visual-dna` typography section or dedicated subview, Wizard, Brand Book.

## 6. Preconditions and dependencies
Draft identity. User may specify a font family by name/reference before licensed asset is available, but publishable design workflows must respect rights status.

## 7. Information architecture
Typeface selection → role assignment → rule configuration → preview → rights/availability → confirm → vertical overrides.

## 8. User roles and permissions
Artist confirms type choices; external creator Brand Book receives allowed usage guidance.

## 9. Core data model
MASTER `TypographySystem`:
```text
headlineFont
bodyFont
fallbackFonts[]
headlineRules
bodyRules
caseRules
trackingRules
allowedWeights[]
```
Optional link from font choice to `ExternalAssetSource`/`AssetRights` when a font file/license is managed.

## 10. Main happy-path workflow
1. User chooses headline/body families or accepts candidates.
2. Defines fallback and weights.
3. Configures case/tracking and usage guidance.
4. Previews with artist/song/release sample text.
5. Records license/availability status where relevant.
6. Confirms system; vertical rules may narrow/override usage.

## 11. Alternative workflows
One family for both roles; system-font fallback; platform-native caption surfaces where custom typography cannot apply; Era override.

## 12. User actions
Add/edit font reference, assign role, set rules, preview, mark avoid, link license record, confirm.

## 13. State model
`EMPTY | DRAFT | CONFIRMED | RIGHTS_WARNING | REVIEW_REQUIRED`.

## 14. Business rules
- **IDN-TYPE-001** — Typography System MUST support headline, body and fallback roles defined by MASTER.
- **IDN-TYPE-002** — Font choice MUST support case/tracking/weight rules, not only family names.
- **IDN-TYPE-003** — A font reference does not imply a valid publication/commercial license.
- **IDN-TYPE-004** — If a font license is unknown/restricted, publishable asset workflows MUST surface a rights warning or use approved fallback.
- **IDN-TYPE-005** — The product MUST NOT expose or redistribute font binary files merely because they are referenced in Identity.
- **IDN-TYPE-006** — Platform-native text limitations MAY override custom typography through Vertical/Platform rules without changing base Identity.
- **IDN-TYPE-007** — Typography changes follow Identity Version rules.
- **IDN-TYPE-008** — AI may suggest typography direction but MUST NOT claim license status without verified source metadata.
- **IDN-TYPE-009** — Preview text MUST not be treated as generated production asset automatically.
- **IDN-TYPE-010** — Era/Vertical overrides remain scoped and do not silently overwrite base Typography System.
- **IDN-TYPE-011** — Accessibility/readability constraints MAY require practical fallback and must be presented as execution constraints, not identity failure.
- **IDN-TYPE-012** — Confirmed typography is included in Brand Book according to internal/external mode and rights-safe metadata.

## 15. AI behavior
Suggest families/categories/styles based on confirmed visual evidence and desired descriptors; output is candidate guidance, preferably generic family/style if exact font rights are unknown. No fake license assertions.

## 16. Human approval
Font/system confirmation and rights override require explicit user action.

## 17. Validation
Family names/reference identifiers non-empty; weights valid; duplicate fallback handling; license link valid if present.

## 18. UI states
No type system, candidate, preview, missing font locally, rights warning, confirmed.

## 19. Edge cases
Exact font unavailable to collaborator → fallback rules. Licensed font expires → keep identity choice but surface operational rights issue for new exports.

## 20. Cross-module effects
Brand Book, Website, design verticals consume typography. Publishing checks may use rights state.

## 21. Notifications and attention model
Only expiring/invalid rights that block current output should become attention.

## 22. Search / filtering / sorting / bulk actions
Font reference search may exist; no requirement to ship font marketplace.

## 23. Analytics and product telemetry
Choice edits, fallback usage, rights warnings, creator Brand Book usage where measurable.

## 24. Learning feedback
Typography performance does not directly change identity; may create hypothesis.

## 25. Auditability / provenance
Source/reference, license record, version, user decision.

## 26. Desktop / mobile behavior
Desktop richer previews; mobile read/review basic settings.

## 27. Accessibility / usability
Preview readability, zoom, sample sizes; do not force decorative type for body copy if unusable.

## 28. Security / privacy / rights
Font files/licenses protected; never include licensed binary in user-facing downloadable project unless allowed by license and explicit feature scope.

## 29. Performance / async jobs
No AI dependency for basic configuration; previews should be fast and fallback-safe.

## 30. Acceptance criteria
1. Headline/body/fallback roles configurable.
2. Unknown license triggers warning, not false approval.
3. Platform limitation can use override/fallback without mutating base identity.
4. Brand Book exports guidance, not unauthorized font binary.
5. AI suggestion remains candidate.

## 31. Test matrix
Unit: rules/license state. Integration: Brand Book/vertical. E2E: configure→rights warning→fallback export.

## 32. Open questions
Exact representation of `headlineRules/bodyRules` should be defined from supported design surfaces rather than over-modeling arbitrary typography properties now.

## 33. Traceability
`IDN-TYPE-001–012` → MASTER 76, 183–185, 278, 404.
