export default class BasePage {
    constructor(page) {
      this.page = page;
    }
  
  
    async navigateTo(url) {
      console.log(`Navigating to: ${url}`);
      await this.page.goto(url);
    }
  
  
    async waitForElement(selector) {
      await this.page.waitForSelector(selector, { state: 'visible' });
    }
  
  
    async verifyElementVisible(selector) {
      const element = this.page.locator(selector);
      await expect(element).toBeVisible();
    }
  

    async takeScreenshot(name = 'screenshot') {
      await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
  }
  