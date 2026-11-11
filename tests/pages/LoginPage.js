/**
 * Pantalla de login de SauceDemo.
 */
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** @param {string} [url] Default: baseURL configurado en playwright.config.ts */
  async goto(url = '/') {
    await this.page.goto(url);
  }

  /** @param {{ username: string, password: string }} credenciales */
  async login({ username, password }) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
