import { jsonResume } from "@/lib/machine";

export const dynamic = "force-static";

export function GET(): Response {
  return Response.json(jsonResume());
}
