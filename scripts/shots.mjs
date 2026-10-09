import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shotsDir = path.join(__dirname, '..', 'shots');

if (!fs.existsSync(shotsDir)) {
  fs.mkdirSync(shotsDir, { recursive: true });
}

const sizes = [
  // Phones portrait
  { width: 320, height: 568, name: 'phone-pt-320' },
  { width: 360, height: 640, name: 'phone-pt-360' },
  { width: 390, height: 844, name: 'phone-pt-390' },
  { width: 430, height: 932, name: 'phone-pt-430' },
  // Phones landscape
  { width: 568, height: 320, name: 'phone-ls-568' },
  { width: 844, height: 390, name: 'phone-ls-844' },
  { width: 932, height: 430, name: 'phone-ls-932' },
  // Tablets
  { width: 768, height: 1024, name: 'tablet-pt-768' },
  { width: 1024, height: 768, name: 'tablet-ls-1024' },
  // Laptop/desktop
  { width: 1280, height: 720, name: 'desktop-1280' },
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 1920, height: 1080, name: 'desktop-1920' },
];

const routes = [
  { path: '/', name: 'home' },
  { path: '/login', name: 'login' },
  { path: '/signup', name: 'signup' }
];

const BASE_URL = 'http://localhost:8443';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  let overflowIssues = [];

  for (const route of routes) {
    for (const size of sizes) {
      console.log(`Testing ${route.name} at ${size.width}x${size.height} (${size.name})...`);
      const page = await context.newPage();
      
      // Handle mobile/touch emulation based on size
      if (size.width < 1024) {
        await page.emulateMedia({ media: 'screen' }); // just forcing some defaults if needed
      }

      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      
      // Wait for any initial animations
      await page.waitForTimeout(1000);

      // Scroll the full page in steps of 70% of the viewport
      let hasMoreToScroll = true;
      while (hasMoreToScroll) {
        hasMoreToScroll = await page.evaluate(async () => {
          const scrollStep = window.innerHeight * 0.7;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (window.scrollY < maxScroll) {
            window.scrollBy(0, scrollStep);
            return window.scrollY < maxScroll;
          }
          return false;
        });
        await page.waitForTimeout(300); // let animations trigger
      }

      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasOverflow) {
        overflowIssues.push({ route: route.path, size: size.name, width: size.width });
      }

      // Scroll back to top before screenshot (or screenshot full page)
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      await page.screenshot({ 
        path: path.join(shotsDir, `${route.name}-${size.name}.png`),
        fullPage: true 
      });

      await page.close();
    }
  }

  await browser.close();

  if (overflowIssues.length > 0) {
    console.error('\n--- HORIZONTAL OVERFLOW REPORT ---');
    overflowIssues.forEach(issue => {
      console.error(`Route: ${issue.route}, Size: ${issue.size} (${issue.width}px)`);
    });
    console.error('----------------------------------\n');
  } else {
    console.log('\n--- HORIZONTAL OVERFLOW REPORT ---');
    console.log('No horizontal overflow detected at any size.');
    console.log('----------------------------------\n');
  }
}

run().catch(console.error);
