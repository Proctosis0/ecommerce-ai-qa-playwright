import type { Locator, Page } from '@playwright/test';
import type { Credenciales } from '../../data/test-data';

/** Pantalla de login de SauceDemo. */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async goto(url = '/'): Promise<void> {
    await this.page.goto(url);
  }

  async login({ username, password }: Credenciales): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Abre la pagina de login e inicia sesion (sin validar el resultado). */
  async loginAs(credenciales: Credenciales): Promise<void> {
    await this.goto('/');
    await this.login(credenciales);
  }
}
