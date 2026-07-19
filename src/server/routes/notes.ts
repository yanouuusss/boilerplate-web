import type { FastifyInstance } from 'fastify';
import type { Database } from '../../db/client.js';
import { noteIdSchema, noteInputSchema } from '../../lib/notes/schemas.js';
import { createNote, deleteNote, listNotes } from '../../lib/notes/service.js';

const INVALID_CONTENT_MESSAGE = 'Le contenu doit faire entre 1 et 500 caractères.';

export function registerNotesRoutes(app: FastifyInstance, db: Database['db']): void {
  app.get('/notes', async (_request, reply) => {
    return reply.view('pages/notes', { title: 'Notes', notes: await listNotes(db) });
  });

  app.post('/notes', async (request, reply) => {
    const parsed = noteInputSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).view('partials/notes-zone', {
        notes: await listNotes(db),
        error: INVALID_CONTENT_MESSAGE,
      });
    }
    await createNote(db, parsed.data.content);
    return reply.view('partials/notes-zone', { notes: await listNotes(db) });
  });

  app.delete('/notes/:id', async (request, reply) => {
    const parsed = noteIdSchema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Identifiant invalide.' });
    }
    const removed = await deleteNote(db, parsed.data.id);
    if (!removed) {
      return reply.code(404).send({ error: 'Note introuvable.' });
    }
    return reply.view('partials/notes-zone', { notes: await listNotes(db) });
  });
}
