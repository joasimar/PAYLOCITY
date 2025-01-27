import { test, expect } from '@playwright/test';
import ApiClient from '../../src/utils/apiClient.js';
import env from '../../src/utils/env.js';  

const API_BASE_URL = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api';
const TOKEN = 'VGVzdFVzZXI3MTc6bFI4eG4tPm15UFA9';
const USERNAME = env.login.account;
const PASSWORD = env.login.password;

test.describe('Employees API Tests', () => {
  let apiClient;

  test.beforeAll(() => {
    apiClient = new ApiClient(API_BASE_URL, TOKEN);
  });

  test('should fetch employees and validate response structure', async () => {
    const employees = await apiClient.getEmployees(USERNAME, PASSWORD);

    expect(Array.isArray(employees)).toBe(true);

    employees.forEach((employee) => {
      expect(employee).toHaveProperty('id');
      expect(employee).toHaveProperty('firstName');
      expect(employee).toHaveProperty('lastName');
      expect(employee).toHaveProperty('dependants');
      expect(employee).toHaveProperty('salary');
      expect(employee).toHaveProperty('gross');
      expect(employee).toHaveProperty('benefitsCost');
      expect(employee).toHaveProperty('net');
    });

    console.log('Test passed: API response structure is valid.');
  });

  test('should validate specific employee data', async () => {
    const employees = await apiClient.getEmployees(USERNAME, PASSWORD);

    const employee = employees.find((e) => e.id === '74d43faa-b7ca-4c9e-98c1-c77d778dd075');
    expect(employee).not.toBeUndefined();

    expect(employee.firstName).toBe('s');
    expect(employee.lastName).toBe('d');
    expect(employee.dependants).toBe(3);
    expect(employee.salary).toBe(52000);
    expect(employee.gross).toBe(2000);
    expect(employee.benefitsCost).toBeCloseTo(96.153854, 2); 
    expect(employee.net).toBeCloseTo(1903.8462, 2);

    console.log('Test passed: Specific employee data is valid.');
  });
});
