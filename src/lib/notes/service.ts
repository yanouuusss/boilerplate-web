import { desc, eq } from 'drizzle-orm';
import type { Database } from '../../db/client.js';
import { notes } from '../../db/schema.js';

type Db = Database['db'];

export type Note = typeof notes.$inferSelect;

export function listNotes(db: Db): Promise<Note[]> {
  return db.select().from(notes).orderBy(desc(notes.createdAt));
}

export async function createNote(db: Db, content: string): Promise<Note> {
  const [note] = await db.insert(notes).values({ content }).returning();
  return note!;
}

/** Retourne true si la note existait et a été supprimée. */
export async function deleteNote(db: Db, id: string): Promise<boolean> {
  const deleted = await db.delete(notes).where(eq(notes.id, id)).returning({ id: notes.id });
  return deleted.length > 0;
}
