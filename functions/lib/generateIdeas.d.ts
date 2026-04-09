/**
 * Idea Generation Cloud Functions
 * HTTP and Scheduled triggers for the AI-powered idea generation pipeline
 */
/**
 * HTTP Trigger - Manual generation
 * POST /generateIdeas
 * Body: { sources?: string[], ideasPerRun?: number, categories?: string[] }
 * Headers: Authorization: Bearer <Firebase ID Token>
 */
export declare const generateIdeasHttp: import("firebase-functions/v2/https").HttpsFunction;
/**
 * Scheduled Trigger - Daily generation
 * Runs at 6:00 AM UTC daily for all users with auto-generation enabled
 */
export declare const generateIdeasScheduled: import("firebase-functions/v2/scheduler").ScheduleFunction;
/**
 * Scheduled Trigger - Weekly App Store Niche Discovery
 * Runs at 2:00 AM UTC every Sunday for users with App Store source enabled
 * This runs the specialized niche discovery pipeline independently from daily runs
 */
export declare const generateNicheIdeasScheduled: import("firebase-functions/v2/scheduler").ScheduleFunction;
//# sourceMappingURL=generateIdeas.d.ts.map