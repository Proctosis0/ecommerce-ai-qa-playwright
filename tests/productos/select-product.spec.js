const { test, expect } = require('@playwright/test');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const testData = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/test-data.json'), 'utf-8'),
);

const { username, password } = testData.usuarios.standard;

test.describe('Seleccion de producto en Saucedemo', () => {
  test('Ver detalle de Sauce Labs Backpack, validar precio y agregarlo al carrito', async ({ page }) => {
    // Test: valida login, apertura del detalle de Sauce Labs Backpack, precio $29.99 y contador del carrito en 1.
    // 1. Login con las credenciales de data/test-data.json.
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Login exitoso y acceso al inventario.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();

    // 3. Abrir el detalle del producto haciendo clic sobre su nombre.
    const tarjetaProducto = page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: 'Sauce Labs Backpack' });
    await tarjetaProducto.locator('[data-test="inventory-item-name"]').click();

    // 4. Esperar la pagina de detalle del producto.
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

    // 5. Extraer el precio desde la pagina de detalle y validarlo.
    const precio = await page.locator('[data-test="inventory-item-price"]').textContent();
    expect(precio?.trim()).toBe('$29.99');

    // 6. Agregar el producto al carrito.
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // 7. Validar que el producto se agrego y el contador muestra 1.
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    const contadorCarrito = page.locator('[data-test="shopping-cart-badge"]');
    await expect(contadorCarrito).toBeVisible();
    await expect(contadorCarrito).toHaveText('1');
  });
});
