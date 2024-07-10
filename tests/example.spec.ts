import { test, expect, Frame } from '@playwright/test';
import CryptoJS from 'crypto-js';
import { config } from '../config';

// Function to decrypt the password
function decryptPassword(encryptedPassword: string, secretKey: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Navigate to Atera login page
async function navigateToLoginPage(page: any) {
  await page.goto('https://app.atera.com/login');
}

// Login to the application
async function loginToAtera(page: any) {
  await page.fill('#username', 'atera-automation-exercise@atera.com');
  await page.click('button[type="submit"]');
  const decryptedPassword = decryptPassword(config.encryptedPassword, config.secretKey);
  await page.fill('#password', decryptedPassword);
  await page.click('._button-login-password');
  await page.waitForSelector('h1.title.atera-typography-heading-l');
}

// Dismiss the "Get Started" pop-up 
async function dismissGetStartedPopup(page: any) {
  const iframeElement = await page.locator('.apcl-left iframe');
  if (iframeElement) {
    const iframe: Frame | null = await iframeElement.contentFrame();
    if (iframe) {
      await iframe.locator('.checklist-footer button.skip-link').click();
    } else {
      console.log('Could not get content frame from iframe element');
    }
  } else {
    console.log('Iframe element not found');
  }
}

enum MenuItem {
  Dashboard = 'menu-item-1',
  Tickets = 'menu-item-2',
  Customers = 'menu-item-3',
  Devices = 'menu-item-4',
  Alerts = 'menu-item-5',
  AppCenter = 'menu-item-6',
  Network = 'menu-item-7',
  KnowledgeBase = 'menu-item-8',
  Reports = 'menu-item-9',
  ReferAFriend = 'menu-item-10',
}

// Click on menu item using the enum menu
async function clickOnMenuItem(page: any, menuItem: MenuItem) {
  await page.click(`#${menuItem}`);
}

// Get number of open tickets from the 'Ticket Status' widget
async function getNumberOfOpenTickets(page: any): Promise<number> {
  // Todo: improve locator
  const ticketWidgetElement = await page.locator('#main-content > div > dashboard-page > div > div > gridster > gridster-item:nth-child(36) > dashboard-card > div > div.h-full.widget-content.gridster-item-content.cursor-default.scrollable > dashboard-widget > kpi > div > span:nth-child(1) > span');
  const text = await ticketWidgetElement.textContent();
  const match = text !== null ? text.match(/\d+/) : null;
  return match ? parseInt(match[0]) : NaN;
}

// Click on the "Open" button on the dashboard tab
async function clickOpenButtonOnDashboard(page: any) {
  await page.click('[data-automation-id=":atera-pill"]');
}

test.describe('Atera Tests', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToLoginPage(page);
    await loginToAtera(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Atera dashboard', async ({ page }) => {
    // await dismissGetStartedPopup(page); 
    await clickOnMenuItem(page, MenuItem.Dashboard);
    
    const numberOfOpenTickets = await getNumberOfOpenTickets(page);
    // verify that number of tickets is less than 10 (not to loaded)
    expect(numberOfOpenTickets).toBeLessThan(10);
    
    // navigate to review the tickets to prioritize the tasks
    await clickOpenButtonOnDashboard(page);
  });
});
