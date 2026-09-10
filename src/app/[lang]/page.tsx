import { Cases } from "@/components/Cases";
import { Contact } from "@/components/Contact";
import { Divergence } from "@/components/Divergence";
import { Masthead } from "@/components/Masthead";
import { Method } from "@/components/Method";
import { Record } from "@/components/Record";
import { getMessages, isLocale } from "@/i18n";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);

  return (
    <>
      <Masthead t={t} />
      <Cases t={t} />
      <Divergence t={t} />
      <Method t={t} />
      <Record t={t} />
      <Contact t={t} />
    </>
  );
}
