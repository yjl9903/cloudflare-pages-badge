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
      expect(text).toMatchInlineSnapshot(
        '"{\\"status\\":\\"error\\",\\"detail\\":\\"You should provide a pages project\\"}"'
      );
    }
  });

  it('should return Failed to resolve project', async () => {
    const resp = await worker.fetch('/project/123');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(
        '"{\\"status\\":\\"error\\",\\"detail\\":\\"Failed to resolve project\\"}"'
      );
    }
  });

  it('should return markdown', async () => {
    const resp = await worker.fetch('/markdown/123?url=456&host=0.0.0.0');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(
        '"{\\"markdown\\":\\"[![123](https://img.shields.io/endpoint?url=https://0.0.0.0/project/123)](456)\\"}"'
      );
    }
  });
});
