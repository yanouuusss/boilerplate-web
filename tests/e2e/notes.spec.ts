import { expect, test } from '@playwright/test';

test('ajouter puis supprimer une note, sans rechargement de page', async ({ page }) => {
  await page.goto('/notes');
  const content = `note e2e ${Date.now()}`;

  await page.getByPlaceholder('Nouvelle note').fill(content);
  await page.getByRole('button', { name: 'Ajouter' }).click();

  const item = page.locator('li', { hasText: content });
  await expect(item).toBeVisible();

  await item.getByRole('button', { name: 'Supprimer' }).click();
  await expect(item).toBeHidden();
});
