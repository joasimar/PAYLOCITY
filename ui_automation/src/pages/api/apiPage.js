// apiPage.js
import ApiClient from '../../utils/apiClient.js';

class ApiPage {
  constructor(baseUrl, token) {
    this.apiClient = new ApiClient(baseUrl, token);
  }

  // Method to validate the employee data structure
  validateEmployeeData(employee) {
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
  }
  

}

export default ApiPage;
