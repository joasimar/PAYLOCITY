import { test, expect } from '@playwright/test';
import LoginPage from '../../src/pages/login/loginPage.js';
import BenefitsPage from '../../src/pages/benefits/benefitsPage.js';
import Logger from '../../src/utils/logger.js'; 
import generateRandomName from '../../src/utils/randomName.js'; 
import env from '../../src/utils/env.js';  
test.describe('Add Employee Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo(env.url);
    await loginPage.login(env.login.account, env.login.password);
    await loginPage.verifyLoginSuccess(expect);
  });

  test('should add an employee and validate table data', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);
  
    const { firstName, lastName } = generateRandomName();
    const dependants = 4;
    const newEmployee = { firstName, lastName, dependants };
  
    await benefitsPage.addAndValidateEmployee(newEmployee, expect);
  });
  


  test('should not allow adding an employee with invalid dependants', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);

    await benefitsPage.waitForTableToLoad(expect);

    const invalidEmployee = {
      firstName: 'Jane',
      lastName: 'Smith',
      dependants: 'invalid', 
    };

    await expect(
      benefitsPage.addEmployee(invalidEmployee, expect)
    ).rejects.toThrow('Dependents field must contain a numeric value.');
  });

  test('should add a new employee', async ({ page }) => {
      const benefitsPage = new BenefitsPage(page);
    
    const { firstName, lastName } = generateRandomName();
    const dependants = 4;
    const newEmployee = { firstName, lastName, dependants };

    const initialIds = await benefitsPage.getAllEmployeeIds();

    await benefitsPage.addEmployee(newEmployee, expect);

    const initialRowCount = await page.locator(`${benefitsPage.tableBody} tr`).count();
    let rowCountChanged = false;
    const maxRetries = 3;

    for (let retryCount = 0; retryCount < maxRetries && !rowCountChanged; retryCount++) {
        await page.waitForTimeout(1000); 
        const updatedRowCount = await page.locator(`${benefitsPage.tableBody} tr`).count();
        if (updatedRowCount > initialRowCount) {
            rowCountChanged = true;
        }
    }

    if (!rowCountChanged) throw new Error('Employee not added, table row count did not increase.');

    const updatedIds = await benefitsPage.getAllEmployeeIds();
    const newEmployeeId = updatedIds.find(id => !initialIds.includes(id));
    expect(newEmployeeId).toBeDefined(); 
  });
  
});
