# Mystique & Interpretation Policy

## 1. Metadata
- **Spec ID:** `IDN-MYST`
- **Domain:** `02_identity`
- **Feature:** Mystique & Interpretation Policy
- **Status:** REVIEW
- **MASTER references:** 84–85, 89–91, 212, 386, 404
- **Depends on:** Identity Narrative, Song interpretation context, draft Identity Version
- **Used by:** Brand/Identity Guard, Brand Book, Website/WebStory, Content Strategy, Context Assembler

## 2. Purpose
Give the artist explicit control over what is revealed, hinted at, protected or left open to interpretation so AI and collaborators do not over-explain the art.

## 3. User problem / job-to-be-done
**JTBD:** “Let me decide how much of my story and songs I explain publicly, and make the system protect that boundary consistently.”

## 4. Scope
Reveal mode, protected facts, allowed hints, forbidden explanations, interpretive-space rules, song/narrative explanation levels, protected meanings, preferred communication style.

Out: deception/fabricated facts, automatic secrecy optimization.

## 5. Entry points
`/identity/mystique`, Wizard, Narrative, Guard warnings.

## 6. Preconditions and dependencies
Draft Identity Version; works even with minimal narrative.

## 7. Information architecture
Mystique mode → protected facts → allowed hints → forbidden explanations → interpretation levels → communication style → examples/tests.

## 8. User roles and permissions
Artist is authority. AI can propose examples but not decide what private fact becomes public.

## 9. Core data model
MASTER `MystiquePolicy` and `InterpretationPolicy` fields.

## 10. Main happy-path workflow
1. User selects reveal mode OPEN/PARTIAL/HIGH_MYSTIQUE.
2. Defines protected facts/meanings.
3. Adds allowed hints and forbidden explanations.
4. Configures song/narrative explanation levels and communication style.
5. Tests example caption/Brand Book/WebStory snippets through Guard preview.
6. Confirms policy in draft version.

## 11. Alternative workflows
Open artist with no protected facts; per-song stricter interpretation handled by Song context/policy extension; Era-specific changes via new version/era overrides if modeled.

## 12. User actions
Add/remove protected fact, add hint, set reveal mode, set communication preference, test text, approve exception/deviation.

## 13. State model
`EMPTY | DRAFT | CONFIRMED | REVIEW_REQUIRED`.

## 14. Business rules
- **IDN-MYST-001** — Protected facts MUST be excluded from external output contexts by default.
- **IDN-MYST-002** — Reveal mode is communication policy, not permission to fabricate false facts.
- **IDN-MYST-003** — Allowed hints MUST not silently disclose a protected fact more directly than the artist intended.
- **IDN-MYST-004** — Forbidden explanations MUST be enforced by Brand/Identity Guard where applicable.
- **IDN-MYST-005** — InterpretationPolicy MUST support DIRECT/POETIC/SUGGESTIVE/AMBIGUOUS preference.
- **IDN-MYST-006** — Song and narrative explanation levels MUST be separable.
- **IDN-MYST-007** — AI MAY propose wording but MUST respect protected meanings and interpretive-space rules.
- **IDN-MYST-008** — The system MUST not optimize for artificial secrecy solely to increase engagement.
- **IDN-MYST-009** — Human-approved creative deviation MAY override policy for a specific Content Unit with traceable reason.
- **IDN-MYST-010** — External Brand Book mode MUST apply stricter disclosure filtering than internal mode where protected facts exist.
- **IDN-MYST-011** — Website/WebStory audience-facing content MUST use policy-filtered fragments, not raw internal canon.
- **IDN-MYST-012** — A change from OPEN to HIGH_MYSTIQUE MUST NOT retroactively erase already published history; it governs future outputs.
- **IDN-MYST-013** — Protected facts should be represented in a way that avoids leaking sensitive values in generic logs/telemetry.
- **IDN-MYST-014** — Guard feedback MUST explain which policy was triggered without unnecessarily repeating the protected content.
- **IDN-MYST-015** — Artist can leave interpretation deliberately unresolved; system must not force a “meaning” field for every song/story.

## 15. AI behavior
Context should receive filtered policy markers; for some tasks it may need protected content to avoid leakage, but tools/integrations get minimum necessary context. Output includes compliance warnings. Forbidden: revealing protected facts, over-explaining when ambiguous mode set, inventing misleading lore as factual biography.

## 16. Human approval
All protected/public classifications and exceptions require human control.

## 17. Validation
No exact duplicate rules; protected/allowed-hint conflict detected; version scope valid.

## 18. UI states
No policy, open, partial, high mystique, conflict, guard preview pass/warning.

## 19. Edge cases
Protected fact already public elsewhere: policy still controls Artist OS output; system may note external contradiction only if source provided. Hint accidentally contains protected phrase: conflict warning.

## 20. Cross-module effects
Filters Context Packs/external Brand Book/WebStory; Guard checks generated content.

## 21. Notifications and attention model
Only concrete leakage/conflict in pending output becomes attention; no generic “mystique health” alert.

## 22. Search / filtering / sorting / bulk actions
Protected items searchable internally with privacy-safe handling. No bulk reveal action.

## 23. Analytics and product telemetry
Guard triggers/overrides, policy edit frequency. Do not log protected text in generic analytics.

## 24. Learning feedback
Audience response may inform communication hypotheses, not auto-change reveal policy.

## 25. Auditability / provenance
Policy version, changes, actor, exception/deviation reason.

## 26. Desktop / mobile behavior
Both; protected-item editing should use privacy-aware UI.

## 27. Accessibility / usability
Clear plain language examples; warnings explain effect, not just technical policy names.

## 28. Security / privacy / rights
High priority: internal canon/protected facts minimized in external providers and logs.

## 29. Performance / async jobs
Guard preview can be async/AI; deterministic protected-token/rule checks may run synchronously as first layer.

## 30. Acceptance criteria
1. Protected fact excluded from external Brand Book.
2. Guard catches forbidden explanation.
3. OPEN/PARTIAL/HIGH_MYSTIQUE supported.
4. Policy change does not rewrite past publications.
5. Specific creative deviation can be approved/audited.
6. Telemetry does not expose protected text.

## 31. Test matrix
Unit: filter/conflict. Integration: Context/Brand Book/WebStory. Agent eval: ambiguity adherence, leakage prevention. E2E: protect fact→generate external copy→guard/filter.

## 32. Open questions
Whether Song-specific interpretation policy should be a first-class entity or live in SongIdentityContext/Knowledge; MASTER implies song explanation level but does not define per-song schema.

## 33. Traceability
`IDN-MYST-001–015` → MASTER 84–85, 89–91, 212, 386, 404.
