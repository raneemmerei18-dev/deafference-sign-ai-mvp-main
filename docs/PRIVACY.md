# Privacy & Compliance Sign-Off — Anonymous Device Identity (BE-9)

**Status: GO**
**Scope:** `deafference_user_id` (frontend UUID, [`lib/identity.ts`](../lib/identity.ts)) and the demo `User`/`CameraPermission` rows it's paired with ([`prisma/schema.prisma`](../prisma/schema.prisma)).
**Reviewed:** 2026-07-22

## Decision

**GO.** Capturing camera-permission status (`granted` / `denied` / `prompted`), attached to an anonymously generated device UUID, is approved for production use. This is standard telemetry/UX-state tracking, not identity or biometric collection, and does not require a consent flow beyond the browser's own camera permission prompt.

## What is actually collected

Verified directly against the current schema and code paths — this is not a policy aspiration, it's what the code does today:

| Data | Where | Notes |
|---|---|---|
| `deafference_user_id` | Browser `localStorage` only | Random UUID (`crypto.randomUUID()`), never tied to a name, email used for login, or any other real-world identifier. |
| `User` row (`id`, `email`, `name`) | Postgres, via `POST /api/users` | The `email` here is a synthetic placeholder (`anon-<uuid>@deafference.local`), generated client-side — not a real address, never used to contact anyone. This is scaffolding standing in for real auth, per [`docs/IDENTITY.md`](./IDENTITY.md); it is not additional PII collection. |
| `CameraPermission.status` | Postgres, one row per `User.id` | An enum: `granted`, `denied`, or `prompted`. Nothing else. |
| Camera video stream | Never leaves the browser | `getUserMedia()` output ([`components/deafference/camera-view.tsx`](../components/deafference/camera-view.tsx)) is attached directly to a local `<video>` element and never uploaded, recorded, or sent to the backend. No frames, images, or video are transmitted or persisted anywhere. |

**What is explicitly NOT collected:** no video/image frames, no facial landmarks or biometric templates, no device fingerprinting beyond the app-generated UUID, no IP-to-identity linkage, no real name/email/phone/address.

## Why this is justified

- **No PII, no biometrics.** The only thing persisted per device is a UI-state enum (whether the camera was allowed) — functionally identical to a "theme: dark" preference in terms of sensitivity. It carries no information about the user's identity, appearance, or speech content.
- **Standard practice.** Persisting a device-scoped, anonymous UUID to avoid asking the same permission question on every page load is common UX practice (comparable to a cookie consent choice or a "don't show this again" flag) and does not itself trigger biometric-data obligations.
- **Purpose-limited.** The UUID and permission status exist solely so the UI can restore "you already denied/granted the camera" state on return visits and so we can monitor permission-flow reliability (e.g. an unexpected spike in `denied` rates indicating a UX or browser-compat regression) — not for tracking, profiling, or advertising.
- **No login friction for guest users**, per the identity strategy in [`docs/IDENTITY.md`](./IDENTITY.md).

## Alignment with landing page privacy messaging (Frontend #34)

At the time of this review, the landing page (`components/landing/landing-page.tsx` and related sections) does not yet contain explicit privacy copy — Frontend #34 had not shipped user-facing text to check this document against. This document is written to be the **source of truth** for that copy: any privacy statement Frontend #34 publishes must not contradict the facts recorded above (no video/biometric data collected; only an anonymous device UUID and a permission-status enum are stored). Whoever implements Frontend #34 should link back to this file rather than re-deriving the claims independently.

## Data retention & logging policy

- **Retention:** `CameraPermission` rows are retained indefinitely while the associated demo `User` row exists — there is no automatic expiry today. Because the data is a single non-sensitive enum keyed to an anonymous UUID (not a real identity), indefinite retention carries materially lower risk than it would for PII, but a TTL/cleanup job (e.g. purge `User` rows with no activity for N months) is a reasonable future hardening step, not a blocker for this sign-off.
- **No video/biometric retention, ever.** This is a hard architectural constraint, not a policy promise: the video stream never reaches the backend, so there is no code path capable of persisting it even accidentally. Any future feature that sends frames/landmarks to the backend (e.g. real hand-tracking inference) requires a new privacy review before shipping — this GO decision does **not** extend to that.
- **Logging:** Server logs (`server/index.ts` request logger, console output) record HTTP method + path only. The `X-User-Id` header (BE-7) and gloss/sentence payloads (BE-10) are not written to any log sink today; if structured logging is added later, `X-User-Id` and `CameraPermission.status` may be included (they're not sensitive), but request bodies containing user-generated sentence content should be excluded or redacted by default.
- **Deletion:** Since the UUID lives in `localStorage`, a user can unilaterally reset their own identity at any time by clearing site data — there is no account to "delete" beyond that. A manual `DELETE /api/users/:id` cascade (via Prisma's `onDelete: Cascade` on `CameraPermission`) is available for support-driven removal requests if ever needed.

## Follow-ups (not required for this GO)

- Add a retention TTL / cleanup job for stale anonymous `User` rows.
- Once Frontend #34 ships real privacy copy, cross-check it against this document and update whichever is out of date.
- If a future feature transmits video frames, hand landmarks, or any biometric derivative to the backend, this document must be revisited before that ships — the GO above is scoped strictly to permission-status + UUID.
