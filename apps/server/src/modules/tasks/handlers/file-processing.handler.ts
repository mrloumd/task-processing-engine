type ProgressFn = (progress: number, detail: string) => Promise<void>;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export async function fileProcessingHandler(
  payload: Record<string, unknown>,
  onProgress: ProgressFn,
): Promise<Record<string, unknown>> {
  const stages = [
    { label: 'Reading source file',       progress: 15, ms: [600, 1000] as const },
    { label: 'Parsing content structure', progress: 35, ms: [800, 1400] as const },
    { label: 'Extracting metadata',       progress: 55, ms: [700, 1200] as const },
    { label: 'Transforming output',       progress: 75, ms: [900, 1500] as const },
    { label: 'Writing result',            progress: 90, ms: [500, 900]  as const },
    { label: 'Finalizing',               progress: 98, ms: [300, 600]  as const },
  ];

  for (const { label, progress, ms } of stages) {
    await sleep(rand(ms[0], ms[1]));
    await onProgress(progress, label);
  }

  const fileName = String(payload['fileName'] ?? 'document.pdf');
  return {
    status: 'processed',
    fileName,
    pages: rand(8, 60),
    wordCount: rand(1500, 12000),
    fileSize: `${(rand(100, 4500) / 100).toFixed(1)} MB`,
    extractedSections: rand(3, 12),
    processedAt: new Date().toISOString(),
  };
}
