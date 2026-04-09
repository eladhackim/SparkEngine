# SSE Progress Streaming Specification

## Overview

Replace the fake client-side progress simulation with real-time Server-Sent Events (SSE) streaming from the generation pipeline. This provides accurate progress updates with meaningful data about each stage.

## Current State (Problem)

- Client simulates progress with hardcoded timers
- No actual correlation to backend progress
- Progress bar gets "stuck" on final stage while backend is still processing
- No visibility into what's actually happening (which app, how many reviews, etc.)

## Proposed Solution

### Architecture

```
┌─────────────┐     SSE Stream      ┌──────────────────┐
│   Frontend  │ <───────────────── │  Cloud Function  │
│  EventSource│                     │  generateIdeasHttp│
└─────────────┘                     └──────────────────┘
       │                                    │
       │ Updates UI                         │ Progress callbacks
       ▼                                    ▼
┌─────────────┐                     ┌──────────────────┐
│ProgressBar  │                     │    Pipeline      │
│ + Details   │                     │  (with hooks)    │
└─────────────┘                     └──────────────────┘
```

### SSE Event Types

```typescript
// Base event structure
interface ProgressEvent {
  type: 'progress' | 'complete' | 'error';
  stage: 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving';
  progress: number; // 0-100
  data: StageData;
  timestamp: string;
}

// Stage-specific data
interface CollectingData {
  categoriesTotal: number;
  categoriesCompleted: number;
  currentCategory: string;
  appsFound: number;
  reviewsFound: number;
}

interface AnalyzingData {
  appsTotal: number;
  appsCompleted: number;
  currentApp: string;
  frictionPointsFound: number;
}

interface GeneratingData {
  clustersTotal: number;
  ideasGenerated: number;
  currentCluster: string;
}

interface ScoringData {
  ideasTotal: number;
  ideasScored: number;
}

interface SavingData {
  ideasTotal: number;
  ideasSaved: number;
}

// Completion event
interface CompleteEvent {
  type: 'complete';
  runId: string;
  ideasGenerated: number;
  ideasSaved: number;
  duration: number;
}

// Error event
interface ErrorEvent {
  type: 'error';
  stage: string;
  message: string;
  recoverable: boolean;
}
```

### Backend Implementation

#### 1. HTTP Function Changes (`generateIdeas.ts`)

```typescript
export const generateIdeasHttp = onRequest(
  {
    // ... existing config
  },
  async (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // CORS headers (existing)
    // ...

    // Progress callback
    const sendProgress = (event: ProgressEvent) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    try {
      const result = await runGenerationPipeline(config, 'manual', sendProgress);

      sendProgress({
        type: 'complete',
        runId: result.runId,
        ideasGenerated: result.ideasGenerated,
        ideasSaved: result.ideasSaved,
        duration: result.duration,
      });
    } catch (error) {
      sendProgress({
        type: 'error',
        stage: 'unknown',
        message: error.message,
        recoverable: false,
      });
    } finally {
      res.end();
    }
  }
);
```

#### 2. Pipeline Changes (`pipeline/index.ts`)

Add progress callback parameter to `runGenerationPipeline`:

```typescript
type ProgressCallback = (event: ProgressEvent) => void;

export async function runGenerationPipeline(
  config: GenerationConfig,
  trigger: GenerationTrigger,
  onProgress?: ProgressCallback
): Promise<GenerationResult> {
  // Pass callback to each stage
  const appStoreData = await fetchAppStoreData(categories, onProgress);
  const frictionPoints = await detectFriction(runId, onProgress);
  const solutions = await generateAISolutions(frictionPoints, niches, count, runId, onProgress);
  // ...
}
```

#### 3. Stage Implementations

Each stage emits progress events:

**AppStore Source (`sources/appstore.ts`):**
```typescript
export async function fetchAppStoreData(
  categories: string[],
  onProgress?: ProgressCallback
): Promise<AppStoreData> {
  for (let i = 0; i < categories.length; i++) {
    onProgress?.({
      type: 'progress',
      stage: 'collecting',
      progress: Math.round((i / categories.length) * 20), // 0-20%
      data: {
        categoriesTotal: categories.length,
        categoriesCompleted: i,
        currentCategory: categories[i],
        appsFound: allApps.length,
        reviewsFound: totalReviews,
      },
    });

    // ... fetch logic
  }
}
```

**Friction Detector (`frictionDetector.ts`):**
```typescript
export async function detectFriction(
  runId: string,
  onProgress?: ProgressCallback
): Promise<FrictionPoint[]> {
  const apps = getStoredReviews();

  for (let i = 0; i < apps.length; i++) {
    onProgress?.({
      type: 'progress',
      stage: 'analyzing',
      progress: 20 + Math.round((i / apps.length) * 50), // 20-70%
      data: {
        appsTotal: apps.length,
        appsCompleted: i,
        currentApp: apps[i].appName,
        frictionPointsFound: aggregatedFriction.length,
      },
    });

    // ... analyze logic
  }
}
```

**Solution Generator (`solutionGenerator.ts`):**
```typescript
// Emit at 70-85%
onProgress?.({
  type: 'progress',
  stage: 'generating',
  progress: 75,
  data: {
    clustersTotal: clusters.length,
    ideasGenerated: solutions.length,
    currentCluster: cluster.theme,
  },
});
```

**Scoring and Saving:**
```typescript
// 85-95% for scoring
// 95-100% for saving
```

### Frontend Implementation

#### 1. SSE Client Hook (`hooks/use-generation-stream.ts`)

```typescript
interface GenerationProgress {
  stage: GenerationStage;
  progress: number;
  data: StageData;
  isComplete: boolean;
  error: string | null;
  result: GenerationResult | null;
}

export function useGenerationStream() {
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startGeneration = useCallback(async (options: GenerationOptions) => {
    const idToken = await user.getIdToken();

    // Use fetch with streaming for POST (EventSource is GET-only)
    const response = await fetch(GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(options),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const event = JSON.parse(line.slice(6));
          setProgress(parseEvent(event));
        }
      }
    }
  }, [user]);

  return { progress, startGeneration };
}
```

#### 2. Progress Display Component

```typescript
function GenerationProgress({ progress }: { progress: GenerationProgress }) {
  return (
    <Card>
      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-5 gap-2">
        {STAGES.map((stage) => (
          <StageIndicator
            key={stage}
            stage={stage}
            status={getStageStatus(stage, progress)}
          />
        ))}
      </div>

      {/* Live Details */}
      <div className="text-sm text-muted-foreground">
        {progress.stage === 'collecting' && (
          <p>
            Fetching {progress.data.currentCategory}...
            ({progress.data.appsFound} apps, {progress.data.reviewsFound} reviews)
          </p>
        )}
        {progress.stage === 'analyzing' && (
          <p>
            Analyzing {progress.data.currentApp}
            ({progress.data.appsCompleted}/{progress.data.appsTotal})
            - {progress.data.frictionPointsFound} friction points found
          </p>
        )}
        {progress.stage === 'generating' && (
          <p>
            Generating ideas... ({progress.data.ideasGenerated} so far)
          </p>
        )}
        {progress.stage === 'saving' && (
          <p>
            Saving {progress.data.ideasSaved}/{progress.data.ideasTotal} ideas...
          </p>
        )}
      </div>
    </Card>
  );
}
```

### Progress Percentage Breakdown

| Stage | Percentage | Description |
|-------|------------|-------------|
| Collecting | 0-20% | Fetching apps and reviews from stores |
| Analyzing | 20-70% | Gemini friction analysis per app |
| Generating | 70-85% | Gemini solution generation |
| Scoring | 85-95% | Calculating composite scores |
| Saving | 95-100% | Writing to Firestore |

### Error Handling

1. **Recoverable errors** (single app fails): Continue, report in final summary
2. **Non-recoverable errors** (API down): Stop, send error event, close stream
3. **Client disconnect**: Server detects via `req.on('close')`, cleanup resources

### CORS Considerations

SSE requires proper CORS headers:
```typescript
res.setHeader('Access-Control-Allow-Origin', origin);
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Expose-Headers', 'Content-Type');
```

### Testing Strategy

1. **Unit tests**: Mock progress callbacks, verify event format
2. **Integration tests**: Full pipeline with SSE client
3. **Load tests**: Multiple concurrent streams
4. **Error tests**: Network drops, timeout handling

### Migration Path

1. Deploy backend with SSE support (backward compatible - non-SSE clients still work)
2. Deploy frontend with SSE client
3. Remove old simulated progress code
4. Monitor for issues

### Files to Modify

**Backend:**
- `functions/src/generateIdeas.ts` - Add SSE headers and streaming
- `functions/src/pipeline/index.ts` - Add progress callback parameter
- `functions/src/pipeline/sources/appstore.ts` - Emit collecting progress
- `functions/src/pipeline/frictionDetector.ts` - Emit analyzing progress
- `functions/src/pipeline/solutionGenerator.ts` - Emit generating progress
- `functions/src/pipeline/persistence/saveIdeas.ts` - Emit saving progress
- `functions/src/types/pipeline.ts` - Add ProgressEvent types

**Frontend:**
- `hooks/use-generation-stream.ts` - New SSE client hook
- `components/generation/generation-progress.tsx` - Real progress display
- `app/(dashboard)/page.tsx` - Use new hook instead of simulated progress

### Estimated Effort

- Backend SSE implementation: 2-3 hours
- Frontend SSE client: 1-2 hours
- Progress UI enhancements: 1-2 hours
- Testing: 1 hour

**Total: ~6-8 hours**
