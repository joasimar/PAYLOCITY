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

  test('should delete an employee and validate the deletion', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);
  
    // Step 1: Get the initial list of employee IDs
    const initialIds = await benefitsPage.getAllEmployeeIds();
    const employeeIdToDelete = initialIds[0];  // Select the first employee for deletion
    Logger.log(`Selecting employee with ID: ${employeeIdToDelete}`);
    
    // Step 2: Delete the employee by ID
    await benefitsPage.deleteEmployeeById(employeeIdToDelete);
    Logger.log(`Employee with ID ${employeeIdToDelete} deleted.`);
  
    
  
    const updatedIds = await benefitsPage.getAllEmployeeIds();
    Logger.log('Updated Employee IDs:', updatedIds);
  
    // Step 4: Validate that the deleted employee's ID is not in the updated list
    expect(updatedIds).not.toContain(employeeIdToDelete); 
    Logger.log('Test passed: Employee deleted successfully.');
  });
  
});
