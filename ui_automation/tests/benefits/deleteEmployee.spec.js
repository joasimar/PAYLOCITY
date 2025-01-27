import { test, expect } from '@playwright/test';
import LoginPage from '../../src/pages/login/loginPage.js';
import BenefitsPage from '../../src/pages/benefits/benefitsPage.js';
import Logger from '../../src/utils/logger.js';
import env from '../../src/utils/env.js';  

test.describe('Delete Employee Tests', () => {
  
  let loginPage;
  let benefitsPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    benefitsPage = new BenefitsPage(page);

    await loginPage.navigateTo(env.url);
    await loginPage.login(env.login.account, env.login.password);
    await loginPage.verifyLoginSuccess(expect);
    await page.waitForTimeout(1000); 
  });

  test('should delete an employee and validate the table data', async ({ page }) => {
    const initialIds = await benefitsPage.getAllEmployeeIds();
    
    const employeeIdToDelete = initialIds[0];
    Logger.log(`Selecting employee with ID: ${employeeIdToDelete}`);
    
    await benefitsPage.deleteEmployeeById(employeeIdToDelete);

    const updatedIds = await benefitsPage.getAllEmployeeIds();
    expect(updatedIds).not.toContain(employeeIdToDelete); 

    Logger.log('Test passed: Employee deleted successfully.');
  });
});
