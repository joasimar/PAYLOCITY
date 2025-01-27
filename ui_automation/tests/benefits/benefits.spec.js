import { test, expect } from '@playwright/test';
import LoginPage from '../../src/pages/login/loginPage.js';
import BenefitsPage from '../../src/pages/benefits/benefitsPage.js';
import Logger from '../../src/utils/logger.js';
import env from '../../src/utils/env.js';  
test.describe('Benefits Page Tests', () => {
  let loginPage;
  let benefitsPage;

  test.beforeEach(async ({ page }) => {
    Logger.log('Navigating to the login page...');
    loginPage = new LoginPage(page);
    benefitsPage = new BenefitsPage(page);

    await loginPage.navigateTo(env.url);
    await loginPage.login(env.login.account, env.login.password);
    await loginPage.verifyLoginSuccess(expect);

    Logger.log('Login successful, now validating the benefits page...');
  });

  test('should validate the presence of the employees table', async () => {
    Logger.log('Validating table presence...');
    await benefitsPage.validateTablePresence(expect);
    Logger.log('Test passed: Employees table is visible.');
  });

  test('should validate table headers', async () => {
    Logger.log('Validating table headers...');
    const expectedHeaders = [
      'Id',
      'Last Name',
      'First Name',
      'Dependents',
      'Salary',
      'Gross Pay',
      'Benefits Cost',
      'Net Pay',
      'Actions',
    ];
    await benefitsPage.validateTableHeaders(expect, expectedHeaders);
    Logger.log('Test passed: Table headers are correct.');
  });

  test('should validate table data against API', async () => {
    Logger.log('Validating table data against API...');
    const tableStatus = await benefitsPage.waitForTableToLoad(expect);
  
    if (tableStatus === 'Employees data loaded.') {
      await benefitsPage.validateTableDataWithApi(
        expect,
        'TestUser717', 
        'lR8xn->myPP=' 
      );
      Logger.log('Test passed: Table data matches API data.');
    } else {
      Logger.log('No rows to validate. Test skipped.');
    }
  });
  
  
  
  
});
