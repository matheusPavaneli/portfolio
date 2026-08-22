"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { ContactForm } from "@/components/ContactForm";
import { SectionMarker } from "@/components/SectionMarker";

export function Contact() {
  const { t } = useLocale();

  return (
    <section id="contact" className="relative border-t border-line">

            <div className="py-24 sm:py-36 md:py-52 px-6 sm:px-10 md:px-16 lg:px-20 pattern-dot">
        <div className="max-w-5xl 2xl:max-w-6xl">

          <SectionMarker
            label={t("contact.title")}
            index="09"
            className="mb-12"
          />

                    <div className="overflow-hidden mb-8">
            <motion.h2
              className="font-display text-[clamp(4rem,13vw,11rem)] font-light italic text-fg leading-[0.88] tracking-tight"
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("contact.titleLine1")}{" "}
              <em className="not-italic text-accent">{t("contact.titleLine2")}</em>
            </motion.h2>
          </div>

          <motion.p
            className="font-sans text-xs sm:text-sm text-fg-muted max-w-lg leading-[1.9] mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t("contact.subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-5 sm:gap-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 px-5 py-3 bg-accent text-on-accent font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-accent-dim transition-colors hover-shine break-all"
            >
              {profile.email}
              <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
                ↗
              </span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[9px] tracking-[0.3em] uppercase text-fg-muted hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[9px] tracking-[0.3em] uppercase text-fg-muted hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </motion.div>
        </div>
      </div>

            <div className="py-16 sm:py-20 md:py-24 px-6 sm:px-10 md:px-16 lg:px-20 bg-surface border-t border-line">
        <div className="max-w-5xl 2xl:max-w-6xl">
          <div className="grid md:grid-cols-[1fr,minmax(220px,300px)] gap-14 lg:gap-24 items-start">
            <ContactForm />

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-line p-6 lg:p-8"
            >
              <h3 className="font-sans text-[8px] tracking-[0.45em] uppercase text-accent mb-5">
                {t("contact.sidebarTitle")}
              </h3>
              <p className="font-sans text-xs text-fg-muted mb-6 leading-relaxed">
                {t("contact.sidebarDirect")}
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-sans text-xs text-fg hover:text-accent transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    className="font-sans text-xs text-fg hover:text-accent transition-colors"
                  >
                    {profile.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs text-fg hover:text-accent transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs text-fg hover:text-accent transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
              <p className="mt-6 pt-6 border-t border-line font-sans text-[9px] text-fg-muted/50 leading-relaxed">
                {t("contact.replyTime")}
              </p>
            </motion.aside>
          </div>
        </div>
      </div>
    </section>
  );
}
