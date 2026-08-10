/** Shared helpers for Area (height × width) variation fields. Stored value is always millimetres. */

export type AreaUnit = 'mm' | 'cm' | 'm';
export type AreaInputType = 'input' | 'slider';
export type DisplayModality = 'metric' | 'imperial';

const MM_PER_INCH = 25.4;
const MM_PER_CM = 10;
const MM_PER_M = 1000;

export function parseAreaValue(
  value: string | null | undefined
): { heightMm: number; widthMm: number } | null {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  const parts = text.split(',').map((p) => p.trim());
  if (parts.length !== 2) return null;
  const heightMm = Number(parts[0]);
  const widthMm = Number(parts[1]);
  if (!Number.isFinite(heightMm) || !Number.isFinite(widthMm)) return null;
  if (heightMm <= 0 || widthMm <= 0) return null;
  return { heightMm, widthMm };
}

export function formatAreaValue(heightMm: number, widthMm: number): string {
  const h = Number(heightMm);
  const w = Number(widthMm);
  if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return '';
  return `${trimNum(h)},${trimNum(w)}`;
}

function trimNum(n: number): string {
  return String(Number(n.toFixed(6)));
}

/** Imperial for en-US / en-LR / en-MM; otherwise metric (incl. en-GB). */
export function localePrefersImperial(locale?: string): boolean {
  const lang =
    locale ||
    (typeof navigator !== 'undefined' ? navigator.language : undefined) ||
    '';
  const normalized = lang.toLowerCase().replace('_', '-');
  return (
    normalized === 'en-us' ||
    normalized === 'en-lr' ||
    normalized === 'en-mm' ||
    normalized.endsWith('-us') ||
    normalized.endsWith('-lr') ||
    normalized.endsWith('-mm')
  );
}

export function metricUnitFactor(unit: AreaUnit = 'mm'): number {
  if (unit === 'cm') return MM_PER_CM;
  if (unit === 'm') return MM_PER_M;
  return 1;
}

export function mmToMetricDisplay(mm: number, unit: AreaUnit = 'mm'): number {
  return mm / metricUnitFactor(unit);
}

export function metricDisplayToMm(value: number, unit: AreaUnit = 'mm'): number {
  return value * metricUnitFactor(unit);
}

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

export function inchesToMm(inches: number): number {
  return inches * MM_PER_INCH;
}

export function mmToDisplay(
  mm: number,
  modality: DisplayModality,
  metricUnit: AreaUnit = 'mm'
): number {
  if (modality === 'imperial') return mmToInches(mm);
  return mmToMetricDisplay(mm, metricUnit);
}

export function displayToMm(
  value: number,
  modality: DisplayModality,
  metricUnit: AreaUnit = 'mm'
): number {
  if (modality === 'imperial') return inchesToMm(value);
  return metricDisplayToMm(value, metricUnit);
}

export function unitLabel(
  modality: DisplayModality,
  metricUnit: AreaUnit = 'mm'
): string {
  if (modality === 'imperial') return 'in';
  return metricUnit;
}

/** Format a length in mm for buyer-facing summary. */
export function formatLengthFromMm(
  mm: number,
  modality: DisplayModality,
  metricUnit: AreaUnit = 'mm'
): string {
  if (modality === 'imperial') {
    const inches = mmToInches(mm);
    if (inches >= 12) {
      const feet = Math.floor(inches / 12);
      const rem = inches - feet * 12;
      if (rem < 0.05) return `${feet} ft`;
      return `${feet} ft ${trimNum(Number(rem.toFixed(2)))} in`;
    }
    return `${trimNum(Number(inches.toFixed(2)))} in`;
  }
  const display = mmToMetricDisplay(mm, metricUnit);
  return `${trimNum(Number(display.toFixed(metricUnit === 'm' ? 4 : 2)))} ${metricUnit}`;
}

export function formatAreaSummary(
  value: string | null | undefined,
  modality: DisplayModality = 'metric',
  metricUnit: AreaUnit = 'mm'
): string | null {
  const parsed = parseAreaValue(value);
  if (!parsed) return null;
  const { heightMm, widthMm } = parsed;
  const h = formatLengthFromMm(heightMm, modality, metricUnit);
  const w = formatLengthFromMm(widthMm, modality, metricUnit);
  const areaMm2 = heightMm * widthMm;
  let areaLabel: string;
  if (modality === 'imperial') {
    const sqIn = areaMm2 / (MM_PER_INCH * MM_PER_INCH);
    if (sqIn >= 144) {
      areaLabel = `${trimNum(Number((sqIn / 144).toFixed(3)))} sq ft`;
    } else {
      areaLabel = `${trimNum(Number(sqIn.toFixed(2)))} sq in`;
    }
  } else if (metricUnit === 'm') {
    areaLabel = `${trimNum(Number((areaMm2 / 1_000_000).toFixed(4)))} m²`;
  } else if (metricUnit === 'cm') {
    areaLabel = `${trimNum(Number((areaMm2 / 100).toFixed(2)))} cm²`;
  } else {
    areaLabel = `${trimNum(Number(areaMm2.toFixed(2)))} mm²`;
  }
  return `${h} × ${w} (${areaLabel})`;
}

export function clamp(n: number, min?: number | null, max?: number | null): number {
  let v = n;
  if (min != null && Number.isFinite(min)) v = Math.max(v, min);
  if (max != null && Number.isFinite(max)) v = Math.min(v, max);
  return v;
}

/**
 * Keep width/height linked by aspectRatio (width/height).
 * `changed` indicates which dimension the user edited.
 */
export function clampWithAspectRatio(args: {
  heightMm: number;
  widthMm: number;
  changed: 'height' | 'width';
  aspectRatio: number;
  heightMin?: number | null;
  heightMax?: number | null;
  widthMin?: number | null;
  widthMax?: number | null;
}): { heightMm: number; widthMm: number } {
  const ratio = args.aspectRatio;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return {
      heightMm: clamp(args.heightMm, args.heightMin, args.heightMax),
      widthMm: clamp(args.widthMm, args.widthMin, args.widthMax),
    };
  }

  let heightMm = args.heightMm;
  let widthMm = args.widthMm;

  if (args.changed === 'height') {
    heightMm = clamp(heightMm, args.heightMin, args.heightMax);
    widthMm = heightMm * ratio;
    widthMm = clamp(widthMm, args.widthMin, args.widthMax);
    heightMm = widthMm / ratio;
    heightMm = clamp(heightMm, args.heightMin, args.heightMax);
    widthMm = heightMm * ratio;
  } else {
    widthMm = clamp(widthMm, args.widthMin, args.widthMax);
    heightMm = widthMm / ratio;
    heightMm = clamp(heightMm, args.heightMin, args.heightMax);
    widthMm = heightMm * ratio;
    widthMm = clamp(widthMm, args.widthMin, args.widthMax);
  }

  return { heightMm, widthMm };
}
