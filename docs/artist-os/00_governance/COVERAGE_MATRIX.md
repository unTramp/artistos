# MASTER v1.3 → Detailed Product Specification Coverage Matrix

This matrix is the first-pass traceability map. Detailed feature-level requirement IDs will be added during specification passes.

| MASTER v1.3 area | Requirement range | Primary detailed-spec destination |
|---|---:|---|
| Product vision / principles / governance | 1–35 | `00_governance`, all domains |
| Technology / application architecture | 36–47 | Engineering derivation, `17_ai_agents_jobs`, `18_platforms_integrations`, `19_settings_security_portability` |
| Core Artist / Song / Campaign model | 48–52 | `04_songs_music`, `05_campaigns_releases` |
| Artist Identity Engine | 53–92 | `02_identity` |
| Narrative Architecture | 93–102 | `03_narrative` |
| Song Brain & Music Intelligence | 103–112 | `04_songs_music` |
| Knowledge & Context Assembly | 113–126 | `16_knowledge_research_context` |
| Content Intelligence | 127–147 | `06_content_factory` |
| Planning / Evergreen / Calendar | 148–159 | `07_pipeline_planning_calendar` |
| Production System / Assets / Rights | 160–191 | `08_production`, `09_assets_media_rights` |
| Profile Readiness / Distribution | 192–202 | `10_distribution_owned_media` |
| Link Routing / Owned Media | 203–216 | `10_distribution_owned_media` |
| Platform Capability Registry | 217–222 | `18_platforms_integrations` |
| DSP Intelligence | 223–244 | `11_dsp` |
| Organic Growth / Market Intelligence | 245–263 | `12_growth_market` |
| Business / Fan Value | 264–286 | `13_business_fan_value` |
| Analytics Normalization | 287–300 | `14_analytics` |
| Insight / Hypothesis / Experiment / Learning | 301–315 | `15_intelligence_learning_decisions` |
| Decision Memory / Reviews | 316–321 | `15_intelligence_learning_decisions` |
| AI / Agent Architecture | 322–347 | `17_ai_agents_jobs`, `16_knowledge_research_context` |
| Job Architecture | 348–353 | `17_ai_agents_jobs` |
| UX / Information Architecture | 354–370 | all product domains; especially `01_overview_command_center`, pipeline/calendar, mobile On-Set |
| Data Import / Integrations | 371–382 | `18_platforms_integrations` |
| Security / Privacy / Portability | 383–391 | `19_settings_security_portability` |
| Product Telemetry | 392–395 | `20_product_quality_telemetry` |
| Testing / Quality | 396–402 | `20_product_quality_telemetry` + per-feature test matrices |
| MVP v1.3 | 403–411 | coverage tags in every relevant feature spec |
| Deferred / boundaries | 412–415 | `00_governance`, per-feature non-goals |
| Development phases | 416–437 | engineering implementation planning; not product behavior source |
| Codex Stage 0 | 438–443 | future engineering audit package |
| Advertising / Publicity research boundary | 444–448 | extension points only; no normative feature specs in v1.3 core |
| Success criteria | 449–457 | domain acceptance criteria / E2E validation |
| Codex global rules | 458–464 | engineering implementation governance |

## Coverage policy

A MASTER requirement is considered *product-spec covered* only when:
1. it maps to at least one feature spec;
2. the feature spec contains explicit behavior/rule(s), not merely a heading;
3. conflicting or ambiguous interpretations are resolved or tracked as an open question;
4. acceptance criteria exist where the requirement is behaviorally testable;
5. cross-domain effects are referenced in both participating domains where necessary.

## Detailed pass register

| Detailed domain | Status | Requirement namespaces | Key MASTER coverage |
|---|---|---|---|
| `01_overview_command_center` | REVIEW complete | `OVR-HOME`, `OVR-ATTN`, `OVR-CMD`, `OVR-ONB` | 8, 20, 24–25, 192–194, 230–233, 287–321, 339–370, 403, 449–457 |
| `02_identity` | REVIEW complete | `IDN-HOME`, `IDN-WIZ`, `IDN-ARCH`, `IDN-LISTEN`, `IDN-ASSOC`, `IDN-MOOD`, `IDN-VDNA`, `IDN-TYPE`, `IDN-NARR`, `IDN-ANCH`, `IDN-MYST`, `IDN-VERT`, `IDN-ERA`, `IDN-CNST`, `IDN-GUARD`, `IDN-BBOOK`, `IDN-VERS` | 16–20, 53–92, 145–147, 175–185, 212, 225, 278, 314–315, 321, 329–330, 336, 360, 386–390, 398–399, 404, 410, 415, 450 |
| `03_narrative` | REVIEW complete | `NAR-HOME`, `NAR-TRK`, `NAR-BEAT`, `NAR-DIFF`, `NAR-MIX`, `NAR-ANL` | 83–85, 93–102, 130–159, 287–321, 354, 361, 405, 450–455 |
| `04_songs_music` | REVIEW complete | `SNG-LIB`, `SNG-HOME`, `SNG-MEAN`, `SNG-LYR`, `SNG-SEG`, `SNG-AUD`, `SNG-IDCTX`, `SNG-PERF`, `SNG-HIST`, `SNG-LEARN`, `SNG-EXT` | 48–49, 103–112, 113–147, 160–190, 197–202, 226–243, 287–321, 329, 342–346, 354–356, 406, 449–455 |

| `05_campaigns_releases` | REVIEW complete | `CMP-*` | 48–52, 226–244, 403–409, 449–457 |
| `06_content_factory` | REVIEW complete | `CNT-*` | 127–147, 341–346, 354–370, 403, 451 |
| `07_pipeline_planning_calendar` | REVIEW complete | `PLN-*` | 148–159, 200, 206, 231, 248, 319, 354–370, 403 |
| `08_production` | REVIEW complete | `PRD-*` | 160–177, 187, 191, 327–330, 349, 370, 411, 452 |
| `09_assets_media_rights` | REVIEW complete | `AST-*` | 170–190, 197–202, 216, 328–330, 349, 383–390, 411 |
| `10_distribution_owned_media` | REVIEW complete | `DST-*` | 192–216, 287–300, 354–377, 407, 453 |
| `11_dsp` | REVIEW complete | `DSP-*` | 217–244, 287–300, 401, 406 |
| `12_growth_market` | REVIEW complete | `GRO-*` | 245–263, 287–315, 408 |
| `13_business_fan_value` | REVIEW complete | `BIZ-*` | 264–286, 287–315, 409, 456 |
| `14_analytics` | REVIEW complete | `ANA-*` | 287–300, 319–320, 392–393, 454 |
| `15_intelligence_learning_decisions` | REVIEW complete | `INT-*` | 301–321, 455 |
| `16_knowledge_research_context` | REVIEW complete | `KNW-*` | 28–35, 103–126, 341–346, 389–390 |
| `17_ai_agents_jobs` | REVIEW complete | `AI-*` | 322–353, 391–393, 398, 410 |
| `18_platforms_integrations` | REVIEW complete | `PLT-*` | 217–222, 371–382 |
| `19_settings_security_portability` | REVIEW complete | `SEC-*` | 383–391 |
| `20_product_quality_telemetry` | REVIEW complete | `QTY-*` | 392–402, 463–464 |

## Reconciliation status

All top-level MASTER product areas now map to at least one detailed domain specification. The first cross-domain reconciliation is documented in `CROSS_DOMAIN_RECONCILIATION_PASS1.md`; unresolved schema/product choices are consolidated in `OPEN_QUESTIONS_REGISTRY.md`.
