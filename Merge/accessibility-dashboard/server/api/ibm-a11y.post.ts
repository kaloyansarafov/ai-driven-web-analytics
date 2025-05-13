import { defineEventHandler, readBody, createError } from 'h3';
import { chromium } from 'playwright';
import { URL } from 'url';
import { getCompliance } from 'accessibility-checker';

interface IbmA11yResult {
  level: 'violation' | 'potentialviolation' | 'recommendation' | 'Needs review';
  ruleId: string;
  message: string;
  context: string;
  snippet: string;
  help: string;
  impact: string;
  path: {
    dom: string;
  };
}

interface IbmA11ySummary {
  counts: {
    violations: number;
    potentialViolations: number;
    recommendations: number;
    needsReview: number;
  };
}

interface IbmA11yReport {
  results: IbmA11yResult[];
  summary: IbmA11ySummary;
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
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    let context, page;

    try {
      context = await browser.newContext();
      page = await context.newPage();
      try {
        // Navigate to the target URL
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Run the accessibility checker
        const compliance = await getCompliance(page, 'memory-only');
        
        // Type assertion with unknown as intermediate step
        const report = (compliance.report as unknown) as IbmA11yReport;

        if (!report.results || !Array.isArray(report.results)) {
          throw new Error('Invalid report format from IBM A11y checker');
        }

        // Process the results
        const issues = report.results.map(result => ({
          type: result.level === 'violation' ? 'error' : 
                result.level === 'potentialviolation' ? 'warning' : 'notice',
          code: result.ruleId,
          message: result.message,
          context: result.snippet,
          source: 'ibm-a11y',
          selector: result.path.dom,
          detail: result.help,
          impact: result.impact
        }));

        return {
          success: true,
          issues,
          compliance,
          summary: {
            violations: report.summary?.counts?.violations || 0,
            potentialViolations: report.summary?.counts?.potentialViolations || 0,
            recommendations: report.summary?.counts?.recommendations || 0,
            needsReview: report.summary?.counts?.needsReview || 0
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
    console.error('IBM A11y scan error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to run IBM A11y scan'
    });
  }
}); 