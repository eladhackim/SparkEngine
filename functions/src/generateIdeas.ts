/**
 * Idea Generation Cloud Functions
 * HTTP and Scheduled triggers for the AI-powered idea generation pipeline
 */

import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { runGenerationPipeline } from './pipeline/index.js';
import { GenerationConfig, GenerationSource, SSEEvent, ProgressCallback } from './types/pipeline.js';
import { UserPreferences } from './types/preferences.js';
import { buildConstraintsFromPreferences, getTemperature } from './personalization/promptBuilder.js';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define secrets for API keys
const GROK_API_KEY = defineSecret('GROK_API_KEY');
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const NEWS_API_KEY = defineSecret('NEWS_API_KEY');
// Note: APPFOLLOW_API_KEY removed - using free scrapers instead

/**
 * HTTP Trigger - Manual generation
 * POST /generateIdeas
 * Body: { sources?: string[], ideasPerRun?: number, categories?: string[] }
 * Headers: Authorization: Bearer <Firebase ID Token>
 */
export const generateIdeasHttp = onRequest(
  {
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 900, // 15 minutes for App Store analysis
    region: 'us-central1',
    invoker: 'public', // Allow unauthenticated HTTP access (we verify Firebase Auth in code)
  },
  async (req, res) => {
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

    let userId: string;
    try {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      userId = decodedToken.uid;
      console.log(`[HTTP Trigger] Authenticated user: ${userId}`);
    } catch (authError) {
      console.error('[HTTP Trigger] Auth error:', authError);
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
      return;
    }

    // Load user preferences for personalized generation
    let preferenceConstraints: string | undefined;
    let aiTemperature: number | undefined;
    try {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userPrefs = userDoc.data()?.preferences as UserPreferences | undefined;
      if (userPrefs) {
        preferenceConstraints = buildConstraintsFromPreferences(userPrefs);
        aiTemperature = getTemperature(userPrefs.characteristics?.noveltyLevel ?? 3);
        console.log(`[HTTP Trigger] Loaded preferences for user ${userId}, temperature: ${aiTemperature}`);
      } else {
        console.log(`[HTTP Trigger] No preferences found for user ${userId}, using defaults`);
      }
    } catch (prefError) {
      console.warn('[HTTP Trigger] Failed to load preferences, continuing with defaults:', prefError);
    }

    // Parse request body
    const body = req.body || {};
    const validSources: GenerationSource[] = ['x', 'polymarket', 'googlenews', 'appstore'];
    const defaultSources: GenerationSource[] = ['x', 'polymarket', 'googlenews']; // appstore is opt-in
    const requestedSources = Array.isArray(body.sources)
      ? body.sources.filter((s: string) => validSources.includes(s as GenerationSource)) as GenerationSource[]
      : defaultSources;

    const ideasPerRun = Math.min(Math.max(body.ideasPerRun || 10, 1), 25); // 1-25 range

    const config: GenerationConfig = {
      userId,
      sources: requestedSources.length > 0 ? requestedSources : defaultSources,
      ideasPerRun,
      categories: Array.isArray(body.categories) ? body.categories : undefined,
      preferenceConstraints,
      aiTemperature,
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
      const sendProgress: ProgressCallback = (event: SSEEvent) => {
        try {
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (writeError) {
          console.error('[SSE] Write error:', writeError);
        }
      };

      // Handle client disconnect
      req.on('close', () => {
        clearInterval(heartbeat);
        console.log('[SSE] Client disconnected');
      });

      try {
        const result = await runGenerationPipeline(config, 'manual', sendProgress);

        // Send completion event
        sendProgress({
          type: 'complete',
          runId: result.runId,
          ideasGenerated: result.ideasGenerated,
          ideasSaved: result.ideasSaved,
          duration: result.duration,
        });
      } catch (error) {
        console.error('[HTTP Trigger] Error:', error);
        sendProgress({
          type: 'error',
          stage: 'unknown',
          message: error instanceof Error ? error.message : 'Unknown error',
          recoverable: false,
        });
      } finally {
        clearInterval(heartbeat);
        res.end();
      }
    } else {
      // Legacy Mode: Return JSON response
      try {
        const result = await runGenerationPipeline(config, 'manual');

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
        } else {
          res.status(500).json({
            success: false,
            error: 'GENERATION_FAILED',
            message: 'Pipeline failed to generate ideas',
            errors: result.errors,
          });
        }
      } catch (error) {
        console.error('[HTTP Trigger] Error:', error);
        res.status(500).json({
          success: false,
          error: 'GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }
);

/**
 * Scheduled Trigger - Daily generation
 * Runs at 6:00 AM UTC daily for all users with auto-generation enabled
 */
export const generateIdeasScheduled = onSchedule(
  {
    schedule: '0 6 * * *', // Daily at 6 AM UTC
    timeZone: 'UTC',
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    region: 'us-central1',
    retryCount: 3,
  },
  async () => {
    console.log('[Scheduled Trigger] Starting daily idea generation');

    // Get all users who have enabled auto-generation
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('autoGenerationEnabled', '==', true)
      .get();

    console.log(`[Scheduled Trigger] Found ${usersSnapshot.size} users with auto-generation enabled`);

    const results: { userId: string; success: boolean; ideasSaved: number; error?: string }[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      console.log(`[Scheduled Trigger] Processing user: ${userId}`);

      // Load user preferences
      let preferenceConstraints: string | undefined;
      let aiTemperature: number | undefined;
      const userPrefs = userData.preferences as UserPreferences | undefined;
      if (userPrefs) {
        preferenceConstraints = buildConstraintsFromPreferences(userPrefs);
        aiTemperature = getTemperature(userPrefs.characteristics?.noveltyLevel ?? 3);
        console.log(`[Scheduled Trigger] Loaded preferences for user ${userId}`);
      }

      const validSources: GenerationSource[] = ['x', 'polymarket', 'googlenews', 'appstore'];
      const defaultSources: GenerationSource[] = ['x', 'polymarket', 'googlenews'];
      const userSources = Array.isArray(userData.generationSources)
        ? userData.generationSources.filter((s: string) => validSources.includes(s as GenerationSource)) as GenerationSource[]
        : defaultSources;

      const config: GenerationConfig = {
        userId,
        sources: userSources.length > 0 ? userSources : defaultSources,
        ideasPerRun: Math.min(Math.max(userData.ideasPerRun || 10, 1), 25),
        categories: userData.preferredCategories || undefined,
        preferenceConstraints,
        aiTemperature,
      };

      try {
        const result = await runGenerationPipeline(config, 'scheduled');
        results.push({
          userId,
          success: result.success,
          ideasSaved: result.ideasSaved,
          error: result.errors.length > 0 ? result.errors.join(', ') : undefined,
        });
        console.log(`[Scheduled Trigger] User ${userId}: ${result.success ? 'success' : 'failed'}, ${result.ideasSaved} ideas saved`);
      } catch (error) {
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
  }
);

/**
 * Scheduled Trigger - Weekly App Store Niche Discovery
 * Runs at 2:00 AM UTC every Sunday for users with App Store source enabled
 * This runs the specialized niche discovery pipeline independently from daily runs
 */
export const generateNicheIdeasScheduled = onSchedule(
  {
    schedule: '0 2 * * 0', // Every Sunday at 2 AM UTC
    timeZone: 'UTC',
    secrets: [GEMINI_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    region: 'us-central1',
    retryCount: 3,
  },
  async () => {
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

    const results: { userId: string; success: boolean; ideasSaved: number; error?: string }[] = [];

    for (const userDoc of users) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      console.log(`[Niche Discovery] Processing user: ${userId}`);

      // Load user preferences
      let preferenceConstraints: string | undefined;
      let aiTemperature: number | undefined;
      const userPrefs = userData.preferences as UserPreferences | undefined;
      if (userPrefs) {
        preferenceConstraints = buildConstraintsFromPreferences(userPrefs);
        aiTemperature = getTemperature(userPrefs.characteristics?.noveltyLevel ?? 3);
        console.log(`[Niche Discovery] Loaded preferences for user ${userId}`);
      }

      // Run App Store pipeline only
      const config: GenerationConfig = {
        userId,
        sources: ['appstore'], // Only App Store source
        ideasPerRun: Math.min(Math.max(userData.nicheIdeasPerRun || 5, 1), 10),
        categories: userData.appStoreCategories || undefined,
        preferenceConstraints,
        aiTemperature,
      };

      try {
        const result = await runGenerationPipeline(config, 'scheduled');
        results.push({
          userId,
          success: result.success,
          ideasSaved: result.ideasSaved,
          error: result.errors.length > 0 ? result.errors.join(', ') : undefined,
        });
        console.log(`[Niche Discovery] User ${userId}: ${result.success ? 'success' : 'failed'}, ${result.ideasSaved} ideas saved`);
      } catch (error) {
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
  }
);
