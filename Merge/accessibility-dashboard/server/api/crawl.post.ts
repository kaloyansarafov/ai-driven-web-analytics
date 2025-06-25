import { defineEventHandler, readBody, createError } from "h3";
import { chromium, Browser as PlaywrightBrowser, Page as PlaywrightPage } from 'playwright';
import pa11y from "pa11y";
import axios from "axios";
import { JSDOM } from "jsdom";
import { SEOAnalyzer } from '../../utils/seo/SEOAnalyzer';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { getCompliance } from 'accessibility-checker';

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
    seo?: any;
    lighthouse?: any;
    "ibm-a11y"?: any;
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

// Helper sleep function
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to extract links using Playwright
async function extractLinks(url: string, baseUrl: string): Promise<string[]> {
  let browser: PlaywrightBrowser | null = null;
  let context: any = null;
  let page: PlaywrightPage | null = null;
  try {
    browser = await chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--disable-gpu",
      ],
      headless: true,
    });
    context = await browser.newContext();
    page = await context.newPage();

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
    if (page) {
      await page.goto(validUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Add a small delay to be respectful to the server
      await sleep(200);

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
      return links;
    }
    return [];
  } catch (error: any) {
    console.error(`Error extracting links from ${url}:`, error.message);
    return [];
  } finally {
    // Always close page, context, and browser
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
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
      timeout: 15000,
      wait: 1000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log,
      },
      chromeLaunchConfig: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

// Run SEO test on a specific URL
async function runSeoTest(url: string) {
  try {
    console.log(`Running SEO test on: ${url}`);
    
    // Create a single-page SEO analyzer
    const seoAnalyzer = new SEOAnalyzer({
      maxDepth: 0, // Only analyze this page
      maxPages: 1,
      respectRobots: false,
      crawlDelay: 0
    });
    
    const result = await seoAnalyzer.analyze(url);
    console.log(`SEO test successful for: ${url}`);
    
    return {
      success: true,
      result,
    };
  } catch (error: any) {
    console.error(`Error running SEO test on ${url}:`, error);
    return {
      success: false,
      pageUrl: url,
      error: error.message || "Unknown error running SEO test",
      date: new Date().toISOString(),
    };
  }
}

// Run Lighthouse test on a specific URL
async function runLighthouseTest(url: string) {
  try {
    console.log(`Running Lighthouse test on: ${url}`);
    
    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });
    
    const options = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['accessibility'],
      port: chrome.port
    };
    
    const result = await lighthouse(url, {
      port: 9222,
      output: "json",
      onlyCategories: ["accessibility", "performance", "seo"],
    });
    const report = result?.lhr;
    
    await chrome.kill();
    
    if (!report) {
      throw new Error('Lighthouse returned no report');
    }
    
    console.log(`Lighthouse test successful for: ${url}`);
    
    return {
      success: true,
      result: {
        audits: Object.values(report.audits).filter((audit: any) => 
          audit.score !== null && audit.score < 1
        )
      },
    };
  } catch (error: any) {
    console.error(`Error running Lighthouse test on ${url}:`, error);
    return {
      success: false,
      pageUrl: url,
      error: error.message || "Unknown error running Lighthouse test",
      date: new Date().toISOString(),
    };
  }
}

// Run IBM A11y test on a specific URL
async function runIbmA11yTest(url: string) {
  try {
    console.log(`Running IBM A11y test on: ${url}`);
    
    const results = await getCompliance(url, 'WCAG_2_1');
    
    console.log(`IBM A11y test successful for: ${url}`);
    console.log('IBM A11y results structure:', JSON.stringify(results, null, 2));
    
    return {
      success: true,
      result: {
        issues: results.report || []
      },
    };
  } catch (error: any) {
    console.error(`Error running IBM A11y test on ${url}:`, error);
    return {
      success: false,
      pageUrl: url,
      error: error.message || "Unknown error running IBM A11y test",
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
  const startTime = Date.now();
  const maxCrawlTime = 5 * 60 * 1000; // 5 minutes timeout

  try {
    while (pagesToScan.length > 0 && scannedUrls.size < maxPages) {
      // Check for timeout
      if (Date.now() - startTime > maxCrawlTime) {
        console.log("Crawl timeout reached, stopping crawl");
        break;
      }

      const currentUrl = pagesToScan.shift();
      if (
        !currentUrl ||
        typeof currentUrl !== "string" ||
        !currentUrl.startsWith("http")
      ) {
        console.warn(`Skipping invalid URL from queue: ${currentUrl}`);
        continue;
      }
      if (scannedUrls.has(currentUrl)) {
        console.log(`Skipping already scanned URL: ${currentUrl}`);
        continue;
      }

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

      const testPromises: Promise<any>[] = [];

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
      if (tools.includes("seo")) {
        testPromises.push(
          runSeoTest(currentUrl).then((res) => {
            pageResult.toolResults.seo = res;
          })
        );
      }
      if (tools.includes("lighthouse")) {
        testPromises.push(
          runLighthouseTest(currentUrl).then((res) => {
            pageResult.toolResults.lighthouse = res;
          })
        );
      }
      if (tools.includes("ibm-a11y")) {
        testPromises.push(
          runIbmA11yTest(currentUrl).then((res) => {
            pageResult.toolResults["ibm-a11y"] = res;
          })
        );
      }

      try {
        console.log(`Waiting for tests to complete for: ${currentUrl}`);
        await Promise.all(testPromises);
        console.log(`Tests completed for: ${currentUrl}`);

        // Process results for each tool
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

        if (pageResult.toolResults.seo) {
          if (
            pageResult.toolResults.seo.success &&
            pageResult.toolResults.seo.result?.issues
          ) {
            pageResult.errors +=
              pageResult.toolResults.seo.result.issues.filter(
                (i: any) => i.type === "error"
              ).length;
            pageResult.warnings +=
              pageResult.toolResults.seo.result.issues.filter(
                (i: any) => i.type === "warning"
              ).length;
            pageResult.notices +=
              pageResult.toolResults.seo.result.issues.filter(
                (i: any) => i.type === "notice"
              ).length;
          } else if (pageResult.toolResults.seo.error) {
            console.warn(
              `SEO Error on ${currentUrl}: ${pageResult.toolResults.seo.error}`
            );
            crawlErrors.push(
              `SEO Error (${currentUrl}): ${pageResult.toolResults.seo.error}`
            );
          }
        }

        if (pageResult.toolResults.lighthouse) {
          if (
            pageResult.toolResults.lighthouse.success &&
            pageResult.toolResults.lighthouse.result?.audits
          ) {
            pageResult.errors +=
              pageResult.toolResults.lighthouse.result.audits.filter(
                (i: any) => i.score !== null && i.score < 1
              ).length;
            pageResult.warnings +=
              pageResult.toolResults.lighthouse.result.audits.filter(
                (i: any) => i.score !== null && i.score >= 1
              ).length;
            pageResult.notices +=
              pageResult.toolResults.lighthouse.result.audits.filter(
                (i: any) => i.score === null
              ).length;
          } else if (pageResult.toolResults.lighthouse.error) {
            console.warn(
              `Lighthouse Error on ${currentUrl}: ${pageResult.toolResults.lighthouse.error}`
            );
            crawlErrors.push(
              `Lighthouse Error (${currentUrl}): ${pageResult.toolResults.lighthouse.error}`
            );
          }
        }

        if (pageResult.toolResults["ibm-a11y"]) {
          console.log('Processing IBM A11y results for:', currentUrl);
          console.log('IBM A11y result structure:', JSON.stringify(pageResult.toolResults["ibm-a11y"], null, 2));
          
          if (
            pageResult.toolResults["ibm-a11y"].success &&
            pageResult.toolResults["ibm-a11y"].result?.issues
          ) {
            // Ensure issues is an array before processing
            const issues = pageResult.toolResults["ibm-a11y"].result.issues;
            console.log('IBM A11y issues type:', typeof issues, 'isArray:', Array.isArray(issues));
            
            if (Array.isArray(issues)) {
              pageResult.errors +=
                issues.filter(
                  (i: any) => i.type === "error"
                ).length;
              pageResult.warnings +=
                issues.filter(
                  (i: any) => i.type === "warning"
                ).length;
              pageResult.notices +=
                issues.filter(
                  (i: any) => i.type === "notice"
                ).length;
            } else {
              console.warn(
                `IBM A11y issues is not an array for ${currentUrl}:`, 
                typeof issues, 
                issues
              );
              // If issues is not an array, try to extract issues from the result structure
              if (typeof issues === 'object' && issues !== null) {
                // Try to find issues in different possible locations
                const possibleIssues = issues.issues || issues.results || issues.items || [];
                if (Array.isArray(possibleIssues)) {
                  pageResult.errors +=
                    possibleIssues.filter(
                      (i: any) => i.type === "error"
                    ).length;
                  pageResult.warnings +=
                    possibleIssues.filter(
                      (i: any) => i.type === "warning"
                    ).length;
                  pageResult.notices +=
                    possibleIssues.filter(
                      (i: any) => i.type === "notice"
                    ).length;
                }
              }
            }
          } else if (pageResult.toolResults["ibm-a11y"].error) {
            console.warn(
              `IBM A11y Error on ${currentUrl}: ${pageResult.toolResults["ibm-a11y"].error}`
            );
            crawlErrors.push(
              `IBM A11y Error (${currentUrl}): ${pageResult.toolResults["ibm-a11y"].error}`
            );
          }
        }

        results.push(pageResult);

        // Only extract links if we haven't reached the max page limit
        if (scannedUrls.size < maxPages) {
          console.log(`Extracting links from: ${currentUrl}`);
          try {
            const links = await extractLinks(currentUrl, url);
            console.log(
              `Found ${links.length} potential links on ${currentUrl}`
            );
            
            // Only add links if we haven't reached the limit
            let addedLinks = 0;
            for (const link of links) {
              if (
                link &&
                !scannedUrls.has(link) &&
                !pagesToScan.includes(link) &&
                scannedUrls.size + pagesToScan.length < maxPages
              ) {
                pagesToScan.push(link);
                addedLinks++;
              }
            }
            console.log(`Added ${addedLinks} new links to queue. Queue size: ${pagesToScan.length}`);
          } catch (linkError: any) {
            console.error(
              `Failed to extract links from ${currentUrl}: ${linkError.message}`
            );
            crawlErrors.push(
              `Link Extraction Error (${currentUrl}): ${linkError.message}`
            );
          }
        } else {
          console.log(`Reached max page limit (${maxPages}), stopping link extraction`);
          break; // Exit the loop immediately
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
    const totalTime = Date.now() - startTime;
    console.log(`Crawl processing finished. Total time: ${totalTime}ms`);
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