import { chromium, devices } from 'playwright';

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  const iPhone = devices['iPhone 14 Pro'];
  const context = await browser.newContext({
    ...iPhone,
  });

  const page = await context.newPage();

  let hasError = false;
  page.on('pageerror', err => {
    hasError = true;
    console.error('*** PAGEERROR ***', err.message);
    console.error(err.stack);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('*** CONSOLE ERROR ***', msg.text());
    }
  });

  console.log('Navigating to http://localhost:3000 on iPhone 14 Pro emulation...');
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Try touch scroll
  await page.touchscreen.tap(200, 300);
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(1000);

  const portal = await page.evaluate(() => {
    const el = document.querySelector('nextjs-portal');
    if (!el || !el.shadowRoot) return null;
    return el.shadowRoot.innerHTML;
  });

  if (portal) {
    console.log('Portal found:', portal.slice(0, 400));
  } else {
    console.log('No portal found.');
  }

  await browser.close();
}

testMobile();
