const { test, expect } = require('@playwright/test');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const testData = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/test-data.json'), 'utf-8'),
);

const { username, password } = testData.usuarios.standard;

const PRODUCTO = 'Sauce Labs Bike Light';
const PRECIO_ESPERADO = '$9.99';

test.describe('Carrito en Saucedemo', () => {
  test('Agregar Sauce Labs Bike Light y verificar nombre, precio y cantidad en el carrito', async ({ page }) => {
    // Test: valida que Sauce Labs Bike Light se agrega al carrito y su nombre, precio $9.99 y cantidad 1 se ven en cart.html.
    // 1. Login con las credenciales de data/test-data.json.
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Login exitoso: acceso al inventario.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();

    // 3. Localizar el contenedor exacto del producto en el inventario.
    const productoEnInventario = page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: PRODUCTO });
    await expect(productoEnInventario).toBeVisible();
    await expect(productoEnInventario.locator('[data-test="inventory-item-name"]')).toHaveText(PRODUCTO);

    // 4. Verificar el precio en el inventario y agregar ese producto (solo ese) al carrito.
    await expect(productoEnInventario.locator('[data-test="inventory-item-price"]')).toHaveText(PRECIO_ESPERADO);
    await productoEnInventario.getByRole('button', { name: 'Add to cart' }).click();

    // 5. Navegar al carrito.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);

    // 6. Esperar el listado del carrito (evita leer el DOM del inventario durante la transicion).
    const listaCarrito = page.locator('[data-test="cart-list"]');
    await expect(listaCarrito).toBeVisible();

    // 7. Verificar el producto dentro del carrito.
    const productoEnCarrito = listaCarrito.locator('[data-test="inventory-item"]');
    await expect(productoEnCarrito).toHaveCount(1);
    await expect(productoEnCarrito.locator('[data-test="inventory-item-name"]')).toHaveText(PRODUCTO);

    // 8. Verificar el precio leido desde cart.html (no el del inventario).
    await expect(productoEnCarrito.locator('[data-test="inventory-item-price"]')).toHaveText(PRECIO_ESPERADO);
  });
});
