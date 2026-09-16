# Content and Asset Lineage

- **Status:** REVIEW COMPLETE
- **MASTER references:** §187–190, §216, §451–454
- **Domain:** 09_assets_media_rights
- **Feature slug:** `lineage`
- **Requirement prefix:** `AST-LIN`

## 2. Purpose
Make every important creative output traceable backward to identity, song/audio, idea, production source and forward to publications/usages/metrics.

## 3. User problem / job-to-be-done
Without lineage, the system cannot answer why a post exists, which take/edit it came from, where an asset is reused, or which evidence should feed learning. File names alone cannot support Artist OS closed-loop learning.

## 4. Scope
MASTER lineage chain, parent/derivative links, usage graph, provenance navigation and deletion impact.

## 5. Entry points
Asset detail, ContentUnit, Publication, Song history, Analytics evidence, Brand Book/Website usage.

## 6. Preconditions and dependencies
Any linked entities may be partial/historical. Imported historical content can have incomplete lineage explicitly marked.

## 7. Information architecture
“Came from” upstream graph → current entity → “Used in / led to” downstream graph → evidence/details.

## 8. User roles and permissions
Single artist reads/corrects links where allowed. System creates deterministic links from workflows.

## 9. Core data model
MASTER chain `Identity Version → Era → Song → Audio Segment → Content Angle → Shoot → Raw Asset → Take → Selected Take → Edit → Content Unit → Publication → Metrics`; actual implementation supports optional/missing nodes and derived asset graph.

## 10. Main happy-path workflow
Each workflow creates explicit references as entities are produced → lineage viewer traverses them → analytics/learning can cite exact Publication/Content/Asset context → user can inspect reuse/usages.

## 11. Alternative workflows
No Song; no Shoot; imported historical Publication; external licensed Asset; long-form source → multiple derivatives; one master ContentUnit → multiple Publications.

## 12. User actions
Inspect, open node, add/correct eligible missing link, see usages, assess delete/archive impact, export metadata.

## 13. State model
Lineage itself is graph/provenance, not status workflow. Link source may be confirmed/inferred where Smart Ingest is involved.

## 14. Business rules
- `AST-LIN-001` Lineage MUST preserve canonical distinction between ContentUnit and Publication.
- `AST-LIN-002` Lineage MUST support optional/missing nodes; not every content item has Song/Shoot/Audio Segment.
- `AST-LIN-003` Derived Asset MUST link to parent Asset and derivation type.
- `AST-LIN-004` One source Asset MAY produce many derived Assets/ContentUnits.
- `AST-LIN-005` One ContentUnit MAY produce multiple platform Publications.
- `AST-LIN-006` One Asset MAY have multiple surface usages such as Reel, Website, EPK and Brand Book.
- `AST-LIN-007` Inferred links MUST be distinguishable from confirmed links.
- `AST-LIN-008` Historical imports with incomplete lineage MUST remain explicitly incomplete rather than fabricated.
- `AST-LIN-009` Archive MUST preserve lineage.
- `AST-LIN-010` Destructive deletion MUST expose downstream/upstream impact and require explicit handling.
- `AST-LIN-011` IdentityVersion/Era used at creation MUST remain historical references even after active identity changes.
- `AST-LIN-012` Metrics MUST attach to Publication/platform observation, not be copied as Asset performance.
- `AST-LIN-013` Learnings/Insights SHOULD cite evidence entities rather than loose prose where possible.
- `AST-LIN-014` Lineage viewer MUST not imply causation merely because nodes are connected temporally.
- `AST-LIN-015` Rights inheritance/constraints SHOULD be traversable through derived Asset chain.
- `AST-LIN-016` Lineage graph MUST prevent cycles in parent-derivation relationships.
- `AST-LIN-017` System-generated lineage changes MUST be auditable.
- `AST-LIN-018` Cross-surface lineage MUST be queryable for reuse/impact analysis.

## 15. AI behavior
AI may help infer missing historical links with confidence but cannot silently establish uncertain provenance.

## 16. Human approval
Inferred link confirmation/correction human-controlled; deterministic workflow references need no extra approval.

## 17. Validation
No derivation cycle; references valid/same artist; inferred status preserved; deletion constraints.

## 18. UI states
Complete chain, partial/incomplete, inferred links, archived node, missing/deleted storage with retained metadata.

## 19. Edge cases
Asset reused after Identity change; Publication deleted on platform; content imported without raw file; derivative parent missing binary but metadata exists.

## 20. Cross-module effects
Every major domain; particularly Analytics/Learning, Rights, Website/Brand Book reuse.

## 21. Notifications and attention model
Deletion/rights changes affecting live usages may surface; lineage incompleteness alone generally not urgent.

## 22. Search / filtering / sorting / bulk actions
Search node/usages; no bulk lineage mutation except reviewed mapping imports.

## 23. Analytics and product telemetry
Lineage completeness, inferred-link correction, reuse count, delete-impact inspections.

## 24. Learning feedback
Lineage is evidence infrastructure enabling valid scoped analysis; it does not itself create conclusions.

## 25. Auditability / provenance
Core purpose: actor/source/confidence/timestamp for links and historical identifiers.

## 26. Desktop / mobile behavior
Desktop graph/detail; mobile simplified upstream/downstream list.

## 27. Accessibility / usability
Provide textual ordered lineage alternative to graph visualization.

## 28. Security / privacy / rights
Viewer respects private/internal entity visibility and proof-document restrictions.

## 29. Performance / async jobs
Graph queries bounded/paginated; derived usage counts cacheable; historical inference async.

## 30. Acceptance criteria
- `AST-LIN-AC01` One ContentUnit shows multiple Publications distinctly.
- `AST-LIN-AC02` Derived asset traces to parent.
- `AST-LIN-AC03` Partial historical lineage remains explicit.
- `AST-LIN-AC04` Identity version remains historical after rebrand.
- `AST-LIN-AC05` Delete impact is visible before destructive action.

## 31. Test matrix
Full chain; no Song; multi-platform; multi-derivative; inferred import; archived nodes; delete impact; identity change.

## 32. Open questions
Whether lineage is implemented purely through domain foreign keys + query service or supplemented by generalized edge table for flexible cross-surface usages.

## 33. Traceability
MASTER §187–190, §216, §451–454.
