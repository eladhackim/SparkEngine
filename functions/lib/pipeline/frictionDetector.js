"use strict";
/**
 * Friction Detection Module
 * Analyzes app store reviews to identify user pain points and friction patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFriction = detectFriction;
const appstore_js_1 = require("./sources/appstore.js");
// ============================================
// CONFIGURATION
// ============================================
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
const BATCH_SIZE = 50; // Reviews per batch
// ============================================
// FRICTION SCORING
// ============================================
/**
 * Calculate composite score (0-100) from weighted criteria
 */
function calculateCompositeScore(frequency, severity, automationFeasibility, competitiveDifferentiation) {
    // Weights from spec
    const weights = {
        frequency: 0.30,
        severity: 0.25,
        automationFeasibility: 0.25,
        competitiveDifferentiation: 0.20,
    };
    const weightedScore = frequency * weights.frequency +
        severity * weights.severity +
        automationFeasibility * weights.automationFeasibility +
        competitiveDifferentiation * weights.competitiveDifferentiation;
    // Convert from 1-5 scale to 0-100
    return Math.round(weightedScore * 20);
}
/**
 * Determine priority tier based on composite score
 */
function determinePriority(score) {
    if (score >= 80)
        return 'P0';
    if (score >= 60)
        return 'P1';
    if (score >= 40)
        return 'P2';
    return 'P3';
}
/**
 * Map frequency count to 1-5 score
 */
function frequencyToScore(count) {
    if (count >= 20)
        return 5;
    if (count >= 10)
        return 4;
    if (count >= 5)
        return 3;
    if (count >= 2)
        return 2;
    return 1;
}
/**
 * Map AI addressability to solution types
 */
function addressabilityToSolutionTypes(addressability, category) {
    const categoryMappings = {
        input: ['recognition', 'nlp', 'prediction'],
        navigation: ['automation', 'prediction'],
        cognitive: ['coaching', 'generation', 'analysis'],
        repetitive: ['automation', 'prediction'],
        waiting: ['prediction', 'automation'],
        decision: ['coaching', 'analysis', 'prediction'],
        accuracy: ['analysis', 'prediction'],
        paywall: [],
        reliability: [],
        other: ['analysis'],
    };
    if (addressability === 'low')
        return [];
    const solutions = categoryMappings[category] || [];
    return addressability === 'high' ? solutions : solutions.slice(0, 2);
}
// ============================================
// AI EXTRACTION
// ============================================
/**
 * Extract friction points from a batch of reviews using Gemini
 */
async function extractFrictionFromReviews(batch, geminiApiKey, runId) {
    const reviewTexts = batch.reviews
        .map((r, i) => `[${i + 1}] (${r.rating}★) ${r.content}`)
        .join('\n\n');
    const prompt = `You are a UX friction analyst. Analyze these app reviews for ${batch.appName} and identify distinct user friction points.

REVIEWS:
${reviewTexts}

For each distinct friction point, identify:
1. Category: One of: input, navigation, cognitive, repetitive, waiting, decision, accuracy, paywall, reliability, other
2. Description: Clear, actionable description (max 100 chars)
3. Severity: 1-5 scale (5 = app-breaking, 1 = minor annoyance)
4. Frequency: Count of reviews mentioning this issue
5. User Quotes: 2-3 exact quotes from reviews
6. AI Addressability: "high", "medium", or "low" based on whether AI could solve this
7. Keywords: 3-5 relevant keywords

Focus on friction that could be solved with AI/automation. Ignore generic complaints.

Return JSON array:
[
  {
    "category": "input",
    "description": "Manual food search every meal takes too long",
    "severity": 4,
    "frequency": 8,
    "userQuotes": ["Constantly typing...", "Wish it remembered..."],
    "aiAddressability": "high",
    "keywords": ["search", "typing", "manual", "slow"]
  }
]

Return at least 3 friction points, max 10. Only include distinct issues.`;
    const response = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3, // Low for consistent extraction
            },
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error(`[FrictionDetector ${runId}] Invalid Gemini response for ${batch.appName}`);
        return [];
    }
    try {
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (parseError) {
        console.error(`[FrictionDetector ${runId}] JSON parse error for ${batch.appName}:`, parseError);
        return [];
    }
}
// ============================================
// AGGREGATION
// ============================================
/**
 * Merge similar friction points across apps
 */
function aggregateFrictionPoints(frictionsByApp, runId) {
    const aggregated = [];
    let frictionId = 1;
    // Group by category + similar description
    const categoryGroups = new Map();
    for (const [, frictions] of frictionsByApp) {
        for (const friction of frictions) {
            const existing = categoryGroups.get(friction.category) || [];
            existing.push(friction);
            categoryGroups.set(friction.category, existing);
        }
    }
    // Process each category group
    for (const [category, frictions] of categoryGroups) {
        // Further group by similar descriptions using keyword overlap
        const clusters = [];
        for (const friction of frictions) {
            let foundCluster = false;
            for (const cluster of clusters) {
                const clusterKeywords = new Set(cluster[0].keywords);
                const overlap = friction.keywords.filter(k => clusterKeywords.has(k)).length;
                if (overlap >= 2) {
                    cluster.push(friction);
                    foundCluster = true;
                    break;
                }
            }
            if (!foundCluster) {
                clusters.push([friction]);
            }
        }
        // Create friction point for each cluster
        for (const cluster of clusters) {
            if (cluster.length === 0)
                continue;
            // Aggregate scores
            const totalFrequency = cluster.reduce((sum, f) => sum + f.frequency, 0);
            const avgSeverity = cluster.reduce((sum, f) => sum + f.severity, 0) / cluster.length;
            // Determine addressability (majority vote)
            const addressabilityCounts = { high: 0, medium: 0, low: 0 };
            for (const f of cluster) {
                addressabilityCounts[f.aiAddressability]++;
            }
            const addressability = (Object.entries(addressabilityCounts)
                .sort((a, b) => b[1] - a[1])[0][0]);
            // Calculate scores
            const frequencyScore = frequencyToScore(totalFrequency);
            const severityScore = Math.round(avgSeverity);
            const automationScore = addressability === 'high' ? 5 : addressability === 'medium' ? 3 : 1;
            const diffScore = cluster.length >= 2 ? 4 : 3; // Higher if across multiple apps
            const compositeScore = calculateCompositeScore(frequencyScore, severityScore, automationScore, diffScore);
            // Collect unique quotes
            const allQuotes = cluster.flatMap(f => f.userQuotes);
            const uniqueQuotes = [...new Set(allQuotes)].slice(0, 5);
            // Use best description
            const bestDescription = cluster.sort((a, b) => b.severity - a.severity)[0].description;
            // Get app info from the first friction
            const appInfo = [...frictionsByApp.entries()].find(([, frictions]) => frictions.includes(cluster[0]));
            aggregated.push({
                id: `FP-${runId.substring(0, 6)}-${String(frictionId++).padStart(3, '0')}`,
                appId: appInfo?.[0] || 'unknown',
                appName: appInfo?.[0] || 'Unknown App',
                category,
                description: bestDescription,
                scores: {
                    frequency: frequencyScore,
                    severity: severityScore,
                    automationFeasibility: automationScore,
                    competitiveDifferentiation: diffScore,
                },
                compositeScore,
                priority: determinePriority(compositeScore),
                evidence: {
                    reviewCount: totalFrequency,
                    userQuotes: uniqueQuotes,
                    platforms: ['ios', 'android'], // Simplified - both platforms
                    ratingCorrelation: 3.0, // Default - would need more data for accurate calc
                },
                aiAnalysis: {
                    addressability,
                    solutionTypes: addressabilityToSolutionTypes(addressability, category),
                    suggestedApproach: generateSuggestedApproach(category, addressability),
                },
                metadata: {
                    createdAt: new Date(),
                    analysisVersion: '1.0',
                    sourceRunId: runId,
                },
            });
        }
    }
    // Sort by composite score descending
    return aggregated.sort((a, b) => b.compositeScore - a.compositeScore);
}
/**
 * Generate suggested approach based on category
 */
function generateSuggestedApproach(category, addressability) {
    if (addressability === 'low') {
        return 'Low automation potential - requires business or engineering solution';
    }
    const approaches = {
        input: 'Use AI prediction, OCR, or voice input to reduce manual data entry',
        navigation: 'Implement smart shortcuts and predictive navigation based on usage patterns',
        cognitive: 'Add AI-powered guidance, suggestions, and simplified workflows',
        repetitive: 'Automate recurring tasks using pattern recognition and learned preferences',
        waiting: 'Implement predictive loading and background processing',
        decision: 'Provide AI recommendations and smart defaults based on context',
        accuracy: 'Use ML for data validation, anomaly detection, and auto-correction',
        paywall: 'N/A - business model decision',
        reliability: 'N/A - engineering stability issue',
        other: 'Analyze specific pain point for AI solution opportunities',
    };
    return approaches[category];
}
// ============================================
// MAIN DETECTION FUNCTION
// ============================================
/**
 * Analyzes app store reviews to detect friction points
 * Uses reviews stored by fetchAppStoreData()
 * @returns Promise<FrictionPoint[]> - Detected and scored friction points
 */
async function detectFriction(runId) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }
    console.log(`[FrictionDetector ${runId}] Starting friction detection...`);
    const storedReviews = (0, appstore_js_1.getStoredReviews)();
    if (storedReviews.length === 0) {
        console.warn(`[FrictionDetector ${runId}] No reviews available for analysis`);
        return [];
    }
    console.log(`[FrictionDetector ${runId}] Processing ${storedReviews.length} apps`);
    const frictionsByApp = new Map();
    let totalApiCalls = 0;
    // Process each app's reviews
    for (const { appId, appName, reviews } of storedReviews) {
        if (reviews.length === 0)
            continue;
        console.log(`[FrictionDetector ${runId}] Analyzing ${reviews.length} reviews for ${appName}`);
        // Process in batches
        const batches = [];
        for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
            batches.push({
                appId,
                appName,
                reviews: reviews.slice(i, i + BATCH_SIZE).map(r => ({
                    rating: r.rating,
                    content: r.content,
                    date: r.date,
                })),
            });
        }
        const appFrictions = [];
        for (const batch of batches) {
            try {
                const extracted = await extractFrictionFromReviews(batch, geminiApiKey, runId);
                appFrictions.push(...extracted);
                totalApiCalls++;
            }
            catch (error) {
                console.error(`[FrictionDetector ${runId}] Error processing batch for ${appName}:`, error);
                // Continue with other batches
            }
        }
        if (appFrictions.length > 0) {
            frictionsByApp.set(appName, appFrictions);
        }
    }
    console.log(`[FrictionDetector ${runId}] Made ${totalApiCalls} Gemini API calls`);
    // Aggregate and score friction points
    const aggregatedFriction = aggregateFrictionPoints(frictionsByApp, runId);
    console.log(`[FrictionDetector ${runId}] Detected ${aggregatedFriction.length} aggregated friction points`);
    // Log priority breakdown
    const priorityCounts = {
        P0: aggregatedFriction.filter(f => f.priority === 'P0').length,
        P1: aggregatedFriction.filter(f => f.priority === 'P1').length,
        P2: aggregatedFriction.filter(f => f.priority === 'P2').length,
        P3: aggregatedFriction.filter(f => f.priority === 'P3').length,
    };
    console.log(`[FrictionDetector ${runId}] Priority breakdown: P0=${priorityCounts.P0}, P1=${priorityCounts.P1}, P2=${priorityCounts.P2}, P3=${priorityCounts.P3}`);
    // Clear stored reviews
    (0, appstore_js_1.clearStoredReviews)();
    return aggregatedFriction;
}
//# sourceMappingURL=frictionDetector.js.map