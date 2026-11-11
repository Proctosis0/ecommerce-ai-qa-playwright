import { test, expect } from '../fixtures';
import { usuarios } from '../../data/test-data';

const MENSAJE_BLOQUEO = 'Epic sadface: Sorry, this user has been locked out.';

test.describe('Login de usuario bloqueado', { tag: '@SCRUM-1' }, () => {
  test('locked_out_user no puede iniciar sesion y ve el mensaje de bloqueo', async ({ page, loginPage }) => {
    await loginPage.loginAs(usuarios.locked);

    await expect(loginPage.errorMessage, 'Debe mostrarse el mensaje de error').toBeVisible();
    await expect(loginPage.errorMessage, 'El mensaje debe indicar que el usuario esta bloqueado').toContainText(
      MENSAJE_BLOQUEO,
    );
    await expect(loginPage.errorMessage, 'El mensaje debe mencionar locked out').toContainText(/locked out/i);

    await expect(page, 'Debe permanecer en la pagina de login').toHaveURL((url) => url.pathname === '/');
    await expect(loginPage.loginButton, 'El boton de login debe seguir visible').toBeVisible();
    await expect(page.getByTestId('inventory-list'), 'No debe acceder al inventario').toHaveCount(0);
  });
});
