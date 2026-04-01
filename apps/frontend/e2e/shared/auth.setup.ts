import { test as setup, expect } from '@playwright/test';
const authFile = 'e2e/.auth/user.json';
setup('autenticar como admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@ipa.gov.br');
  await page.getByLabel('Senha').fill('admin123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/.*admin\/dashboard/);
  await page.context().storageState({ path: authFile });
});
