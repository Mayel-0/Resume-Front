import { MoveRight } from "lucide-react";

function Contact() {
  return (
    <section id="contact" className="section shell">
      <div className="contact card">
        <div className="contact__head">
          <span className="eyebrow">Contact</span>
          <h2>Discutons de votre projet</h2>
          <p className="section__lead">
            Disponible pour une alternance, un stage ou une collaboration. Le plus simple reste
            l'e-mail — je réponds rapidement.
          </p>
        </div>

        <ul className="contact__links">
          <li>
            <a href="https://www.linkedin.com/in/llado-mael-54008a384/" target="_blank" rel="noopener noreferrer">
              {/* LinkedinIcon */}
              <span className="contact__label">Linkedin</span>
              <span className="contact__handle">llado-mael</span>
              <MoveRight size={24} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="https://github.com/Mayel-0" target="_blank" rel="noopener noreferrer">
              {/* GithubIcon */}
              <span className="contact__label">Github</span>
              <span className="contact__handle">Mayel-0</span>
              <MoveRight size={24} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="mailto:llado.mael33@gmail.com" target="_blank" rel="noopener noreferrer">
              {/* MailIcon */}
              <span className="contact__label">Gmail</span>
              <span className="contact__handle">llado.mael33@gmail.com</span>
              <MoveRight size={24} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Contact;
