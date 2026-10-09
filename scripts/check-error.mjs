import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  // Test both desktop and mobile
  for (const viewport of [
    { width: 375, height: 667, name: 'mobile' },
    { width: 1280, height: 800, name: 'desktop' }
  ]) {
    console.log(`\n=== Testing ${viewport.name} (${viewport.width}x${viewport.height}) ===`);
    const page = await browser.newPage({ viewport });
    
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`[${viewport.name} CONSOLE ERROR]:`, msg.text());
    });
    page.on('pageerror', err => {
      console.log(`[${viewport.name} PAGEERROR]:`, err.message);
      console.log(err.stack);
    });

    try {
      await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(2000);

      // Scroll a bit to trigger scroll events
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      // Check nextjs-portal
      const portalInfo = await page.evaluate(() => {
        const portal = document.querySelector('nextjs-portal');
        if (portal && portal.shadowRoot) {
          return portal.shadowRoot.innerHTML;
        }
        return null;
      });

      if (portalInfo) {
        console.log(`[${viewport.name} PORTAL]:`, portalInfo.slice(0, 500));
      } else {
        console.log(`[${viewport.name}]: No error portal found.`);
      }
    } catch (e) {
      console.error(`[${viewport.name} FAILED]:`, e.message);
    }
    await page.close();
  }

  await browser.close();
}

check();
