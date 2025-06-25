import { SEOCrawler, type PageData } from './SEOCrawler';
import axios from 'axios';

interface SEOAnalysis {
  url: string;
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  metrics: SEOMetrics;
  robotsAnalysis: {
    exists: boolean;
    content: string;
    directives: {
      allow: string[];
      disallow: string[];
      sitemap: string[];
      userAgent: string[];
      crawlDelay: number | null;
    };
    issues: {
      type: 'error' | 'warning' | 'notice';
      message: string;
      recommendation: string;
    }[];
  };
  crawledPages: {
    total: number;
    pages: Array<{
      url: string;
      status: number;
      wordCount: number;
      headings: {
        h1: number;
        h2: number;
        h3: number;
      };
      images: {
        total: number;
        withAlt: number;
        withoutAlt: number;
      };
      links: {
        internal: number;
        external: number;
      };
    }>;
  };
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  recommendation: string;
  url: string;
}

interface SEORecommendation {
  priority: 'high' | 'medium' | 'low';
  message: string;
  impact: string;
  url: string;
}

interface SEOMetrics {
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    timeToInteractive: number;
  };
  content: {
    wordCount: number;
    keywordDensity: Record<string, number>;
  };
  technical: {
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
    headings: {
      h1: number;
      h2: number;
      h3: number;
    };
  };
  meta: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasCanonical: boolean;
    hasRobots: boolean;
    ogTags: number;
    twitterTags: number;
  };
}

interface ScoreBreakdown {
  total: number;
  meta: number;
  content: number;
  technical: number;
  structure: number;
}

class SEOAnalyzer {
  private crawler: SEOCrawler;

  constructor(crawlerConfig = {}) {
    this.crawler = new SEOCrawler(crawlerConfig);
  }

  async analyze(url: string): Promise<SEOAnalysis & { scoreBreakdown: ScoreBreakdown }> {
    try {
      const [pages, robotsAnalysis] = await Promise.all([
        this.crawler.crawl(url),
        this.analyzeRobotsTxt(url)
      ]);

      if (!pages || pages.length === 0) {
        throw new Error('No pages were crawled successfully');
      }

      const issues: SEOIssue[] = [];
      const recommendations: SEORecommendation[] = [];
      const scoreBreakdown: ScoreBreakdown = { total: 0, meta: 0, content: 0, technical: 0, structure: 0 };
      let scoreSum = 0;
      let scoredPages = 0;

      for (const page of pages) {
        if (page.status === 0) {
          issues.push({
            type: 'error',
            message: 'Failed to load page',
            recommendation: 'Check if the page is accessible and not blocked by robots.txt or server errors',
            url: page.url
          });
          continue;
        }
        // Per-page issues/recommendations
        const pageIssues: SEOIssue[] = [];
        const pageRecs: SEORecommendation[] = [];
        this.analyzeMetaTags(page, pageIssues, pageRecs);
        this.analyzeContent(page, pageIssues, pageRecs);
        this.analyzeTechnical(page, pageIssues, pageRecs);
        // Attach url to each
        pageIssues.forEach(i => i.url = page.url);
        pageRecs.forEach(r => r.url = page.url);
        issues.push(...pageIssues);
        recommendations.push(...pageRecs);
        // Score breakdown (simple: average per page)
        const { meta, content, technical, structure } = this.calculateScoreBreakdown(page);
        scoreBreakdown.meta += meta;
        scoreBreakdown.content += content;
        scoreBreakdown.technical += technical;
        scoreBreakdown.structure += structure;
        scoreSum += meta + content + technical + structure;
        scoredPages++;
      }
      // Average breakdown
      if (scoredPages > 0) {
        scoreBreakdown.meta = Math.round(scoreBreakdown.meta / scoredPages);
        scoreBreakdown.content = Math.round(scoreBreakdown.content / scoredPages);
        scoreBreakdown.technical = Math.round(scoreBreakdown.technical / scoredPages);
        scoreBreakdown.structure = Math.round(scoreBreakdown.structure / scoredPages);
        scoreBreakdown.total = Math.round(scoreSum / scoredPages);
      }

      // Add crawled pages information
      const crawledPages = {
        total: pages.length,
        pages: pages.map(page => ({
          url: page.url,
          status: page.status,
          wordCount: page.seo?.content?.wordCount || 0,
          headings: {
            h1: page.seo?.headings?.h1?.length || 0,
            h2: page.seo?.headings?.h2?.length || 0,
            h3: page.seo?.headings?.h3?.length || 0
          },
          images: {
            total: page.seo?.images?.total || 0,
            withAlt: page.seo?.images?.withAlt || 0,
            withoutAlt: page.seo?.images?.withoutAlt || 0
          },
          links: {
            internal: page.seo?.links?.internal || 0,
            external: page.seo?.links?.external || 0
          }
        }))
      };

      // Use the first successfully loaded page for metrics (for now)
      const mainPage = pages.find(p => p.status !== 0) || pages[0];

      return {
        url,
        score: scoreBreakdown.total,
        issues,
        recommendations,
        metrics: this.extractMetrics(mainPage),
        robotsAnalysis,
        crawledPages,
        scoreBreakdown
      };
    } catch (error) {
      console.error('SEO Analysis Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to analyze the website');
    }
  }

  private analyzeMetaTags(page: PageData, issues: SEOIssue[], recommendations: SEORecommendation[]) {
    if (!page.meta) return;

    // Title analysis
    if (!page.meta.title || page.meta.title === 'Untitled') {
      issues.push({
        type: 'error',
        message: 'Missing page title',
        recommendation: 'Add a descriptive title tag',
        url: page.url
      });
    } else {
      const title = page.meta.title;
      if (title.length < 30 || title.length > 60) {
        issues.push({
          type: 'warning',
          message: 'Title length is not optimal',
          element: title,
          recommendation: 'Keep title between 30-60 characters',
          url: page.url
        });
      }
      // Check for keyword in title
      const mainKeyword = this.extractMainKeyword(page.seo?.content?.keywordDensity || {});
      if (mainKeyword && !title.toLowerCase().includes(mainKeyword.toLowerCase())) {
        recommendations.push({
          priority: 'high',
          message: 'Include main keyword in title',
          impact: 'Improves SEO relevance',
          url: page.url
        });
      }
    }

    // Description analysis
    if (!page.meta.description || page.meta.description === 'No description available') {
      issues.push({
        type: 'error',
        message: 'Missing meta description',
        recommendation: 'Add a meta description',
        url: page.url
      });
    } else {
      const description = page.meta.description;
      if (description.length < 120 || description.length > 160) {
        issues.push({
          type: 'warning',
          message: 'Description length is not optimal',
          element: description,
          recommendation: 'Keep description between 120-160 characters',
          url: page.url
        });
      }
      // Check for call-to-action in description
      if (!description.match(/learn|discover|find|get|view|read|explore|check|see/i)) {
        recommendations.push({
          priority: 'medium',
          message: 'Add call-to-action to description',
          impact: 'Improves click-through rate',
          url: page.url
        });
      }
    }

    // Canonical URL analysis
    if (!page.meta.canonical || page.meta.canonical === page.url) {
      recommendations.push({
        priority: 'medium',
        message: 'Add canonical URL',
        impact: 'Helps prevent duplicate content issues',
        url: page.url
      });
    }

    // Robots meta analysis
    if (!page.meta.robots) {
      recommendations.push({
        priority: 'medium',
        message: 'Add robots meta tag',
        impact: 'Controls search engine crawling behavior',
        url: page.url
      });
    } else if (page.meta.robots.includes('noindex')) {
      issues.push({
        type: 'warning',
        message: 'Page is set to noindex',
        element: page.meta.robots,
        recommendation: 'Remove noindex if page should be indexed',
        url: page.url
      });
    }

    // Social media tags analysis
    const ogTagsCount = Object.keys(page.meta.ogTags || {}).length;
    const twitterTagsCount = Object.keys(page.meta.twitterTags || {}).length;

    if (ogTagsCount === 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Add Open Graph tags',
        impact: 'Improves social media sharing',
        url: page.url
      });
    } else {
      // Check for essential OG tags
      const essentialOgTags = ['title', 'description', 'image'];
      const missingOgTags = essentialOgTags.filter(tag => !page.meta.ogTags[tag]);
      if (missingOgTags.length > 0) {
        recommendations.push({
          priority: 'medium',
          message: `Add missing Open Graph tags: ${missingOgTags.join(', ')}`,
          impact: 'Improves social media sharing appearance',
          url: page.url
        });
      }
    }

    if (twitterTagsCount === 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Add Twitter Card tags',
        impact: 'Improves Twitter sharing',
        url: page.url
      });
    } else {
      // Check for essential Twitter tags
      const essentialTwitterTags = ['card', 'title', 'description'];
      const missingTwitterTags = essentialTwitterTags.filter(tag => !page.meta.twitterTags[tag]);
      if (missingTwitterTags.length > 0) {
        recommendations.push({
          priority: 'medium',
          message: `Add missing Twitter Card tags: ${missingTwitterTags.join(', ')}`,
          impact: 'Improves Twitter sharing appearance',
          url: page.url
        });
      }
    }
  }

  private extractMainKeyword(keywordDensity: Record<string, number>): string | null {
    const sortedKeywords = Object.entries(keywordDensity)
      .sort(([, a], [, b]) => b - a);
    return sortedKeywords.length > 0 ? sortedKeywords[0][0] : null;
  }

  private analyzeContent(page: PageData, issues: SEOIssue[], recommendations: SEORecommendation[]) {
    if (!page.seo?.content) return;

    // Word count analysis
    if (page.seo.content.wordCount < 300) {
      issues.push({
        type: 'warning',
        message: 'Content is too short',
        recommendation: 'Add more content to improve SEO',
        url: page.url
      });
    }

    // Heading structure analysis
    if (!page.seo.headings?.h1?.length) {
      issues.push({
        type: 'error',
        message: 'Missing H1 heading',
        recommendation: 'Add an H1 heading to your page',
        url: page.url
      });
    } else if (page.seo.headings.h1.length > 1) {
      issues.push({
        type: 'warning',
        message: 'Multiple H1 headings found',
        element: page.seo.headings.h1.join(', '),
        recommendation: 'Use only one H1 heading per page',
        url: page.url
      });
    }

    // Keyword density analysis
    const keywordDensity = page.seo.content.keywordDensity || {};
    const highDensityKeywords = Object.entries(keywordDensity)
      .filter(([_, density]) => density > 5)
      .map(([keyword]) => keyword);

    if (highDensityKeywords.length > 0) {
      issues.push({
        type: 'warning',
        message: 'High keyword density detected',
        element: highDensityKeywords.join(', '),
        recommendation: 'Reduce keyword density to avoid keyword stuffing',
        url: page.url
      });
    }
  }

  private analyzeTechnical(page: PageData, issues: SEOIssue[], recommendations: SEORecommendation[]) {
    if (!page.seo) return;

    // Image analysis
    if (page.seo.images?.total > 0) {
      if (page.seo.images.withoutAlt > 0) {
        issues.push({
          type: 'warning',
          message: 'Images missing alt text',
          recommendation: 'Add alt text to all images',
          url: page.url
        });
      }
    } else {
      recommendations.push({
        priority: 'low',
        message: 'Add images to your content',
        impact: 'Images can improve user engagement and SEO',
        url: page.url
      });
    }

    // Link analysis
    if (page.seo.links?.internal === 0 && page.seo.links?.external === 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Add internal and external links',
        impact: 'Links help with navigation and SEO',
        url: page.url
      });
    }

    // Performance analysis
    if (page.performance?.loadTime > 3000) {
      issues.push({
        type: 'warning',
        message: 'Page load time is high',
        recommendation: 'Optimize page performance',
        url: page.url
      });
    }
  }

  private calculateScoreBreakdown(page: PageData): { meta: number; content: number; technical: number; structure: number } {
    // Simple scoring: 0-25 per category, based on presence of key features
    let meta = 0, content = 0, technical = 0, structure = 0;
    // Meta
    if (page.meta?.title && page.meta.title !== 'Untitled') meta += 7;
    if (page.meta?.description && page.meta.description !== 'No description available') meta += 7;
    if (page.meta?.canonical && page.meta.canonical !== page.url) meta += 5;
    if (page.meta?.robots) meta += 3;
    if (Object.keys(page.meta?.ogTags || {}).length > 0) meta += 2;
    if (Object.keys(page.meta?.twitterTags || {}).length > 0) meta += 1;
    // Content
    if (page.seo?.content?.wordCount > 300) content += 10;
    if (Object.keys(page.seo?.content?.keywordDensity || {}).length > 2) content += 8;
    if (page.seo?.headings?.h1?.length === 1) content += 7;
    // Technical
    if (page.seo?.images?.withAlt === page.seo?.images?.total && page.seo?.images?.total > 0) technical += 8;
    if (page.seo?.links?.broken === 0) technical += 8;
    if (page.performance?.loadTime && page.performance.loadTime < 3000) technical += 9;
    // Structure
    if (page.seo?.headings?.h1?.length === 1) structure += 8;
    if ((page.seo?.headings?.h2?.length || 0) >= 2) structure += 8;
    if ((page.seo?.headings?.h3?.length || 0) >= 1) structure += 5;
    if ((page.seo?.links?.internal || 0) > 0) structure += 4;
    return { meta, content, technical, structure };
  }

  private extractMetrics(page: PageData): SEOMetrics {
    return {
      performance: {
        loadTime: page.performance?.loadTime || 0,
        firstContentfulPaint: page.performance?.firstContentfulPaint || 0,
        largestContentfulPaint: page.performance?.largestContentfulPaint || 0,
        timeToInteractive: page.performance?.timeToInteractive || 0
      },
      content: {
        wordCount: page.seo?.content?.wordCount || 0,
        keywordDensity: page.seo?.content?.keywordDensity || {}
      },
      technical: {
        images: {
          total: page.seo?.images?.total || 0,
          withAlt: page.seo?.images?.withAlt || 0,
          withoutAlt: page.seo?.images?.withoutAlt || 0
        },
        links: {
          internal: page.seo?.links?.internal || 0,
          external: page.seo?.links?.external || 0,
          broken: page.seo?.links?.broken || 0
        },
        headings: {
          h1: page.seo?.headings?.h1?.length || 0,
          h2: page.seo?.headings?.h2?.length || 0,
          h3: page.seo?.headings?.h3?.length || 0
        }
      },
      meta: {
        hasTitle: !!page.meta?.title && page.meta.title !== 'Untitled',
        hasDescription: !!page.meta?.description && page.meta.description !== 'No description available',
        hasCanonical: !!page.meta?.canonical && page.meta.canonical !== page.url,
        hasRobots: !!page.meta?.robots,
        ogTags: Object.keys(page.meta?.ogTags || {}).length,
        twitterTags: Object.keys(page.meta?.twitterTags || {}).length
      }
    };
  }

  private async analyzeRobotsTxt(url: string): Promise<SEOAnalysis['robotsAnalysis']> {
    const analysis: SEOAnalysis['robotsAnalysis'] = {
      exists: false,
      content: '',
      directives: {
        allow: [],
        disallow: [],
        sitemap: [],
        userAgent: [],
        crawlDelay: null
      },
      issues: []
    };

    try {
      const robotsUrl = new URL('/robots.txt', url).toString();
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0)'
        }
      });

      if (response.status === 200) {
        analysis.exists = true;
        analysis.content = response.data;

        // Parse robots.txt content
        const lines = response.data.split('\n');
        let currentUserAgent = '*';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith('#')) continue;

          const [directive, value] = trimmedLine.split(':').map(part => part.trim());
          const lowerDirective = directive.toLowerCase();

          switch (lowerDirective) {
            case 'user-agent':
              currentUserAgent = value;
              analysis.directives.userAgent.push(value);
              break;
            case 'allow':
              analysis.directives.allow.push(value);
              break;
            case 'disallow':
              analysis.directives.disallow.push(value);
              break;
            case 'sitemap':
              const sitemapValue = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
              if (sitemapValue) {
                analysis.directives.sitemap.push(sitemapValue);
              }
              break;
            case 'crawl-delay':
              const delay = parseFloat(value);
              if (!isNaN(delay)) {
                analysis.directives.crawlDelay = delay;
              }
              break;
          }
        }

        // Analyze for common issues
        if (!analysis.directives.sitemap.length) {
          analysis.issues.push({
            type: 'warning',
            message: 'No sitemap specified',
            recommendation: 'Add a sitemap directive to help search engines discover your content'
          });
        }

        if (analysis.directives.disallow.includes('/')) {
          analysis.issues.push({
            type: 'error',
            message: 'Entire site is disallowed',
            recommendation: 'Remove or modify the disallow directive to allow search engines to crawl your site'
          });
        }

        if (!analysis.directives.userAgent.includes('*')) {
          analysis.issues.push({
            type: 'warning',
            message: 'No default user-agent specified',
            recommendation: 'Add a User-agent: * directive to set default rules for all crawlers'
          });
        }

        if (analysis.directives.crawlDelay === null) {
          analysis.issues.push({
            type: 'notice',
            message: 'No crawl delay specified',
            recommendation: 'Consider adding a Crawl-delay directive to control crawler request rate'
          });
        }
      }
    } catch (error) {
      analysis.issues.push({
        type: 'error',
        message: 'Failed to fetch robots.txt',
        recommendation: 'Ensure robots.txt is accessible and properly configured'
      });
    }

    return analysis;
  }
}

export { SEOAnalyzer, type SEOAnalysis, type SEOIssue, type SEORecommendation, type SEOMetrics }; 