/**
 * Signal Analysis using Gemini AI
 * Analyzes collected data from multiple sources to identify business opportunities
 */

import { AnalyzedSignals, SourceData } from '../../types/pipeline.js';

/**
 * Analyzes signals from multiple data sources using Gemini AI
 * @param sourceData - Array of data from various sources (X, Polymarket, Google News)
 * @returns Promise<AnalyzedSignals> - Structured analysis of opportunities and pain points
 */
export async function analyzeSignals(
  sourceData: SourceData[]
): Promise<AnalyzedSignals> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log(`[Signal Analysis] Analyzing data from ${sourceData.length} sources...`);

  const prompt = `You are a business opportunity analyst.

Analyze the following data from multiple sources and identify:
1. Business opportunities - signals that suggest a market need
2. Pain points - problems people are experiencing that could be solved
3. Trending themes - topics gaining momentum

DATA FROM SOURCES:
${JSON.stringify(sourceData, null, 2)}

Return a JSON object with this EXACT structure:
{
  "opportunities": [
    {
      "signal": "description of the opportunity",
      "sources": ["x", "polymarket"],
      "confidence": 0.8,
      "category": "SaaS",
      "urgency": "short-term"
    }
  ],
  "painPoints": [
    {
      "problem": "description of the pain point",
      "audience": "target audience",
      "severity": 4,
      "sources": ["x"]
    }
  ],
  "trendingThemes": ["AI", "remote work", "sustainability"]
}

IMPORTANT:
- Provide at least 10 opportunities
- Provide at least 8 pain points
- Provide at least 10 trending themes
- Focus on opportunities that could translate to viable app/business ideas
- Prioritize signals that appear across multiple sources
- confidence should be 0.0 to 1.0
- severity should be 1 to 5
- urgency must be "immediate", "short-term", or "long-term"
- category should be one of: games, tools, saas, platforms, mobile, content, services, hardware, other`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Invalid response from Gemini API');
  }

  const result = JSON.parse(content) as AnalyzedSignals;

  console.log(`[Signal Analysis] Found ${result.opportunities?.length || 0} opportunities, ${result.painPoints?.length || 0} pain points, ${result.trendingThemes?.length || 0} themes`);

  return {
    opportunities: result.opportunities || [],
    painPoints: result.painPoints || [],
    trendingThemes: result.trendingThemes || [],
  };
}
