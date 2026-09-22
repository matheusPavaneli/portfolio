const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export function href(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Lower-cased by URL, as the canonical links are, so every absolute URL names one host. */
export const ORIGIN = new URL(process.env.NEXT_PUBLIC_ORIGIN ?? "https://matheusPavaneli.github.io").origin;

export function absolute(path: string): string {
  return `${ORIGIN}${href(path)}`;
}
