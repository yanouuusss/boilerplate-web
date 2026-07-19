// Schéma Drizzle — source de vérité unique du schéma de la base.
// Chaque table est ajoutée par une feature (process-dev) et versionnée par une migration drizzle-kit.
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
