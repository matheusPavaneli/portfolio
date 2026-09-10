/** Serves the static export exactly as a file host would, so the export itself can be tested. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 4173);
/** Mirrors `basePath`, so the export can be tested at the path it will actually be served from. */
const prefix = (process.argv[4] ?? "").replace(/\/+$/, "");

const TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".png", "image/png"],
  [".json", "application/json; charset=utf-8"],
]);

/** Resolve inside `root` only: a path that escapes it is a 404, not a file read. */
async function locate(pathname) {
  const requested = normalize(join(root, decodeURIComponent(pathname)));
  if (requested !== root && !requested.startsWith(root + sep)) return null;

  for (const candidate of [requested, join(requested, "index.html"), `${requested}.html`]) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname =
    prefix && url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) || "/" : url.pathname;
  locate(pathname)
    .then(async (file) => {
      if (!file) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("not found");
        return;
      }
      response.writeHead(200, {
        "content-type": TYPES.get(extname(file)) ?? "application/octet-stream",
      });
      response.end(await readFile(file));
    })
    .catch((error) => {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end(String(error?.message ?? error));
    });
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
