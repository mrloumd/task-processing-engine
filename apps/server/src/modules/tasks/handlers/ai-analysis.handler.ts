type ProgressFn = (progress: number, detail: string) => Promise<void>;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const SENTIMENTS = ['positive', 'neutral', 'negative', 'mixed'] as const;
const CATEGORIES = ['finance', 'technology', 'operations', 'hr', 'marketing'] as const;

export async function aiAnalysisHandler(
  payload: Record<string, unknown>,
  onProgress: ProgressFn,
): Promise<Record<string, unknown>> {
  const stages = [
    { label: 'Loading AI model',           progress: 10, ms: [700, 1200]  as const },
    { label: 'Tokenizing input',           progress: 25, ms: [500, 900]   as const },
    { label: 'Running inference',          progress: 55, ms: [2000, 4000] as const },
    { label: 'Extracting key entities',    progress: 72, ms: [800, 1400]  as const },
    { label: 'Scoring confidence',         progress: 85, ms: [600, 1000]  as const },
    { label: 'Compiling analysis report',  progress: 95, ms: [400, 700]   as const },
  ];

  for (const { label, progress, ms } of stages) {
    await sleep(rand(ms[0], ms[1]));
    await onProgress(progress, label);
  }

  const input = String(payload['input'] ?? 'sample text input');
  return {
    status: 'analysed',
    input: input.slice(0, 80),
    sentiment: SENTIMENTS[rand(0, SENTIMENTS.length - 1)],
    sentimentScore: (rand(55, 99) / 100).toFixed(2),
    category: CATEGORIES[rand(0, CATEGORIES.length - 1)],
    confidence: (rand(70, 99) / 100).toFixed(2),
    tokens: rand(120, 3000),
    entities: rand(3, 15),
    keyInsights: rand(2, 6),
    modelUsed: 'analysis-v2.1',
    analysedAt: new Date().toISOString(),
  };
}
