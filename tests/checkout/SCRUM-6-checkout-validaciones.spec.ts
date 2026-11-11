// spec: SCRUM-6
import { test, expect } from '../fixtures';
import { checkoutInvalido, checkoutValido, productos, resumenBackpack, urls } from '../../data/test-data';

const { backpack } = productos;

test.describe('SCRUM-6: Checkout - validaciones del formulario y compra completa', () => {
  // La sesion de standard_user se reutiliza (storageState): cada test arranca en el inventario
  // con el Backpack en el carrito y entra a la pantalla de datos del comprador.
  test.beforeEach(async ({ page, productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addToCart(backpack.nombre);
    await productsPage.openCart();
    await page.getByTestId('checkout').click();
    await expect(page, 'Debe abrir la pantalla de datos del comprador').toHaveURL(
      (url) => url.pathname === urls.checkoutInfo,
    );
    await expect(cartPage.cartBadge, 'El carrito debe tener 1 producto antes del checkout').toHaveText('1');
  });

  // Data-driven: un test por cada combinacion invalida definida en test-data.ts
  for (const datos of checkoutInvalido) {
    test(`muestra error con ${datos.caso}`, async ({ page, checkoutPage }) => {
      await test.step('Completar el formulario con un campo obligatorio vacio', async () => {
        await checkoutPage.fillInfo(datos.nombre, datos.apellido, datos.codigoPostal);
        await checkoutPage.continue();
      });

      await test.step('Validar el mensaje de error y que no avance', async () => {
        await expect(checkoutPage.errorMessage, `Debe mostrarse el error "${datos.error}"`).toHaveText(datos.error);
        await expect(page, 'No debe avanzar al resumen de la compra').toHaveURL(
          (url) => url.pathname === urls.checkoutInfo,
        );
      });
    });
  }

  test('completa la compra con datos validos y valida el resumen', async ({ page, checkoutPage }) => {
    await test.step('Completar los datos del comprador', async () => {
      await checkoutPage.fillInfo(checkoutValido.nombre, checkoutValido.apellido, checkoutValido.codigoPostal);
      await checkoutPage.continue();
      await expect(page, 'Debe avanzar al resumen de la compra').toHaveURL(
        (url) => url.pathname === urls.checkoutOverview,
      );
    });

    await test.step('Validar subtotal, impuesto y total', async () => {
      await expect(checkoutPage.subtotalLabel, 'El subtotal debe ser el precio del Backpack').toHaveText(
        resumenBackpack.subtotal,
      );
      await expect(checkoutPage.taxLabel, 'El impuesto debe ser el 8% del subtotal').toHaveText(resumenBackpack.impuesto);
      await expect(checkoutPage.totalLabel, 'El total debe ser subtotal + impuesto').toHaveText(resumenBackpack.total);
    });

    await test.step('Finalizar la compra y validar la confirmacion', async () => {
      await checkoutPage.finish();
      await expect(page, 'Debe mostrar la pantalla de compra completa').toHaveURL(
        (url) => url.pathname === urls.checkoutComplete,
      );
      await expect(checkoutPage.completeHeader, 'Debe mostrarse el mensaje de agradecimiento').toHaveText(
        'Thank you for your order!',
      );
      await expect(checkoutPage.cartBadge, 'El carrito debe quedar vacio tras la compra').toHaveCount(0);
    });
  });
});
