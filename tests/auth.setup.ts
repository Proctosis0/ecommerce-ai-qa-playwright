import { test as setup, expect } from './fixtures';
import { urls, usuarios } from '../data/test-data';
import { authFile } from '../data/auth';

/**
 * Inicia sesion una sola vez con standard_user y guarda la sesion (cookies) en authFile.
 * Los proyectos que dependen de "setup" arrancan ya logueados y no repiten el login.
 */
setup('login de standard_user y guardado de la sesion', async ({ page, loginPage }) => {
  await loginPage.loginAs(usuarios.standard);
  await expect(page, 'El login del setup debe llegar al inventario').toHaveURL(
    (url) => url.pathname === urls.inventory,
  );
  await page.context().storageState({ path: authFile });
});
