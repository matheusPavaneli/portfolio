const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export function href(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
