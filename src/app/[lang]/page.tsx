import { Contact } from "@/components/Contact";
import { SystemBuild } from "@/components/SystemBuild";
import { Ledger } from "@/components/Ledger";
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
      <Ledger t={t} />
      <SystemBuild t={t} />
      <Method t={t} />
      <Record t={t} />
      <Contact t={t} />
    </>
  );
}
