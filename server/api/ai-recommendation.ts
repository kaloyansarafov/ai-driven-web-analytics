import { GoogleGenerativeAI } from '@google/generative-ai';
import { defineEventHandler, readBody, createError } from 'h3';
import type { SEOIssue } from '../../utils/seo/SEOAnalyzer';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issue } = body as { issue: SEOIssue };

    if (!issue) {
      throw createError({
        statusCode: 400,
        message: 'Issue is required'
      });
    }

    // Initialize Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct the prompt
    const prompt = `As an SEO expert, provide a detailed recommendation for the following SEO issue:
    
Issue Type: ${issue.type}
Message: ${issue.message}
Element: ${issue.element || 'N/A'}
Current Recommendation: ${issue.recommendation}
URL: ${issue.url}

Please provide:
1. A detailed explanation of why this issue matters for SEO
2. Step-by-step instructions on how to fix it
3. A code example if applicable (in HTML/JavaScript/TypeScript)
4. Best practices to prevent this issue in the future

Format the response as JSON with the following structure:
{
  "recommendation": "detailed recommendation text",
  "codeExample": "code example if applicable, otherwise null"
}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(text);
      return {
        recommendation: parsedResponse.recommendation,
        codeExample: parsedResponse.codeExample
      };
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      return {
        recommendation: text,
        codeExample: null
      };
    }
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'An error occurred while generating the recommendation'
    });
  }
}); 