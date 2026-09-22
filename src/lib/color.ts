export type Rgb = { r: number; g: number; b: number };
export type Rgba = Rgb & { a: number };

function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function parseColor(value: string): Rgba {
  const input = value.trim();

  const hex = input.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hex?.[1]) {
    const digits =
      hex[1].length === 3
        ? hex[1]
            .split("")
            .map((d) => d + d)
            .join("")
        : hex[1];
    const n = Number.parseInt(digits, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }

  const rgba = input.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/,
  );
  if (rgba) {
    const [, r, g, b, a] = rgba;
    if (r === undefined || g === undefined || b === undefined) {
      throw new Error(`incomplete rgb() value: "${value}"`);
    }
    return { r: Number(r), g: Number(g), b: Number(b), a: a === undefined ? 1 : Number(a) };
  }

  throw new Error(`not a colour this parser handles: "${value}"`);
}

export function composite(over: Rgba, ground: Rgb): Rgb {
  const mix = (f: number, b: number) => Math.round(f * over.a + b * (1 - over.a));
  return { r: mix(over.r, ground.r), g: mix(over.g, ground.g), b: mix(over.b, ground.b) };
}
