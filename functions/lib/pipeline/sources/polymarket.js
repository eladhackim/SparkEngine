"use strict";
/**
 * Polymarket Data Source
 * Fetches prediction market data for business signals
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPolymarketSignals = fetchPolymarketSignals;
/**
 * Fetches market signals from Polymarket
 * @returns Promise<PolymarketData> - Structured prediction market data
 */
async function fetchPolymarketSignals() {
    console.log('[Polymarket] Fetching market signals...');
    const baseUrl = 'https://clob.polymarket.com';
    // Fetch active markets
    const marketsResponse = await fetch(`${baseUrl}/markets?active=true&limit=100`);
    if (!marketsResponse.ok) {
        throw new Error(`Polymarket API error: ${marketsResponse.status}`);
    }
    const marketsData = await marketsResponse.json();
    // Handle both array and object responses
    let markets;
    if (Array.isArray(marketsData)) {
        markets = marketsData;
    }
    else if (marketsData?.data && Array.isArray(marketsData.data)) {
        markets = marketsData.data;
    }
    else if (marketsData?.markets && Array.isArray(marketsData.markets)) {
        markets = marketsData.markets;
    }
    else {
        console.log('[Polymarket] Unexpected response format:', JSON.stringify(marketsData).slice(0, 200));
        markets = [];
    }
    // Filter for relevant categories (tech, business, etc.)
    const relevantCategories = ['Technology', 'Business', 'Finance', 'Crypto', 'Science', 'AI'];
    const filteredMarkets = markets.filter((m) => relevantCategories.some(cat => m.category?.toLowerCase().includes(cat.toLowerCase())));
    // Identify high-confidence signals (probability > 0.8 or < 0.2)
    const highConfidenceSignals = filteredMarkets
        .filter((m) => {
        const prob = m.outcomePrices?.[0];
        return prob !== undefined && (prob > 0.8 || prob < 0.2);
    })
        .map((m) => ({
        topic: m.question || 'Unknown',
        probability: m.outcomePrices?.[0] || 0.5,
        implication: (m.outcomePrices?.[0] || 0.5) > 0.8 ? 'Likely to happen' : 'Unlikely to happen',
    }));
    // Map markets to our structure
    const structuredMarkets = filteredMarkets.slice(0, 50).map((m) => ({
        question: m.question || 'Unknown',
        probability: m.outcomePrices?.[0] || 0.5,
        volume: m.volume || 0,
        category: m.category || 'Unknown',
        endDate: new Date(m.endDate || Date.now()),
    }));
    console.log(`[Polymarket] Fetched ${structuredMarkets.length} markets, ${highConfidenceSignals.length} high-confidence signals`);
    return {
        source: 'polymarket',
        markets: structuredMarkets,
        highConfidenceSignals,
        emergingMarkets: [], // Would need historical data to calculate
        fetchedAt: new Date(),
    };
}
//# sourceMappingURL=polymarket.js.map