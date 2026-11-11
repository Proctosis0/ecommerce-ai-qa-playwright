// spec: SCRUM-7
import { test, expect } from '../fixtures';
import { checkoutValido, productos, urls, usuarios } from '../../data/test-data';

/**
 * problem_user es un usuario de SauceDemo con defectos a proposito.
 * Cada test valida el comportamiento CORRECTO (el mismo que tiene standard_user) y esta
 * marcado con test.fail() + anotacion "bug": la suite queda en verde mientras el defecto
 * exista, y el reporte muestra cada bug documentado. Si un bug se corrige, el test pasa a
 * "unexpectedly passed" y avisa que hay que quitar la marca.
 */
test.describe('SCRUM-7: Defectos detectados con problem_user', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.loginAs(usuarios.problem);
    await expect(page, 'problem_user debe poder iniciar sesion').toHaveURL((url) => url.pathname === urls.inventory);
  });

  test('BUG-01: cada producto debe mostrar su propia imagen', async ({ productsPage }) => {
    test.fail(true, 'Bug conocido de problem_user');
    test.info().annotations.push({
      type: 'bug',
      description: 'Los 6 productos muestran la misma imagen; con standard_user cada producto tiene una imagen distinta.',
    });

    const imagenes = await productsPage.imageSources();
    const cantidadProductos = await productsPage.items.count();

    expect(new Set(imagenes).size, 'Cada producto debe tener una imagen distinta').toBe(cantidadProductos);
  });

  test('BUG-02: ordenar por precio (menor a mayor) debe ordenar el listado', async ({ productsPage }) => {
    test.fail(true, 'Bug conocido de problem_user');
    test.info().annotations.push({
      type: 'bug',
      description: 'Al elegir "Price (low to high)" el listado no cambia de orden.',
    });

    await productsPage.sortBy('lohi');
    const precios = await productsPage.visiblePrices();
    const esperados = [...precios].sort((a, b) => a - b);

    expect(precios, 'Los precios deben quedar ordenados de menor a mayor').toEqual(esperados);
  });

  test('BUG-03: el apellido ingresado en el checkout debe quedar en su campo', async ({
    page,
    productsPage,
    checkoutPage,
  }) => {
    test.fail(true, 'Bug conocido de problem_user');
    test.info().annotations.push({
      type: 'bug',
      description:
        'Al escribir en "Last Name" el texto se carga en "First Name"; el apellido queda vacio y la compra no puede continuar.',
    });

    await productsPage.addToCart(productos.backpack.nombre);
    await productsPage.openCart();
    await page.getByTestId('checkout').click();
    await checkoutPage.fillInfo(checkoutValido.nombre, checkoutValido.apellido, checkoutValido.codigoPostal);

    await expect(checkoutPage.lastNameInput, 'El apellido debe quedar en el campo Last Name').toHaveValue(
      checkoutValido.apellido,
      { timeout: 3000 },
    );
  });
});
