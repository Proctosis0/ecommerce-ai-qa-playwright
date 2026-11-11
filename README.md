# ecommerce-ai-qa-playwright

Tests E2E de [SauceDemo](https://www.saucedemo.com) con Playwright + TypeScript.

## Requisitos

- Node.js LTS
- `npm install`
- `npx playwright install chromium`

## Variables de entorno

Las credenciales son opcionales: si no se definen, se usan los usuarios publicos de la demo.

1. Copiar `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Ajustar los valores:

   | Variable | Default |
   | --- | --- |
   | `SAUCE_USER` | `standard_user` |
   | `SAUCE_PASSWORD` | `secret_sauce` |
   | `SAUCE_LOCKED_USER` | `locked_out_user` |
   | `SAUCE_LOCKED_PASSWORD` | `secret_sauce` |

El `.env` esta en `.gitignore` (nunca se versiona). `playwright.config.ts` lo carga con `dotenv`,
y en CI las variables se pasan desde el workflow.

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm test` | Toda la suite (proyecto `chromium`). |
| `npm run test:e2e` | Solo los tests E2E (`tests/e2e`). |
| `npm run test:api` | Solo los tests de API (`tests/api`). |
| `npm run report` | Abre el reporte HTML del ultimo run. |

## Estructura

```
data/test-data.ts        Datos y URLs de prueba (productos, API, credenciales)
tests/fixtures.ts        test.extend() con loginPage, productsPage y cartPage
tests/pages/             Page Objects (BasePage, LoginPage, ProductsPage, CartPage)
tests/api/               Helper y tests de la API de precios
tests/e2e/               Flujo de compra completa
tests/login|productos|carrito/
```

Los selectores usan `getByTestId()` con `data-test` (configurado con `use.testIdAttribute`).
