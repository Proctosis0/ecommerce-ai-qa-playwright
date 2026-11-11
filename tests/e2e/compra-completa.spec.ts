import { test, expect } from '../fixtures';
import { productos, urls, usuarios } from '../../data/test-data';
import { getPrecio } from '../api/productoApi';

const { backpack } = productos;

test.describe('Compra completa en Saucedemo', () => {
  test('Flujo E2E: login, producto, carrito, precio por API y logout', async ({
    page,
    request,
    loginPage,
    productsPage,
    cartPage,
  }) => {
    await test.step('Login con standard_user', async () => {
      await loginPage.loginAs(usuarios.standard);
      await expect(page, 'Debe acceder al inventario tras el login').toHaveURL(
        (url) => url.pathname === urls.inventory,
      );
    });

    await test.step(`Verificar productos y agregar ${backpack.nombre}`, async () => {
      await expect(productsPage.list, 'El listado de productos debe estar visible').toBeVisible();
      await expect(productsPage.items, 'Debe haber productos disponibles').not.toHaveCount(0);
      await expect(productsPage.productName(backpack.nombre), 'El producto debe mostrarse en el listado').toHaveText(
        backpack.nombre,
      );
      await expect(productsPage.productPrice(backpack.nombre), 'El precio en el listado debe ser $29.99').toHaveText(
        backpack.precioTexto,
      );

      await productsPage.addToCart(backpack.nombre);
      await expect(productsPage.cartBadge, 'El contador del carrito debe mostrar 1').toHaveText('1');
    });

    await test.step('Validar el carrito de compras', async () => {
      await cartPage.openCart();
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

    await test.step('Consultar y validar el precio mediante API', async () => {
      const respuesta = await getPrecio(request, backpack.nombre);
      expect(respuesta.ok(), `La API debe responder OK (status ${respuesta.status()})`).toBeTruthy();

      const cuerpo = await respuesta.json();
      expect(cuerpo, 'La respuesta debe incluir la propiedad precio').toHaveProperty('precio');
      expect(typeof cuerpo.precio, 'El precio de la API debe ser numerico').toBe('number');
      expect(cuerpo.precio, `El precio de la API debe ser ${backpack.precio}`).toBe(backpack.precio);

      const precioUiTexto = await cartPage.itemPrice(backpack.nombre).textContent();
      const precioUi = Number(precioUiTexto?.replace('$', ''));
      expect(precioUi, 'El precio de la interfaz debe coincidir con el de la API').toBe(cuerpo.precio);
    });

    await test.step('Realizar logout y verificar el regreso al login', async () => {
      await cartPage.logout();
      await expect(page, 'Debe volver a la pagina de login').toHaveURL((url) => url.pathname === urls.login);
      await expect(loginPage.usernameInput, 'El campo de usuario debe estar visible').toBeVisible();
    });
  });
});
