import { test, expect } from '@playwright/test';
import ApiClient from '../../src/utils/apiClient.js';
import env from '../../src/utils/env.js';
import generateRandomName from '../../src/utils/randomName.js'; 
import ApiPage from '../../src/pages/api/apiPage.js';  


const API_BASE_URL = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api';
const TOKEN = 'VGVzdFVzZXI3MTc6bFI4eG4tPm15UFA9';
const USERNAME = env.login.account;
const PASSWORD = env.login.password;

let apiClient;

test.describe('Employees API Tests', () => {
  
  test.beforeAll(() => {
    apiClient = new ApiClient(API_BASE_URL, TOKEN);
  });

  const validateEmployeeData = (employee) => {
    expect(employee).toHaveProperty('id');
    expect(employee).toHaveProperty('firstName');
    expect(employee).toHaveProperty('lastName');
    expect(employee).toHaveProperty('dependants');
    expect(employee).toHaveProperty('salary');
    expect(employee).toHaveProperty('gross');
    expect(employee).toHaveProperty('benefitsCost');
    expect(employee).toHaveProperty('net');
    expect(employee).toHaveProperty('expiration');
    expect(typeof employee.firstName).toBe('string');
    expect(typeof employee.lastName).toBe('string');
    expect(typeof employee.dependants).toBe('number');
    expect(typeof employee.salary).toBe('number');
    expect(typeof employee.gross).toBe('number');
    expect(typeof employee.benefitsCost).toBe('number');
    expect(typeof employee.net).toBe('number');
  };

  test('should fetch employees and validate response structure and status code', async () => {
    const { status, data: employees } = await apiClient.getEmployees(USERNAME, PASSWORD);
    expect(status).toBe(200);
    expect(Array.isArray(employees)).toBe(true);

    employees.forEach((employee, index) => {
      validateEmployeeData(employee);
    });

    console.log('Test passed: API response structure is valid.');
  });

  test('should validate specific employee data dynamically', async () => {
    const { status, data: employees } = await apiClient.getEmployees(USERNAME, PASSWORD);
    const employee = employees[0];
    expect(status).toBe(200);
    expect(employee).toBeDefined();

    const validateField = (field, expectedType) => {
      expect(employee[field]).toBeDefined();
      expect(typeof employee[field]).toBe(expectedType);
    };

    validateField('firstName', 'string');
    validateField('lastName', 'string');
    validateField('dependants', 'number');
    validateField('salary', 'number');
    validateField('gross', 'number');
    validateField('benefitsCost', 'number');
    validateField('net', 'number');

    console.log('Test passed: Specific employee data is valid.');
  });

  test('should add an employee and validate response structure and status code', async () => {
    const { firstName, lastName } = generateRandomName();
    const newEmployee = { firstName, lastName, dependants: 4 };

    const response = await apiClient.addEmployee(newEmployee, USERNAME, PASSWORD);
    expect(response.status).toBe(200);
    const employee = response.data;

    expect(employee.firstName).toBe(newEmployee.firstName);
    expect(employee.lastName).toBe(newEmployee.lastName);
    expect(employee.dependants).toBe(newEmployee.dependants);

    console.log('Test passed: Employee added and validated.');
  });

  test('should update an employee and validate the updated data', async () => {
    const { status, data: employees } = await apiClient.getEmployees(USERNAME, PASSWORD);
    expect(status).toBe(200);
    const employeeIdToUpdate = employees[0].id;

    const { firstName, lastName } = generateRandomName();
    const updatedEmployeeData = { firstName, lastName, dependants: 5 };

    const updateResponse = await apiClient.updateEmployee(employeeIdToUpdate, updatedEmployeeData, USERNAME, PASSWORD);
    expect(updateResponse.status).toBe(200);
    const updatedEmployee = updateResponse.data;

    expect(updatedEmployee.firstName).toBe(updatedEmployeeData.firstName);
    expect(updatedEmployee.lastName).toBe(updatedEmployeeData.lastName);
    expect(updatedEmployee.dependants).toBe(updatedEmployeeData.dependants);

    console.log('Test passed: Employee updated and validated.');
  });

  test('should fetch employees, extract an ID, and validate response structure and status code', async () => {
    const { status, data: employees } = await apiClient.getEmployees(USERNAME, PASSWORD);
    expect(status).toBe(200);
    const employeeId = employees[0].id;

    const employeeResponse = await apiClient.getEmployee(employeeId, USERNAME, PASSWORD);
    expect(employeeResponse.status).toBe(200);
    const employee = employeeResponse.data;

    expect(employee.id).toBe(employeeId);
    expect(employee.firstName).toBeDefined();
    expect(employee.lastName).toBeDefined();
    expect(employee.dependants).toBeGreaterThanOrEqual(0);
    expect(employee.salary).toBeGreaterThan(0);

    console.log('Test passed: Specific employee data is valid.');
  });

  test('should fetch employees, extract an ID, delete the employee, and verify deletion using getEmployees', async () => {
    const { status, data: employees } = await apiClient.getEmployees(USERNAME, PASSWORD);
    expect(status).toBe(200);
    const employeeIdToDelete = employees[0].id;

    const deleteResponse = await apiClient.deleteEmployee(employeeIdToDelete, USERNAME, PASSWORD);
    expect(deleteResponse.status).toBe(200);

    const verifyResponse = await apiClient.getEmployees(USERNAME, PASSWORD);
    const remainingEmployeeIds = verifyResponse.data.map((employee) => employee.id);
    expect(remainingEmployeeIds).not.toContain(employeeIdToDelete);

    console.log('Test passed: Employee deleted and verified successfully.');
  });
});
