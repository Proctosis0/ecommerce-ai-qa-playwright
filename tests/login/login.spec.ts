import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Credenciales {
  username: string;
  password: string;
}

interface TestData {
  usuarios: {
    standard: Credenciales;
    locked: Credenciales;
  };
}

const testData: TestData = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/test-data.json'), 'utf-8'),
);

const { username, password } = testData.usuarios.standard;

test.describe('Login en Saucedemo', () => {
  test('Login exitoso con standard_user y acceso al inventario', async ({ page }) => {
    // 1. Abrir la pagina de login (baseURL configurado en playwright.config.ts).
    await page.goto('/');

    // 2. Completar credenciales provenientes de data/test-data.json.
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);

    // 3. Iniciar sesion.
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Validar que el login fue exitoso por la URL del inventario.
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // 5. Validar que el listado de productos se muestra en pantalla.
    const listaProductos = page.locator('[data-test="inventory-list"]');
    await expect(listaProductos).toBeVisible();

    // 6. Validar que existen productos dentro del listado.
    const productos = listaProductos.locator('[data-test="inventory-item"]');
    await expect(productos.first()).toBeVisible();
    expect(await productos.count()).toBeGreaterThan(0);
  });
});
