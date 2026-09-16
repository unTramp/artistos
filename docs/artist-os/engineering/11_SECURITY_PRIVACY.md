# Artist OS — Engineering Spec 11: Security & Privacy

**Status:** DRAFT / Pass 1

## 1. Security principles

### ENG-SEC-001 — Least privilege
Providers, jobs and agents receive only permissions/data needed for the workflow.

### ENG-SEC-002 — Server-side secrets
API keys, OAuth tokens, refresh tokens and signing secrets never enter client bundles, git, logs or user-visible errors.

### ENG-SEC-003 — Encryption
Secrets encrypted at rest with key management separated from DB content. TLS required in transit.

## 2. Data classification

```text
PUBLIC
INTERNAL
PRIVATE_ARTIST
PROTECTED_CANON
SECRET_CREDENTIAL
PII_EXTERNAL_REFERENCE
```

Fields/documents can carry classification metadata when needed. `PROTECTED_CANON` includes private narrative/mystique facts.

## 3. Authorization

Single-artist MVP still enforces authenticated ownership scope. Do not defer all authorization because only one user exists today.

Future team/roles are deferred; avoid schema assumptions that make row-level artist scoping impossible.

## 4. Internal Canon

Protected artist facts are excluded by default from:

```text
external provider payloads
external Brand Book mode
public website generation
research queries
telemetry
logs
```

Explicit workflow inclusion is allow-list based.

## 5. PII minimization

No hidden fan profiling. Audience capture stores aggregates/provider refs by default. Person-level data requires future explicit CRM/privacy contract.

## 6. File access

Object storage private by default. Signed URLs short-lived. Rights proof/private docs have stricter access class than publishable media.

## 7. Destructive actions

Hard deletion/purge requires explicit user action, dependency check, audit event and where appropriate delayed/purge job. Normal UX prefers archive/soft-delete.

## 8. Audit-sensitive operations

Always audited:

```text
identity activation/change
protected knowledge promotion
rights override
credential connection/disconnection
publishing actions
config/prompt promotion
destructive archive/delete
security setting change
```

## 9. Logging redaction

Structured logs must redact credentials, access tokens, signed URLs, raw private canon and unnecessary personal data. Error stack may be retained server-side but user output is safe/sanitized.

## 10. Prompt injection boundary

Web/imported/research content is treated as untrusted data. Tool instructions come only from system/application configuration, never from retrieved text.

## 11. Dependency/upload safety

- pin/scan dependencies in CI;
- validate upload type/container;
- isolate parsers/transcoders in worker process;
- reject executable/script content where not supported.

## 12. Backups

Backups encrypted, access-controlled and restore-tested. Secret material/credentials follow dedicated backup/key policy.

## 13. Privacy retention

Debug prompts, provider raw payloads, temporary media and logs have explicit retention. Canonical artistic history/decisions follow product retention/export policy.

## 14. Export/portability

Knowledge Export supports JSON/Markdown for portable artist-owned knowledge; export excludes secret credentials and may mark references to binary/private assets separately.

## 15. Acceptance criteria

- no secret reaches frontend source/logs;
- private canon excluded from unrelated AI/integration payloads;
- every sensitive override is audited;
- object URLs expire;
- user can export canonical knowledge without exporting credentials.
