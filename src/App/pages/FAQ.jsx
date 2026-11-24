import styles from './css/FAQ.module.css'
import { Plus, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { faqs } from "../data/content";
import { useState } from 'react';

function FAQ() {
 const [active, setActive] = useState(-1);

  return (
    <>
      <PageHero title="Preguntas frecuentes" image="/assets/banners/faq.png" />
      <section className="section light">
        <div className={`container ${styles.wrap}`}>
          <p className="lead">
            Respondemos las dudas más comunes sobre nuestras formaciones,
            cursos, inscripciones y el funcionamiento del campus.
          </p>
          <div className={styles.items}>
            {faqs.map(([q, a], i) => {
              const isOpen = active === i;
              return (
                <article key={q} className={isOpen ? styles.open : ""}>
                  <button
                    onClick={() => setActive(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    {q}
                    <Plus className={styles.icon} aria-hidden="true" />
                  </button>
                  <div className={styles.panel}>
                    <div className={styles.panelInner}>
                      <p>{a}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className={styles.cta}>
            <HelpCircle />
            <div>
              <strong>¿No encontraste la respuesta que buscabas?</strong>
              <p>Escribinos y te ayudamos.</p>
            </div>
            <Link className="button" to="/contacto">
              Contactanos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQ