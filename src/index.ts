import type { Env } from './types';

import { getProject } from './project';
import { createResponse } from './shield';

function createErrorResponse(detail: string, status = 400) {
  return new Response(JSON.stringify({ status: 'error', detail }), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/project/')) {
      const projectName = url.pathname.split('/')[2];

      if (!projectName) {
        return createErrorResponse(`You should provide a pages project`);
      }

      try {
        const project = await getProject(env, projectName);
        if (!project) {
          return createErrorResponse(`Pages project is not found`);
        }

        const status = project?.canonical_deployment?.latest_stage?.status;
        if (!status) {
          console.error({
            message: 'Failed to resolve project status',
            response: project,
          });
          return createErrorResponse('Failed to resolve project status');
        }

        return new Response(JSON.stringify(createResponse(status)), {
          headers: {
            'content-type': 'application/json; charset=utf-8',
          },
        });
      } catch (error) {
        console.log((error as Error).toString());
        return createErrorResponse('Failed to resolve project');
      }
    } else {
      return createErrorResponse(`Not implemented`);
    }
  },
};
