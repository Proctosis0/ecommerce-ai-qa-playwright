// spec: SCRUM-1
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';
import { urls, usuarios } from '../../data/test-data';

test.describe('SCRUM-1: Login en Saucedemo', { tag: '@SCRUM-1' }, () => {
  test('SCRUM-1: login con standard user y logout', async ({ page, loginPage, productsPage }) => {
    await loginPage.loginAs(usuarios.standard);
    await expect(page, 'Debe acceder al inventario tras el login').toHaveURL(
      (url) => url.pathname === urls.inventory,
    );

    await productsPage.logout();

    await expect(page, 'Debe volver a la pagina de login tras el logout').toHaveURL(
      (url) => url.pathname === urls.login,
    );
    await expect(loginPage.usernameInput, 'El campo de usuario debe estar visible').toBeVisible();
  });
});
