import { SEOAnalyzer } from '../../utils/seo/SEOAnalyzer';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url, options } = body;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      });
    }

    const analyzer = new SEOAnalyzer({
      maxDepth: options?.maxDepth || 2,
      maxPages: options?.maxPages || 10,
      respectRobots: options?.respectRobots ?? true,
      crawlDelay: options?.crawlDelay || 1000
    });

    const analysis = await analyzer.analyze(url);
    return analysis;
  } catch (error) {
    console.error('SEO Analysis Error:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'An error occurred during SEO analysis'
    });
  }
}); 