/**
 * Session cleanup — deletes expired rows from the `sessions` table.
 *
 * Why a setInterval here instead of pg_cron or a DB-side job:
 *   - This project does not enable pg_cron on the Replit Postgres instance.
 *   - The server is always running, so an in-process interval is reliable.
 *   - The `IDX_session_expire` index on `sessions.expire` makes the DELETE fast
 *     even as the table grows, so running every hour has negligible DB impact.
 *
 * Safety properties:
 *   - Only rows where expire < NOW() are deleted — active sessions are safe.
 *   - The job catches its own errors so it never crashes the server.
 *   - The first run is delayed 60 s after startup to avoid competing with the
 *     initial request burst (startup auth checks, session reads).
 */

import { db, sessionsTable } from "@workspace/db";
import { lt } from "drizzle-orm";
import { logger } from "./logger";

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // every hour
const STARTUP_DELAY_MS = 60 * 1000;          // wait 60 s after boot

async function deleteExpiredSessions(): Promise<void> {
  const now = new Date();
  const deleted = await db
    .delete(sessionsTable)
    .where(lt(sessionsTable.expire, now))
    .returning({ sid: sessionsTable.sid });

  if (deleted.length > 0) {
    logger.info({ count: deleted.length }, "session-cleanup: deleted expired sessions");
  } else {
    logger.debug("session-cleanup: no expired sessions to delete");
  }
}

/** Start the periodic cleanup. Safe to call once at server startup. */
export function startSessionCleanup(): void {
  // First run after a short delay so startup traffic settles first.
  const initialTimer = setTimeout(() => {
    deleteExpiredSessions().catch((err) =>
      logger.error({ err }, "session-cleanup: initial run failed"),
    );

    // Then repeat on the regular interval.
    const interval = setInterval(() => {
      deleteExpiredSessions().catch((err) =>
        logger.error({ err }, "session-cleanup: periodic run failed"),
      );
    }, CLEANUP_INTERVAL_MS);

    // Allow the process to exit cleanly even if the interval is pending.
    interval.unref();
  }, STARTUP_DELAY_MS);

  initialTimer.unref();

  logger.info(
    { intervalMs: CLEANUP_INTERVAL_MS, startupDelayMs: STARTUP_DELAY_MS },
    "session-cleanup: scheduled",
  );
}
