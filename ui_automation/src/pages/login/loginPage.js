import BasePage from '../basePage.js';

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameField = '#Username';
    this.passwordField = '#Password';
    this.loginButton = 'button[type="submit"]';
    this.errorMessage = '.validation-summary-errors';
    this.navbarBrand = 'a.navbar-brand[href="/Prod/Benefits"]';
  }

  async login(username, password) {
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButton);
  }

  async verifyLoginSuccess(expect) {
    const navbar = this.page.locator(this.navbarBrand);
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveText('Paylocity Benefits Dashboard');
    await expect(navbar).toHaveAttribute('href', '/Prod/Benefits');

    const currentUrl = this.page.url();
    expect(currentUrl).toBe('https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Benefits');
  }

  async verifyLoginError(expect, expectedError) {
    const error = this.page.locator(this.errorMessage);
    await expect(error).toBeVisible();
    await expect(error).toContainText(expectedError);
  }
}

export default LoginPage;
