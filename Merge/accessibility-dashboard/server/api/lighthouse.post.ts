import { defineEventHandler, readBody, createError } from 'h3';
import puppeteer from 'puppeteer';
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

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Run Lighthouse
      const { lhr } = await lighthouse(url, {
        port: (new URL(browser.wsEndpoint())).port,
        output: 'json',
        logLevel: 'info',
        onlyCategories: ['performance','accessibility', 'seo', 'best-practices'],
        skipAudits: ['screenshot-thumbnails', 'final-screenshot', 'full-page-screenshot']
      });

      // Process the results
      const rawResults = lhr?.audits;

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