import { MoveRight } from "lucide-react";
import Reveal from "./reveal";
import SplitHeading from "./splitHeading";

function Contact({socials = []}) {
  return (
    <section id="contact" className="section shell">
      <div className="contact card">
        <Reveal className="contact__head" y={40} stagger={0.1}>
          <span className="eyebrow">Contact</span>
          <SplitHeading as="h2">Discutons de votre projet</SplitHeading>
          <p className="section__lead">
            Disponible pour une alternance, un stage ou une collaboration. Le plus simple reste
            l'e-mail — je réponds rapidement.
          </p>
        </Reveal>

        <Reveal as="ul" className="contact__links" y={34} stagger={0.1} start="top 85%">
          {socials.map((social) => (
            <li key={social.order}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <svg
                    viewBox={social.viewBox || social.viewbox}
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={social.path} />
                  </svg>
                <span className="contact__label">{social.label}</span>
                <span className="contact__handle">{social.handle}</span>
                <MoveRight size={24} aria-hidden="true" />
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
