import { test, expect, Frame } from '@playwright/test';
import assert from 'assert';

test('atera', async ({ page }) => { //Todo: before and after test close browser
  // Navigate to the Atera login page
  await page.goto('https://app.atera.com/login');

  // Fill in the username field
  await page.fill('#username', 'atera-automation-exercise@atera.com');

  // Click submit button to continue
  await page.click('button[type="submit"]');

  // Fill in the password field 
  await page.fill('#password', 'sjAh8lfE@m~dotC5'); //Todo: encrypt password

  // Click the login button to complete the login process
  await page.click('._button-login-password');

  // Wait for the headers to load
  await page.waitForSelector('h1.title.atera-typography-heading-l');

  // Dismiss get started pop up 
 // Get the iframe element
//  const iframeElement = await page.locator('.apcl-left iframe');
//   if (iframeElement) {
//     // Get the content frame of the iframe
//     const iframe: Frame | null = await iframeElement.contentFrame();

//     if (iframe) {
//       // Interact with elements inside the iframe
//       await iframe.locator('.checklist-footer button.skip-link').click();
//       // await iframe.locator('.button-default').click();
//     } else {
//       console.log('Could not get content frame from iframe element');
//     }
//   } else {
//     console.log('Iframe element not found');
//   }


//Click on the 'Dashboard' button on the vertical menu
await page.click('#menu-item-1');

// Get the number of 'Open' tickets
const ticketWidgetElement = await page.locator('#main-content > div > dashboard-page > div > div > gridster > gridster-item:nth-child(36) > dashboard-card > div > div.h-full.widget-content.gridster-item-content.cursor-default.scrollable > dashboard-widget > kpi > div > span:nth-child(1) > span');
const text = await ticketWidgetElement.textContent();

const match = text !== null? text.match(/\d+/) : 0; // Using regex to match digits
const numberOfOpenTickets: number = match ? parseInt(match[0]) : NaN;
expect(numberOfOpenTickets).toBe(9)

//Click on the 'Open' button on the dashboard tab
await page.click('[data-automation-id=":atera-pill"]')


// Close the browser
  await page.close();
});

