import type { UnstableDevWorker } from 'wrangler';

import { unstable_dev } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it('should provide project', async () => {
    const resp = await worker.fetch('/project/');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot('"{\\"status\\":\\"error\\",\\"detail\\":\\"You should provide a pages project\\"}"');
    }
  });

  it('should return Hello World', async () => {
    const resp = await worker.fetch('/project/123');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot('"{\\"status\\":\\"error\\",\\"detail\\":\\"Failed to resolve project\\"}"');
    }
  });
});
