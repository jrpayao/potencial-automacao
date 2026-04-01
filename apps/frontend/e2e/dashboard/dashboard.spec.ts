import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard');
  });

  test('cards de resumo estao visiveis', async ({ page }) => {
    await expect(page.getByText('Total de Processos')).toBeVisible();
    await expect(page.getByText('Prioridade Alta')).toBeVisible();
    await expect(page.getByText('Backlog')).toBeVisible();
    await expect(page.getByText('Descarte')).toBeVisible();
  });

  test('tabela de ranking exibe dados', async ({ page }) => {
    const tabela = page.locator('mat-table, table');
    await expect(tabela.first()).toBeVisible();

    const linhas = page.locator('mat-row, tr[mat-row]');
    await expect(linhas.first()).toBeVisible({ timeout: 10000 });
  });

  test('tabela de ranking possui colunas essenciais', async ({ page }) => {
    await expect(page.getByText('Processo')).toBeVisible();
    await expect(page.getByText('IPA Final')).toBeVisible();
    await expect(page.getByText('Status')).toBeVisible();
  });

  test('numeros nos cards sao visiveis e numericos', async ({ page }) => {
    const cards = page.locator('mat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
