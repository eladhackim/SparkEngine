"use strict";
/**
 * Google News Data Source
 * Fetches trending news headlines for business signals
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGoogleNews = fetchGoogleNews;
/**
 * Fetches news headlines from News API
 * @returns Promise<GoogleNewsData> - Structured news data
 */
async function fetchGoogleNews() {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
        throw new Error('NEWS_API_KEY not configured');
    }
    console.log('[Google News] Fetching headlines...');
    // Categories relevant to business ideas
    const categories = ['technology', 'business', 'science'];
    const articles = [];
    for (const category of categories) {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${newsApiKey}`);
            if (!response.ok) {
                console.warn(`[Google News] Failed to fetch ${category}: ${response.status}`);
                continue;
            }
            const data = await response.json();
            if (data.articles) {
                articles.push(...data.articles.map((a) => ({
                    title: a.title || 'Unknown',
                    description: a.description || '',
                    category,
                    publishedAt: new Date(a.publishedAt || Date.now()),
                    source: a.source?.name || 'Unknown',
                })));
            }
        }
        catch (error) {
            console.warn(`[Google News] Error fetching ${category}:`, error);
        }
    }
    // Extract trending topics from headlines
    const trendingTopics = extractTopicsFromHeadlines(articles.map(a => a.title));
    console.log(`[Google News] Fetched ${articles.length} articles, ${trendingTopics.length} trending topics`);
    return {
        source: 'googlenews',
        articles,
        trendingTopics,
        industrySignals: [], // Would require NLP analysis
        fetchedAt: new Date(),
    };
}
/**
 * Extracts key topics from headlines using simple keyword extraction
 * @param headlines - Array of headline strings
 * @returns Array of trending topics
 */
function extractTopicsFromHeadlines(headlines) {
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
        'used', 'it', 'its', 'this', 'that', 'these', 'those', 'what', 'which',
        'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'all', 'each',
        'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
        'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
        'new', 'says', 'said', 'report', 'reports', 'after', 'over', 'into',
    ]);
    const words = headlines.join(' ').toLowerCase().split(/\W+/);
    const wordCounts = new Map();
    for (const word of words) {
        if (word.length > 3 && !stopWords.has(word)) {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
    }
    return Array.from(wordCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word]) => word);
}
//# sourceMappingURL=googlenews.js.map