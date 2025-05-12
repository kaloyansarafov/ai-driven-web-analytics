import { defineEventHandler, readBody, createError } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useRuntimeConfig } from '#imports';

// Initialize Gemini with runtime config
const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.geminiApiKey || '');

interface Issue {
  type: "error" | "warning" | "notice";
  code: string;
  message: string;
  context?: string;
  source: string;
  selector?: string;
  detail?: string;
}

interface GeminiResponse {
  explanation: string;
  recommendations: string[];
  technicalTerms: {
    term: string;
    definition: string;
  }[];
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issue } = body;

    if (!issue) {
      throw createError({
        statusCode: 400,
        message: 'Issue data is required'
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Create the prompt with explicit JSON formatting instructions
    const prompt = `You are an accessibility expert. Analyze this web accessibility issue and provide a response in the following JSON format ONLY. Do not include any other text or explanation outside the JSON structure.

Required JSON structure:
{
  "explanation": "A clear, simple explanation of the issue",
  "recommendations": ["First specific recommendation", "Second specific recommendation", "Third specific recommendation"],
  "technicalTerms": [
    {
      "term": "Technical term 1",
      "definition": "Simple definition of term 1"
    }
  ]
}

Issue details:
- Type: ${issue.type}
- Code: ${issue.code}
- Message: ${issue.message}
- Context: ${issue.context || 'N/A'}
- Source: ${issue.source}
- Detail: ${issue.detail || 'N/A'}

Remember to:
1. Keep explanations clear and simple
2. Provide specific, actionable recommendations
3. Define any technical terms used
4. Return ONLY valid JSON matching the required structure`;

    // Generate content with safety settings
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = await result.response;
    const text = response.text();

    // Clean the response text to ensure it's valid JSON
    const cleanedText = text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');

    try {
      const parsedResponse: GeminiResponse = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!parsedResponse.explanation || !Array.isArray(parsedResponse.recommendations) || !Array.isArray(parsedResponse.technicalTerms)) {
        throw new Error('Invalid response structure');
      }

      return {
        success: true,
        data: parsedResponse
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      throw createError({
        statusCode: 500,
        message: 'Failed to parse AI response. Please try again.'
      });
    }
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get AI recommendations'
    });
  }
}); 