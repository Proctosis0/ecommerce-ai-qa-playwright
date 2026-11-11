import { test, expect } from '../fixtures';
import { productos, urls } from '../../data/test-data';

const { backpack } = productos;

test.describe('Carrito en Saucedemo', () => {
  test('Agregar Sauce Labs Backpack y verificar nombre, precio y cantidad en el carrito', async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto(); // sesion reutilizada (storageState)

    await expect(productsPage.productCard(backpack.nombre), 'La tarjeta del producto debe estar visible').toBeVisible();
    await expect(productsPage.productName(backpack.nombre), 'El nombre del producto debe coincidir').toHaveText(
      backpack.nombre,
    );
    await expect(productsPage.productPrice(backpack.nombre), 'El precio en el listado debe ser $29.99').toHaveText(
      backpack.precioTexto,
    );

    await productsPage.addToCart(backpack.nombre);
    await productsPage.openCart();

    await expect(page, 'Debe acceder a cart.html').toHaveURL((url) => url.pathname === urls.cart);
    await expect(cartPage.list, 'El listado del carrito debe estar visible').toBeVisible();
    await expect(cartPage.items, 'Debe existir exactamente un producto en el carrito').toHaveCount(1);
    await expect(cartPage.itemName(backpack.nombre), 'El producto debe estar en el carrito').toHaveText(
      backpack.nombre,
    );
    await expect(cartPage.itemPrice(backpack.nombre), 'El precio en el carrito debe ser $29.99').toHaveText(
      backpack.precioTexto,
    );
  });
});
