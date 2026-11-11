import { test, expect } from '@playwright/test';

const MENSAJE_BLOQUEO = 'Epic sadface: Sorry, this user has been locked out.';

test.describe('Login de usuario bloqueado', () => {
  test('locked_out_user no puede iniciar sesion y ve el mensaje de bloqueo', async ({ page }) => {
    // Test: valida que locked_out_user es rechazado y ve el mensaje de bloqueo sin acceder al inventario.
    // 1. Credenciales exclusivamente desde .env (cargado en playwright.config.ts).
    const usuario = process.env.LOCKED_USER;
    const password = process.env.LOCKED_PASSWORD;

    if (!usuario || !password) {
      throw new Error('Faltan LOCKED_USER y/o LOCKED_PASSWORD en el archivo .env');
    }

    // 2. Abrir la pagina de login (baseURL configurado en playwright.config.ts).
    await page.goto('/');

    // 3. Completar credenciales del usuario bloqueado.
    await page.getByPlaceholder('Username').fill(usuario);
    await page.getByPlaceholder('Password').fill(password);

    // 4. Intentar iniciar sesion. SauceDemo valida en el cliente (sin peticion de red),
    //    por lo que la respuesta de la aplicacion es el alert de error: lo esperamos.
    await page.getByRole('button', { name: 'Login' }).click();

    const mensajeError = page.locator('[data-test="error"]');
    await mensajeError.waitFor({ state: 'visible' });

    // 5. Validar que el mensaje de error se muestra y describe el bloqueo.
    await expect(mensajeError).toBeVisible();
    await expect(mensajeError).toContainText(MENSAJE_BLOQUEO);
    await expect(mensajeError).toContainText(/locked out/i);

    // 6. Validar que permanece en la pagina de login y no accede al inventario.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).not.toHaveURL(/\/inventory\.html$/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-list"]')).toHaveCount(0);
  });
});
