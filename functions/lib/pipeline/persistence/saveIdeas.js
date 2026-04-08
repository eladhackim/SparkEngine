"use strict";
/**
 * Firestore Persistence Layer
 * Saves generated ideas and logs generation runs to Firestore
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
exports.saveIdeas = saveIdeas;
exports.logGenerationRun = logGenerationRun;
const admin = __importStar(require("firebase-admin"));
/**
 * Saves scored ideas to Firestore in a batch operation
 * @param userId - User ID to save ideas for
 * @param ideas - Array of scored ideas to save
 * @param runId - Generation run ID for linking
 * @returns Promise<number> - Number of ideas saved
 */
async function saveIdeas(userId, ideas, runId) {
    const db = admin.firestore();
    const batch = db.batch();
    let savedCount = 0;
    console.log(`[Persistence] Saving ${ideas.length} ideas for user ${userId}...`);
    for (const idea of ideas) {
        const ideaRef = db.collection('users').doc(userId).collection('ideas').doc();
        batch.set(ideaRef, {
            // Basic info
            name: idea.name,
            brief: idea.brief,
            category: idea.category,
            tags: idea.tags || [],
            status: 'new',
            source: 'ai-generated',
            // Scores
            businessPotential: idea.businessPotential,
            developmentComplexity: idea.developmentComplexity,
            timeToMarket: idea.timeToMarket,
            competitionLevel: idea.competitionLevel,
            riskLevel: idea.riskLevel,
            compositeScore: idea.compositeScore,
            tier: idea.tier,
            // Optional scores (null for AI-generated)
            trendAlignment: null,
            founderMarketFit: null,
            growthPotential: null,
            defensibility: null,
            capitalEfficiency: null,
            // AI content
            strengths: idea.strengths || [],
            risks: idea.risks || [],
            businessPlan: idea.businessPlan || null,
            elevatorPitch: idea.elevatorPitch || null,
            // Metadata
            sourceSignals: idea.sourceSignals || [],
            generationRunId: runId,
            scoringMethod: 'ai-auto',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            noteCount: 0,
            viewedAt: null,
            tradeoffFlags: calculateTradeoffFlags(idea),
        });
        savedCount++;
    }
    await batch.commit();
    console.log(`[Persistence] Saved ${savedCount} ideas`);
    return savedCount;
}
/**
 * Logs a generation run to Firestore
 * @param userId - User ID
 * @param metadata - Run metadata
 */
async function logGenerationRun(userId, metadata) {
    const db = admin.firestore();
    console.log(`[Persistence] Logging generation run ${metadata.runId}...`);
    const runDoc = {
        runId: metadata.runId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ideasGenerated: metadata.ideasGenerated,
        ideasSaved: metadata.ideasSaved,
        success: metadata.errors.length === 0 && metadata.ideasSaved > 0,
        sources: metadata.sources,
        ideasPerRun: metadata.ideasGenerated,
        categories: null,
        trigger: metadata.trigger || 'manual',
        duration: metadata.duration,
        errors: metadata.errors,
    };
    if (metadata.stages) {
        runDoc.stages = metadata.stages;
    }
    await db
        .collection('users')
        .doc(userId)
        .collection('generationRuns')
        .doc(metadata.runId)
        .set(runDoc);
    // Update user's last generation run timestamp
    await db
        .collection('users')
        .doc(userId)
        .update({
        lastGenerationRun: admin.firestore.FieldValue.serverTimestamp(),
        generationRunCount: admin.firestore.FieldValue.increment(1),
    });
    console.log(`[Persistence] Generation run logged`);
}
/**
 * Calculates trade-off flags based on score patterns
 * @param idea - Scored idea
 * @returns Array of trade-off flags
 */
function calculateTradeoffFlags(idea) {
    const flags = [];
    // high-risk-high-reward: businessPotential >= 4 AND riskLevel <= 2
    if (idea.businessPotential >= 4 && idea.riskLevel <= 2) {
        flags.push('high-risk-high-reward');
    }
    // hidden-gem: businessPotential >= 4 AND competitionLevel >= 4
    if (idea.businessPotential >= 4 && idea.competitionLevel >= 4) {
        flags.push('hidden-gem');
    }
    // grind-play: businessPotential >= 3 AND developmentComplexity <= 2
    if (idea.businessPotential >= 3 && idea.developmentComplexity <= 2) {
        flags.push('grind-play');
    }
    // quick-win: timeToMarket >= 4 AND competitionLevel >= 4
    if (idea.timeToMarket >= 4 && idea.competitionLevel >= 4) {
        flags.push('quick-win');
    }
    // moonshot: businessPotential = 5 AND (developmentComplexity <= 2 OR riskLevel <= 2)
    if (idea.businessPotential === 5 && (idea.developmentComplexity <= 2 || idea.riskLevel <= 2)) {
        flags.push('moonshot');
    }
    return flags;
}
//# sourceMappingURL=saveIdeas.js.map