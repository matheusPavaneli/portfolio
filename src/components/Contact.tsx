import { ContactForm } from "@/components/ContactForm";
import { Eyebrow } from "@/components/Eyebrow";
import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

/** The second empty block. One line, one address, one form. */
export function Contact({ t }: { t: Messages }) {
  return (
    <section id="contact" className="px-5 py-20 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>{t.contact.eyebrow}</Eyebrow>

        <h2 className="mt-6 max-w-[22ch] text-2xl font-light tracking-[-0.02em]">
          {t.contact.title}
        </h2>
        <p className="mt-6 max-w-[58ch] text-md text-muted">{t.contact.lede}</p>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,2fr)_260px]">
          <ContactForm t={t.contact} email={profile.email} />

          <div>
            <h3 className="font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted">
              {t.contact.emailLabel}
            </h3>
            <ul className="mt-4 list-none space-y-3 p-0">
              <li>
                <a className="u-rule break-all text-base text-text" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              <li>
                <a className="u-rule text-base text-text" href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>
                  {profile.phone}
                </a>
              </li>
              <li>
                <a
                  className="u-rule text-base text-text"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="u-rule text-base text-text"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </a>
              </li>
            </ul>
            <p className="mt-6 border-t border-rule pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">
              {t.masthead.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
