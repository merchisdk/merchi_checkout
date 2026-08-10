/** Shared helpers for Area (height × width) variation fields. Stored value is always millimetres. */

export type AreaUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
export type AreaInputType = 'input' | 'slider';
export type DisplayModality = 'metric' | 'imperial';

const MM_PER_INCH = 25.4;
const MM_PER_FOOT = 304.8;
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

export function isImperialUnit(unit: AreaUnit | string | null | undefined): boolean {
  const u = String(unit || 'mm').toLowerCase();
  return u === 'in' || u === 'ft';
}

export function normaliseAreaUnit(unit?: string | null): AreaUnit {
  const u = String(unit || 'mm').toLowerCase();
  if (u === 'cm' || u === 'm' || u === 'in' || u === 'ft' || u === 'mm') {
    return u;
  }
  return 'mm';
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

/** Millimetres per one unit of the given area unit. */
export function unitFactorMm(unit: AreaUnit | string = 'mm'): number {
  switch (normaliseAreaUnit(unit)) {
    case 'cm':
      return MM_PER_CM;
    case 'm':
      return MM_PER_M;
    case 'in':
      return MM_PER_INCH;
    case 'ft':
      return MM_PER_FOOT;
    default:
      return 1;
  }
}

/** @deprecated use unitFactorMm */
export function metricUnitFactor(unit: AreaUnit = 'mm'): number {
  return unitFactorMm(unit);
}

export function mmToUnit(mm: number, unit: AreaUnit | string = 'mm'): number {
  return mm / unitFactorMm(unit);
}

export function unitToMm(value: number, unit: AreaUnit | string = 'mm'): number {
  return value * unitFactorMm(unit);
}

/** @deprecated use mmToUnit */
export function mmToMetricDisplay(mm: number, unit: AreaUnit = 'mm'): number {
  return mmToUnit(mm, unit);
}

/** @deprecated use unitToMm */
export function metricDisplayToMm(value: number, unit: AreaUnit = 'mm'): number {
  return unitToMm(value, unit);
}

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

export function inchesToMm(inches: number): number {
  return inches * MM_PER_INCH;
}

/**
 * Unit shown for the current buyer modality.
 * Metric → field unit if metric, else mm.
 * Imperial → field unit if imperial, else inches.
 */
export function activeDisplayUnit(
  modality: DisplayModality,
  areaUnit: AreaUnit | string = 'mm'
): AreaUnit {
  const unit = normaliseAreaUnit(areaUnit);
  if (modality === 'imperial') {
    return isImperialUnit(unit) ? unit : 'in';
  }
  return isImperialUnit(unit) ? 'mm' : unit;
}

export function defaultModalityForAreaUnit(
  areaUnit: AreaUnit | string = 'mm'
): DisplayModality {
  if (isImperialUnit(areaUnit)) return 'imperial';
  return localePrefersImperial() ? 'imperial' : 'metric';
}

export function mmToDisplay(
  mm: number,
  modality: DisplayModality,
  areaUnit: AreaUnit | string = 'mm'
): number {
  return mmToUnit(mm, activeDisplayUnit(modality, areaUnit));
}

export function displayToMm(
  value: number,
  modality: DisplayModality,
  areaUnit: AreaUnit | string = 'mm'
): number {
  return unitToMm(value, activeDisplayUnit(modality, areaUnit));
}

export function unitLabel(
  modality: DisplayModality,
  areaUnit: AreaUnit | string = 'mm'
): string {
  return activeDisplayUnit(modality, areaUnit);
}

export function defaultAreaStep(unit: AreaUnit | string = 'mm'): number {
  switch (normaliseAreaUnit(unit)) {
    case 'm':
      return 0.001;
    case 'cm':
      return 0.1;
    case 'in':
      return 0.125;
    case 'ft':
      return 0.01;
    default:
      return 1;
  }
}

/**
 * Step for inputs/sliders in the current display unit.
 * `stepMm` is the admin-configured step stored in millimetres.
 */
export function stepInDisplayUnit(
  stepMm: number | null | undefined,
  modality: DisplayModality,
  areaUnit: AreaUnit | string = 'mm'
): number {
  const unit = activeDisplayUnit(modality, areaUnit);
  const raw = Number(stepMm);
  if (Number.isFinite(raw) && raw > 0) {
    return raw / unitFactorMm(unit);
  }
  return defaultAreaStep(unit);
}

function decimalsForUnit(unit: AreaUnit): number {
  if (unit === 'm') return 4;
  if (unit === 'ft') return 3;
  if (unit === 'in' || unit === 'cm') return 2;
  return 2;
}

/** Format a length in mm for buyer-facing summary. */
export function formatLengthFromMm(
  mm: number,
  modality: DisplayModality,
  areaUnit: AreaUnit | string = 'mm'
): string {
  const unit = activeDisplayUnit(modality, areaUnit);
  if (unit === 'ft') {
    const feet = mmToUnit(mm, 'ft');
    return `${trimNum(Number(feet.toFixed(3)))} ft`;
  }
  if (unit === 'in') {
    const inches = mmToInches(mm);
    if (inches >= 12) {
      const feet = Math.floor(inches / 12);
      const rem = inches - feet * 12;
      if (rem < 0.05) return `${feet} ft`;
      return `${feet} ft ${trimNum(Number(rem.toFixed(2)))} in`;
    }
    return `${trimNum(Number(inches.toFixed(2)))} in`;
  }
  const display = mmToUnit(mm, unit);
  return `${trimNum(Number(display.toFixed(decimalsForUnit(unit))))} ${unit}`;
}

export function formatAreaParts(
  value: string | null | undefined,
  modality: DisplayModality = 'metric',
  areaUnit: AreaUnit | string = 'mm'
): { width: string; height: string; areaLabel: string } | null {
  const parsed = parseAreaValue(value);
  if (!parsed) return null;
  const { heightMm, widthMm } = parsed;
  const height = formatLengthFromMm(heightMm, modality, areaUnit);
  const width = formatLengthFromMm(widthMm, modality, areaUnit);
  const areaMm2 = heightMm * widthMm;
  const unit = activeDisplayUnit(modality, areaUnit);
  let areaLabel: string;
  if (unit === 'ft') {
    const sqFt = areaMm2 / (MM_PER_FOOT * MM_PER_FOOT);
    areaLabel = `${trimNum(Number(sqFt.toFixed(3)))} sq ft`;
  } else if (unit === 'in') {
    const sqIn = areaMm2 / (MM_PER_INCH * MM_PER_INCH);
    if (sqIn >= 144) {
      areaLabel = `${trimNum(Number((sqIn / 144).toFixed(3)))} sq ft`;
    } else {
      areaLabel = `${trimNum(Number(sqIn.toFixed(2)))} sq in`;
    }
  } else if (unit === 'm') {
    areaLabel = `${trimNum(Number((areaMm2 / 1_000_000).toFixed(4)))} m²`;
  } else if (unit === 'cm') {
    areaLabel = `${trimNum(Number((areaMm2 / 100).toFixed(2)))} cm²`;
  } else {
    areaLabel = `${trimNum(Number(areaMm2.toFixed(2)))} mm²`;
  }
  return { width, height, areaLabel };
}

export function formatAreaSummary(
  value: string | null | undefined,
  modality: DisplayModality = 'metric',
  areaUnit: AreaUnit | string = 'mm'
): string | null {
  const parts = formatAreaParts(value, modality, areaUnit);
  if (!parts) return null;
  // Width × height (landscape-first) to match the buyer control order.
  return `Width ${parts.width} × Height ${parts.height} (${parts.areaLabel})`;
}

export function clamp(n: number, min?: number | null, max?: number | null): number {
  let v = n;
  if (min != null && Number.isFinite(min)) v = Math.max(v, min);
  if (max != null && Number.isFinite(max)) v = Math.min(v, max);
  return v;
}

/**
 * Client-side Area cost estimate (pre-discount), matching API formula:
 * onceOff = heightCost × widthCost × height_u × width_u
 * unitCost = heightUnit × widthUnit × height_u × width_u
 * (dimensions expressed in the field's areaUnit)
 */
export function estimateAreaCosts(
  variationField: any,
  value: string | null | undefined
): { onceOffCost: number; unitCost: number } | null {
  const parsed = parseAreaValue(value);
  if (!parsed) return null;
  const areaUnit = normaliseAreaUnit(
    variationField?.areaUnit ?? variationField?.area_unit ?? 'mm'
  );
  const heightU = mmToUnit(parsed.heightMm, areaUnit);
  const widthU = mmToUnit(parsed.widthMm, areaUnit);
  const area = heightU * widthU;
  const heightCost = Number(
    variationField?.heightVariationCost ??
      variationField?.height_variation_cost
  ) || 0;
  const widthCost = Number(
    variationField?.widthVariationCost ?? variationField?.width_variation_cost
  ) || 0;
  const heightUnit = Number(
    variationField?.heightVariationUnitCost ??
      variationField?.height_variation_unit_cost
  ) || 0;
  const widthUnit = Number(
    variationField?.widthVariationUnitCost ??
      variationField?.width_variation_unit_cost
  ) || 0;
  const onceOffCost = heightCost * widthCost * area;
  const unitCost = heightUnit * widthUnit * area;
  if (!(onceOffCost > 0) && !(unitCost > 0)) return null;
  return {
    onceOffCost: Number(onceOffCost.toFixed(3)),
    unitCost: Number(unitCost.toFixed(3)),
  };
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
