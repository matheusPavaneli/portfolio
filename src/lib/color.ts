/**
 * Just enough colour maths to assert the palette in CI.
 *
 * The outgoing build shipped a 2.81:1 primary call to action and 97 sub-AA muted-text uses,
 * because nothing ever computed a ratio. This is the thing that computes it.
 */

export type Oklch = { l: number; c: number; h: number };
export type Rgb = { r: number; g: number; b: number };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** OKLCH (l in 0..1) to sRGB 0..255, gamut-clipped per channel. */
export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const bb = c * Math.sin(hr);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = l - 0.0894841775 * a - 1.291485548 * bb;

  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;

  const lr = +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  const lg = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  const lb = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

  const encode = (v: number) => {
    const x = clamp01(v);
    const srgb = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return Math.round(clamp01(srgb) * 255);
  };

  return { r: encode(lr), g: encode(lg), b: encode(lb) };
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.2 contrast ratio, 1..21. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(oklchToRgb(a));
  const lb = relativeLuminance(oklchToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Parse `oklch(97.5% 0.006 250)` as it is written in `globals.css`. */
export function parseOklch(value: string): Oklch {
  const match = value
    .trim()
    .match(/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (!match) throw new Error(`not an oklch() value this parser handles: "${value}"`);
  const [, l, c, h] = match;
  if (l === undefined || c === undefined || h === undefined) {
    throw new Error(`incomplete oklch() value: "${value}"`);
  }
  return { l: Number(l) / 100, c: Number(c), h: Number(h) };
}
