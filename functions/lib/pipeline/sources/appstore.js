"use strict";
/**
 * App Store Data Source via AppFollow API
 * Fetches top apps and reviews for friction analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAppStoreData = fetchAppStoreData;
exports.getStoredReviews = getStoredReviews;
exports.clearStoredReviews = clearStoredReviews;
// ============================================
// CONFIGURATION
// ============================================
const APPFOLLOW_BASE_URL = 'https://api.appfollow.io/v2';
// Categories to analyze (from spec)
const DEFAULT_CATEGORIES = [
    'health-fitness',
    'productivity',
    'finance',
];
// Configuration constants
const CONFIG = {
    maxAppsPerCategory: 10,
    maxReviewsPerApp: 200,
    minDownloads: 100000,
    starRange: [2, 3, 4], // Most constructive feedback
    lookbackDays: 90,
};
// ============================================
// API FUNCTIONS
// ============================================
/**
 * Fetches top apps in a category from AppFollow
 */
async function fetchTopApps(category, platform, apiKey) {
    const url = `${APPFOLLOW_BASE_URL}/apps/top?category=${category}&platform=${platform}&country=us&limit=${CONFIG.maxAppsPerCategory}`;
    const response = await fetch(url, {
        headers: {
            'X-AppFollow-API-Token': apiKey,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AppFollow API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data.apps || [];
}
/**
 * Fetches reviews for a specific app
 */
async function fetchAppReviews(appId, platform, apiKey) {
    const reviews = [];
    // Fetch reviews for each star rating in range
    for (const stars of CONFIG.starRange) {
        const url = `${APPFOLLOW_BASE_URL}/reviews?app_id=${appId}&platform=${platform}&rating=${stars}&sort=date&limit=${Math.floor(CONFIG.maxReviewsPerApp / CONFIG.starRange.length)}`;
        const response = await fetch(url, {
            headers: {
                'X-AppFollow-API-Token': apiKey,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            reviews.push(...(data.reviews || []));
        }
    }
    return reviews;
}
/**
 * Fetches ratings distribution for an app
 */
async function fetchAppRatings(appId, platform, apiKey) {
    const url = `${APPFOLLOW_BASE_URL}/ratings?app_id=${appId}&platform=${platform}`;
    const response = await fetch(url, {
        headers: {
            'X-AppFollow-API-Token': apiKey,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data.ratings || null;
}
/**
 * Calculates negative review rate from ratings distribution
 */
function calculateNegativeReviewRate(ratings) {
    if (!ratings || !ratings.distribution || ratings.total === 0) {
        return 0;
    }
    const negative = (ratings.distribution['1'] || 0) + (ratings.distribution['2'] || 0);
    return negative / ratings.total;
}
/**
 * Transforms AppFollow app to our CompetitorApp type
 */
function transformToCompetitorApp(app, platform, negativeRate) {
    return {
        name: app.title,
        appId: app.app_id,
        platform,
        category: app.category,
        downloads: 'Unknown', // AppFollow basic tier doesn't provide this
        rating: app.rating,
        reviewCount: app.reviews_count,
        negativeReviewRate: negativeRate,
    };
}
// ============================================
// MAIN FETCH FUNCTION
// ============================================
/**
 * Fetches App Store data for idea generation pipeline
 * @returns Promise<AppStoreData> - Structured app store data
 */
async function fetchAppStoreData(categories = DEFAULT_CATEGORIES) {
    const apiKey = process.env.APPFOLLOW_API_KEY;
    if (!apiKey) {
        throw new Error('APPFOLLOW_API_KEY not configured');
    }
    console.log('[AppStore] Fetching app store data via AppFollow API...');
    console.log(`[AppStore] Categories: ${categories.join(', ')}`);
    const niches = [];
    const allApps = [];
    const allReviews = [];
    let totalAppsAnalyzed = 0;
    let totalReviewsProcessed = 0;
    // Process each category
    for (const category of categories) {
        console.log(`[AppStore] Processing category: ${category}`);
        try {
            // Fetch top apps for both platforms
            const [iosApps, androidApps] = await Promise.all([
                fetchTopApps(category, 'ios', apiKey).catch(() => []),
                fetchTopApps(category, 'android', apiKey).catch(() => []),
            ]);
            // Combine and deduplicate by name (prefer iOS data when available)
            const appMap = new Map();
            for (const app of iosApps) {
                appMap.set(app.title.toLowerCase(), { app, platform: 'ios' });
            }
            for (const app of androidApps) {
                const key = app.title.toLowerCase();
                if (!appMap.has(key)) {
                    appMap.set(key, { app, platform: 'android' });
                }
            }
            const categoryApps = [];
            const competitorWeaknesses = [];
            let totalRating = 0;
            let totalNegativeRate = 0;
            // Process each app
            for (const { app, platform } of Array.from(appMap.values()).slice(0, CONFIG.maxAppsPerCategory)) {
                totalAppsAnalyzed++;
                // Fetch ratings for negative rate calculation
                const ratings = await fetchAppRatings(app.app_id, platform, apiKey);
                const negativeRate = calculateNegativeReviewRate(ratings);
                const competitorApp = transformToCompetitorApp(app, platform, negativeRate);
                categoryApps.push(competitorApp);
                allApps.push(competitorApp);
                totalRating += app.rating;
                totalNegativeRate += negativeRate;
                // Fetch reviews for friction analysis
                const reviews = await fetchAppReviews(app.app_id, platform, apiKey);
                if (reviews.length > 0) {
                    allReviews.push({
                        appId: app.app_id,
                        appName: app.title,
                        reviews,
                    });
                    totalReviewsProcessed += reviews.length;
                }
                // Add to weaknesses if high negative rate
                if (negativeRate > 0.25) {
                    competitorWeaknesses.push(`${app.title} has ${Math.round(negativeRate * 100)}% negative reviews`);
                }
            }
            // Create niche profile
            const appCount = categoryApps.length;
            if (appCount > 0) {
                niches.push({
                    name: formatCategoryName(category),
                    category,
                    marketSize: estimateMarketSize(category),
                    topApps: categoryApps.slice(0, 3),
                    avgRating: totalRating / appCount,
                    negativeReviewRate: totalNegativeRate / appCount,
                    aiDisruptionScore: calculateAIDisruptionScore(totalNegativeRate / appCount, categoryApps),
                    competitorWeaknesses,
                });
            }
        }
        catch (error) {
            console.error(`[AppStore] Error processing category ${category}:`, error);
            // Continue with other categories
        }
    }
    console.log(`[AppStore] Fetched ${totalAppsAnalyzed} apps, ${totalReviewsProcessed} reviews`);
    // Store reviews for later friction detection
    // The friction detector will use this data
    globalThis.__appStoreReviews = allReviews;
    return {
        source: 'appstore',
        niches,
        frictionPoints: [], // Will be populated by friction detector
        opportunities: [], // Will be populated by solution generator
        metadata: {
            appsAnalyzed: totalAppsAnalyzed,
            reviewsProcessed: totalReviewsProcessed,
            categoriesAnalyzed: categories,
        },
        fetchedAt: new Date(),
    };
}
// ============================================
// HELPER FUNCTIONS
// ============================================
function formatCategoryName(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
function estimateMarketSize(category) {
    // Market size estimates based on category (from research)
    const marketSizes = {
        'health-fitness': '$10B',
        'productivity': '$8B',
        'finance': '$12B',
        'education': '$6B',
        'lifestyle': '$5B',
        'utilities': '$3B',
        'business': '$7B',
        'food-drink': '$4B',
        'games-casual': '$15B',
        'games-puzzle': '$8B',
        'games-strategy': '$6B',
    };
    return marketSizes[category] || '$1B+';
}
function calculateAIDisruptionScore(negativeReviewRate, apps) {
    // Base score from negative review rate (higher negative = more opportunity)
    let score = negativeReviewRate * 100;
    // Adjust based on average rating (lower rating = more opportunity)
    const avgRating = apps.reduce((sum, app) => sum + app.rating, 0) / apps.length;
    if (avgRating < 4.0) {
        score += 20;
    }
    else if (avgRating < 4.5) {
        score += 10;
    }
    // Normalize to 0-100 range
    return Math.min(Math.max(score, 0), 100);
}
/**
 * Get stored reviews for friction analysis
 */
function getStoredReviews() {
    return globalThis.__appStoreReviews || [];
}
/**
 * Clear stored reviews after processing
 */
function clearStoredReviews() {
    delete globalThis.__appStoreReviews;
}
//# sourceMappingURL=appstore.js.map