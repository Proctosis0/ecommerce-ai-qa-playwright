// spec: SCRUM-5
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';
import { productos, urls } from '../../data/test-data';

const { backpack, bikeLight } = productos;
const BOTON_AGREGAR = 'Add to cart';
const BOTON_QUITAR = 'Remove';

test.describe('SCRUM-5: Agregar y quitar productos del carrito', () => {
  test('agrega dos productos, valida el contador y los quita desde carrito y productos', async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await test.step('Ingresar con el standard user (sesion reutilizada)', async () => {
      await productsPage.goto(); // sesion reutilizada (storageState)
      await expect(page, 'Debe acceder al inventario tras el login').toHaveURL((url) => url.pathname === urls.inventory);
    });

    await test.step(`Agregar ${backpack.nombre} y ${bikeLight.nombre} al carrito`, async () => {
      await productsPage.addToCart(backpack.nombre);
      await productsPage.addToCart(bikeLight.nombre);
    });

    await test.step('Validar que el contador del carrito muestre 2', async () => {
      await expect(productsPage.cartBadge, 'El contador del carrito debe mostrar 2').toHaveText('2');
    });

    await test.step('Validar que el boton de ambos productos cambie a Remove', async () => {
      await expect(productsPage.productButton(backpack.nombre), `El boton de ${backpack.nombre} debe decir Remove`).toHaveText(
        BOTON_QUITAR,
      );
      await expect(productsPage.productButton(bikeLight.nombre), `El boton de ${bikeLight.nombre} debe decir Remove`).toHaveText(
        BOTON_QUITAR,
      );
    });

    await test.step('Ir al carrito y validar los 2 productos con sus precios', async () => {
      await productsPage.openCart();
      await expect(page, 'Debe acceder a cart.html').toHaveURL((url) => url.pathname === urls.cart);
      await expect(cartPage.items, 'El carrito debe contener 2 productos').toHaveCount(2);
      await expect(cartPage.itemName(backpack.nombre), 'El carrito debe incluir Sauce Labs Backpack').toHaveText(
        backpack.nombre,
      );
      await expect(cartPage.itemPrice(backpack.nombre), 'El precio del Backpack debe ser $29.99').toHaveText(
        backpack.precioTexto,
      );
      await expect(cartPage.itemName(bikeLight.nombre), 'El carrito debe incluir Sauce Labs Bike Light').toHaveText(
        bikeLight.nombre,
      );
      await expect(cartPage.itemPrice(bikeLight.nombre), 'El precio del Bike Light debe ser $9.99').toHaveText(
        bikeLight.precioTexto,
      );
    });

    await test.step('Quitar Sauce Labs Bike Light del carrito', async () => {
      await cartPage.removeItem(bikeLight.nombre);
    });

    await test.step('Validar que quede solo Sauce Labs Backpack y el contador muestre 1', async () => {
      await expect(cartPage.items, 'El carrito debe contener un solo producto').toHaveCount(1);
      await expect(cartPage.itemName(backpack.nombre), 'El unico producto debe ser Sauce Labs Backpack').toHaveText(
        backpack.nombre,
      );
      await expect(
        cartPage.items.filter({ hasText: bikeLight.nombre }),
        'Sauce Labs Bike Light ya no debe estar en el carrito',
      ).toHaveCount(0);
      await expect(cartPage.cartBadge, 'El contador del carrito debe mostrar 1').toHaveText('1');
    });

    await test.step('Volver a productos con Continue Shopping y quitar Sauce Labs Backpack', async () => {
      await cartPage.continueShopping();
      await expect(page, 'Continue Shopping debe volver al inventario').toHaveURL((url) => url.pathname === urls.inventory);
      await productsPage.removeFromCart(backpack.nombre);
    });

    await test.step('Validar que el contador desaparezca y el boton vuelva a Add to cart', async () => {
      await expect(productsPage.cartBadge, 'El contador del carrito no debe mostrarse con el carrito vacio').toHaveCount(0);
      await expect(
        productsPage.productButton(backpack.nombre),
        `El boton de ${backpack.nombre} debe volver a Add to cart`,
      ).toHaveText(BOTON_AGREGAR);
      await expect(
        productsPage.productButton(bikeLight.nombre),
        `El boton de ${bikeLight.nombre} debe volver a Add to cart`,
      ).toHaveText(BOTON_AGREGAR);
    });
  });
});
