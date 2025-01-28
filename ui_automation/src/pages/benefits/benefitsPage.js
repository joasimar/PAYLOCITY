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
  
  
    let fieldRetries = 0;
    const maxFieldRetries = 3;

    while (fieldRetries < maxFieldRetries) {
        // Validate that the fields are visible and ready to be filled
        const firstNameField = this.page.locator('#firstName');
        const lastNameField = this.page.locator('#lastName');
        const dependantsField = this.page.locator('#dependants');

        const fieldsVisible = await firstNameField.isVisible() && await lastNameField.isVisible() && await dependantsField.isVisible();

        if (fieldsVisible) {
            console.log('Fields are visible, proceeding to fill the form.');
            break; // Proceed if the fields are visible
        } else {
            console.log('Form fields are not visible, retrying...');
            fieldRetries++;
            if (fieldRetries >= maxFieldRetries) {
                throw new Error('Form fields not visible after multiple retries.');
            }
            await this.page.waitForTimeout(1000); // Wait before retrying
            // Retry clicking the "Add Employee" button again if fields are not visible
            await addButton.click();
        }
    }

    // Fill the form fields
    await this.page.fill('#firstName', employee.firstName);
    await this.page.fill('#lastName', employee.lastName);
    await this.page.fill('#dependants', employee.dependants.toString());;
  
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
      const idCell = row.locator('td').first(); // Suponiendo que el ID está en la primera columna
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
  async validateRowData(employeeRow, expectedRowData, expect) {
    const rowData = await employeeRow.locator('td').allTextContents();
    const cleanedRowData = rowData.map((cell) => cell.trim()); // Limpiar los datos

    for (let i = 0; i < expectedRowData.length; i++) {
      await expect(cleanedRowData[i]).toBe(expectedRowData[i]); // Validamos los datos fila por fila
    }
  }
  async findEmployeeRowById(employeeId) {
    const rows = this.page.locator(`${this.tableBody} tr`);
    const rowCount = await rows.count();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = rows.nth(rowIndex);
      const rowId = await row.locator('td').first().textContent();
      if (rowId.trim() === employeeId) {
        return row; 
      }
    }
    throw new Error('Employee not found');
  }

  async addAndValidateEmployee(employee, expect) {
    const initialIds = await this.getAllEmployeeIds(); 
    console.log('Initial Employee IDs:', initialIds);
  
    console.log('Adding a new employee...');
    await this.addEmployee(employee, expect); 
    console.log('Employee added.');
  
    console.log('Waiting for the table to update...');
    const initialRowCount = await this.page.locator(`${this.tableBody} tr`).count();
    console.log(`Initial row count: ${initialRowCount}`);
    
    let retryCount = 0;
    const maxRetries = 3;
    let rowCountChanged = false;
  
    while (retryCount < maxRetries && !rowCountChanged) {
      await this.page.waitForTimeout(1000); 
      const updatedRowCount = await this.page.locator(`${this.tableBody} tr`).count();
      console.log(`Row count after ${retryCount + 1} second(s): ${updatedRowCount}`);
  
      if (updatedRowCount > initialRowCount) {
        rowCountChanged = true;
        console.log('Row count increased. New employee added.');
      } else {
        retryCount++;
      }
    }
  
    if (!rowCountChanged) {
      throw new Error('Employee not added, table row count did not increase.');
    }
  
    const updatedIds = await this.getAllEmployeeIds();
    const newEmployeeId = updatedIds.find(id => !initialIds.includes(id)); 
    console.log(`Found new employee ID: ${newEmployeeId}`);
    
    expect(newEmployeeId).toBeDefined(); 
  
    console.log('Locating the row for the new employee...');
    const employeeRow = await this.findEmployeeRowById(newEmployeeId);
    console.log('Row found for the new employee.');
  
    const expectedRowData = [
      employee.lastName,  
      employee.firstName, 
      employee.dependants.toString(), 
      '52000.00',     
      '2000.00',         
      '115.38',           
      '1884.62',          
    ];
  
    console.log('Validating row data...');
    try {
      const rowData = await employeeRow.locator('td').allTextContents();
      console.log('Row Data:', rowData); 
      const rowDataToCompare = rowData.slice(1, -1); 
      console.log('Row Data to Compare:', rowDataToCompare);
  
      console.log('Expected Data:', expectedRowData);
  
      for (let i = 0; i < rowDataToCompare.length; i++) {
        console.log(`Comparing Row Data: ${rowDataToCompare[i]} === Expected Data: ${expectedRowData[i]}`);
        expect(rowDataToCompare[i].trim()).toBe(expectedRowData[i].trim());  
      }
  
      console.log('Validation successful: Row data matches expected.');
    } catch (error) {
      console.error('Validation failed:', error);
      throw new Error(`Validation failed: ${error.message}`);
    }
  }
  
  async verifyUpdatedEmployeeInTable(updatedEmployee) {
    // Locate the row for the updated employee by first name
    const employeeRowUpdated = await this.page.locator(`#employeesTable tbody tr:has(td:has-text("${updatedEmployee.firstName}"))`);
    
    // Get the first and last name from the table row
    const firstNameInTable = await employeeRowUpdated.locator('td:nth-child(3)').textContent(); 
    const lastNameInTable = await employeeRowUpdated.locator('td:nth-child(2)').textContent(); 
  
    // Return the extracted data to be used for validation
    return { firstNameInTable, lastNameInTable };
  }
  async addEmployeeAndValidateRowData(employee, expect) {
    const benefitsPage = new BenefitsPage(page);

    const initialRowCount = await page.locator(`${benefitsPage.tableBody} tr`).count();

    console.log(`Initial row count: ${initialRowCount}`);

    await benefitsPage.addEmployee(employee, expect);

    let retryCount = 0;
    const maxRetries = 3;
    let rowCountChanged = false;

    while (retryCount < maxRetries && !rowCountChanged) {
        await page.waitForTimeout(1000); 

        const updatedRowCount = await page.locator(`${benefitsPage.tableBody} tr`).count();
        console.log(`Row count after ${retryCount + 1} second(s): ${updatedRowCount}`);

        if (updatedRowCount > initialRowCount) {
            rowCountChanged = true;
            console.log('Row count increased. New employee added.');
        } else {
            retryCount++;
        }
    }

    if (!rowCountChanged) {
        throw new Error('Employee not added, table row count did not increase.');
    }

    const updatedRowData = [
        employee.lastName,  
        employee.firstName, 
        employee.dependants.toString(), 
        '52000.00',         
        '2000.00',          
        '115.38',          
        '1884.62',    
    ];

    const rows = await page.locator(`${benefitsPage.tableBody} tr`);
    const newRow = rows.nth(updatedRowCount - 1); 

    await benefitsPage.validateRowData(expect, newRow, updatedRowData);
}


async getEmployeeCurrentData(employeeIdToEdit) {
  // Locate the employee row by employeeId
  const employeeRow = await this.page.locator(`#employeesTable tbody tr:has(td:has-text("${employeeIdToEdit}"))`);
  
  // Get current first and last name values
  const currentFirstName = await employeeRow.locator('td:nth-child(3)').textContent();
  const currentLastName = await employeeRow.locator('td:nth-child(2)').textContent();

  return {
    currentFirstName: currentFirstName.trim(),
    currentLastName: currentLastName.trim(),
  };
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
