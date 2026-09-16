# Identity Vertical Rules

## 1. Metadata
- **Spec ID:** `IDN-VERT`
- **Domain:** `02_identity`
- **Feature:** Identity Vertical Rules
- **Status:** REVIEW
- **MASTER references:** 69–80, 87–92, 128, 141, 199, 278, 404
- **Depends on:** confirmed Visual DNA, Typography, Anchors, Mystique, Identity Constraints
- **Used by:** Content Factory, Production, Platform Adaptation, Merch, Website, Brand Book, Guard

### 1.1 Product derivation
MASTER requires `Vertical Rules` in the Identity Wizard and defines Content Verticals, but does not define a dedicated entity schema. This spec defines behavior and leaves relational/JSON schema choice to the data-model pass.

## 2. Purpose
Translate base Identity into context-specific execution guidance for different creative media without duplicating or mutating the base identity.

## 3. User problem / job-to-be-done
**JTBD:** “Tell me how my identity should show up in cover art, photos, short video, live shows, merch, website and other media, because the same rules cannot be applied literally everywhere.”

## 4. Scope
Rules for MASTER Content Verticals: COVER_ART, PHOTOGRAPHY, MUSIC_VIDEO, SHORT_FORM_VIDEO, LONG_FORM_VIDEO, LIVE_SHOW, PRESS, MERCH, PACKAGING, WEBSITE, SOCIAL_PROFILE. Includes overrides, required/avoid guidance, anchor usage and examples.

Out: platform asset dimensions (Capability Registry), exact production briefs, automatic asset creation.

## 5. Entry points
`/identity/verticals`, Wizard, Visual DNA, Guard warnings, Brand Book.

## 6. Preconditions and dependencies
At least some confirmed base Identity. Missing components are allowed; Vertical Rule can remain partial.

## 7. Information architecture
Vertical list → completeness → vertical detail:
```text
Intent
Inherited base rules
Vertical-specific emphasis
Allowed overrides
Required constraints
Avoid
Anchors
Typography
Presence
Mystique
Examples / references
```

## 8. User roles and permissions
Artist confirms. Collaborator view is future/external Brand Book output only.

## 9. Core data model
Suggested product concept:
```text
IdentityVerticalSpec
identityVersionId
vertical
intent
inheritedRules
visualOverrides
requiredConstraints[]
avoid[]
anchorRules[]
typographyOverrides?
presenceOverrides?
mystiqueNotes?
status
```
Exact schema not normative until data-model pass.

## 10. Main happy-path workflow
1. System creates inherited view from confirmed base Identity.
2. User opens a vertical and sees what applies by default.
3. AI may suggest vertical-specific translation/overrides.
4. User confirms specific emphasis/avoid/requirements.
5. Guard/Production/Brand Book consume the spec for that vertical.

## 11. Alternative workflows
Vertical intentionally inherits base with no overrides; vertical not relevant → mark not applicable; Era override adds temporary direction.

## 12. User actions
Open, mark relevant/not applicable, add override, set required/avoid, preview summary, confirm, reset override to inherited.

## 13. State model
`NOT_CONFIGURED | INHERITED | DRAFT | CONFIRMED | NOT_APPLICABLE | REVIEW_REQUIRED`.

## 14. Business rules
- **IDN-VERT-001** — Vertical Rules MUST inherit from base Identity rather than duplicate all values by default.
- **IDN-VERT-002** — A vertical-specific override MUST be explicitly scoped and MUST NOT mutate base Visual DNA.
- **IDN-VERT-003** — Content Vertical identity rules MUST remain distinct from platform technical asset requirements.
- **IDN-VERT-004** — A vertical MAY be marked not applicable without reducing Identity quality/completeness artificially.
- **IDN-VERT-005** — Vertical Rules MAY narrow or adapt presence, typography, composition, anchors and visual treatment where appropriate.
- **IDN-VERT-006** — Mystique/disclosure constraints MUST propagate to verticals that expose narrative/public information.
- **IDN-VERT-007** — Rights restrictions MUST remain separate operational checks even if a style/reference is identity-aligned.
- **IDN-VERT-008** — AI suggestions MUST use confirmed Identity and not unreviewed Moodboard candidates by default.
- **IDN-VERT-009** — Era overrides apply after base inheritance and before execution-specific deviations, with clear precedence.
- **IDN-VERT-010** — Content Unit-specific approved IdentityDeviation is more specific than vertical guidance but does not rewrite it.
- **IDN-VERT-011** — Platform Adaptation may change crop/duration/thumbnail/caption etc. without being interpreted as identity change if within vertical/constraint rules.
- **IDN-VERT-012** — Brand Book external mode MAY include vertical specs relevant to creators while excluding private internal canon.
- **IDN-VERT-013** — Production Agent MUST treat vertical rules as constraints/preferences according to their priority, not as impossible universal absolutes.
- **IDN-VERT-014** — Missing vertical rule MUST fall back to confirmed base identity rather than generic AI brand advice.
- **IDN-VERT-015** — User can intentionally leave a vertical exploratory and use deviations/experiments.
- **IDN-VERT-016** — Technical infeasibility should trigger feasible fallback or deviation proposal, not silent identity mutation.

## 15. AI behavior
Translate base confirmed identity into medium-aware candidate execution rules. Must distinguish inherited values, proposed overrides and platform/production constraints. No copying specific reference artworks.

## 16. Human approval
Overrides/required/avoid rules are human confirmed. AI can draft.

## 17. Validation
Vertical enum; override conflicts; dependency version; `NOT_APPLICABLE` suppresses completeness nags.

## 18. UI states
Inherited, configured, not applicable, partial, conflict, review required.

## 19. Edge cases
Typography not supported natively on platform → technical adaptation outside base identity. Merch needs simpler palette for print feasibility → scoped production/vertical override.

## 20. Cross-module effects
Guard, Production, Factory, Brand Book and Website consume vertical-specific context.

## 21. Notifications and attention model
Only missing vertical spec that blocks current production should surface; no need to configure unused verticals.

## 22. Search / filtering / sorting / bulk actions
Filter configured/relevant; `Apply inherited` can bulk mark selected verticals but not auto-create restrictive rules.

## 23. Analytics and product telemetry
Vertical setup completion, override frequency, Guard conflict/override, not-applicable distribution.

## 24. Learning feedback
Performance creates hypotheses about executions; does not edit vertical rules automatically.

## 25. Auditability / provenance
Inherited source version, override author/reason, Era/deviation precedence.

## 26. Desktop / mobile behavior
Desktop matrix/detail; mobile summaries/edit basic rules.

## 27. Accessibility / usability
Clearly show inherited vs overridden values and precedence in text, not color only.

## 28. Security / privacy / rights
External creator view filters internal/private data; rights checked separately.

## 29. Performance / async jobs
Rule drafting optional AI job; inherited rendering deterministic.

## 30. Acceptance criteria
1. Vertical inherits base Identity by default.
2. Override does not mutate base.
3. Platform dimensions are not stored as identity rule.
4. Not-applicable vertical does not nag.
5. Guard receives correct precedence.
6. Missing spec falls back to base identity.

## 31. Test matrix
Unit: inheritance/precedence. Integration: Guard/Production/Platform adaptation. E2E: base Visual DNA→short-form override→content deviation.

## 32. Open questions
Exact persistent schema should follow Stage 0 relational/JSONB reasoning because many vertical fields may be sparse and evolve.

## 33. Traceability
`IDN-VERT-001–016` → MASTER 69–80, 87–92, 128, 199, 404.
