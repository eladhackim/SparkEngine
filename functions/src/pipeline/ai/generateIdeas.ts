/**
 * Idea Generation using Gemini AI
 * Generates business ideas based on analyzed signals
 */

import { AnalyzedSignals, GenerationOptions, RawIdea, IdeaCategory } from '../../types/pipeline.js';

/**
 * Generates business ideas from analyzed signals using Gemini AI
 * @param signals - Analyzed signals from the analysis stage
 * @param options - Generation options (count, categories)
 * @returns Promise<RawIdea[]> - Array of generated business ideas
 */
export async function generateFromSignals(
  signals: AnalyzedSignals,
  options: GenerationOptions
): Promise<RawIdea[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log(`[Idea Generation] Generating ${options.count} ideas...`);

  const categoryFilter = options.categories?.length
    ? `Focus on these categories: ${options.categories.join(', ')}`
    : 'Include diverse categories: games, tools, saas, platforms, mobile, content, services, hardware';

  const validCategories = ['games', 'tools', 'saas', 'platforms', 'mobile', 'content', 'services', 'hardware', 'other'];

  const prompt = `You are a creative business idea generator.

Based on the following market signals and opportunities, generate ${options.count} unique business/app ideas.

MARKET SIGNALS:
${JSON.stringify(signals, null, 2)}

REQUIREMENTS:
- Each idea should address a real opportunity or pain point from the signals
- Ideas should be actionable and buildable by a solo founder or small team
- Include a mix of complexity levels (quick MVPs to larger platforms)
- ${categoryFilter}
- Each idea needs: name (company name), brief (1-2 sentences), category, tags (3-5)

CATEGORY MUST be one of: ${validCategories.join(', ')}

Return a JSON array of ideas with this EXACT structure:
[
  {
    "name": "AppName",
    "brief": "One or two sentence description of what it does and who it's for",
    "category": "saas",
    "tags": ["ai", "productivity", "b2b"],
    "sourceSignals": ["signal that inspired this idea"]
  }
]

IMPORTANT:
- Generate exactly ${options.count} ideas
- Be creative but practical
- Ideas should have clear monetization potential
- Each name should be unique and catchy
- brief should be 1-2 sentences max
- tags should be 3-5 lowercase keywords
- sourceSignals should reference 1-3 signals that inspired this idea`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.9, // Higher creativity
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

  // Extract JSON from response (may be wrapped in markdown code blocks)
  let jsonStr = content.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  const ideas = JSON.parse(jsonStr) as Array<{
    name: string;
    brief: string;
    category: string;
    tags: string[];
    sourceSignals: string[];
  }>;

  // Validate and normalize categories
  const normalizedIdeas: RawIdea[] = ideas.map(idea => ({
    name: idea.name,
    brief: idea.brief,
    category: (validCategories.includes(idea.category?.toLowerCase())
      ? idea.category.toLowerCase()
      : 'other') as IdeaCategory,
    tags: Array.isArray(idea.tags) ? idea.tags.slice(0, 5) : [],
    sourceSignals: Array.isArray(idea.sourceSignals) ? idea.sourceSignals.slice(0, 3) : [],
  }));

  console.log(`[Idea Generation] Generated ${normalizedIdeas.length} ideas`);

  return normalizedIdeas;
}
