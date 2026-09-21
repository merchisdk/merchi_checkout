export const JOB_SOURCE_STORAGE_KEY = 'merchi_job_source';

const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const;

export interface JobSourceFields {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  sourceClickId?: string;
  sourceLanding?: string;
  sourceReferrer?: string;
}

function trimTo(value: string | null | undefined, limit: number): string | undefined {
  if (!value) return undefined;
  const text = value.trim().slice(0, limit);
  return text || undefined;
}

function readStoredSource(): JobSourceFields | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(JOB_SOURCE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as JobSourceFields;
  } catch {
    return null;
  }
}

function writeStoredSource(source: JobSourceFields) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(JOB_SOURCE_STORAGE_KEY, JSON.stringify(source));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function hasPaidClick(source: JobSourceFields | null | undefined): boolean {
  return Boolean(source?.sourceClickId);
}

function hasSourceData(source: JobSourceFields | null | undefined): boolean {
  if (!source) return false;
  return Boolean(
    source.utmSource ||
      source.utmMedium ||
      source.utmCampaign ||
      source.utmContent ||
      source.utmTerm ||
      source.sourceClickId ||
      source.sourceLanding ||
      source.sourceReferrer
  );
}

function sourceFromLocation(): JobSourceFields {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const source: JobSourceFields = {
    utmSource: trimTo(params.get('utm_source'), 256),
    utmMedium: trimTo(params.get('utm_medium'), 256),
    utmCampaign: trimTo(params.get('utm_campaign'), 256),
    utmContent: trimTo(params.get('utm_content'), 256),
    utmTerm: trimTo(params.get('utm_term'), 256),
    sourceLanding: trimTo(
      `${window.location.pathname || '/'}${window.location.search || ''}`,
      512
    ),
    sourceReferrer: trimTo(document.referrer, 512),
  };
  for (const key of CLICK_ID_PARAMS) {
    const value = trimTo(params.get(key), 256);
    if (value) {
      source.sourceClickId = value;
      break;
    }
  }
  return source;
}

export function captureAndReadJobSource(): JobSourceFields {
  const incoming = sourceFromLocation();
  const stored = readStoredSource();
  if (hasPaidClick(incoming) || !hasSourceData(stored)) {
    const next = {
      ...(stored || {}),
      ...Object.fromEntries(
        Object.entries(incoming).filter(([, value]) => Boolean(value))
      ),
    } as JobSourceFields;
    if (hasSourceData(next)) writeStoredSource(next);
    return next;
  }
  return stored || incoming;
}

export function jobSourceFieldsForApi(): JobSourceFields {
  const resolved = captureAndReadJobSource();
  const out: JobSourceFields = {};
  (Object.keys(resolved) as Array<keyof JobSourceFields>).forEach((key) => {
    const value = resolved[key];
    if (value) out[key] = value;
  });
  return out;
}
