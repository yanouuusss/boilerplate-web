import { z } from 'zod';

/** Corps du POST /notes — contenu limité à 500 caractères après trim. */
export const noteInputSchema = z.object({
  content: z.string().trim().min(1).max(500),
});

/** Paramètre d'URL du DELETE /notes/:id. */
export const noteIdSchema = z.object({
  id: z.uuid(),
});

export type NoteInput = z.infer<typeof noteInputSchema>;
