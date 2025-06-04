import { defineEventHandler, readBody, createError, getQuery } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(String(geminiApiKey));

  try {
    const body = await readBody(event);
    const { prompt } = body;
    if (!prompt) {
      throw createError({ statusCode: 400, message: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
    });

    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw createError({ statusCode: 500, message: error.message || 'Failed to get AI summary' });
  }
}); 