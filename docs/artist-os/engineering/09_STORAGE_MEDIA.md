# Artist OS — Engineering Spec 09: Storage & Media

**Status:** DRAFT / Pass 1

## 1. Purpose

Define media/object storage, upload, metadata, previews, transcription artifacts, derivation provenance and Smart Ingest boundaries.

## 2. Storage abstraction

### ENG-MEDIA-001 — StorageProvider

```text
put/getHead/delete? (controlled)
createUploadTarget
createDownloadUrl
copy/move where provider supports
```

Development: local filesystem allowed. Production: S3-compatible preferred.

Domain stores storage keys/provider-neutral object references, not public URLs as canonical identity.

## 3. Object key policy

Keys are opaque and collision-safe. User filenames stored as metadata. Never build authorization logic from path naming.

Suggested physical grouping may include artist/date prefixes for operations, but is not domain identity.

## 4. Asset availability lifecycle

```text
PENDING_UPLOAD
UPLOADED_UNVERIFIED
AVAILABLE
QUARANTINED
MISSING
ARCHIVED
```

This engineering availability state is distinct from product rights/content status.

## 5. Upload flow

1. create upload intent;
2. direct client-to-storage upload;
3. verify object size/checksum/type;
4. register canonical Asset metadata;
5. enqueue preview/transcription/analysis as applicable.

Failed verification never creates a silently usable Asset.

## 6. Metadata

Preserve raw observed metadata separately from normalized fields:

```text
original filename
MIME/container
byte size
checksum
creation/recorded timestamps
EXIF/device fields
duration
dimensions/orientation
codec/frame/audio metadata
```

Normalized `recordedAt` may apply configured device offset; raw timestamp remains preserved.

## 7. Device time offset

Per-device offset configuration is versioned/effective-dated. Recomputing normalized timestamps must not destroy original metadata or past ingest evidence.

## 8. Preview derivatives

Preview/thumbnail/waveform proxies are derived technical assets with explicit profile/version. They do not replace original media.

Examples:

```text
image thumbnail
video poster
low-res video proxy
audio waveform data
transcription preview
```

## 9. Derivation graph

**Architecture:** AssetDerivation is normative under MASTER v1.4 §188 (approved ACP-006).

Media edits/composites create AssetDerivation edges. Graph constraints:

```text
no cycles
child != parent
roles typed
all parents exist
archived parent lineage retained
```

Rights traversal follows publish-relevant parent edges.

## 10. Take/media relation

**Architecture:** Take/TakeAsset is normative under MASTER v1.4 §§166A–166B (approved ACP-005).

A Take may link multiple assets (multi-camera, external audio, still/photo) through TakeAsset roles. Asset registration can precede mapping; Smart Ingest suggests links.

## 11. Transcription

Canonical machine-readable transcript stores:

```text
sourceAssetId
provider/config version
language
detected language confidence?
segments {start,end,text,speaker?}
createdAt
```

A portable/exportable `TRANSCRIPT` Asset may also exist, but cannot become a conflicting source of truth.

Speech transcription is primary for speech. Singing alignment cannot rely solely on speech ASR.

## 12. Smart Ingest pipeline

Signals:

```text
recordedAt/creation timestamp
duration
orientation
device + offset
shoot window
shot schedule
transcript
audio similarity
visual similarity (when available)
```

Output is suggestion set:

```text
assetId
suggestedShotId?
suggestedTakeId?
confidence
signalsUsed[]
conflicts[]
```

Human can Accept / Change / Ignore. Low confidence is visible.

## 13. Duplicate detection

Use checksum for exact duplicate. Perceptual/audio similarity may suggest probable duplicate but cannot auto-delete source files.

## 14. Deletion/archive

### ENG-MEDIA-002 — Soft archive first
Canonical Asset records are archived before destructive object deletion where lineage/audit requires retention.

### ENG-MEDIA-003 — Destructive delete guard
Physical deletion is blocked if Asset is required by active publication, rights proof, lineage, audit/legal retention or immutable evidence policy unless explicit approved purge process handles consequences.

## 15. Rights proof objects

License/proof documents may be Assets with protected access. Public content delivery URLs must never expose private rights documents through predictable paths.

## 16. Object access

Private-by-default storage. Generate short-lived signed URLs for authenticated access. Public published media can use dedicated delivery/CDN configuration rather than making the whole bucket public.

## 17. Malware/type validation

Uploaded files are untrusted. Validate MIME/container and, where deployment risk warrants, malware scan documents/archives before server-side processing.

## 18. Processing isolation

Media parsers/transcoders run in worker context with resource/time limits. A malformed media file must not crash web runtime.

## 19. Retention classes

At minimum distinguish:

```text
ORIGINAL_MEDIA
DERIVED_MEDIA
TEMP_PROCESSING
DEBUG_AI
IMPORT_RAW
RIGHTS_PROOF
```

Retention policy is configurable and documented; temporary processing artifacts expire automatically.

## 20. Acceptance criteria

- originals and raw metadata are never overwritten by normalized convenience values;
- media upload can complete without AI;
- large binaries do not flow through normal app server request body in production design;
- Smart Ingest suggestions expose confidence;
- multi-parent provenance and Take mapping remain traceable;
- private rights proofs are access-controlled independently from publishable assets.
