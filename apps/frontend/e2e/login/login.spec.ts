import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login valido redireciona para dashboard', async ({ page }) => {
    await page.getByLabel('Email').fill('admin@ipa.gov.br');
    await page.getByLabel('Senha').fill('admin123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('login invalido exibe mensagem de erro', async ({ page }) => {
    await page.getByLabel('Email').fill('usuario@invalido.com');
    await page.getByLabel('Senha').fill('senhaErrada');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/.*login/);
    const erro = page.locator('mat-error, .erro-login, [role="alert"]');
    await expect(erro.first()).toBeVisible();
  });

  test('campos obrigatorios exibem erro de validacao', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click();

    const erros = page.locator('mat-error');
    await expect(erros.first()).toBeVisible();
  });
});
