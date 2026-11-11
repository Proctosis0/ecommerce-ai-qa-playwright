// spec: SCRUM-1
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SCRUM-1: Login en Saucedemo', () => {
  test('SCRUM-1: login con standard user y logout', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // 1. Ingresar con el standard user (standard_user) en el campo User.
    await page.locator('[data-test="username"]').fill('standard_user');

    // 2. Ingresar la password del standard user (secret_sauce) en el campo Password.
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 3. Hacer click en Login.
    await page.locator('[data-test="login-button"]').click();

    // 4. Validar que la URL sea /inventory.html al ingresar.
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // 5. Desloguear desde el menu de 3 lineas (menu hamburguesa, link Logout).
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // 6. Validar que vuelve a la pagina de login.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
