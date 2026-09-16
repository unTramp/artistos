# Asset Rights and Publishability

- **Status:** REVIEW COMPLETE
- **MASTER references:** §181–186, §328–330, §383–390
- **Domain:** 09_assets_media_rights
- **Feature slug:** `rights`
- **Requirement prefix:** `AST-RGT`

## 2. Purpose
Make asset permission state explicit and traceable so Artist OS does not confuse possession, credit or source attribution with legal permission to publish/commercialize.

## 3. User problem / job-to-be-done
Artists routinely have reference images, stock, collaborator footage, fonts or downloaded media where usage rights differ. Without rights metadata the system can accidentally recommend publishing something only meant as reference.

## 4. Scope
RightsStatus, AssetRights fields, proof Asset, expiration, commercial/modification/attribution permissions, warnings and publishability checks. Not legal advice.

## 5. Entry points
Asset detail/import, Production plan, Factory, Publication/Website/Brand Book export, external asset acquisition.

## 6. Preconditions and dependencies
Asset/source exists. UNKNOWN is valid default for externally sourced material unless evidence says otherwise.

## 7. Information architecture
Rights summary → status → creator/source/license → permissions → expiry/attribution → proof → usages/blocks.

## 8. User roles and permissions
Single artist can enter evidence/override with audit; AI may parse license text as candidate but cannot make definitive legal determination beyond explicit metadata.

## 9. Core data model
MASTER `RightsStatus` and `AssetRights {creator, sourceUrl, license, acquiredAt, expiresAt?, commercialUse, modificationAllowed, attributionRequired, proofAssetId?}` plus provenance/override notes.

## 10. Main happy-path workflow
Acquire/create Asset → select origin → record rights evidence → system derives/display publishability constraints → downstream use checks status → attribution/expiry conditions surface → proof retained.

## 11. Alternative workflows
Original owned asset; commissioned collaborator; permission email; public license; reference-only moodboard; unknown rights; expiring stock license; generated asset with provider terms.

## 12. User actions
Set/update status, attach proof, enter license/expiry, record permission, override warning with reason where product permits, inspect affected usages.

## 13. State model
RightsStatus MASTER: OWNED, LICENSED, PUBLIC_LICENSE, PERMISSION_GRANTED, REFERENCE_ONLY, UNKNOWN. Expired/contradicted permission may cause effective warning state without inventing new enum until schema decisions.

## 14. Business rules
- `AST-RGT-001` RightsStatus MUST use MASTER enum.
- `AST-RGT-002` Credit, source URL or `I do not own` MUST NOT convert UNKNOWN/REFERENCE_ONLY into publishable status.
- `AST-RGT-003` AssetOrigin MUST NOT be treated as RightsStatus.
- `AST-RGT-004` UNKNOWN MUST remain a first-class state and MUST NOT be coerced to safe/publishable.
- `AST-RGT-005` REFERENCE_ONLY assets MUST be blocked/warned from audience-facing publication/export where actual media would be distributed.
- `AST-RGT-006` LICENSED/PERMISSION_GRANTED usage MUST respect commercialUse, modificationAllowed, attributionRequired and expiry when known.
- `AST-RGT-007` Rights expiry MUST not delete historical usage but SHOULD block/warn future usage after expiry.
- `AST-RGT-008` ProofAssetId SHOULD preserve evidence of license/permission where available.
- `AST-RGT-009` AI MUST NOT invent license terms or declare legal ownership from appearance/source alone.
- `AST-RGT-010` Parsing a license document MAY produce candidate fields requiring human confirmation.
- `AST-RGT-011` Publishing/Export surfaces MUST consume rights status rather than duplicate independent permission logic.
- `AST-RGT-012` Intentional rights override, where allowed, MUST be explicit, audited and never silently performed by AI.
- `AST-RGT-013` Unknown rights on an unused reference MAY remain informational; unknown rights on committed publication SHOULD become blocking/high-attention depending usage.
- `AST-RGT-014` Derived assets MUST inherit/compose parent rights constraints unless a new valid rights basis is recorded.
- `AST-RGT-015` Cropping/coloring/captioning MUST NOT be treated as creating new ownership rights.
- `AST-RGT-016` Generated assets MUST retain provider/source terms when relevant; “AI-generated” alone does not imply unrestricted use.
- `AST-RGT-017` Rights feature MUST clearly state operational metadata, not legal advice.
- `AST-RGT-018` Historical audit MUST preserve what rights evidence/status was believed at publication time.

## 15. AI behavior
Can extract candidate terms and flag inconsistencies/expiry; forbidden from definitive unsupported legal conclusions.

## 16. Human approval
Rights status/evidence confirmation and overrides are human-controlled.

## 17. Validation
Expiry after acquisition when dates known; proof belongs to same artist/workspace; permission fields coherent; attribution text present when required if publication workflow uses it.

## 18. UI states
Owned, licensed, permission, public license, reference only, unknown, expiring/expired warning, missing proof, conflict.

## 19. Edge cases
Collaborator verbally agrees; license terms change; derivative combines assets with different licenses; public domain claim uncertain; generated provider terms vary by plan/time.

## 20. Cross-module effects
Production/Factory warnings, Distribution/Website publish block, Brand Book external export, Asset acquisition.

## 21. Notifications and attention model
Rights expiry affecting upcoming committed use; UNKNOWN/REFERENCE_ONLY asset used by Ready/Scheduled content; contradictory rights evidence.

## 22. Search / filtering / sorting / bulk actions
Filter rights/expiry/proof; bulk set only where same evidence genuinely applies, with confirmation.

## 23. Analytics and product telemetry
Rights correction/override rate, blocked publication count, expiry warnings resolved.

## 24. Learning feedback
None to creative learning; operational rights patterns may improve checklists.

## 25. Auditability / provenance
Every status change, evidence, source, override, effective date and publication-time snapshot.

## 26. Desktop / mobile behavior
Desktop detailed rights; mobile summary/warning and proof capture.

## 27. Accessibility / usability
Plain language with “Can I publish/commercially use/modify?” summaries; do not rely on legal jargon or color alone.

## 28. Security / privacy / rights
Proof documents may contain personal/contracts data; restrict/export carefully.

## 29. Performance / async jobs
Mostly synchronous; document parsing async optional.

## 30. Acceptance criteria
- `AST-RGT-AC01` Credit does not change UNKNOWN rights.
- `AST-RGT-AC02` Reference-only asset cannot silently enter publish flow.
- `AST-RGT-AC03` Expiry affects future, not historical lineage.
- `AST-RGT-AC04` Derived asset preserves parent restrictions.
- `AST-RGT-AC05` AI cannot autonomously grant rights.

## 31. Test matrix
Owned; licensed expiring; permission proof; unknown; reference-only; derived; generated terms; override; historical publication.

## 32. Open questions
Exact blocking matrix by surface/use type should be centralized in Rights policy implementation rather than scattered per UI.

## 33. Traceability
MASTER §181–186, §328–330, §383–390.
