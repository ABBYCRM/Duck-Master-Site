import { index, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

// Persistent rate-limit counters — survive server restarts.
// One row per (limiter-name + client-key). Rows expire naturally;
// a periodic sweep or on-read check handles stale entries.
export const rateLimitsTable = pgTable(
  'rate_limits',
  {
    // Composite key encoded as "<limiter>:<client-key>", e.g. "search:u:abc123"
    key: varchar('key', { length: 512 }).primaryKey(),
    count: integer('count').notNull().default(1),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [index('rate_limits_expires_idx').on(table.expiresAt)],
);

export type RateLimit = typeof rateLimitsTable.$inferSelect;
