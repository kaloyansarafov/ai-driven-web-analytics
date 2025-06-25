import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import lighthouse from 'lighthouse';
import type { OutputMode } from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

interface CrawlerConfig {
  maxDepth: number;
  maxPages: number;
  respectRobots: boolean;
  crawlDelay: number;
  userAgent: string;
  timeout: number;
}

interface PageData {
  url: string;
  depth: number;
  status: number;
  content: string;
  html: string;
  links: string[];
  meta: {
    title: string;
    description: string;
    robots: string;
    canonical: string;
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
  };
  seo: {
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
    };
    links: {
      internal: number;
      external: number;
      broken: number;
    };
    content: {
      wordCount: number;
      keywordDensity: Record<string, number>;
    };
  };
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    timeToInteractive: number;
  };
}

class SEOCrawler {
  private config: CrawlerConfig;
  private visited: Set<string>;
  private queue: { url: string; depth: number }[];
  private browser: any;
  private mainPage: PageData | null = null;

  constructor(config: Partial<CrawlerConfig> = {}) {
    this.config = {
      maxDepth: 2,
      maxPages: 10,
      respectRobots: false,
      crawlDelay: 2000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      timeout: 30000,
      ...config
    };
    this.visited = new Set();
    this.queue = [];
  }

  async initialize() {
    try {
      console.log('Initializing browser...');
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-site-isolation-trials'
        ]
      });
      console.log('Browser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw new Error('Failed to initialize browser: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  async crawl(startUrl: string): Promise<PageData[]> {
    console.log('Starting crawl for URL:', startUrl);
    await this.initialize();
    const results: PageData[] = [];
    
    try {
      // Ensure URL has protocol
      if (!startUrl.startsWith('http://') && !startUrl.startsWith('https://')) {
        startUrl = 'https://' + startUrl;
      }

      // Normalize URL
      const baseUrl = new URL(startUrl);
      const normalizedUrl = baseUrl.toString();
      console.log('Normalized URL:', normalizedUrl);

      this.queue.push({ url: normalizedUrl, depth: 0 });
      
      while (this.queue.length > 0 && results.length < this.config.maxPages) {
        const { url, depth } = this.queue.shift()!;
        
        if (depth > this.config.maxDepth || this.visited.has(url)) {
          console.log(`Skipping ${url} - depth: ${depth}, visited: ${this.visited.has(url)}`);
          continue;
        }

        try {
          console.log(`Processing page: ${url} (depth: ${depth})`);
          const pageData = await this.processPage(url, depth);
          
          // Accept any response that gives us content
          if (pageData.content || pageData.html) {
            results.push(pageData);
            this.visited.add(url);
            console.log(`Successfully processed page: ${url}`);

            // Add discovered links to queue
            for (const link of pageData.links) {
              if (!this.visited.has(link)) {
                this.queue.push({ url: link, depth: depth + 1 });
              }
            }
          } else {
            console.warn(`Skipping page ${url} - no content found`);
          }

          await new Promise(resolve => setTimeout(resolve, this.config.crawlDelay));
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          // Add a basic page data object for failed pages
          results.push({
            url,
            depth,
            status: 0,
            content: '',
            html: '',
            links: [],
            meta: {
              title: url.split('/').pop() || 'Untitled',
              description: 'Failed to load page content',
              robots: 'noindex, nofollow',
              canonical: url,
              ogTags: {},
              twitterTags: {}
            },
            seo: {
              headings: { h1: [], h2: [], h3: [] },
              images: { total: 0, withAlt: 0, withoutAlt: 0 },
              links: { internal: 0, external: 0, broken: 0 },
              content: { wordCount: 0, keywordDensity: {} }
            },
            performance: {
              loadTime: 0,
              firstContentfulPaint: 0,
              largestContentfulPaint: 0,
              timeToInteractive: 0
            }
          });
        }
      }
    } catch (error) {
      console.error('Crawl error:', error);
      throw new Error('Crawl failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      if (this.browser) {
        console.log('Closing browser...');
        await this.browser.close();
      }
    }

    if (results.length === 0) {
      throw new Error('No pages were successfully crawled');
    }

    console.log(`Crawl completed. Processed ${results.length} pages.`);
    return results;
  }

  private async processPage(url: string, depth: number): Promise<PageData> {
    console.log(`Starting to process page: ${url}`);
    const page = await this.browser.newPage();
    
    try {
      // Set viewport and user agent
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.setExtraHTTPHeaders({
        'User-Agent': this.config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      });

      // Navigate to page with more lenient timeout
      console.log(`Navigating to ${url}...`);
      const response = await page.goto(url, {
        waitUntil: 'load',
        timeout: this.config.timeout
      });

      if (!response) {
        console.error('No response received from page');
        throw new Error('Failed to get response from page');
      }

      const status = response.status();
      console.log(`Page status: ${status}`);

      // Wait a bit for late JS
      await page.waitForTimeout(1000);

      // Get page content even if status is not 200
      console.log('Getting page content...');
      const html = await page.content();
      console.log(`HTML content length: ${html.length} characters`);

      const $ = cheerio.load(html);
      console.log('Loaded HTML into Cheerio');

      // Extract meta data with fallbacks
      console.log('Extracting meta data...');
      const meta = {
        title: $('title').text().trim() || 
               $('h1').first().text().trim() || 
               $('meta[property="og:title"]').attr('content') || 
               url.split('/').pop() || 'Untitled',
        description: $('meta[name="description"]').attr('content') || 
                    $('meta[property="og:description"]').attr('content') || 
                    $('p').first().text().trim().substring(0, 160) || 
                    'No description available',
        robots: $('meta[name="robots"]').attr('content') || 'index, follow',
        canonical: $('link[rel="canonical"]').attr('href') || url,
        ogTags: this.extractMetaTags($, 'og:'),
        twitterTags: this.extractMetaTags($, 'twitter:')
      };
      console.log('Meta data extracted:', meta);

      // Extract SEO data
      console.log('Extracting SEO data...');
      const headings = {
        h1: $('h1').map((_, el) => $(el).text().trim()).get(),
        h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        h3: $('h3').map((_, el) => $(el).text().trim()).get()
      };
      console.log('Headings found:', headings);

      const images = {
        total: $('img').length,
        withAlt: $('img[alt]').length,
        withoutAlt: $('img:not([alt])').length
      };
      console.log('Images found:', images);

      const links = {
        internal: $('a[href^="/"], a[href^="' + url + '"]').length,
        external: $('a[href^="http"]').length,
        broken: 0
      };
      console.log('Links found:', links);

      const bodyText = $('body').text().trim();
      const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
      console.log('Word count:', wordCount);

      const seo = {
        headings,
        images,
        links,
        content: {
          wordCount,
          keywordDensity: this.calculateKeywordDensity(bodyText)
        }
      };

      // Extract links
      console.log('Extracting page links...');
      const pageLinks = this.extractLinks($, url);
      console.log(`Found ${pageLinks.length} unique links`);

      // Get main content
      console.log('Extracting main content...');
      const mainContent = $('main, article, [role="main"], #content, .content, #main, .main, .post, .page, .entry')
        .first()
        .text()
        .trim() || bodyText;
      console.log(`Main content length: ${mainContent.length} characters`);

      // Get performance metrics with improved timing and fallbacks
      console.log('Getting performance metrics...');
      let performance = await page.evaluate(() => {
        return new Promise((resolve) => {
          const waitForMetrics = () => {
            try {
              const navigation = performance.getEntriesByType('navigation')[0];
              const paintEntries = performance.getEntriesByType('paint');
              const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
              const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
              const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
              const tti = domContentLoaded + 1000; // Approximate TTI
              const metrics = {
                loadTime: navigation.loadEventEnd - navigation.navigationStart,
                firstContentfulPaint: fcp ? fcp.startTime : 0,
                largestContentfulPaint: lcp ? lcp.startTime : 0,
                timeToInteractive: tti
              };
              if (metrics.loadTime > 0) {
                resolve(metrics);
              } else {
                setTimeout(() => {
                  const retryNavigation = performance.getEntriesByType('navigation')[0];
                  const retryPaintEntries = performance.getEntriesByType('paint');
                  const retryFcp = retryPaintEntries.find(entry => entry.name === 'first-contentful-paint');
                  const retryLcp = retryPaintEntries.find(entry => entry.name === 'largest-contentful-paint');
                  const retryTti = retryNavigation.domContentLoadedEventEnd - retryNavigation.navigationStart + 1000;
                  resolve({
                    loadTime: retryNavigation.loadEventEnd - retryNavigation.navigationStart,
                    firstContentfulPaint: retryFcp ? retryFcp.startTime : 0,
                    largestContentfulPaint: retryLcp ? retryLcp.startTime : 0,
                    timeToInteractive: retryTti
                  });
                }, 2000);
              }
            } catch (error) {
              console.warn('Failed to get performance metrics:', error);
              resolve({
                loadTime: 0,
                firstContentfulPaint: 0,
                largestContentfulPaint: 0,
                timeToInteractive: 0
              });
            }
          };
          waitForMetrics();
        });
      });
      console.log('Performance metrics:', performance);
      // Fallback to Lighthouse metrics if Playwright fails
      if ((performance.loadTime === 0 && performance.firstContentfulPaint === 0 && performance.largestContentfulPaint === 0) && depth === 0) {
        try {
          const lighthouseResult = await this.runLighthouse(url);
          const audits = lighthouseResult.audits;
          performance = {
            loadTime: audits['interactive']?.numericValue || 0,
            firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
            largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
            timeToInteractive: audits['interactive']?.numericValue || 0
          };
          console.log('Used Lighthouse performance metrics:', performance);
        } catch (e) {
          console.error('Lighthouse performance fallback failed:', e);
        }
      }

      const pageData = {
        url,
        depth,
        status,
        content: mainContent,
        html,
        links: pageLinks,
        meta,
        seo,
        performance
      };

      // Store the main page data
      if (depth === 0) {
        this.mainPage = pageData;
        try {
          const lighthouseResult = await this.runLighthouse(url);
          if (lighthouseResult && lighthouseResult.categories && lighthouseResult.categories.seo && typeof lighthouseResult.categories.seo.score === 'number') {
            (this.mainPage as any).lighthouse = {
              seoScore: lighthouseResult.categories.seo.score * 100,
              audits: lighthouseResult.categories.seo.auditRefs.map(ref => lighthouseResult.audits[ref.id])
            };
          }
        } catch (e) {
          console.error('Lighthouse failed:', e);
        }
      }

      console.log('Successfully processed page:', {
        url,
        status,
        wordCount: seo.content.wordCount,
        headings: Object.keys(headings).map(h => `${h}: ${headings[h].length}`).join(', '),
        images: `${images.total} total (${images.withAlt} with alt)`,
        links: `${links.internal} internal, ${links.external} external`
      });

      return pageData;
    } catch (error) {
      console.error(`Error in processPage for ${url}:`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private extractMetaTags($: cheerio.Root, selector: string): Record<string, string> {
    const tags: Record<string, string> = {};
    
    // Use proper CSS selectors for meta tags
    const metaSelector = selector.includes('og:') 
      ? 'meta[property^="og:"]'
      : 'meta[name^="twitter:"]';
    
    $(metaSelector).each((_, el) => {
      const name = $(el).attr('name') || $(el).attr('property') || '';
      const content = $(el).attr('content') || '';
      if (name && content) {
        tags[name.replace(/^(og:|twitter:)/, '')] = content;
      }
    });
    return tags;
  }

  private extractLinks($: cheerio.Root, baseUrl: string): string[] {
    const links: string[] = [];
    const baseUrlObj = new URL(baseUrl);
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          // Handle relative URLs and fragments
          const absoluteUrl = new URL(href, baseUrl).toString();
          // Only include links from the same domain and exclude fragments
          if (new URL(absoluteUrl).hostname === baseUrlObj.hostname && !absoluteUrl.includes('#')) {
            links.push(absoluteUrl);
          }
        } catch (error) {
          console.warn(`Invalid URL: ${href}`);
        }
      }
    });
    return [...new Set(links)]; // Remove duplicates
  }

  private calculateKeywordDensity(content: string): Record<string, number> {
    // Remove HTML tags, special characters, and common words
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s]/g, ' ')
      .toLowerCase();
    
    // Common English stop words to exclude
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
      'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
      'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
      'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
      'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
      'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
      'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
      'day', 'most', 'us'
    ]);
    
    // Split into words and filter
    const words = cleanContent
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !stopWords.has(word) && 
        !/^\d+$/.test(word) // Exclude pure numbers
      );
    
    const wordCount = words.length;
    const density: Record<string, number> = {};
    
    // Count word occurrences
    words.forEach(word => {
      density[word] = (density[word] || 0) + 1;
    });

    // Calculate density percentages and filter
    const filteredDensity: Record<string, number> = {};
    Object.entries(density).forEach(([word, count]) => {
      const percentage = (count / wordCount) * 100;
      // Only include words that appear at least 0.5% of the time and at least twice
      if (percentage >= 0.5 && count >= 2) {
        filteredDensity[word] = Number(percentage.toFixed(2));
      }
    });

    // Sort by density and limit to top 20 keywords
    return Object.fromEntries(
      Object.entries(filteredDensity)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
    );
  }

  // Add getMainPage method
  public getMainPage(): PageData | null {
    return this.mainPage;
  }

  public async runLighthouse(url: string) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'error' as const, output: ['json' as OutputMode], onlyCategories: ['seo'], port: chrome.port };
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();
    if (!runnerResult || !runnerResult.lhr) throw new Error('Lighthouse did not return results');
    return runnerResult.lhr;
  }
}

export { SEOCrawler, type CrawlerConfig, type PageData }; 