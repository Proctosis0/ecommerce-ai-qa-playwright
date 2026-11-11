const { test, expect } = require('@playwright/test');
const testData = require('../../data/test-data');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');

const PRODUCTO = 'Sauce Labs Backpack';
const PRECIO_TEXTO = '$29.99';
const PRECIO_NUMERO = 29.99;
const API_URL = 'https://cursotesting.com.ar:3000/producto/';

test.describe('Compra completa en Saucedemo', () => {
  test('Flujo E2E: login, producto, carrito, precio por API y logout', async ({ page, request }) => {
    // Test: valida la compra completa de Sauce Labs Backpack usando Page Objects y el precio de la API.
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await test.step('Login con standard_user', async () => {
      await loginPage.goto(testData.urls.base);
      await loginPage.login(testData.usuarios.standard);

      await expect(page, 'Debe acceder al inventario tras el login').toHaveURL(
        (url) => url.pathname === testData.urls.inventory,
      );
    });

    await test.step('Verificar productos y agregar Sauce Labs Backpack', async () => {
      await expect(productsPage.list, 'El listado de productos debe estar visible').toBeVisible();
      expect(await productsPage.items.count(), 'Debe haber productos disponibles').toBeGreaterThan(0);

      await expect(productsPage.productName(PRODUCTO), 'El producto debe mostrarse en el listado').toHaveText(
        PRODUCTO,
      );
      await expect(productsPage.productPrice(PRODUCTO), 'El precio en el listado debe ser $29.99').toHaveText(
        PRECIO_TEXTO,
      );

      await productsPage.addToCart(PRODUCTO);
      await expect(productsPage.cartBadge, 'El contador del carrito debe mostrar 1').toHaveText('1');
    });

    await test.step('Validar el carrito de compras', async () => {
      await cartPage.openCart();
      await expect(page, 'Debe acceder a cart.html').toHaveURL((url) => url.pathname === testData.urls.cart);

      await expect(cartPage.list, 'El listado del carrito debe estar visible').toBeVisible();
      await expect(cartPage.items, 'Debe existir exactamente un producto').toHaveCount(1);
      await expect(cartPage.itemName(PRODUCTO), 'El producto debe estar en el carrito').toHaveText(PRODUCTO);
      await expect(cartPage.itemPrice(PRODUCTO), 'El precio en el carrito debe ser $29.99').toHaveText(
        PRECIO_TEXTO,
      );
    });

    await test.step('Consultar y validar el precio mediante API', async () => {
      const respuesta = await request.post(API_URL, { data: { nombre: PRODUCTO } });

      expect(respuesta.ok(), `La API debe responder OK (status ${respuesta.status()})`).toBeTruthy();

      const cuerpo = await respuesta.json();
      expect(cuerpo, 'La respuesta debe incluir la propiedad precio').toHaveProperty('precio');
      expect(typeof cuerpo.precio, 'El precio de la API debe ser numerico').toBe('number');
      expect(cuerpo.precio, 'El precio de la API debe ser 29.99').toBe(PRECIO_NUMERO);

      // Precio leido directamente del DOM de cart.html, convertido a numero.
      const precioUiTexto = await cartPage.itemPrice(PRODUCTO).textContent();
      const precioUi = Number(precioUiTexto.trim().replace('$', ''));
      expect(precioUi, 'El precio de la interfaz debe coincidir con el de la API').toBe(cuerpo.precio);
    });

    await test.step('Realizar logout', async () => {
      await cartPage.logout();
    });

    await test.step('Verificar el regreso a la pantalla de login', async () => {
      await expect(page, 'Debe volver a la pagina de login').toHaveURL((url) => url.pathname === '/');
      await expect(loginPage.usernameInput, 'El campo de usuario debe estar visible').toBeVisible();
    });
  });
});
