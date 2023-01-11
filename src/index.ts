import type { Env } from './types';

import { getProject } from './project';
import { createShieldResponse } from './shield';

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
        return makeErrorResponse(`You should provide a pages project`);
      }

      try {
        const project = await getProject(env, projectName);
        if (!project) {
          return makeErrorResponse(`Pages project is not found`);
        }

        const status = project?.canonical_deployment?.latest_stage?.status;
        if (!status) {
          console.error({
            message: 'Failed to resolve project status',
            response: project,
          });
          return makeErrorResponse('Failed to resolve project status');
        }

        return makeResponse(
          createShieldResponse({ label: url.searchParams.get('label'), status })
        );
      } catch (error) {
        console.log((error as Error).toString());
        return makeErrorResponse('Failed to resolve project');
      }
    } else if (
      url.pathname.startsWith('/markdown/') ||
      url.pathname.startsWith('/md/')
    ) {
      const projectName = url.pathname.split('/')[2];
      if (!projectName) {
        return makeErrorResponse(`You should provide a pages project`);
      }

      const target = url.searchParams.get('url') ?? '';
      const label = url.searchParams.get('label') ?? '';
      const labelText = label !== '' ? `?label=${label}` : '';
      const host = url.searchParams.get('host') ?? request.headers.get('host');

      return makeResponse({
        markdown: `[![${projectName}](https://img.shields.io/endpoint?url=https://${host}/project/${projectName}${labelText})](${target})`,
      });
    } else {
      return makeErrorResponse(`Not implemented`);
    }
  },
};

function makeResponse<T extends any>(detail: T, status = 200) {
  return new Response(JSON.stringify(detail), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

function makeErrorResponse(detail: string, status = 400) {
  return new Response(JSON.stringify({ status: 'error', detail }), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
