const { test, expect } = require('@playwright/test');
const { loginAs } = require('../helpers/login');

const PRODUCTO = 'Sauce Labs Backpack';

test.describe('Seleccion de producto en Saucedemo', () => {
  test('Ver detalle de Sauce Labs Backpack, validar precio y agregarlo al carrito', async ({ page }) => {
    // Test: valida login, apertura del detalle de Sauce Labs Backpack, precio $29.99 y contador del carrito en 1.
    // 1. Login con el standard user y verificacion de acceso al inventario.
    await loginAs(page);

    // 2. Abrir el detalle del producto haciendo clic sobre su nombre.
    const tarjetaProducto = page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: PRODUCTO });
    await tarjetaProducto.locator('[data-test="inventory-item-name"]').click();

    // 3. Esperar la pagina de detalle del producto.
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(PRODUCTO);

    // 4. Extraer el precio desde la pagina de detalle y validarlo.
    const precio = await page.locator('[data-test="inventory-item-price"]').textContent();
    expect(precio?.trim()).toBe('$29.99');

    // 5. Agregar el producto al carrito.
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // 6. Validar que el producto se agrego y el contador muestra 1.
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    const contadorCarrito = page.locator('[data-test="shopping-cart-badge"]');
    await expect(contadorCarrito).toBeVisible();
    await expect(contadorCarrito).toHaveText('1');
  });
});
