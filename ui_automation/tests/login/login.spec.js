import { test, expect } from '@playwright/test';
import LoginPage from '../../src/pages/login/loginPage.js';
import Logger from '../../src/utils/logger.js';
import env from '../../src/utils/env.js';  

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    Logger.log('Navigating to the login page...');
    loginPage = new LoginPage(page);
    await loginPage.navigateTo(env.url);
  });

  test('should login successfully with valid credentials', async () => {
    Logger.log('Testing valid login...');
    console.log('Username:', env.login.account);  // Verifica si el nombre de usuario está siendo leído correctamente

    await loginPage.login(env.login.account, env.login.password);
    await loginPage.verifyLoginSuccess(expect); 
    Logger.log('Test passed: Valid login.');
  });

  test('should show error message with invalid username', async ({ page }) => {
    Logger.log('Testing login with invalid username...');
    await loginPage.login('InvalidUser', env.login.password);
    await loginPage.verifyLoginError(expect, 'The specified username or password is incorrect.');
    Logger.log('Test passed: Invalid username.');
  });
});
