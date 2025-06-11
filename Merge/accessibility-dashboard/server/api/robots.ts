import { URL } from 'url';
import axios from 'axios';
import { defineEventHandler, readBody, createError } from 'h3';

interface RobotsAnalysis {
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

    const robotsUrl = new URL('/robots.txt', url).toString();
    const analysis: RobotsAnalysis = {
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
              // Handle sitemap URLs that might contain colons (e.g., https://)
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
  } catch (error) {
    console.error('Robots.txt Analysis Error:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'An error occurred during robots.txt analysis'
    });
  }
}); 