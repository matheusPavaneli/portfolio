"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { ContactForm } from "@/components/ContactForm";
import { SectionLabel } from "@/components/SectionLabel";

export function Contact() {
  const { t } = useLocale();

  return (
    <section id="contact" className="relative">
      {/* Full-bleed accent strip */}
      <div className="bg-accent text-on-accent py-16 xs:py-20 md:py-28 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 safe-x">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex items-baseline gap-0">
          <div className="w-[clamp(3.5rem,14vw,9rem)] shrink-0">
            <SectionLabel number="06" className="text-on-accent/20" />
          </div>
          <div className="min-w-0 flex-1">
            <motion.h2
              className="font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t("contact.titleLine1")}{" "}
              <span className="text-on-accent/90">{t("contact.titleLine2")}</span>
            </motion.h2>
            <motion.p
              className="text-on-accent/80 text-base xs:text-lg max-w-xl mb-8 md:mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {t("contact.subtitle")}
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center min-h-[44px] gap-2 px-4 xs:px-5 py-2.5 rounded-full bg-on-accent text-accent font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm xs:text-base break-all"
              >
                {profile.email}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center text-on-accent/80 hover:text-on-accent transition-colors py-2"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center text-on-accent/80 hover:text-on-accent transition-colors py-2"
              >
                GitHub
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="min-h-[44px] inline-flex items-center text-on-accent/80 hover:text-on-accent transition-colors py-2"
              >
                {profile.phone}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Form below strip - on surface */}
      <div className="relative py-12 xs:py-16 md:py-24 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 bg-surface safe-x">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto pl-[clamp(3.5rem,14vw,9rem)]">
          <div className="grid md:grid-cols-[1fr,minmax(240px,320px)] gap-10 lg:gap-16 items-start">
            <ContactForm />
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-fg-muted/10 bg-surface-elevated/50 p-6 lg:p-8"
            >
              <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-3">
                {t("contact.sidebarTitle")}
              </h3>
              <p className="text-fg-muted text-sm mb-5">
                {t("contact.sidebarDirect")}
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-fg hover:text-accent transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    className="text-fg hover:text-accent transition-colors"
                  >
                    {profile.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg hover:text-accent transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg hover:text-accent transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
              <p className="mt-5 pt-5 border-t border-fg-muted/10 text-fg-muted/80 text-xs">
                {t("contact.replyTime")}
              </p>
            </motion.aside>
          </div>
        </div>
      </div>
    </section>
  );
}
