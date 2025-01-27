import BasePage from '../basePage.js';
import ApiClient from '../../utils/apiClient.js'; 

export default class BenefitsPage extends BasePage {
  constructor(page) {
    super(page);
    this.table = '#employeesTable'; 
    this.tableBody = `${this.table} tbody`; 
    this.noEmployeesRow = `${this.tableBody} tr td[colspan="9"]`; 
    this.dataRows = `${this.tableBody} tr`; 

    this.apiClient = new ApiClient(
      'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api',
      'VGVzdFVzZXI3MTc6bFI4eG4tPm15UFA9'
    );
  }


  async waitForTableToLoad(expect) {
    const noEmployeesLocator = this.page.locator(this.noEmployeesRow);
    const rowsLocator = this.page.locator(this.dataRows);

    await expect(rowsLocator.first()).toBeVisible(); 

    if (await noEmployeesLocator.isVisible()) {
      return 'No employees found.';
    }

    return 'Employees data loaded.';
  }


  async validateTablePresence(expect) {
    const tableElement = this.page.locator(this.table);
    await expect(tableElement).toBeVisible();
  }

  
  async validateTableHeaders(expect, expectedHeaders) {
    const headers = this.page.locator(`${this.table} thead th`);
    const actualHeaders = await headers.allTextContents();
    expect(actualHeaders).toEqual(expectedHeaders);
  }

 
  async validateTableDataWithApi(expect, username, password) {
    const apiData = await this.apiClient.getEmployees(username, password);

    const rows = this.page.locator(`${this.table} tbody tr`);
    const rowCount = await rows.count();

    expect(rowCount).toBe(apiData.length);

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = rows.nth(rowIndex); 
      const cells = row.locator('td'); 

      const actualRowData = await cells.allTextContents();
      const cleanedRowData = actualRowData.map((cell) => cell.trim()); 

      const expectedRowData = [
        apiData[rowIndex].id,
        apiData[rowIndex].lastName,
        apiData[rowIndex].firstName,
        apiData[rowIndex].dependants.toString(),
        apiData[rowIndex].salary.toFixed(2),
        apiData[rowIndex].gross.toFixed(2),
        apiData[rowIndex].benefitsCost.toFixed(2),
        apiData[rowIndex].net.toFixed(2),
      ];

      const dataCells = cleanedRowData.slice(0, expectedRowData.length); 
      expect(dataCells).toEqual(expectedRowData);

      const actionsCell = cells.last();
      const editIcon = actionsCell.locator('i.fas.fa-edit');
      const deleteIcon = actionsCell.locator('i.fas.fa-times');

      await expect(editIcon).toBeVisible();
      await expect(deleteIcon).toBeVisible();
    }
  }

async addEmployee(employee, expect) {
    const addButton = this.page.locator('#add');
    await expect(addButton).toBeVisible();
    await addButton.click();
  
  
    await this.page.fill('#firstName', employee.firstName);
    await this.page.fill('#lastName', employee.lastName);
  
    if (isNaN(employee.dependants)) {
      throw new Error('Dependents field must contain a numeric value.');
    }
    await this.page.fill('#dependants', employee.dependants.toString());
  
    const saveButton = this.page.locator('#addEmployee');
    await saveButton.click();
  
  }

async validateRowByParameters(expect, employee, expectedRowData) {
    const rows = this.page.locator(`${this.tableBody} tr`);
    const rowCount = await rows.count();
  
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = rows.nth(rowIndex); 
      const cells = row.locator('td'); 
      const actualRowData = await cells.allTextContents(); 
  
      const cleanedRowData = actualRowData.map((cell) => cell.trim());
      const dataWithoutIdAndActions = cleanedRowData.slice(1, -1); 
  
      if (
        dataWithoutIdAndActions.includes(employee.firstName) &&
        dataWithoutIdAndActions.includes(employee.lastName) &&
        dataWithoutIdAndActions.includes(employee.dependants.toString())
      ) {
        expect(dataWithoutIdAndActions).toEqual(expectedRowData);
        return; 
      }
    }
  
    throw new Error(
      `Row with parameters "${employee.firstName}, ${employee.lastName}, ${employee.dependants}" not found in the table.`
    );
  }
 
async getAllEmployeeIds() {
    const rows = this.page.locator(`${this.tableBody} tr`);
    const rowCount = await rows.count();
  
    const ids = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = rows.nth(rowIndex); 
      const idCell = row.locator('td').first(); 
      const id = await idCell.textContent();
      ids.push(id.trim());
    }
  
    return ids;
  }
  
  async deleteEmployeeById(employeeId) {
    const employeeRow = await this.page.locator(`#employeesTable tbody tr:has(td:has-text("${employeeId}"))`);
  
    const deleteIcon = employeeRow.locator('i.fas.fa-times');
    await deleteIcon.click();
  
  
    const deleteButton = this.page.locator('#deleteEmployee');
    await deleteButton.click();
  
    await this.page.waitForTimeout(1000); 
  }
  

async editEmployeeById(employeeId, updatedEmployeeData, expect) {
    const rows = this.page.locator(`${this.tableBody} tr`);
    const rowCount = await rows.count();
  
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = rows.nth(rowIndex);
      const cells = row.locator('td');
      const actualRowData = await cells.allTextContents();
  
      if (actualRowData[0].trim() === employeeId) {
        const editIcon = row.locator('i.fas.fa-edit');
        await editIcon.click();
  
        const modal = this.page.locator('.modal.show');
        await expect(modal).toBeVisible();
  
        await this.page.fill('#firstName', updatedEmployeeData.firstName);
        await this.page.fill('#lastName', updatedEmployeeData.lastName);
        await this.page.fill('#dependants', updatedEmployeeData.dependants.toString());
  
        const saveButton = this.page.locator('#updateEmployee');
        await saveButton.click();
  
        return;
      }
    }
  
    throw new Error(`Employee with ID "${employeeId}" not found in the table.`);
  }
  
  
}
