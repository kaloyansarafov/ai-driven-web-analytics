import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextApiRequest, NextApiResponse } from 'next';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { issue, includeRelatedLinks = true } = req.body;

    if (!issue) {
      return res.status(400).json({ success: false, error: 'Issue is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct the prompt based on the issue type (SEO or accessibility)
    const prompt = constructPrompt(issue, includeRelatedLinks);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into a structured format
    const structuredResponse = parseAIResponse(text, issue.source);

    return res.status(200).json({
      success: true,
      data: structuredResponse
    });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get AI recommendations'
    });
  }
}

function constructPrompt(issue: any, includeRelatedLinks: boolean): string {
  const { type, message, context, detail, source, category, url } = issue;
  const isSEO = source === 'seo';

  let prompt = `Analyze the following ${isSEO ? 'SEO' : 'accessibility'} issue and provide detailed recommendations:\n\n`;
  
  if (isSEO) {
    prompt += `Category: ${category}\n`;
    prompt += `URL: ${url}\n`;
  }
  
  prompt += `Type: ${type}\n`;
  prompt += `Message: ${message}\n`;
  
  if (context) {
    prompt += `Context: ${context}\n`;
  }
  
  if (detail) {
    prompt += `Details: ${detail}\n`;
  }

  prompt += `\nPlease provide:\n`;
  prompt += `1. A clear explanation of the issue\n`;
  prompt += `2. Specific, actionable recommendations to fix the issue\n`;
  prompt += `3. Technical terms and their definitions related to this issue\n`;
  
  if (includeRelatedLinks) {
    prompt += `4. Related resources and documentation links\n`;
  }

  prompt += `\nFormat your response in the following structure:\n`;
  prompt += `EXPLANATION:\n[Your explanation here]\n\n`;
  prompt += `RECOMMENDATIONS:\n- [Recommendation 1]\n- [Recommendation 2]\n...\n\n`;
  prompt += `TECHNICAL_TERMS:\n- Term: [Term 1]\n  Definition: [Definition 1]\n- Term: [Term 2]\n  Definition: [Definition 2]\n...\n\n`;
  
  if (includeRelatedLinks) {
    prompt += `RELATED_LINKS:\n- Title: [Title 1]\n  URL: [URL 1]\n  Description: [Description 1]\n- Title: [Title 2]\n  URL: [URL 2]\n  Description: [Description 2]\n...\n`;
  }

  return prompt;
}

function parseAIResponse(text: string, source: string): any {
  const sections = text.split('\n\n');
  const response: any = {
    explanation: '',
    recommendations: [],
    technicalTerms: [],
    relatedLinks: []
  };

  let currentSection = '';

  sections.forEach(section => {
    if (section.startsWith('EXPLANATION:')) {
      currentSection = 'explanation';
      response.explanation = section.replace('EXPLANATION:', '').trim();
    } else if (section.startsWith('RECOMMENDATIONS:')) {
      currentSection = 'recommendations';
      const recommendations = section.replace('RECOMMENDATIONS:', '').trim();
      response.recommendations = recommendations
        .split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => line.replace('-', '').trim());
    } else if (section.startsWith('TECHNICAL_TERMS:')) {
      currentSection = 'technicalTerms';
      const terms = section.replace('TECHNICAL_TERMS:', '').trim();
      const termBlocks = terms.split('\n-').filter(block => block.trim());
      
      response.technicalTerms = termBlocks.map(block => {
        const lines = block.split('\n').map(line => line.trim());
        const term = lines[0].replace('Term:', '').trim();
        const definition = lines[1].replace('Definition:', '').trim();
        return { term, definition };
      });
    } else if (section.startsWith('RELATED_LINKS:')) {
      currentSection = 'relatedLinks';
      const links = section.replace('RELATED_LINKS:', '').trim();
      const linkBlocks = links.split('\n-').filter(block => block.trim());
      
      response.relatedLinks = linkBlocks.map(block => {
        const lines = block.split('\n').map(line => line.trim());
        const title = lines[0].replace('Title:', '').trim();
        const url = lines[1].replace('URL:', '').trim();
        const description = lines[2].replace('Description:', '').trim();
        return { title, url, description };
      });
    }
  });

  return response;
} 