/**
 * Idea Generation Cloud Functions
 * HTTP and Scheduled triggers for the AI-powered idea generation pipeline
 */

import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { runGenerationPipeline } from './pipeline/index.js';
import { GenerationConfig, GenerationSource } from './types/pipeline.js';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define secrets for API keys
const GROK_API_KEY = defineSecret('GROK_API_KEY');
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const NEWS_API_KEY = defineSecret('NEWS_API_KEY');

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
    timeoutSeconds: 540, // 9 minutes max
    cors: true,
    region: 'us-central1',
  },
  async (req, res) => {
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

    // Parse request body
    const body = req.body || {};
    const validSources: GenerationSource[] = ['x', 'polymarket', 'googlenews'];
    const requestedSources = Array.isArray(body.sources)
      ? body.sources.filter((s: string) => validSources.includes(s as GenerationSource)) as GenerationSource[]
      : validSources;

    const ideasPerRun = Math.min(Math.max(body.ideasPerRun || 10, 1), 25); // 1-25 range

    const config: GenerationConfig = {
      userId,
      sources: requestedSources.length > 0 ? requestedSources : validSources,
      ideasPerRun,
      categories: Array.isArray(body.categories) ? body.categories : undefined,
    };

    console.log(`[HTTP Trigger] Config: ${JSON.stringify(config)}`);

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

      const validSources: GenerationSource[] = ['x', 'polymarket', 'googlenews'];
      const userSources = Array.isArray(userData.generationSources)
        ? userData.generationSources.filter((s: string) => validSources.includes(s as GenerationSource)) as GenerationSource[]
        : validSources;

      const config: GenerationConfig = {
        userId,
        sources: userSources.length > 0 ? userSources : validSources,
        ideasPerRun: Math.min(Math.max(userData.ideasPerRun || 10, 1), 25),
        categories: userData.preferredCategories || undefined,
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
