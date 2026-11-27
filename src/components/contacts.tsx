import { MoveRight } from "lucide-react";
import Marquee from "./marquee";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";
import type { Social } from "../models";
import useSiteTexts from "../hooks/useSiteTexts";

function Contact({ socials = [] }: { socials?: Social[] }) {
  const { t } = useSiteTexts();
  const calls = t("contact.calls").split("|").map((call) => call.trim()).filter(Boolean);

  return (
    <section id="contact" className="section contact-section">
      <Marquee className="marquee--tilt" items={calls} duration={55} reverse />

      <div className="shell">
        <div className="contact card">
          <Reveal className="contact__head" y={40} stagger={0.1}>
            <span className="eyebrow">{t("contact.eyebrow")}</span>
            <SplitHeading as="h2">{t("contact.title")}</SplitHeading>
            <p className="section__lead">
              {t("contact.lead")}
            </p>
          </Reveal>

          <Reveal as="ul" className="contact__links" y={34} stagger={0.1} start="top 85%">
            {socials.map((social) => (
              <li key={social.id}>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <svg
                      viewBox={social.viewbox ?? undefined}
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={social.path ?? undefined} />
                    </svg>
                  <span className="contact__label">{social.label}</span>
                  <span className="contact__handle">{social.handle}</span>
                  <MoveRight size={24} aria-hidden="true" />
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Contact;
