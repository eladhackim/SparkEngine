"use strict";
/**
 * Idea Generation Cloud Functions
 * HTTP and Scheduled triggers for the AI-powered idea generation pipeline
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNicheIdeasScheduled = exports.generateIdeasScheduled = exports.generateIdeasHttp = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const index_js_1 = require("./pipeline/index.js");
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
// Define secrets for API keys
const GROK_API_KEY = (0, params_1.defineSecret)('GROK_API_KEY');
const GEMINI_API_KEY = (0, params_1.defineSecret)('GEMINI_API_KEY');
const NEWS_API_KEY = (0, params_1.defineSecret)('NEWS_API_KEY');
// Note: APPFOLLOW_API_KEY removed - using free scrapers instead
/**
 * HTTP Trigger - Manual generation
 * POST /generateIdeas
 * Body: { sources?: string[], ideasPerRun?: number, categories?: string[] }
 * Headers: Authorization: Bearer <Firebase ID Token>
 */
exports.generateIdeasHttp = (0, https_1.onRequest)({
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 900, // 15 minutes for App Store analysis
    region: 'us-central1',
    invoker: 'public', // Allow unauthenticated HTTP access (we verify Firebase Auth in code)
}, async (req, res) => {
    // Set CORS headers manually
    const allowedOrigins = ['https://sparkengine-3740d.web.app', 'https://sparkengine.online', 'http://localhost:3000'];
    const origin = req.headers.origin || '';
    if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
    }
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    console.log('[HTTP Trigger] Received generation request');
    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - Missing or invalid Authorization header' });
        return;
    }
    let userId;
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        userId = decodedToken.uid;
        console.log(`[HTTP Trigger] Authenticated user: ${userId}`);
    }
    catch (authError) {
        console.error('[HTTP Trigger] Auth error:', authError);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
        return;
    }
    // Parse request body
    const body = req.body || {};
    const validSources = ['x', 'polymarket', 'googlenews', 'appstore'];
    const defaultSources = ['x', 'polymarket', 'googlenews']; // appstore is opt-in
    const requestedSources = Array.isArray(body.sources)
        ? body.sources.filter((s) => validSources.includes(s))
        : defaultSources;
    const ideasPerRun = Math.min(Math.max(body.ideasPerRun || 10, 1), 25); // 1-25 range
    const config = {
        userId,
        sources: requestedSources.length > 0 ? requestedSources : defaultSources,
        ideasPerRun,
        categories: Array.isArray(body.categories) ? body.categories : undefined,
    };
    console.log(`[HTTP Trigger] Config: ${JSON.stringify(config)}`);
    // Check if SSE streaming is requested
    const useSSE = req.query.stream === 'true' || body.stream === true;
    if (useSSE) {
        // SSE Mode: Stream progress events
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
        // Keep connection alive with heartbeat
        const heartbeat = setInterval(() => {
            res.write(': heartbeat\n\n');
        }, 15000);
        // Progress callback that writes SSE events
        const sendProgress = (event) => {
            try {
                res.write(`data: ${JSON.stringify(event)}\n\n`);
            }
            catch (writeError) {
                console.error('[SSE] Write error:', writeError);
            }
        };
        // Handle client disconnect
        req.on('close', () => {
            clearInterval(heartbeat);
            console.log('[SSE] Client disconnected');
        });
        try {
            const result = await (0, index_js_1.runGenerationPipeline)(config, 'manual', sendProgress);
            // Send completion event
            sendProgress({
                type: 'complete',
                runId: result.runId,
                ideasGenerated: result.ideasGenerated,
                ideasSaved: result.ideasSaved,
                duration: result.duration,
            });
        }
        catch (error) {
            console.error('[HTTP Trigger] Error:', error);
            sendProgress({
                type: 'error',
                stage: 'unknown',
                message: error instanceof Error ? error.message : 'Unknown error',
                recoverable: false,
            });
        }
        finally {
            clearInterval(heartbeat);
            res.end();
        }
    }
    else {
        // Legacy Mode: Return JSON response
        try {
            const result = await (0, index_js_1.runGenerationPipeline)(config, 'manual');
            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: {
                        runId: result.runId,
                        ideasGenerated: result.ideasGenerated,
                        ideasSaved: result.ideasSaved,
                        duration: result.duration,
                    },
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'GENERATION_FAILED',
                    message: 'Pipeline failed to generate ideas',
                    errors: result.errors,
                });
            }
        }
        catch (error) {
            console.error('[HTTP Trigger] Error:', error);
            res.status(500).json({
                success: false,
                error: 'GENERATION_FAILED',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
});
/**
 * Scheduled Trigger - Daily generation
 * Runs at 6:00 AM UTC daily for all users with auto-generation enabled
 */
exports.generateIdeasScheduled = (0, scheduler_1.onSchedule)({
    schedule: '0 6 * * *', // Daily at 6 AM UTC
    timeZone: 'UTC',
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    region: 'us-central1',
    retryCount: 3,
}, async () => {
    console.log('[Scheduled Trigger] Starting daily idea generation');
    // Get all users who have enabled auto-generation
    const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('autoGenerationEnabled', '==', true)
        .get();
    console.log(`[Scheduled Trigger] Found ${usersSnapshot.size} users with auto-generation enabled`);
    const results = [];
    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        console.log(`[Scheduled Trigger] Processing user: ${userId}`);
        const validSources = ['x', 'polymarket', 'googlenews', 'appstore'];
        const defaultSources = ['x', 'polymarket', 'googlenews'];
        const userSources = Array.isArray(userData.generationSources)
            ? userData.generationSources.filter((s) => validSources.includes(s))
            : defaultSources;
        const config = {
            userId,
            sources: userSources.length > 0 ? userSources : defaultSources,
            ideasPerRun: Math.min(Math.max(userData.ideasPerRun || 10, 1), 25),
            categories: userData.preferredCategories || undefined,
        };
        try {
            const result = await (0, index_js_1.runGenerationPipeline)(config, 'scheduled');
            results.push({
                userId,
                success: result.success,
                ideasSaved: result.ideasSaved,
                error: result.errors.length > 0 ? result.errors.join(', ') : undefined,
            });
            console.log(`[Scheduled Trigger] User ${userId}: ${result.success ? 'success' : 'failed'}, ${result.ideasSaved} ideas saved`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            results.push({
                userId,
                success: false,
                ideasSaved: 0,
                error: errorMessage,
            });
            console.error(`[Scheduled Trigger] User ${userId} failed:`, error);
            // Continue with other users
        }
    }
    // Log summary
    const successful = results.filter(r => r.success).length;
    const totalIdeas = results.reduce((sum, r) => sum + r.ideasSaved, 0);
    console.log(`[Scheduled Trigger] Complete: ${successful}/${results.length} users successful, ${totalIdeas} total ideas generated`);
});
/**
 * Scheduled Trigger - Weekly App Store Niche Discovery
 * Runs at 2:00 AM UTC every Sunday for users with App Store source enabled
 * This runs the specialized niche discovery pipeline independently from daily runs
 */
exports.generateNicheIdeasScheduled = (0, scheduler_1.onSchedule)({
    schedule: '0 2 * * 0', // Every Sunday at 2 AM UTC
    timeZone: 'UTC',
    secrets: [GEMINI_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    region: 'us-central1',
    retryCount: 3,
}, async () => {
    console.log('[Niche Discovery] Starting weekly App Store niche discovery');
    // Get all users who have App Store source enabled
    const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('appStoreEnabled', '==', true)
        .get();
    console.log(`[Niche Discovery] Found ${usersSnapshot.size} users with App Store enabled`);
    // If no users have explicitly enabled, check autoGenerationEnabled users
    let users = usersSnapshot.docs;
    if (users.length === 0) {
        const autoUsersSnapshot = await admin.firestore()
            .collection('users')
            .where('autoGenerationEnabled', '==', true)
            .get();
        users = autoUsersSnapshot.docs;
        console.log(`[Niche Discovery] Fallback: Found ${users.length} users with auto-generation enabled`);
    }
    const results = [];
    for (const userDoc of users) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        console.log(`[Niche Discovery] Processing user: ${userId}`);
        // Run App Store pipeline only
        const config = {
            userId,
            sources: ['appstore'], // Only App Store source
            ideasPerRun: Math.min(Math.max(userData.nicheIdeasPerRun || 5, 1), 10),
            categories: userData.appStoreCategories || undefined,
        };
        try {
            const result = await (0, index_js_1.runGenerationPipeline)(config, 'scheduled');
            results.push({
                userId,
                success: result.success,
                ideasSaved: result.ideasSaved,
                error: result.errors.length > 0 ? result.errors.join(', ') : undefined,
            });
            console.log(`[Niche Discovery] User ${userId}: ${result.success ? 'success' : 'failed'}, ${result.ideasSaved} ideas saved`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            results.push({
                userId,
                success: false,
                ideasSaved: 0,
                error: errorMessage,
            });
            console.error(`[Niche Discovery] User ${userId} failed:`, error);
            // Continue with other users
        }
    }
    // Log summary
    const successful = results.filter(r => r.success).length;
    const totalIdeas = results.reduce((sum, r) => sum + r.ideasSaved, 0);
    console.log(`[Niche Discovery] Complete: ${successful}/${results.length} users successful, ${totalIdeas} total niche ideas generated`);
});
//# sourceMappingURL=generateIdeas.js.map