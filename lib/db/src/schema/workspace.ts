import { boolean, index, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './auth';

// Per-user saved tools — fully isolated by userId
export const savedToolsTable = pgTable(
  'saved_tools',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    toolUrl: varchar('tool_url', { length: 2048 }).notNull(),
    toolName: varchar('tool_name', { length: 512 }).notNull(),
    categoryId: varchar('category_id', { length: 64 }).notNull(),
    categoryLabel: varchar('category_label', { length: 256 }).notNull(),
    savedAt: timestamp('saved_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [
    uniqueIndex('saved_tools_user_url_idx').on(table.userId, table.toolUrl),
    index('saved_tools_user_idx').on(table.userId),
  ],
);

// Per-user search history — fully isolated by userId
export const searchHistoryTable = pgTable(
  'search_history',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    query: text('query').notNull(),
    resultCount: integer('result_count').notNull().default(0),
    aiPowered: boolean('ai_powered').notNull().default(false),
    searchedAt: timestamp('searched_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [index('search_history_user_idx').on(table.userId)],
);

export type SavedTool = typeof savedToolsTable.$inferSelect;
export type InsertSavedTool = typeof savedToolsTable.$inferInsert;
export type SearchHistory = typeof searchHistoryTable.$inferSelect;
export type InsertSearchHistory = typeof searchHistoryTable.$inferInsert;
