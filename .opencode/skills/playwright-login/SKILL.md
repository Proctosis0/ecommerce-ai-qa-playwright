---
name: Login reutilizable en Playwright
description: Convenciones de este proyecto para iniciar sesion en SauceDemo sin duplicar codigo. Usalo al crear o refactorizar tests E2E que necesiten autenticarse.
---

# Login reutilizable

Todos los tests que necesitan autenticarse deben usar el helper de login en lugar de repetir
los pasos de `page.goto` + rellenar campos + click.

## Helper

Archivo: `tests/helpers/login.js`

```js
const { loginAs, submitLogin } = require('../helpers/login');
```

| Funcion | Uso |
| --- | --- |
| `loginAs(page, usuario = 'standard')` | Login con un usuario de `data/test-data.json` y valida `/inventory.html` + listado visible. |
| `submitLogin(page, { username, password })` | Solo completa y envia el formulario. Para logins que deben fallar (usuario bloqueado) o credenciales de `.env`. |

## Reglas

1. **No duplicar** los pasos de login en los tests.
2. **No hardcodear credenciales**: usar `data/test-data.json` (`usuarios.standard`, `usuarios.locked`)
   o variables de entorno del `.env` (`LOCKED_USER`, `LOCKED_PASSWORD`).
3. `loginAs` ya verifica el acceso al inventario; no repetir esa assertion en el test.
4. La unica excepcion es `tests/login/login.spec.ts`: prueba el flujo de login en si mismo y
   **no** debe usar el helper.
5. El helper funciona tanto en specs `.js` como `.ts` (Playwright transpila el `require`/`import`).
6. La navegacion inicial va a `/`, usando el `baseURL` de `playwright.config.ts`.

## Ejemplo de test

```js
const { test, expect } = require('@playwright/test');
const { loginAs } = require('../helpers/login');

test('abre el carrito con el standard user', async ({ page }) => {
  await loginAs(page); // login + validacion de inventario
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
});
```

## Login que debe fallar

```ts
import { submitLogin } from '../helpers/login';

const usuario = process.env.LOCKED_USER;
const password = process.env.LOCKED_PASSWORD;
if (!usuario || !password) throw new Error('Faltan LOCKED_USER y/o LOCKED_PASSWORD en .env');

await submitLogin(page, { username: usuario, password }); // luego assertion del mensaje de error
```

## Contexto del proyecto

- SauceDemo valida el login en el cliente: no hay peticion de red, la respuesta es el alert `[data-test="error"]`.
- En CI, las credenciales llegan por variables de entorno del workflow (no existe `.env`).
- `data/test-data.json` contiene `usuarios.standard` y `usuarios.locked`; no modificarlo.
