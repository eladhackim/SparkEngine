export type DataSource = 'x' | 'polymarket' | 'googlenews' | 'appstore';
export type GenerationStage = 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving';
export type GenerationTrigger = 'manual' | 'scheduled';

export interface GenerationConfig {
  sources: DataSource[];
  ideasPerRun: number;
  categories?: string[];
}

export interface GenerationResult {
  success: boolean;
  runId: string;
  ideasGenerated: number;
  ideasSaved: number;
  errors: string[];
  duration: number;
}

// SSE Stage-specific data types
export interface CollectingProgressData {
  categoriesTotal: number;
  categoriesCompleted: number;
  currentCategory: string;
  appsFound: number;
  reviewsFound: number;
}

export interface AnalyzingProgressData {
  appsTotal: number;
  appsCompleted: number;
  currentApp: string;
  frictionPointsFound: number;
}

export interface GeneratingProgressData {
  clustersTotal: number;
  ideasGenerated: number;
  currentCluster: string;
}

export interface ScoringProgressData {
  ideasTotal: number;
  ideasScored: number;
}

export interface SavingProgressData {
  ideasTotal: number;
  ideasSaved: number;
}

export type StageProgressData =
  | CollectingProgressData
  | AnalyzingProgressData
  | GeneratingProgressData
  | ScoringProgressData
  | SavingProgressData;

// SSE Event Types
export interface ProgressEvent {
  type: 'progress';
  stage: GenerationStage;
  progress: number;
  data: StageProgressData;
  timestamp: string;
}

export interface CompleteEvent {
  type: 'complete';
  runId: string;
  ideasGenerated: number;
  ideasSaved: number;
  duration: number;
}

export interface ErrorEvent {
  type: 'error';
  stage: string;
  message: string;
  recoverable: boolean;
}

export type SSEEvent = ProgressEvent | CompleteEvent | ErrorEvent;

export interface GenerationStatus {
  isGenerating: boolean;
  stage?: GenerationStage;
  progress?: number;
  stageData?: StageProgressData;
  startedAt?: string;
  estimatedTimeRemaining?: number;
  lastRun?: {
    runId: string;
    timestamp: string;
    ideasGenerated: number;
    success: boolean;
  };
  error?: string;
}

export interface GenerationRun {
  runId: string;
  timestamp: string;
  ideasGenerated: number;
  ideasSaved: number;
  sources: DataSource[];
  duration: number;
  success: boolean;
  errors?: string[];
}

export interface GenerationSettings {
  autoGenerationEnabled: boolean;
  generationSources: DataSource[];
  ideasPerRun: number;
  preferredCategories?: string[];
}

export const defaultGenerationSettings: GenerationSettings = {
  autoGenerationEnabled: true,
  generationSources: ['x', 'polymarket', 'googlenews'],
  ideasPerRun: 10,
};

export const stageLabels: Record<GenerationStage, string> = {
  collecting: 'Collecting market data...',
  analyzing: 'Analyzing trends...',
  generating: 'Generating ideas...',
  scoring: 'Scoring ideas...',
  saving: 'Saving to portfolio...',
};

export const stageProgress: Record<GenerationStage, { min: number; max: number }> = {
  collecting: { min: 0, max: 20 },
  analyzing: { min: 20, max: 40 },
  generating: { min: 40, max: 70 },
  scoring: { min: 70, max: 90 },
  saving: { min: 90, max: 100 },
};
