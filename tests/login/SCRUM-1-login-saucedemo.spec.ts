// spec: SCRUM-1
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/login';

test.describe('SCRUM-1: Login en Saucedemo', () => {
  test('SCRUM-1: login con standard user y logout', async ({ page }) => {
    // Test: valida login del standard user y el posterior logout desde el menu lateral.
    // 1. Ingresar con el standard user y validar el acceso al inventario.
    await loginAs(page);

    // 2. Desloguear desde el menu de 3 lineas (menu hamburguesa, link Logout).
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // 3. Validar que vuelve a la pagina de login.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
