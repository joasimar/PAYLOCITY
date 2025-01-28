# Paylocity Automation Framework

This repository contains two automation frameworks designed to test both API endpoints and UI workflows. The frameworks are structured for scalability, maintainability, and ease of use, and they include dynamic configurations to handle multiple environments.

---

## **Framework Overview**

### **1. API Automation**
The API automation framework is designed to test RESTful APIs using Postman and Newman. It ensures that API endpoints are validated for correctness, performance, and security.

### **2. UI + API Automation**
The UI + API automation framework combines Playwright for UI testing and API testing. It supports end-to-end flows, including user interactions and API validation.

---

## **Project Structure**

```
paylocity/
├── api_automation/       # Framework for API testing
│   ├── collections/      # Postman collections and environment files
│   ├── reports/          # Newman test reports (HTML, CLI output)
│   ├── scripts/          # Supporting scripts for Newman execution
│   └── package.json      # Dependencies and npm scripts
│
├── ui_automation/        # Framework for UI + API testing
│   ├── node_modules/     # Node modules dependencies
│   ├── playwright-report/ # Playwright test reports (HTML output)
│   ├── src/              # Source code for the automation framework
│   │   ├── pages/        # Page Object Model (POM) classes
│   │   │   ├── benefits/ # Page objects related to benefits page
│   │   │   ├── login/    # Page objects related to login page
│   │   │   └── basePage.js # Base page class for shared actions across pages
│   │   ├── utils/        # Utility functions and reusable helpers
│   │   ├── test-results/ # Folder for test result data (e.g., screenshots)
│   ├── tests/            # Tests directory for API and UI tests
│   │   ├── api/          # API tests integrated with Playwright
│   │   ├── benefits/     # UI and API tests related to employee benefits
│   │   ├── login/        # UI and API tests related to login
│   │   └── tests-examples/ # Example tests
│   ├── .env              # Environment configuration file
│   ├── .gitignore        # Git ignore file to exclude unnecessary files
│   ├── package-lock.json # Auto-generated lock file for dependencies
│   ├── package.json      # Dependencies and npm scripts
│   └── playwright.config.js # Playwright configuration file
│
├── .github/workflows/    # CI/CD pipelines for GitHub Actions
│
└── README.md             # Documentation 

```

---

## **Setup and Installation**

### **Prerequisites**
- **Node.js**: Ensure Node.js (v16+) is installed. Check the version:
  ```bash
  node -v
  npm -v
  ```
- **Git**: Clone the repository and configure it for version control.

---

### **Steps to Install**

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd paylocity
   ```

2. **Install Dependencies**:
   - For API Automation:
     ```bash
     cd api_automation
     npm install
     ```
   - For UI + API Automation:
     ```bash
     cd ui_automation
     npm install
     ```

3. **Verify Setup**:
   - Ensure the required files and dependencies are installed.

---

## **Usage**

### **1. Running API Tests**
To run the API automation tests with Newman:
```bash
cd api_automation
npm run test
```

**Reports**:
- HTML reports are saved in `api_automation/reports/newman_report.html`.

### **2. Running UI + API Tests**
To run the Playwright tests:
```bash
cd ui_automation
npm run test
```

**Scripts**:
- `npm run test`: Runs all tests in headless mode.
- `npm run test-headed`: Runs all tests in headed mode for UI interaction visibility.
- `npm run debug`: Opens Playwright Inspector for debugging.
- `npm run report`: Opens the latest HTML test report.
- `npx playwright test --ui`: Opens the Playwright Test Runner UI for visualizing test execution.

**Reports**:
- HTML reports are saved in `ui_automation/playwright-report/`.

### **3. Testing in Different Environments**
- Modify the environment files in `api_automation/collections/`.
- Use `BASE_URL` for Playwright to specify the environment:
  ```bash
  BASE_URL=https://staging-server.com npm run test
  ```

---

## **Dynamic Data**
The frameworks support dynamic data generation to ensure tests run uniquely each time:
- Unique emails and phone numbers are dynamically generated in API tests.
- Reusable methods for creating test data are implemented in utility scripts.

---

## **Continuous Integration (CI)**

### **Pipeline Overview**
This project uses GitHub Actions to run tests automatically on every code change (push or pull request). 

- **Pipeline Steps:**
  1. Run API tests using `npm run test` in `api_automation`.
  2. Run UI tests using `npm run test` in `ui_automation`.
  3. Generate and store test reports for review.

### **How to Trigger CI Pipelines**
- Push or open a pull request to the main branch to trigger the pipeline.

To view the pipeline configuration, see `.github/workflows/`.

---

## **Customization**

### **1. Adding New API Tests**
1. Update the Postman collection in `api_automation/collections/`.
2. Run the tests with:
   ```bash
   npm run test
   ```

### **2. Adding New UI Tests**
1. Add a new file in `ui_automation/tests/`.
2. Write your test using Playwright syntax or leverage the Page Object Model (POM) classes in `pages/`.

 
   ```
3. Run the tests with:
   ```bash
   npm run test
   ```

---


Environment Configuration
The .env file is used to store environment-specific variables such as API URLs, credentials, and other sensitive information that are used throughout the automation framework.

1. Location of the .env File
The .env file is located in the ui_automation project directory, specifically in the root directory where it will be used by both the Playwright and API tests.

2. Example .env File Structure
env
Copiar
# API URL and credentials
LOGIN_URL=https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login
ACCOUNT=TestUser717
PASSWORD=lR8xn->myPP=
3. Environment Variables
LOGIN_URL: The URL used to authenticate with the API service. This is the login endpoint where authentication takes place.

ACCOUNT: The username for authentication. This variable stores the login account name used in the tests.

PASSWORD: The password associated with the login account. It is used to authenticate and access the API securely.

4. How to Use .env File
Step 1: Create a .env file in the root directory of your project (if not already created).

Step 2: Add the required environment variables in the .env file. The format should be KEY=VALUE.

Step 3: In your tests and configuration files, access these variables using process.env. For example:

javascript
Copiar
const loginUrl = process.env.LOGIN_URL;
const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;
5. Storing Sensitive Information
Security Note: Do not commit the .env file to version control (e.g., Git). Make sure to add it to .gitignore to avoid exposing sensitive information.

Example .gitignore entry:

bash
Copiar
.env


---


## **Best Practices**
- Use dynamic data generation for unique test inputs.
- Structure tests using Page Object Model (POM) for UI tests.
- Keep environment-specific configurations separate.
- Regularly monitor and update CI/CD pipelines.

---

## **Support**
If you encounter any issues, please reach out to the repository maintainers or raise an issue in the repository.

---

## **Future Enhancements**
- Integration with AI tools for smarter testing.
- Support for mobile device testing using Playwright.
- Visual regression testing for UI validation.
- Enhanced reporting with trend analysis of test execution over time.

---

## **Contributors**
- **Joasimar Palos** - Framework Developer

