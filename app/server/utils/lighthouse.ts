import lighthouse from 'lighthouse';
import { Browser } from 'puppeteer';

export async function getLighthouseReport(url: string, browser: Browser) {
  const options = {
    logLevel: 'info' as 'info',
    output: 'json' as 'json',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    disableStorageReset: true,
    skipAudits: ['screenshot-thumbnails', 'final-screenshot', 'screenshot', 'FullPageScreenshot'],
    port: parseInt(new URL(browser.wsEndpoint()).port)
  };

  const runnerResult = await lighthouse(url, options);
  if (!runnerResult) {
    throw new Error('Lighthouse audit failed');
  }
  
  return runnerResult.lhr;
} 