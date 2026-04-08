"use strict";
/**
 * Idea Scoring using Gemini AI
 * Scores generated ideas on multiple parameters and generates business analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreIdeas = scoreIdeas;
/**
 * Scores ideas using Gemini AI
 * @param ideas - Array of raw ideas to score
 * @returns Promise<ScoredIdea[]> - Array of scored ideas with analysis
 */
async function scoreIdeas(ideas) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }
    console.log(`[Idea Scoring] Scoring ${ideas.length} ideas...`);
    const prompt = `You are a business analyst scoring startup ideas.

For each idea, provide:
1. Scores (1-5 scale, where 5 is best/most favorable):
   - businessPotential: Revenue opportunity, market size (5=huge potential, 1=limited)
   - developmentComplexity: 5=easy to build, 1=very complex
   - timeToMarket: 5=can launch in weeks, 1=takes years
   - competitionLevel: 5=low competition/blue ocean, 1=saturated market
   - riskLevel: 5=low risk, 1=very risky

2. Analysis:
   - strengths: Array of 3-5 key advantages
   - risks: Array of 3-5 key challenges
   - businessPlan: { targetMarket, monetization, goToMarket, competitiveAdvantage }
   - elevatorPitch: 2-3 sentence pitch

IDEAS TO SCORE:
${JSON.stringify(ideas, null, 2)}

Return a JSON array with this EXACT structure for each idea:
[
  {
    "name": "original name",
    "brief": "original brief",
    "category": "original category",
    "tags": ["original", "tags"],
    "sourceSignals": ["original signals"],
    "businessPotential": 4,
    "developmentComplexity": 3,
    "timeToMarket": 4,
    "competitionLevel": 2,
    "riskLevel": 3,
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "risks": ["risk 1", "risk 2", "risk 3"],
    "businessPlan": {
      "targetMarket": "Who the product is for",
      "monetization": "How it makes money",
      "goToMarket": "How to acquire customers",
      "competitiveAdvantage": "What makes it defensible"
    },
    "elevatorPitch": "2-3 sentence compelling pitch"
  }
]

IMPORTANT:
- Be critical and realistic in scoring - not everything is a 4 or 5
- Scores should reflect genuine assessment
- Keep all original fields (name, brief, category, tags, sourceSignals)
- strengths and risks should be specific and actionable
- businessPlan fields should each be 1-2 sentences
- elevatorPitch should be compelling and concise`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3, // Lower temperature for consistent scoring
            },
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
        throw new Error('Invalid response from Gemini API');
    }
    // Extract JSON from response (may be wrapped in markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
    }
    else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();
    const scoredIdeas = JSON.parse(jsonStr);
    // Calculate composite score and tier for each idea
    const finalIdeas = scoredIdeas.map(idea => ({
        ...idea,
        compositeScore: calculateComposite(idea),
        tier: getTier(calculateComposite(idea)),
    }));
    console.log(`[Idea Scoring] Scored ${finalIdeas.length} ideas`);
    return finalIdeas;
}
/**
 * Calculates composite score using weighted average
 * @param idea - Scored idea with individual scores
 * @returns Composite score (1.0 to 5.0)
 */
function calculateComposite(idea) {
    const weights = {
        businessPotential: 0.25,
        developmentComplexity: 0.20,
        timeToMarket: 0.20,
        competitionLevel: 0.20,
        riskLevel: 0.15,
    };
    const score = (idea.businessPotential || 3) * weights.businessPotential +
        (idea.developmentComplexity || 3) * weights.developmentComplexity +
        (idea.timeToMarket || 3) * weights.timeToMarket +
        (idea.competitionLevel || 3) * weights.competitionLevel +
        (idea.riskLevel || 3) * weights.riskLevel;
    return Math.round(score * 100) / 100;
}
/**
 * Determines decision tier based on composite score
 * @param score - Composite score
 * @returns Decision tier
 */
function getTier(score) {
    if (score >= 4.0)
        return 'hot';
    if (score >= 3.0)
        return 'warm';
    if (score >= 2.0)
        return 'park';
    return 'discard';
}
//# sourceMappingURL=scoreIdeas.js.map