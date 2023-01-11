import type { ProjectStageStatus } from './types';

export interface ShieldResponse {
  schemaVersion: number; // always 1
  label: string;
  message: string;
  color: string;
  isError: boolean;
  namedLogo: string;
  cacheSeconds: number;
}

// these statuses should return isError: true on the badge response
const errorStatuses = new Set<ProjectStageStatus>(['failure', 'canceled']);

const colors: Record<ProjectStageStatus, string> = {
  success: 'success',
  idle: 'informational',
  failure: 'critical',
  canceled: 'inactive',
  active: 'green',
};

export function createShieldResponse(options: {
  label?: string | null | undefined;
  status: ProjectStageStatus;
}): ShieldResponse {
  const label = options?.label ?? 'Cloudflare Pages';
  const status = options.status;

  return {
    schemaVersion: 1,
    label,
    message: status,
    color: colors[status] || 'grey',
    isError: errorStatuses.has(status),
    namedLogo: 'cloudflare',
    cacheSeconds: 60,
  };
}
