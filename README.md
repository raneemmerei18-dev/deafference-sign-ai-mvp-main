# Deafference: Speech-to-Sign MVP

Deafference is a modern, responsive web application MVP designed to bridge the communication gap between hearing individuals and the Deaf/Hard-of-Hearing (DHH) community. The application translates spoken speech or typed text into simplified, high-confidence sign language phrases with interactive visual support.

> **Status:** the previous frontend UI has been removed; a new frontend is
> being rebuilt in this repo. Only the backend pieces below are currently
> present.

---

## 📁 Project Structure

```text
├── app/api/              # Next.js route handlers: auth, account, admin users
├── lib/
│   ├── auth/             # Sessions (JWT via jose), cookies, passwords, admin guard
│   ├── prisma.ts         # Shared Prisma client
│   └── validation.ts     # Zod request schemas
├── middleware.ts         # Gates /api/admin/* (401 guest, 403 non-admin)
├── server/               # Express API (users, camera permission, sentences)
├── prisma/               # Schema and migrations
├── scripts/              # Local Postgres helpers (npm run db:start / db:stop)
└── docs/                 # Identity strategy and privacy sign-off
```

The new frontend goes in `app/` alongside `app/api/`. Before building it, read
[`docs/IDENTITY.md`](docs/IDENTITY.md) for the anonymous device-UUID strategy
(sent as an `X-User-Id` header, which the Express API's CORS config allows)
and [`docs/PRIVACY.md`](docs/PRIVACY.md) for what it's approved to collect.

---

## ⚙️ Setup

Requires [Node.js](https://nodejs.org/) v18+.

```bash
npm install
cp .env.example .env
npm run db:start          # optional: local embedded Postgres
npx prisma migrate dev
```

- **Next.js route handlers (`app/api/*`):** port **3000** (`npm run dev`)
- **Express API (`server/`):** port **4000** (`npm run server:dev`)

They use different ports so both can run at the same time.

---

## 🔌 Express API

### Database setup

1. Copy the environment template and adjust the connection string for your
   local Postgres:
   ```bash
   cp .env.example .env
   # then edit DATABASE_URL in .env if your Postgres user/password/db differ
   ```
   `.env.example` documents the format:
   `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`.

2. Create the tables and generate the Prisma client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
   This creates the `User` and `CameraPermission` tables.

3. Start the API:
   ```bash
   npm run server:dev
   ```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/health` | Liveness check |
| `POST` | `/api/users` | Create a user (`email` required, `name` optional) → **201** |
| `POST` | `/api/users/camera-permission` | Create **or** update a user's camera permission (upsert) → **200** |
| `GET`  | `/api/users/camera-permission/:userId` | Read a user's camera permission |

`CameraPermission.userId` is a foreign key to `User.id` (both integers), so a
user must exist before a permission can be set.

### Full flow: zero → create user → set camera permission → read it back

```bash
API=http://localhost:4000

# 1. Create a user and capture the generated integer id
USER_ID=$(curl -s -X POST "$API/api/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice"}' \
  | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

# 2. Set that user's camera permission
curl -X POST "$API/api/users/camera-permission" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":$USER_ID,\"status\":\"granted\"}"

# 3. Read the permission back
curl "$API/api/users/camera-permission/$USER_ID"
```

See [`CURL_EXAMPLES.md`](CURL_EXAMPLES.md) for every endpoint and error case,
and run [`test-api.sh`](test-api.sh) to exercise the whole suite end-to-end.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is private and proprietary. All rights reserved.
