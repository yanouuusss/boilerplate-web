import { expect, test } from '@playwright/test';

test("la page d'accueil se charge dans le layout", async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Boilerplate web');
});

test('les headers de sécurité sont présents', async ({ request }) => {
  const response = await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
});

test('la démo Alpine fonctionne (état local éphémère)', async ({ page }) => {
  await page.goto('/');
  const detail = page.getByText('État local éphémère');
  await expect(detail).toBeHidden();
  await page.getByRole('button', { name: 'Démo Alpine' }).click();
  await expect(detail).toBeVisible();
});
