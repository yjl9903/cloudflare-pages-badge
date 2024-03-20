import { Hono } from 'hono';

import type { Env } from './types';

import { getProject } from './project';
import { createShieldResponse } from './shield';

const app = new Hono<{
  Bindings: Env;
}>();

app.all('/project/:name', async ctx => {
  const name = ctx.req.param('name');

  try {
    const project = await getProject(ctx.env, name);
    if (!project) {
      ctx.status(404);
      return ctx.json({
        status: 'error',
        detail: 'You should provide a pages project',
      });
    }

    const status = project?.canonical_deployment?.latest_stage?.status;
    if (!status) {
      console.error({
        message: 'Failed to resolve project status',
        response: project,
      });

      ctx.status(500);
      return ctx.json({
        status: 'error',
        detail: 'Failed to resolve project status',
      });
    }

    const label = ctx.req.query('label');
    return ctx.json(createShieldResponse({ label, status }));
  } catch (error) {
    console.error(error);

    ctx.status(500);
    return ctx.json({
      status: 'error',
      detail: 'Failed to resolve project',
    });
  }
});

app.all('/markdown/:name', async ctx => {
  const projectName = ctx.req.param('name');

  const target = ctx.req.query('url') ?? '';
  const label = ctx.req.query('label') ?? '';
  const labelText = label !== '' ? `?label=${label}` : '';
  const host = ctx.req.query('host') ?? ctx.req.header('host');

  return ctx.json({
    markdown: `[![${projectName}](https://img.shields.io/endpoint?url=https://${host}/project/${projectName}${labelText})](${target})`,
  });
});

export default app;
