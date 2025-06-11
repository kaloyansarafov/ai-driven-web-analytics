import { defineEventHandler, readBody, createError } from 'h3';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { URL } from 'url';

interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  explanation?: string;
  selector?: string;
  impact?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = body;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      });
    }

    // Launch Playwright Chromium
    const browser = await chromium.launch({
      headless: true,
      args: ['--remote-debugging-port=9222', '--no-sandbox', '--disable-setuid-sandbox']
    });
    let context, page;

    // Get the wsEndpoint for Lighthouse
    // Playwright does not expose wsEndpoint directly, so we use the default port
    // Lighthouse will connect to ws://localhost:9222
    try {
      context = await browser.newContext();
      page = await context.newPage();
      try {
        // Run Lighthouse
        const result = await lighthouse(url, {
          port: 9222,
          output: 'json',
          logLevel: 'info',
          onlyCategories: ['performance','accessibility', 'seo', 'best-practices'],
          skipAudits: ['screenshot-thumbnails', 'final-screenshot', 'full-page-screenshot']
        });
        const lhr = result?.lhr;
        if (!lhr) throw new Error('Lighthouse did not return results');

        // Process the results
        const rawResults = lhr.audits;

        const audits = Object.values(lhr.audits)
          .filter((audit: any) => audit.score !== null && audit.score < 1)
          .map((audit: any): LighthouseAudit => ({
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            scoreDisplayMode: audit.scoreDisplayMode,
            explanation: audit.explanation,
            selector: audit.explanation,
            impact: audit.impact
          }));

        return {
          success: true,
          rawResults,
          audits,
          categories: {
            accessibility: lhr.categories.accessibility,
            seo: lhr.categories.seo
          }
        };
      } finally {
        // Always close page and context
        if (page) await page.close();
        if (context) await context.close();
      }
    } finally {
      // Always close browser
      await browser.close();
    }
  } catch (error: any) {
    console.error('Lighthouse scan error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to run Lighthouse scan'
    });
  }
}); 