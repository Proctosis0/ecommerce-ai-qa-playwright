import { test, expect } from '../fixtures';
import { productos, usuarios } from '../../data/test-data';

const { backpack } = productos;

test.describe('Seleccion de producto en Saucedemo', () => {
  test('Ver detalle de Sauce Labs Backpack, validar precio y agregarlo al carrito', async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.loginAs(usuarios.standard);

    await productsPage.openProduct(backpack.nombre);

    await expect(page, 'Debe acceder al detalle del producto').toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(
      page.getByRole('button', { name: 'Back to products' }),
      'El boton de volver al listado debe estar visible',
    ).toBeVisible();
    await expect(productsPage.detailName, 'El detalle debe mostrar el nombre del producto').toHaveText(backpack.nombre);
    await expect(productsPage.detailPrice, 'El detalle debe mostrar el precio $29.99').toHaveText(backpack.precioTexto);

    await page.getByRole('button', { name: 'Add to cart' }).click();

    await expect(
      page.getByRole('button', { name: 'Remove' }),
      'El boton debe cambiar a Remove tras agregar el producto',
    ).toBeVisible();
    await expect(productsPage.cartBadge, 'El contador del carrito debe mostrar 1').toHaveText('1');
  });
});
