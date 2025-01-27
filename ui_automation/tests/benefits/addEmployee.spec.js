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

    await benefitsPage.waitForTableToLoad(expect);

    const newEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      dependants: 4,
    };

    await benefitsPage.addEmployee(newEmployee, expect);

    const expectedRowData = [
      'John',        
      'Doe',         
      '4',           
      '52000.00',    
      '2000.00',    
      '115.38',      
      '1884.62',     
    ];

    await benefitsPage.validateRowData(expect, 0, expectedRowData); 
  });

  test('should not allow adding an employee with invalid dependants', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);

    await benefitsPage.waitForTableToLoad(expect);

    const invalidEmployee = {
      firstName: 'Jane',
      lastName: 'Smith',
      dependants: 'invalid', o
    };

    await expect(
      benefitsPage.addEmployee(invalidEmployee, expect)
    ).rejects.toThrow('Dependents field must contain a numeric value.');
  });

  test('should add an employee and validate table data by searching with parameters', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);
  
    await benefitsPage.waitForTableToLoad(expect);
  
    const newEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      dependants: 4,
    };
  
    Logger.log('Adding a new employee...');
    await benefitsPage.addEmployee(newEmployee, expect);
  
    Logger.log('Validating new employee in the table...');
    const expectedRowData = [
      'John',        
      'Doe',         
      '4',           
      '52000.00',    
      '2000.00',     
      '115.38',      
      '1884.62',     
    ];
  
    await benefitsPage.validateRowByParameters(expect, newEmployee, expectedRowData); 
    Logger.log('Test passed: Employee added successfully with correct benefit calculations.');
  });

  test('should add an employee and validate data using the new ID', async ({ page }) => {
    const benefitsPage = new BenefitsPage(page);

    await benefitsPage.waitForTableToLoad(expect);

    const initialIds = await benefitsPage.getAllEmployeeIds();

    const { firstName, lastName } = generateRandomName();
    const dependants = 4;

    const newEmployee = {
      firstName: firstName,
      lastName: lastName,
      dependants: dependants,
    };

    Logger.log('Adding a new employee...');
    await benefitsPage.addEmployee(newEmployee, expect);

    const updatedIds = await benefitsPage.getAllEmployeeIds();

    const newEmployeeId = updatedIds.find(id => !initialIds.includes(id));
    expect(newEmployeeId).toBeDefined(); 

    Logger.log('Validating the data of the new employee...');
    const expectedRowData = [
      newEmployee.firstName,    
      newEmployee.lastName,     
      newEmployee.dependants.toString(),  
      '52000.00',               
      '2000.00',                
      '115.38',                 
      '1884.62',                
    ];

    await benefitsPage.validateRowByParameters(expect, { id: newEmployeeId, ...newEmployee }, expectedRowData);
    Logger.log('Test passed: Employee added successfully with correct benefit calculations.');
  });
});
