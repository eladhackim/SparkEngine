"use strict";
/**
 * Idea Forge Cloud Functions
 * Main entry point - exports all Cloud Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNicheIdeasScheduled = exports.generateIdeasScheduled = exports.generateIdeasHttp = void 0;
// Export idea generation functions
var generateIdeas_js_1 = require("./generateIdeas.js");
Object.defineProperty(exports, "generateIdeasHttp", { enumerable: true, get: function () { return generateIdeas_js_1.generateIdeasHttp; } });
Object.defineProperty(exports, "generateIdeasScheduled", { enumerable: true, get: function () { return generateIdeas_js_1.generateIdeasScheduled; } });
Object.defineProperty(exports, "generateNicheIdeasScheduled", { enumerable: true, get: function () { return generateIdeas_js_1.generateNicheIdeasScheduled; } });
//# sourceMappingURL=index.js.map