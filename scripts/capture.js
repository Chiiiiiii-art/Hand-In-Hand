import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_DIR = path.resolve('race/assets/screenshots');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await wait(200);
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

async function main() {
  console.log('Building app...');
  const buildProc = spawn('npm', ['run', 'build'], { shell: true, stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    buildProc.on('close', code => (code === 0 ? resolve() : reject(new Error('Build failed'))));
  });

  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'pipe'
  });

  try {
    await waitForServer('http://localhost:4173/');
    console.log('Server is ready on http://localhost:4173/');

    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1.5,
      }
    });

    const page = await browser.newPage();

    async function preparePage() {
      await page.evaluate(() => {
        const fab = document.querySelector('aside[aria-label="展示與走查控制台"]');
        if (fab) fab.style.display = 'none';
        const header = document.querySelector('header[role="banner"]');
        if (header) header.style.position = 'static';
      });
    }

    // 1. 01_base_home.png: 小組基地首頁與同伴狀態感知條
    console.log('Capturing 01_base_home.png...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
    await preparePage();
    await wait(500);
    await page.setViewport({ width: 1440, height: 780, deviceScaleFactor: 1.5 });
    await page.screenshot({
      path: path.join(TARGET_DIR, '01_base_home.png'),
      clip: { x: 0, y: 0, width: 1440, height: 760 }
    });

    // 2. 02_coop_tasks.png: 合作任務與多元貢獻分工路徑 (full 4 cards with comfortable bottom margin)
    console.log('Capturing 02_coop_tasks.png...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
    await preparePage();
    await wait(400);

    const taskCardRect = await page.evaluate(() => {
      const taskSec = document.querySelector('section[aria-labelledby="active-task-heading"]');
      if (!taskSec) return null;
      taskSec.scrollIntoView({ behavior: 'instant', block: 'start' });
      const rect = taskSec.getBoundingClientRect();
      return {
        x: Math.max(0, rect.x - 20),
        y: Math.max(0, window.scrollY + rect.y - 16),
        width: rect.width + 40,
        height: 610 // gives ample room for all 4 cards and their bottom borders
      };
    });

    if (taskCardRect) {
      await page.screenshot({
        path: path.join(TARGET_DIR, '02_coop_tasks.png'),
        clip: taskCardRect
      });
    }

    // 3. 03_proposals_voting.png: 共同家園設計提案與小組表決決策
    console.log('Capturing 03_proposals_voting.png...');
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      const propHeading = headings.find(h => h.textContent.includes('設計提案與小組投票'));
      if (propHeading) {
        propHeading.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    await wait(400);

    const propBox = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      const propHeading = headings.find(h => h.textContent.includes('設計提案與小組投票'));
      if (!propHeading) return null;
      const target = propHeading.parentElement.parentElement;
      const rect = target.getBoundingClientRect();
      return {
        x: Math.max(0, rect.x - 20),
        y: Math.max(0, window.scrollY + rect.y - 16),
        width: rect.width + 40,
        height: rect.height + 32
      };
    });

    if (propBox) {
      await page.screenshot({
        path: path.join(TARGET_DIR, '03_proposals_voting.png'),
        clip: propBox
      });
    }

    // 4. 04_reflection_plan.png: 低壓力交流回顧與下次相聚目標共識
    console.log('Capturing 04_reflection_plan.png...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const reflectTab = buttons.find(b => b.textContent.includes('交流分享與接續'));
      if (reflectTab) reflectTab.click();
    });
    await wait(600);
    await preparePage();

    const reflectBox = await page.evaluate(() => {
      const sec = document.querySelector('section[aria-labelledby="reflection-title"]');
      if (!sec) return null;
      sec.scrollIntoView({ behavior: 'instant', block: 'start' });
      const rect = sec.getBoundingClientRect();
      return {
        x: Math.max(0, rect.x - 20),
        y: Math.max(0, window.scrollY + rect.y - 16),
        width: rect.width + 40,
        height: 740
      };
    });

    if (reflectBox) {
      await page.screenshot({
        path: path.join(TARGET_DIR, '04_reflection_plan.png'),
        clip: reflectBox
      });
    }

    // 5. 05_host_console.png: 小隊長即時支援與卡關調適工作台 (both members list + help desk)
    console.log('Capturing 05_host_console.png...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hostBtn = buttons.find(b => b.textContent.includes('引導主持'));
      if (hostBtn) hostBtn.click();
    });
    await wait(800);
    await preparePage();
    await page.setViewport({ width: 1440, height: 1150, deviceScaleFactor: 1.5 });
    await page.screenshot({
      path: path.join(TARGET_DIR, '05_host_console.png'),
      clip: { x: 0, y: 0, width: 1440, height: 1120 }
    });

    console.log('All 5 screenshots updated with premium quality!');
    await browser.close();
  } finally {
    server.kill();
  }
}

main().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
