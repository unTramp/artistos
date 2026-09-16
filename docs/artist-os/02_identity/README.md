# 02 — Artist Identity Engine

**Domain status:** `REVIEW — detailed functional specification pass complete`

Artist Identity is a first-class bounded context. It defines the artistic, emotional, visual and narrative language used by Strategy, Content, Production, Distribution and Brand/Identity Guard. It is versioned, human-controlled and intentionally insulated from automatic performance-driven rebranding.

## Feature specifications

1. [Identity Home](01_identity-home.md)
2. [Identity Wizard](02_identity-wizard.md)
3. [Archetype Discovery](03_archetype-discovery.md)
4. [Identity Listening Session](04_listening-session.md)
5. [Sensory Associations & Candidate Review](05_sensory-associations.md)
6. [Moodboard](06_moodboard.md)
7. [Visual DNA](07_visual-dna.md)
8. [Typography System](08_typography.md)
9. [Identity Narrative](09_narrative-identity.md)
10. [Symbolic Anchors](10_symbolic-anchors.md)
11. [Mystique & Interpretation Policy](11_mystique-interpretation.md)
12. [Identity Vertical Rules](12_vertical-rules.md)
13. [Era Identity](13_eras.md)
14. [Identity Constraints & Deviations](14_identity-constraints.md)
15. [Identity Guard](15_identity-guard.md)
16. [Brand Book Compiler](16_brand-book.md)
17. [Identity Versioning & Review](17_identity-versioning.md)

## Identity flow

```text
Evidence / Artist Statements
↓
Discovery
↓
Candidates
↓
Human Review
↓
Structured Identity Draft
↓
Constraints / Mystique / Vertical Rules
↓
Version Review
↓
ACTIVE Identity Version
↓
Identity Context Capsule
↓
Strategy / Content / Production / Guard
↓
Performance signals
↓
Insight / Identity Hypothesis
↓
Repeated evidence + Human Review
↓
Era evolution OR new Identity Version OR no change
```

## Domain invariants

- Identity before optimization.
- AI suggests; human confirms.
- Archetype is a creative model, not diagnosis.
- Moodboard/reference recurrence is evidence, not truth.
- Structured Identity is source of truth; Brand Book is compiled output.
- Active identity is versioned and not edited in place for material changes.
- Historical work keeps its historical Identity Version / Era.
- Creative exceptions are first-class via IdentityDeviation.
- Analytics creates hypotheses, never automatic rebrand.
- No magic identity/alignment score.
- Protected internal canon stays filtered from external output.

## Requirement namespaces

`IDN-HOME-*`, `IDN-WIZ-*`, `IDN-ARCH-*`, `IDN-LISTEN-*`, `IDN-ASSOC-*`, `IDN-MOOD-*`, `IDN-VDNA-*`, `IDN-TYPE-*`, `IDN-NARR-*`, `IDN-ANCH-*`, `IDN-MYST-*`, `IDN-VERT-*`, `IDN-ERA-*`, `IDN-CNST-*`, `IDN-GUARD-*`, `IDN-BBOOK-*`, `IDN-VERS-*`.

## Known architecture/data-model questions preserved for Stage 0 / schema pass

1. `EnvironmentRules` is named by MASTER but has no detailed field schema yet.
2. `IdentityVerticalSpec` behavior is required but its persistent entity schema is not defined by MASTER; relational vs JSONB boundary must be justified from query/history requirements.
3. Protected visibility for Sensory Associations is likely cleaner as an orthogonal visibility field than a status; data-model pass should decide.
4. Song-specific Interpretation Policy needs a final home (`SongIdentityContext` extension vs dedicated entity).
5. Version semantic label UX (system suggestion vs user editable) remains a product/detail decision, not architecture change.
