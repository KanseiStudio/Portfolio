import { chromium } from 'file:///C:/Users/User/AppData/Local/npm-cache/_npx/5e2e484947874241/node_modules/playwright/index.mjs';
const CHROME = 'C:/Users/User/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe';
const OUT = 'C:/Users/User/AppData/Local/Temp/';
const b = await chromium.launch({ executablePath: CHROME, headless: true });
const errs = [];

for (const [w, h] of [[1440,900],[1280,720]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type()==='error') errs.push(`${w}x${h}: ${m.text()}`); });
  await p.goto('http://localhost:3000/it', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  await p.screenshot({ path: `${OUT}home-${w}x${h}.png` });
  await ctx.close();
}

console.log('errors:', errs.length ? errs : 'none');
await b.close();
