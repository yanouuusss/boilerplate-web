import { describe, expect, it } from 'vitest';
import { noteIdSchema, noteInputSchema } from './schemas.js';

describe('noteInputSchema', () => {
  it('accepte un contenu de 1 à 500 caractères (après trim)', () => {
    expect(noteInputSchema.parse({ content: 'une note' }).content).toBe('une note');
    expect(noteInputSchema.parse({ content: '  entourée d’espaces  ' }).content).toBe(
      'entourée d’espaces',
    );
    expect(noteInputSchema.parse({ content: 'a'.repeat(500) }).content).toHaveLength(500);
  });

  it('rejette un contenu vide ou blanc', () => {
    expect(noteInputSchema.safeParse({ content: '' }).success).toBe(false);
    expect(noteInputSchema.safeParse({ content: '   ' }).success).toBe(false);
    expect(noteInputSchema.safeParse({}).success).toBe(false);
  });

  it('rejette un contenu de plus de 500 caractères', () => {
    expect(noteInputSchema.safeParse({ content: 'a'.repeat(501) }).success).toBe(false);
  });
});

describe('noteIdSchema', () => {
  it('accepte un UUID valide', () => {
    const id = '3f2b8c9e-1a4d-4e6f-9b2a-7c5d8e0f1a2b';
    expect(noteIdSchema.parse({ id }).id).toBe(id);
  });

  it('rejette un id mal formé', () => {
    expect(noteIdSchema.safeParse({ id: '42' }).success).toBe(false);
    expect(noteIdSchema.safeParse({ id: 'pas-un-uuid' }).success).toBe(false);
    expect(noteIdSchema.safeParse({}).success).toBe(false);
  });
});
