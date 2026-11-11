/**
 * Archivo donde el setup guarda la sesion de standard_user (ver tests/auth.setup.ts).
 * Vive separado de test-data.ts para que playwright.config.ts pueda importarlo
 * sin leer las credenciales antes de cargar el .env.
 */
export const authFile = 'playwright/.auth/standard.json';
