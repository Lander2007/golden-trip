import { chromium } from 'playwright';

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  page.on('pageerror', err => {
    console.error('*** CAUGHT PAGEERROR ***');
    console.error(err.message);
    console.error(err.stack);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('*** CONSOLE ERROR ***', msg.text());
    }
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  console.log('Testing resize loop...');
  for (let w of [1024, 768, 600, 375, 414, 768, 1200]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(300);
  }

  console.log('Testing fast scrolling...');
  for (let y = 0; y <= 5000; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }

  console.log('Testing fast scrolling back up...');
  for (let y = 5000; y >= 0; y -= 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }

  console.log('Testing interaction with buttons...');
  const buttons = await page.$$('button');
  for (const btn of buttons.slice(0, 10)) {
    try {
      if (await btn.isVisible()) {
        await btn.hover();
      }
    } catch {}
  }

  await page.waitForTimeout(1000);
  console.log('Finished tests.');
  await browser.close();
}

testAll();
