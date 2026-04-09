"use strict";
/**
 * App Store Data Source using Free Scrapers
 * Fetches top apps and reviews for friction analysis from both stores
 * Uses: google-play-scraper and app-store-scraper (no API keys required)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAppStoreData = fetchAppStoreData;
exports.getStoredReviews = getStoredReviews;
exports.clearStoredReviews = clearStoredReviews;
const google_play_scraper_1 = __importDefault(require("google-play-scraper"));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const appStore = require('app-store-scraper');
// ============================================
// CONFIGURATION
// ============================================
// Categories to analyze (from spec) - mapped to scraper constants
const DEFAULT_CATEGORIES = [
    'health-fitness',
    'productivity',
    'finance',
];
// Configuration constants
const CONFIG = {
    maxAppsPerCategory: 5, // 5 apps × 3 categories = 15 apps total
    maxReviewsPerApp: 40, // 40 reviews per app for good friction analysis
    requestDelay: 200, // ms between requests
};
// Category mapping for Google Play (using string values that match the enum)
const GPLAY_CATEGORY_MAP = {
    'health-fitness': 'HEALTH_AND_FITNESS',
    'productivity': 'PRODUCTIVITY',
    'finance': 'FINANCE',
    'education': 'EDUCATION',
    'lifestyle': 'LIFESTYLE',
    'business': 'BUSINESS',
    'food-drink': 'FOOD_AND_DRINK',
    'games-casual': 'GAME_CASUAL',
    'games-puzzle': 'GAME_PUZZLE',
    'games-strategy': 'GAME_STRATEGY',
};
// Category mapping for App Store (numeric IDs)
const APPSTORE_CATEGORY_MAP = {
    'health-fitness': 6013,
    'productivity': 6007,
    'finance': 6015,
    'education': 6017,
    'lifestyle': 6012,
    'business': 6000,
    'food-drink': 6023,
    'games-casual': 7003,
    'games-puzzle': 7012,
    'games-strategy': 7017,
};
// ============================================
// HELPER FUNCTIONS
// ============================================
/**
 * Delay helper for rate limiting
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
// ============================================
// GOOGLE PLAY SCRAPER FUNCTIONS
// ============================================
/**
 * Fetches top apps from Google Play Store
 */
async function fetchGooglePlayApps(category) {
    const gplayCategory = GPLAY_CATEGORY_MAP[category];
    if (!gplayCategory) {
        console.log(`[AppStore] No Google Play mapping for category: ${category}`);
        return [];
    }
    try {
        const apps = await google_play_scraper_1.default.list({
            category: gplayCategory,
            collection: 'TOP_FREE',
            num: CONFIG.maxAppsPerCategory,
            fullDetail: true,
        });
        return apps.map((app) => ({
            name: app.title,
            appId: app.appId,
            platform: 'android',
            category: app.genre || category,
            downloads: app.installs || 'Unknown',
            rating: app.score || 0,
            reviewCount: app.reviews || 0,
            negativeReviewRate: app.histogram
                ? ((app.histogram['1'] || 0) + (app.histogram['2'] || 0)) / (app.ratings || 1)
                : 0,
        }));
    }
    catch (error) {
        console.error(`[AppStore] Google Play fetch error for ${category}:`, error);
        return [];
    }
}
/**
 * Fetches reviews from Google Play Store
 */
async function fetchGooglePlayReviews(appId) {
    try {
        // Fetch reviews sorted by rating (to get critical reviews)
        const result = await google_play_scraper_1.default.reviews({
            appId,
            sort: 3, // 3 = RATING
            num: CONFIG.maxReviewsPerApp,
        });
        return result.data.map((review) => ({
            id: review.id,
            author: review.userName,
            rating: review.score,
            title: review.title || undefined,
            content: review.text,
            date: review.date,
            version: review.version || undefined,
            helpful_count: review.thumbsUp || undefined,
        }));
    }
    catch (error) {
        console.error(`[AppStore] Google Play reviews error for ${appId}:`, error);
        return [];
    }
}
/**
 * Fetches app details with ratings from Google Play
 */
async function fetchGooglePlayRatings(appId) {
    try {
        const app = await google_play_scraper_1.default.app({ appId });
        if (app.histogram) {
            return {
                average: app.score || 0,
                total: app.ratings || 0,
                distribution: {
                    '1': app.histogram['1'] || 0,
                    '2': app.histogram['2'] || 0,
                    '3': app.histogram['3'] || 0,
                    '4': app.histogram['4'] || 0,
                    '5': app.histogram['5'] || 0,
                },
            };
        }
        return null;
    }
    catch (error) {
        console.error(`[AppStore] Google Play ratings error for ${appId}:`, error);
        return null;
    }
}
/**
 * Fetches top apps from Apple App Store
 */
async function fetchAppStoreApps(category) {
    const appStoreCategory = APPSTORE_CATEGORY_MAP[category];
    if (!appStoreCategory) {
        console.log(`[AppStore] No App Store mapping for category: ${category}`);
        return [];
    }
    try {
        const apps = await appStore.list({
            category: appStoreCategory,
            collection: appStore.collection.TOP_FREE_IOS,
            num: CONFIG.maxAppsPerCategory,
            country: 'us',
        });
        return apps.map((app) => ({
            name: app.title,
            appId: String(app.id), // Use numeric ID for iOS (required for reviews/ratings API)
            platform: 'ios',
            category: app.primaryGenre || category,
            downloads: 'Unknown', // App Store doesn't provide download counts
            rating: app.score || 0,
            reviewCount: app.reviews || 0,
            negativeReviewRate: 0, // Will be calculated separately if needed
        }));
    }
    catch (error) {
        console.error(`[AppStore] App Store fetch error for ${category}:`, error);
        return [];
    }
}
/**
 * Fetches reviews from Apple App Store
 */
async function fetchAppStoreReviews(appId) {
    try {
        const reviews = await appStore.reviews({
            id: typeof appId === 'string' ? parseInt(appId, 10) : appId,
            sort: appStore.sort.RECENT,
            page: 1,
            country: 'us',
        });
        return reviews.map((review) => ({
            id: review.id || String(Math.random()),
            author: review.userName,
            rating: review.score,
            title: review.title || undefined,
            content: review.text,
            date: review.date || new Date().toISOString(),
            version: review.version || undefined,
        }));
    }
    catch (error) {
        console.error(`[AppStore] App Store reviews error for ${appId}:`, error);
        return [];
    }
}
/**
 * Fetches ratings from Apple App Store
 */
async function fetchAppStoreRatings(appId) {
    try {
        const ratings = await appStore.ratings({
            id: typeof appId === 'string' ? parseInt(appId, 10) : appId,
            country: 'us',
        });
        if (ratings && ratings.histogram) {
            return {
                average: ratings.ratings || 0,
                total: Object.values(ratings.histogram).reduce((a, b) => a + b, 0),
                distribution: {
                    '1': ratings.histogram['1'] || 0,
                    '2': ratings.histogram['2'] || 0,
                    '3': ratings.histogram['3'] || 0,
                    '4': ratings.histogram['4'] || 0,
                    '5': ratings.histogram['5'] || 0,
                },
            };
        }
        return null;
    }
    catch (error) {
        console.error(`[AppStore] App Store ratings error for ${appId}:`, error);
        return null;
    }
}
// ============================================
// MAIN FETCH FUNCTION
// ============================================
/**
 * Fetches App Store data for idea generation pipeline
 * @returns Promise<AppStoreData> - Structured app store data
 */
async function fetchAppStoreData(categories = DEFAULT_CATEGORIES) {
    console.log('[AppStore] Fetching app store data via free scrapers...');
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
            // Fetch top apps from both platforms in parallel
            const [iosApps, androidApps] = await Promise.all([
                fetchAppStoreApps(category),
                fetchGooglePlayApps(category),
            ]);
            // Combine and deduplicate by name (prefer iOS data when available)
            const appMap = new Map();
            for (const app of iosApps) {
                appMap.set(app.name.toLowerCase(), app);
            }
            for (const app of androidApps) {
                const key = app.name.toLowerCase();
                if (!appMap.has(key)) {
                    appMap.set(key, app);
                }
            }
            const categoryApps = Array.from(appMap.values()).slice(0, CONFIG.maxAppsPerCategory);
            const competitorWeaknesses = [];
            let totalRating = 0;
            let totalNegativeRate = 0;
            // Process each app
            for (const app of categoryApps) {
                totalAppsAnalyzed++;
                // Add rate limiting delay
                await delay(CONFIG.requestDelay);
                // Fetch ratings for negative rate calculation
                let ratings = null;
                if (app.platform === 'android') {
                    ratings = await fetchGooglePlayRatings(app.appId);
                }
                else {
                    ratings = await fetchAppStoreRatings(app.appId);
                }
                const negativeRate = calculateNegativeReviewRate(ratings);
                app.negativeReviewRate = negativeRate;
                allApps.push(app);
                totalRating += app.rating;
                totalNegativeRate += negativeRate;
                // Fetch reviews for friction analysis
                await delay(CONFIG.requestDelay);
                let reviews = [];
                if (app.platform === 'android') {
                    reviews = await fetchGooglePlayReviews(app.appId);
                }
                else {
                    reviews = await fetchAppStoreReviews(app.appId);
                }
                if (reviews.length > 0) {
                    allReviews.push({
                        appId: app.appId,
                        appName: app.name,
                        reviews,
                    });
                    totalReviewsProcessed += reviews.length;
                }
                // Add to weaknesses if high negative rate
                if (negativeRate > 0.25) {
                    competitorWeaknesses.push(`${app.name} has ${Math.round(negativeRate * 100)}% negative reviews`);
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