import { isLocale, LOCALES, type Locale } from "@/i18n";
import { profileMarkdown } from "@/lib/machine";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { lang: Locale }[] {
  return LOCALES.map((lang) => ({ lang }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> },
): Promise<Response> {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  return new Response(profileMarkdown(lang), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
