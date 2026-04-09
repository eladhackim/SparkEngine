/**
 * App Store Data Source using Free Scrapers
 * Fetches top apps and reviews for friction analysis from both stores
 * Uses: google-play-scraper and app-store-scraper (no API keys required)
 */
import { AppStoreData } from '../../types/pipeline.js';
interface ScrapedReview {
    id: string;
    author: string;
    rating: number;
    title?: string;
    content: string;
    date: string;
    version?: string;
    helpful_count?: number;
}
/**
 * Fetches App Store data for idea generation pipeline
 * @returns Promise<AppStoreData> - Structured app store data
 */
export declare function fetchAppStoreData(categories?: string[]): Promise<AppStoreData>;
/**
 * Get stored reviews for friction analysis
 */
export declare function getStoredReviews(): {
    appId: string;
    appName: string;
    reviews: ScrapedReview[];
}[];
/**
 * Clear stored reviews after processing
 */
export declare function clearStoredReviews(): void;
export {};
//# sourceMappingURL=appstore.d.ts.map