import type { Env, CloudflareResponse, Project } from './types';

const request = (url: string, env: Env) =>
  fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
    },
  });

const handleResponse = (
  res: Response
): Promise<CloudflareResponse<Project>> => {
  if (!res.ok) {
    throw new Error(`Invalid response: ${res.status}`);
  }
  return res.json();
};

interface CachedProject {
  cachedAt: number;
  project?: Project;
}

const cachedProjects: Record<string, CachedProject> = {};

export async function getProject(
  env: Env,
  projectName: string
): Promise<Project | undefined> {
  if (
    cachedProjects[projectName]?.cachedAt &&
    Date.now() - cachedProjects[projectName]?.cachedAt < 60 * 1000
  ) {
    // fetched within the last 60s, use cache
    return cachedProjects[projectName]?.project;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(
    env.CF_ACCOUNT_ID
  )}/pages/projects/${encodeURIComponent(projectName)}`;
  const resp = await request(url, env);
  const project = (await handleResponse(resp))?.result;

  cachedProjects[projectName] = {
    cachedAt: Date.now(),
    project: project,
  };

  return project;
}
