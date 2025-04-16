import { defineEventHandler, readBody, createError } from "h3";
import puppeteer, {
  Browser as PuppeteerBrowser,
  Page as PuppeteerPage,
} from "puppeteer";
import pa11y from "pa11y";
import axios from "axios";
import { JSDOM } from "jsdom";

// Define interfaces for type safety
interface WaveItem {
  description: string;
  context?: string;
  selector?: string;
  count?: number;
  id?: string;
  [key: string]: any;
}

interface PageResult {
  url: string;
  toolResults: {
    pa11y?: any;
    wave?: any;
    [key: string]: any;
  };
  errors: number;
  warnings: number;
  notices: number;
  date: string;
}

interface AccessibilityIssue {
  type: "error" | "warning" | "notice";
  code: string;
  message: string;
  context?: string;
  source: "pa11y" | "wave" | "axe";
  selector?: string;
  detail?: string;
  pageUrl?: string;
  [key: string]: any;
}

// Function to extract links using Puppeteer
async function extractLinks(url: string, baseUrl: string): Promise<string[]> {
  let browser: PuppeteerBrowser | null = null;
  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--disable-gpu",
      ],
      headless: true,
    });
    const page: PuppeteerPage = await browser.newPage();

    // Validate URL and determine base hostname
    const validUrl =
      !url.startsWith("http://") && !url.startsWith("https://")
        ? `https://${url}`
        : url;
    let baseHostname = "";
    try {
      baseHostname = new URL(baseUrl).hostname;
    } catch (error) {
      const fixedBaseUrl =
        !baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")
          ? `https://${baseUrl}`
          : baseUrl;
      baseHostname = new URL(fixedBaseUrl).hostname;
    }

    // Navigate to the URL
    await page.goto(validUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for 2 seconds using modern syntax
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Extract links matching the base hostname
    const links = await page.evaluate((baseHost) => {
      const urlLinks = Array.from(document.querySelectorAll("a[href]"))
        .map((link) => {
          try {
            return (link as HTMLAnchorElement).href;
          } catch (e) {
            return null;
          }
        })
        .filter((href): href is string => {
          if (
            !href ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("#")
          ) {
            return false;
          }
          // Filter out non-HTTP protocols
          if (!href.startsWith("http:") && !href.startsWith("https:")) {
            return false;
          }
          // Filter out links to files (common extensions)
          if (
            /\.(pdf|zip|docx?|xlsx?|pptx?|jpe?g|png|gif|svg|webp)$/i.test(href)
          ) {
            return false;
          }
          try {
            const linkHostname = new URL(href).hostname;
            return linkHostname === baseHost;
          } catch (e) {
            return false;
          }
        });
      return [...new Set(urlLinks)];
    }, baseHostname);

    await page.close();
    if (browser) {
      await browser.close();
    }
    return links;
  } catch (error: any) {
    console.error(`Error extracting links from ${url}:`, error.message);
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("Error closing browser during link extraction error:", e);
      }
    }
    return [];
  }
}

// Run Pa11y test on a specific URL
async function runPa11yTest(url: string) {
  try {
    // Configure Pa11y options
    const options: pa11y.Options = {
      standard: "WCAG2AA",
      includeNotices: true,
      includeWarnings: true,
      timeout: 60000,
      wait: 2000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log,
      },
      chromeLaunchConfig: {
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-extensions",
          "--disable-features=IsolateOrigins",
          "--disable-site-isolation-trials",
        ],
      },
    };

    console.log(`Running Pa11y test on: ${url}`);
    // Run Pa11y - it will manage its own browser instance now
    const result = await pa11y(url, options);
    console.log(`Pa11y test successful for: ${url}`);

    // Add metadata
    if (result) {
      result.date = new Date().toISOString();
      result.pageUrl = url;
    } else {
      throw new Error("Pa11y returned an unexpected empty result.");
    }

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    console.error(`Error running Pa11y on ${url}:`, error);
    return {
      success: false,
      pageUrl: url,
      error: error.message || "Unknown error running Pa11y",
      date: new Date().toISOString(),
    };
  }
}

// Run WAVE test on a specific URL
async function runWaveTest(url: string, apiKey: string) {
  try {
    if (!apiKey) {
      return {
        success: false,
        pageUrl: url,
        error: "WAVE API key is required",
        date: new Date().toISOString(),
      };
    }

    console.log(`Running WAVE test on: ${url}`);
    // Call WAVE API
    const response = await axios.get("https://wave.webaim.org/api/request", {
      params: { key: apiKey, url, reporttype: 2 },
      timeout: 45000,
    });
    console.log(`WAVE API call successful for: ${url}`);

    if (!response.data) {
      throw new Error("Empty response from WAVE API");
    }
    if (response.data.status && !response.data.status.success) {
      throw new Error(response.data.status.description || "WAVE scan failed");
    }

    // Format WAVE results to match our expected format
    const result: {
      date: string;
      pageUrl: string;
      categories: any;
      statistics: any;
      issues: AccessibilityIssue[];
    } = {
      date: new Date().toISOString(),
      pageUrl: url,
      categories: response.data.categories,
      statistics: response.data.statistics,
      issues: [] as AccessibilityIssue[],
    };

    // Process different issue categories from WAVE response
    const processCategory = (
      categoryName: string,
      issueType: AccessibilityIssue["type"]
    ) => {
      if (response.data.categories?.[categoryName]?.items) {
        Object.entries(response.data.categories[categoryName].items).forEach(
          ([id, itemData]) => {
            const item = itemData as WaveItem;
            result.issues.push({
              type: issueType,
              code: id || "wave_unknown",
              message: item.description || "No description provided by WAVE",
              context: item.context,
              source: "wave",
              selector: item.selector,
              detail: item.description || "",
              pageUrl: url,
            });
          }
        );
      }
    };

    processCategory("error", "error");
    processCategory("contrast", "error");
    processCategory("alert", "warning");
    processCategory("feature", "notice");
    processCategory("structure", "notice");
    processCategory("aria", "notice");

    return { success: true, result };
  } catch (error: any) {
    console.error(
      `Error running WAVE test on ${url}:`,
      error.response?.data || error.message
    );
    return {
      success: false,
      pageUrl: url,
      error:
        error.response?.data?.status?.description ||
        error.message ||
        "Unknown error running WAVE test",
      date: new Date().toISOString(),
    };
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, maxPages = 5, tools = [], waveApiKey } = body;

  if (!url) {
    return createError({ statusCode: 400, statusMessage: "URL is required" });
  }

  console.log(
    `Starting crawl for URL: ${url}, Max Pages: ${maxPages}, Tools: ${tools.join(
      ", "
    )}`
  );

  const scannedUrls = new Set<string>();
  const pagesToScan = [url];
  const results: PageResult[] = [];
  const crawlErrors: string[] = [];

  try {
    while (pagesToScan.length > 0 && scannedUrls.size < maxPages) {
      const currentUrl = pagesToScan.shift();
      if (
        !currentUrl ||
        typeof currentUrl !== "string" ||
        !currentUrl.startsWith("http")
      ) {
        console.warn(`Skipping invalid URL from queue: ${currentUrl}`);
        continue;
      }
      if (scannedUrls.has(currentUrl)) continue;

      scannedUrls.add(currentUrl);
      console.log(
        `Processing page ${scannedUrls.size}/${maxPages}: ${currentUrl}`
      );

      const pageResult: PageResult = {
        url: currentUrl,
        toolResults: {},
        errors: 0,
        warnings: 0,
        notices: 0,
        date: new Date().toISOString(),
      };

      const testPromises = [];

      if (tools.includes("pa11y")) {
        testPromises.push(
          runPa11yTest(currentUrl).then((res) => {
            pageResult.toolResults.pa11y = res;
          })
        );
      }
      if (tools.includes("wave") && waveApiKey) {
        testPromises.push(
          runWaveTest(currentUrl, waveApiKey).then((res) => {
            pageResult.toolResults.wave = res;
          })
        );
      }

      try {
        console.log(`Waiting for tests to complete for: ${currentUrl}`);
        await Promise.all(testPromises);
        console.log(`Tests completed for: ${currentUrl}`);

        if (pageResult.toolResults.pa11y) {
          if (
            pageResult.toolResults.pa11y.success &&
            pageResult.toolResults.pa11y.result?.issues
          ) {
            pageResult.errors +=
              pageResult.toolResults.pa11y.result.issues.filter(
                (i: any) => i.type === "error"
              ).length;
            pageResult.warnings +=
              pageResult.toolResults.pa11y.result.issues.filter(
                (i: any) => i.type === "warning"
              ).length;
            pageResult.notices +=
              pageResult.toolResults.pa11y.result.issues.filter(
                (i: any) => i.type === "notice"
              ).length;
          } else if (pageResult.toolResults.pa11y.error) {
            console.warn(
              `Pa11y Error on ${currentUrl}: ${pageResult.toolResults.pa11y.error}`
            );
            crawlErrors.push(
              `Pa11y Error (${currentUrl}): ${pageResult.toolResults.pa11y.error}`
            );
          }
        }

        if (pageResult.toolResults.wave) {
          if (
            pageResult.toolResults.wave.success &&
            pageResult.toolResults.wave.result?.issues
          ) {
            pageResult.errors +=
              pageResult.toolResults.wave.result.issues.filter(
                (i: AccessibilityIssue) => i.type === "error"
              ).length;
            pageResult.warnings +=
              pageResult.toolResults.wave.result.issues.filter(
                (i: AccessibilityIssue) => i.type === "warning"
              ).length;
            pageResult.notices +=
              pageResult.toolResults.wave.result.issues.filter(
                (i: AccessibilityIssue) => i.type === "notice"
              ).length;
          } else if (pageResult.toolResults.wave.error) {
            console.warn(
              `WAVE Error on ${currentUrl}: ${pageResult.toolResults.wave.error}`
            );
            crawlErrors.push(
              `WAVE Error (${currentUrl}): ${pageResult.toolResults.wave.error}`
            );
          }
        }

        results.push(pageResult);

        if (scannedUrls.size < maxPages) {
          console.log(`Extracting links from: ${currentUrl}`);
          try {
            const links = await extractLinks(currentUrl, url);
            console.log(
              `Found ${links.length} potential links on ${currentUrl}`
            );
            for (const link of links) {
              if (
                link &&
                !scannedUrls.has(link) &&
                !pagesToScan.includes(link)
              ) {
                if (pagesToScan.length < maxPages * 2) {
                  pagesToScan.push(link);
                } else {
                  console.log("Link queue limit reached, not adding:", link);
                }
              }
            }
          } catch (linkError: any) {
            console.error(
              `Failed to extract links from ${currentUrl}: ${linkError.message}`
            );
            crawlErrors.push(
              `Link Extraction Error (${currentUrl}): ${linkError.message}`
            );
          }
        }
      } catch (testError: any) {
        console.error(`Error processing tests for ${currentUrl}:`, testError);
        crawlErrors.push(`Testing Error (${currentUrl}): ${testError.message}`);
        results.push(pageResult);
      }
    }
  } catch (crawlSetupError: any) {
    console.error("Crawler setup error:", crawlSetupError);
    return createError({
      statusCode: 500,
      statusMessage: `Crawler failed during setup: ${crawlSetupError.message}`,
    });
  } finally {
    console.log("Crawl processing finished.");
  }

  const totalErrors = results.reduce((sum, page) => sum + page.errors, 0);
  const totalWarnings = results.reduce((sum, page) => sum + page.warnings, 0);
  const totalNotices = results.reduce((sum, page) => sum + page.notices, 0);

  console.log(
    `Crawl finished. Pages Scanned: ${results.length}, Errors Recorded: ${crawlErrors.length}`
  );

  return {
    success: crawlErrors.length === 0,
    summary: {
      pagesScanned: results.length,
      totalErrors,
      totalWarnings,
      totalNotices,
      scannedUrls: Array.from(scannedUrls),
    },
    pages: results,
    errors: crawlErrors,
  };
});
