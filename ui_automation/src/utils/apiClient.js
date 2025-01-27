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
      return employees;
    } catch (error) {
      console.error(`Error fetching employees: ${error.message}`);
      throw new Error(`Error fetching employees: ${error.message}`);
    }
  }
}
