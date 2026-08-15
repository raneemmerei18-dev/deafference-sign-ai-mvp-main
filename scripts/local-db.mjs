// Manages a persistent local Postgres instance for development, used when
// the Supabase DATABASE_URL in .env is unreachable. The server keeps running
// in the background after this script's `start` command (same as a normal
// `pg_ctl start`) — see the note above `await new Promise(() => {})` below.
//
// Usage: node scripts/local-db.mjs start|stop
import EmbeddedPostgres from "embedded-postgres"
import path from "node:path"
import fs from "node:fs"

// Deliberately NOT under the project (which lives in Desktop, likely
// OneDrive-synced) — Postgres's data dir does thousands of small file
// writes, and OneDrive's real-time sync over that made initdb pathologically
// slow in practice. A plain path under the user's home dir avoids it.
const DATA_DIR = path.join("C:\\Users\\dell\\.deafference-localdb", "pgdata")
const PORT = 5433
const USER = "postgres"
const PASSWORD = "localdev"
export const LOCAL_DATABASE_URL = `postgresql://${USER}:${PASSWORD}@127.0.0.1:${PORT}/postgres`

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: USER,
  password: PASSWORD,
  port: PORT,
  persistent: true,
})

const command = process.argv[2]

if (command === "start") {
  const isFirstRun = !fs.existsSync(DATA_DIR)
  if (isFirstRun) {
    console.log("Initializing local Postgres data directory...")
    await pg.initialise()
  }
  await pg.start()
  console.log(`Local Postgres is running at ${LOCAL_DATABASE_URL}`)
  console.log("Keeping this process alive so the server stays healthy — leave it running; Ctrl+C (or SIGTERM) stops it cleanly.")
  // On this host, the spawned postgres process only stays healthy while its
  // parent Node process is alive — exiting right after start() leaves it
  // listening but unable to complete handshakes. So this process runs
  // forever instead of exiting; stop it via SIGINT/SIGTERM (or `npm run db:stop`
  // from a separate terminal, which connects and issues its own shutdown).
  async function shutdown() {
    console.log("\nStopping local Postgres...")
    await pg.stop()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
  await new Promise(() => {})
} else if (command === "stop") {
  await pg.stop()
  console.log("Local Postgres stopped.")
  process.exit(0)
} else {
  console.log("Usage: node scripts/local-db.mjs start|stop")
  process.exit(1)
}
