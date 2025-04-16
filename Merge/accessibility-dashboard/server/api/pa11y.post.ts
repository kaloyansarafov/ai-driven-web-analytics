import { defineEventHandler, readBody } from "h3";
import pa11y from "pa11y";
import axios from "axios";
import { JSDOM } from "jsdom";

// Function to extract links from a webpage
async function getLinksFromPage(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const links = Array.from(dom.window.document.querySelectorAll("a"))
      .map((link: Element) => (link as HTMLAnchorElement).href)
      .filter(
        (href) =>
          href &&
          !href.startsWith("#") &&
          !href.startsWith("javascript:") &&
          !href.startsWith("mailto:")
      )
      .map((href) => {
        try {
          // Convert relative URLs to absolute
          if (href.startsWith("/")) {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${href}`;
          }

          // Only return URLs from the same domain
          const baseUrl = new URL(url).hostname;
          const linkUrl = new URL(href).hostname;

          if (baseUrl === linkUrl) {
            return href;
          }
          return null;
        } catch (e) {
          return null;
        }
      })
      .filter((href): href is string => href !== null);

    return [...new Set(links)]; // Remove duplicates
  } catch (error) {
    console.error(`Error fetching links from ${url}:`, error);
    return [];
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.url) {
      return {
        statusCode: 400,
        body: {
          error: "URL is required",
        },
      };
    }

    // Configure Pa11y options with enhanced settings
    const options: any = {
      standard: body.standard || "WCAG2AA",
      includeNotices: true,
      includeWarnings: true,
      timeout: 60000, // 60 second timeout
      wait: 1000, // Wait for 1000ms after page load to ensure JavaScript execution
      chromeLaunchConfig: {
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--headless",
        ],
      },
    };

    // Add optional parameters if provided
    if (body.actions) options.actions = body.actions;
    if (body.headers) options.headers = body.headers;
    if (body.hideElements) options.hideElements = body.hideElements;
    if (body.runners) options.runners = body.runners;
    if (body.rules) options.rules = body.rules;
    if (body.screenCapture) options.screenCapture = body.screenCapture;

    // Check if multi-page crawling is requested
    const shouldCrawl = body.crawl === true;
    const maxPages = body.maxPages || 5; // Limit to prevent excessive crawling

    if (!shouldCrawl) {
      // Single page scan
      const result = await pa11y(body.url, options);

      // Add metadata
      result.date = new Date().toISOString();
      result.pageUrl = body.url;

      return {
        pages: [result],
        summary: {
          pagesScanned: 1,
          totalErrors: result.issues.filter(
            (issue: any) => issue.type === "error"
          ).length,
          totalWarnings: result.issues.filter(
            (issue: any) => issue.type === "warning"
          ).length,
          totalNotices: result.issues.filter(
            (issue: any) => issue.type === "notice"
          ).length,
        },
      };
    } else {
      // Multi-page crawling
      const scannedUrls = new Set<string>();
      const pagesToScan = [body.url];
      const results = [];

      let totalErrors = 0;
      let totalWarnings = 0;
      let totalNotices = 0;

      // Crawl and scan pages up to the max limit
      while (pagesToScan.length > 0 && scannedUrls.size < maxPages) {
        const currentUrl = pagesToScan.shift();

        if (!currentUrl || scannedUrls.has(currentUrl)) continue;

        scannedUrls.add(currentUrl);
        console.log(
          `Scanning page ${scannedUrls.size}/${maxPages}: ${currentUrl}`
        );

        // Run Pa11y on the current page
        try {
          const result = await pa11y(currentUrl, options);

          // Add metadata
          result.date = new Date().toISOString();
          result.pageUrl = currentUrl;

          // Count issues
          const errors = result.issues.filter(
            (issue: any) => issue.type === "error"
          ).length;
          const warnings = result.issues.filter(
            (issue: any) => issue.type === "warning"
          ).length;
          const notices = result.issues.filter(
            (issue: any) => issue.type === "notice"
          ).length;

          totalErrors += errors;
          totalWarnings += warnings;
          totalNotices += notices;

          results.push(result);

          // Find links on the page to add to scan queue
          if (scannedUrls.size < maxPages) {
            const links = await getLinksFromPage(currentUrl);
            for (const link of links) {
              if (
                !scannedUrls.has(link) &&
                !pagesToScan.includes(link) &&
                scannedUrls.size + pagesToScan.length < maxPages
              ) {
                pagesToScan.push(link);
              }
            }
          }
        } catch (error) {
          console.error(`Error scanning ${currentUrl}:`, error);
        }
      }

      return {
        pages: results,
        summary: {
          pagesScanned: results.length,
          totalErrors,
          totalWarnings,
          totalNotices,
          scannedUrls: Array.from(scannedUrls),
        },
      };
    }
  } catch (error: any) {
    console.error("Pa11y API error:", error);

    return {
      statusCode: 500,
      body: {
        error: error.message || "An error occurred running the Pa11y test",
      },
    };
  }
});
