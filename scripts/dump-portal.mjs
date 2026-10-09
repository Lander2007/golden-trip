import { chromium } from 'playwright';
import fs from 'fs';

async function dumpPortal() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  page.on('pageerror', err => {
    fs.writeFileSync('pageerror.txt', `${err.message}\n${err.stack}`);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const portalHTML = await page.evaluate(() => {
    const p = document.querySelector('nextjs-portal');
    return p && p.shadowRoot ? p.shadowRoot.innerHTML : 'none';
  });

  fs.writeFileSync('portal-dump.html', portalHTML);
  console.log('Saved portal-dump.html, length:', portalHTML.length);

  await browser.close();
}

dumpPortal();
