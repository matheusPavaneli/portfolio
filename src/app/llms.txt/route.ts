import { llmsIndex } from "@/lib/machine";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(llmsIndex(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
