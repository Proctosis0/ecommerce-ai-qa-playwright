const { expect } = require('@playwright/test');
const { readFileSync } = require('fs');
const { resolve } = require('path');

/** Datos de prueba compartidos (credenciales de los usuarios de SauceDemo). */
const testData = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/test-data.json'), 'utf-8'),
);

/**
 * Abre la pagina de login, completa las credenciales y envia el formulario.
 * No valida el resultado: sirve tanto para logins exitosos como rechazados.
 * @param {import('@playwright/test').Page} page
 * @param {{ username: string, password: string }} credenciales
 */
async function submitLogin(page, { username, password }) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/**
 * Inicia sesion con un usuario definido en data/test-data.json y valida
 * que se haya accedido al inventario de productos.
 * @param {import('@playwright/test').Page} page
 * @param {'standard' | 'locked'} [usuario] Clave del usuario en el JSON.
 */
async function loginAs(page, usuario = 'standard') {
  const credenciales = testData.usuarios[usuario];
  if (!credenciales) {
    throw new Error(`El usuario "${usuario}" no existe en data/test-data.json`);
  }

  await submitLogin(page, credenciales);
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
}

module.exports = { submitLogin, loginAs };
