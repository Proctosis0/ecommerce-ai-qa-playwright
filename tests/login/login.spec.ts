import { test, expect } from '../fixtures';
import { urls, usuarios } from '../../data/test-data';

test.describe('Login en Saucedemo', { tag: '@SCRUM-1' }, () => {
  test('Login exitoso con standard_user y acceso al inventario', async ({ page, loginPage, productsPage }) => {
    await loginPage.loginAs(usuarios.standard);

    await expect(page, 'Debe acceder al inventario tras el login').toHaveURL(
      (url) => url.pathname === urls.inventory,
    );
    await expect(productsPage.list, 'El listado de productos debe estar visible').toBeVisible();
    await expect(productsPage.items.first(), 'El primer producto debe estar visible').toBeVisible();
    await expect(productsPage.items, 'Debe haber productos disponibles').not.toHaveCount(0);
  });
});
