type ProgressFn = (progress: number, detail: string) => Promise<void>;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export async function reportGenerationHandler(
  payload: Record<string, unknown>,
  onProgress: ProgressFn,
): Promise<Record<string, unknown>> {
  const stages = [
    { label: 'Fetching data sources',   progress: 10, ms: [500, 900]   as const },
    { label: 'Aggregating records',      progress: 30, ms: [1000, 1800] as const },
    { label: 'Running calculations',     progress: 55, ms: [1200, 2200] as const },
    { label: 'Generating charts',        progress: 70, ms: [800, 1400]  as const },
    { label: 'Building PDF layout',      progress: 85, ms: [700, 1200]  as const },
    { label: 'Applying styles',          progress: 95, ms: [400, 700]   as const },
  ];

  for (const { label, progress, ms } of stages) {
    await sleep(rand(ms[0], ms[1]));
    await onProgress(progress, label);
  }

  const reportType = String(payload['reportType'] ?? 'summary');
  return {
    status: 'generated',
    reportType,
    totalRows: rand(200, 8000),
    sections: rand(4, 10),
    charts: rand(2, 6),
    format: 'PDF',
    fileSizeKb: rand(150, 2000),
    generatedAt: new Date().toISOString(),
  };
}
