import { test, expect } from '@playwright/test';
import LoginPage from '../../src/pages/login/loginPage.js';
import BenefitsPage from '../../src/pages/benefits/benefitsPage.js';
import Logger from '../../src/utils/logger.js';
import env from '../../src/utils/env.js';  

test.describe('Edit Employee Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo(env.url);
    await loginPage.login(env.login.account, env.login.password);
    await loginPage.verifyLoginSuccess(expect);
    await page.waitForTimeout(1000); 
  });

  test('should edit an employee and validate the updated data', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);

    await benefitsPage.waitForTableToLoad(expect);

    const initialIds = await benefitsPage.getAllEmployeeIds();

    const employeeIdToEdit = initialIds[0];  

    await page.waitForTimeout(2000); 

    const employeeRow = await page.locator(`#employeesTable tbody tr:has(td:has-text("${employeeIdToEdit}"))`);
    const currentFirstName = await employeeRow.locator('td:nth-child(3)').textContent();
    const currentLastName = await employeeRow.locator('td:nth-child(2)').textContent();

    const updatedEmployee = {
      firstName: 'first' + currentLastName,  
      lastName: 'last' + currentFirstName,  
      dependants: 5,  
    };

    Logger.log('Editing the employee...');
    await benefitsPage.editEmployeeById(employeeIdToEdit, updatedEmployee, expect);

    await page.waitForSelector(`td:has-text("${updatedEmployee.firstName}")`, { timeout: 5000 });

    Logger.log('Validating updated employee data...');
    const expectedRowData = [
      updatedEmployee.firstName,    
      updatedEmployee.lastName,     
      updatedEmployee.dependants.toString(),  
      '52000.00',                   
      '2000.00',                    
      '134.62',                     
      '1865.38',                    
    ];

    await benefitsPage.validateRowByParameters(expect, updatedEmployee, expectedRowData); 
    Logger.log('Test passed: Employee edited successfully with correct updated data.');

    await page.waitForTimeout(2000); 
    const employeeRowUpdated = await page.locator(`#employeesTable tbody tr:has(td:has-text("${updatedEmployee.firstName}"))`);
    const firstNameInTable = await employeeRowUpdated.locator('td:nth-child(3)').textContent(); 
    const lastNameInTable = await employeeRowUpdated.locator('td:nth-child(2)').textContent(); 

    expect(firstNameInTable).toBe(updatedEmployee.firstName); 
    expect(lastNameInTable).toBe(updatedEmployee.lastName);   
  });
});
