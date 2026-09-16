# Visual DNA

## 1. Metadata
- **Spec ID:** `IDN-VDNA`
- **Domain:** `02_identity`
- **Feature:** Visual DNA
- **Status:** REVIEW
- **MASTER references:** 61, 68–80, 87, 92, 404, 450
- **Depends on:** confirmed sensory associations, Moodboard patterns, draft Identity Version
- **Used by:** Vertical Rules, Production Agent, Identity Guard, Brand Book, Context Capsule

## 2. Purpose
Transform reviewed visual evidence into a structured visual identity system that can guide creative decisions without reducing the artist to one rigid look.

## 3. User problem / job-to-be-done
**JTBD:** “Turn the visual world I recognize as mine into clear reusable rules so I, collaborators and AI can create consistently without making everything look identical.”

## 4. Scope
Color, texture, lighting, art style, composition, fashion, environment, visual treatment, retouching, presence and cross-component review. Typography is detailed separately but summarized here.

### Out of scope
- generating all creative assets automatically;
- fixed single filter forever;
- numerical identity score;
- copying Moodboard references.

## 5. Entry points
`/identity/visual-dna`, Identity Wizard, Identity Home, Moodboard pattern review.

## 6. Preconditions and dependencies
Draft Identity Version. Evidence is recommended but manual artist-defined rules are allowed and must be labeled as artist decisions rather than evidence-derived patterns.

## 7. Information architecture
```text
Visual DNA
├─ Emotional Territory context
├─ Colors
├─ Textures / Materials
├─ Lighting
├─ Art Style
├─ Composition
├─ Fashion
├─ Environment
├─ Typography summary
├─ Visual Treatment families
├─ Retouching
├─ Presence
└─ Review / conflicts / provenance
```

## 8. User roles and permissions
Artist confirms structured identity rules. AI suggests candidates and detects conflicts.

## 9. Core data model
Uses MASTER `VisualIdentitySystem` components:
`ColorSystem`, `TextureProfile`, `LightingProfile`, `ArtStyleProfile`, `CompositionRules`, `FashionRules`, `EnvironmentRules`, `TypographySystem`, `VisualTreatmentProfile`, `SymbolicAnchors` plus `RetouchingPolicy` and `PresenceProfile`.

## 10. Main happy-path workflow
1. System collects confirmed associations and accepted Moodboard pattern candidates.
2. AI optionally proposes structured candidate values per Visual DNA component with evidence.
3. User reviews each component, edits or defines manually.
4. System flags internal contradictions and excessive rigidity.
5. User confirms component set within current draft Identity Version.
6. Vertical Rules/Brand Book can use confirmed data.

## 11. Alternative workflows
Manual-first; partial Visual DNA; multiple treatment families (`DAY/NIGHT/STUDIO/PERFORMANCE`); new Era overlays selected values without changing base Identity.

## 12. User actions
Review candidate, add/edit/remove value, move between preferred/allowed/avoid, set ranges, create treatment family, preview, confirm component, compare with active version.

## 13. State model
Per component: `EMPTY | CANDIDATE | DRAFT | CONFIRMED | REVIEW_REQUIRED`. Version lifecycle remains authoritative.

## 14. Business rules
- **IDN-VDNA-001** — Visual DNA MUST be structured by component and MUST NOT collapse into one generic visual-description field.
- **IDN-VDNA-002** — Evidence-derived values MUST retain provenance; manual artist choices MUST be distinguishable as direct decisions.
- **IDN-VDNA-003** — Moodboard/association patterns remain suggestions until confirmed.
- **IDN-VDNA-004** — Color system MUST support primary, secondary, accent, forbidden colors and tonal ranges as defined by MASTER.
- **IDN-VDNA-005** — Texture, lighting, fashion and other systems MUST distinguish preferred/allowed/avoid where the MASTER model supports it.
- **IDN-VDNA-006** — Visual Treatment MUST support coherent families/presets rather than force one universal filter.
- **IDN-VDNA-007** — Retouching policy MUST be explicitly representable as NONE/MINIMAL/EDITORIAL/POLISHED.
- **IDN-VDNA-008** — PresenceProfile MUST separately represent face, personal voice and performance presence.
- **IDN-VDNA-009** — AI MUST NOT infer that a repeated color/object has guaranteed psychological effect.
- **IDN-VDNA-010** — Visual DNA MUST allow creative exceptions through IdentityDeviation rather than requiring destructive rule edits.
- **IDN-VDNA-011** — Era overrides MUST remain separate from base Visual DNA and be identifiable as overrides.
- **IDN-VDNA-012** — A confirmed Identity may be intentionally broad; the product MUST NOT force narrow rules merely to increase “consistency.”
- **IDN-VDNA-013** — Contradictory rules MUST be surfaced for review when they cannot coexist operationally.
- **IDN-VDNA-014** — `avoid` and forbidden values MUST require explicit artist confirmation if AI suggested them.
- **IDN-VDNA-015** — Visual DNA changes MUST follow Identity Versioning rules and MUST NOT rewrite historical execution metadata.
- **IDN-VDNA-016** — Visual DNA MUST remain useful without AI via manual editing and evidence review.
- **IDN-VDNA-017** — Typography source-of-truth lives in Typography System; Visual DNA displays/integrates it without duplicating conflicting data.
- **IDN-VDNA-018** — Visual rules SHOULD express ranges/tendencies where appropriate rather than absolute prescriptions.
- **IDN-VDNA-019** — Production constraints may limit execution, but feasibility limitations do not silently alter identity preference.
- **IDN-VDNA-020** — Identity Guard consumes confirmed rules and approved Era overrides, not unreviewed candidates by default.

## 15. AI behavior
Input: Identity evidence, confirmed associations, accepted Moodboard patterns, existing draft/active Visual DNA. Output per component: candidate values, rationale, evidence refs, confidence, conflicts, suggested flexibility. Forbidden: automatic confirmation, copyright imitation instructions, pseudo-scientific meaning claims.

## 16. Human approval
Each component can be saved as draft; confirmation and version activation are human decisions.

## 17. Validation
Ranges valid; forbidden/preferred conflicts flagged; references exist; treatment family names unique per scope; Era override compatibility checked.

## 18. UI states
Empty, candidate-rich, partial, confirmed, conflict, review required, AI unavailable, comparison with active version.

## 19. Edge cases
Same color preferred in photography but avoided in merch → route to Vertical Rules instead of global contradiction. High face presence in performance but low in artwork → scope rules rather than flatten.

## 20. Cross-module effects
Confirmed Visual DNA feeds Context Capsule, Production Agent, Guard, Brand Book and Vertical Rules. It does not alter source assets.

## 21. Notifications and attention model
Only unresolved blocking conflicts/review-ready version changes surface; partial optional fields do not create urgency.

## 22. Search / filtering / sorting / bulk actions
Not table-centric. Compare active vs draft by component; bulk accept AI suggestions should not be offered for high-impact fields.

## 23. Analytics and product telemetry
Candidate acceptance/edit rate by component, time to confirmation, Guard override rate, component change frequency.

## 24. Learning feedback
Visual performance may generate Identity hypotheses but never directly edits Visual DNA.

## 25. Auditability / provenance
Per value: origin/source, actor, version, timestamp, optional reason. Comparison view shows old/new.

## 26. Desktop / mobile behavior
Desktop primary; mobile summary/quick review. Visual comparison and rich controls may require desktop.

## 27. Accessibility / usability
Color values include text/hex/name and contrast-safe UI; image previews have labels; do not communicate “avoid” by color alone.

## 28. Security / privacy / rights
Reference sources stay private unless exported intentionally. Fonts/images remain subject to rights metadata.

## 29. Performance / async jobs
Candidate generation can be job-backed. Manual data loads synchronously and does not depend on analysis jobs.

## 30. Acceptance criteria
1. Visual DNA can be built manually without AI.
2. Candidate evidence is inspectable.
3. Treatment families support multiple contexts.
4. Era overrides are visibly separate.
5. Historical content keeps old Identity Version.
6. Guard ignores unconfirmed candidates by default.
7. Exceptions do not require editing the base identity.

## 31. Test matrix
Unit: component validation/conflicts. Integration: Visual DNA→Context Capsule/Guard. Agent eval: evidence grounding/no pseudo-science. E2E: Moodboard→Visual DNA→Vertical rule→Guard.

## 32. Open questions
`EnvironmentRules` fields are named in MASTER but not structurally enumerated; detailed schema should be defined during DB/product data-model pass based on query/use cases.

## 33. Traceability
`IDN-VDNA-001–020` → MASTER 61, 68–80, 87–92, 404, 450.
