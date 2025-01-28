import fetch from 'node-fetch';

export default class ApiClient {
  constructor(baseUrl, token) {
    if (!baseUrl || !token) {
      throw new Error('API base URL and token are required.');
    }

    this.baseUrl = baseUrl;
    this.token = token;
  }


  async getEmployees(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required for Basic Auth.');
    }
  
    const url = `${this.baseUrl}/employees`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'x-token': this.token,
        },
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText} - ${errorDetails}`);
      }
  
      const employees = await response.json();
      return { status: response.status, data: employees };  
    } catch (error) {
      console.error(`Error fetching employees: ${error.message}`);
      throw new Error(`Error fetching employees: ${error.message}`);
    }
  }
  async addEmployee(employeeData, username, password) {
    if (!employeeData || !employeeData.firstName || !employeeData.lastName || !employeeData.dependants) {
      throw new Error('Invalid employee data');
    }

    const url = `${this.baseUrl}/employees`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'x-token': this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          dependants: employeeData.dependants,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to add employee: ${response.status} ${response.statusText} - ${errorDetails}`);
      }

      const responseData = await response.json();  
      return { status: response.status, data: responseData };  

    } catch (error) {
      console.error(`Error adding employee: ${error.message}`);
      throw new Error(`Error adding employee: ${error.message}`);
    }
  }

  async updateEmployee(employeeId, updatedData, username, password) {
    if (!employeeId || !updatedData) {
      throw new Error('Employee ID and updated data are required.');
    }
  
    const url = `${this.baseUrl}/employees`;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'x-token': this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: employeeId,
          ...updatedData,  
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to update employee: ${response.status} ${response.statusText} - ${errorDetails}`);
      }
  
      const updatedEmployee = await response.json(); 
      return { status: response.status, data: updatedEmployee }; 
    } catch (error) {
      console.error(`Error updating employee: ${error.message}`);
      throw new Error(`Error updating employee: ${error.message}`);
    }
  }
  async getEmployee(employeeId, username, password) {
    if (!employeeId || !username || !password) {
      throw new Error('Employee ID, username, and password are required for authentication.');
    }

    const url = `${this.baseUrl}/employees/${employeeId}`;  
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,  
          'x-token': this.token,        
        },
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch employee: ${response.status} ${response.statusText} - ${errorDetails}`);
      }

      const employee = await response.json();  
      return { status: response.status, data: employee };  
    } catch (error) {
      console.error(`Error fetching employee: ${error.message}`);
      throw new Error(`Error fetching employee: ${error.message}`);
    }
}
async deleteEmployee(employeeId, username, password) {
  if (!employeeId || !username || !password) {
    throw new Error('Employee ID, username, and password are required for deletion.');
  }

  const url = `${this.baseUrl}/employees/${employeeId}`;  
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'x-token': this.token,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to delete employee: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    console.log(`Employee with ID ${employeeId} deleted successfully.`);
    return { status: response.status };  
  } catch (error) {
    console.error(`Error deleting employee: ${error.message}`);
    throw new Error(`Error deleting employee: ${error.message}`);
  }
}

  
}
