import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
import { authFile } from './data/auth';
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Reintentar cada test fallido una vez */
  retries: 1,
  /* Tiempo maximo por test (30s) */
  timeout: 30000,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporte HTML (publicado en GitHub Pages desde la CI) + salida en consola */
  reporter: [['html', { open: 'never' }], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.saucedemo.com',

    /* Grabar video solo de los tests que fallen */
    video: 'retain-on-failure',

    /* Selector de test id: permite getByTestId('...') sobre data-test="..." */
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    /* Inicia sesion una vez y guarda la sesion para los tests que la reutilizan */
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    /* Tests que prueban el login o usan otro usuario: arrancan sin sesion */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/auth\.setup\.ts/, /tests[\\/](productos|carrito|checkout)[\\/]/],
    },
    /* Tests de flujo con standard_user: arrancan ya logueados (storageState) */
    {
      name: 'chromium-logged-in',
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      testMatch: /tests[\\/](productos|carrito|checkout)[\\/].*\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
