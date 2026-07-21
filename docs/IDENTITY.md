# Identity Strategy (BE-7)

Identity is tracked via a persistent, anonymously generated UUID stored in
browser `localStorage` (`deafference_user_id`). This avoids friction for
guest users while enabling backend tracking for camera permissions and
preferences per device. Can easily be mapped to a real account auth token
in future releases.

## Implementation

- `lib/identity.ts` exports `getOrCreateUserId()`, which reads
  `localStorage["deafference_user_id"]` and, on first use for a given
  browser, generates one with `crypto.randomUUID()` and persists it.
- Every outgoing request from `lib/camera-permission-service.ts` attaches
  this id via the `X-User-Id` header (see `withIdentityHeaders`). The
  Express CORS config (`server/index.ts`, BE-8) explicitly allowlists
  `X-User-Id` so the preflight for it succeeds.

## Relationship to the existing numeric `User.id`

`CameraPermission` rows are still keyed off the numeric, autoincrement
`User.id` from `POST /api/users` (see `lib/camera-permission-service.ts`'s
`getOrCreateDemoUserId`), not the UUID above — changing that join key
would mean a Prisma schema migration, which is out of scope here so the
existing camera-permission flow keeps working unmodified.

The `X-User-Id` header is the intended long-term identity: a future
change can add a `User.deviceId` column, have the backend read
`X-User-Id` instead of minting an anonymous email/user row, and retire
`getOrCreateDemoUserId` — at that point `deafference_user_id` becomes the
real join key, with a real auth token able to supersede it later without
changing any call sites.
