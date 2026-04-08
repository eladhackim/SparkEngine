/**
 * X/Twitter Data Source via Grok API
 * Fetches trending topics, pain points, and emerging discussions from X/Twitter
 */

import { XTrendData } from '../../types/pipeline.js';

/**
 * Fetches X/Twitter trends using Grok API with real-time access
 * @returns Promise<XTrendData> - Structured trend data from X/Twitter
 */
export async function fetchXTrends(): Promise<XTrendData> {
  const grokApiKey = process.env.GROK_API_KEY;

  if (!grokApiKey) {
    throw new Error('GROK_API_KEY not configured');
  }

  console.log('[X/Twitter] Fetching trends via Grok API...');

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${grokApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3-latest',
      messages: [
        {
          role: 'system',
          content: `You are a trend analyst with real-time access to X/Twitter data.
            Identify:
            1. Top trending topics relevant to business/tech/apps
            2. Pain points people are complaining about (potential business opportunities)
            3. Emerging discussions that are growing rapidly

            Focus on signals that could translate to app/business ideas.
            Return structured JSON.`,
        },
        {
          role: 'user',
          content: `Analyze current X/Twitter trends for business opportunities. Return JSON with this exact structure:
{
  "trends": [
    { "topic": "string", "volume": number, "sentiment": "positive"|"negative"|"neutral", "relatedTopics": ["string"] }
  ],
  "painPoints": [
    { "description": "string", "frequency": number, "examples": ["string"] }
  ],
  "emergingDiscussions": [
    { "topic": "string", "growth": number, "keyPhrases": ["string"] }
  ]
}

Provide at least 5 items in each category. Focus on tech, business, and app opportunities.`,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  };

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from Grok API');
  }

  const parsed = JSON.parse(data.choices[0].message.content) as {
    trends: XTrendData['trends'];
    painPoints: XTrendData['painPoints'];
    emergingDiscussions: XTrendData['emergingDiscussions'];
  };

  console.log(`[X/Twitter] Fetched ${parsed.trends?.length || 0} trends, ${parsed.painPoints?.length || 0} pain points`);

  return {
    source: 'x',
    trends: parsed.trends || [],
    painPoints: parsed.painPoints || [],
    emergingDiscussions: parsed.emergingDiscussions || [],
    fetchedAt: new Date(),
  };
}
