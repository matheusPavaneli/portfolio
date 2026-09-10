const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * A root-relative URL with the deploy's `basePath` on it.
 *
 * Locale links are plain `<a>` rather than `next/link`: switching locale changes
 * `<html lang>`, so it is a document navigation, not a client transition — and Next 16's
 * prefetch was requesting an RSC payload that does not exist in a static export
 * (`/en/__next.$d$lang.__PAGE__.txt`, 404).
 */
export function href(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
