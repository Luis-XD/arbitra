import styles from './css/Help.module.css'
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { faqs } from "../data/content";
import { useState } from 'react';

function FAQ() {
 const [active, setActive] = useState(-1);

  return (
    <>
      <PageHero title="Preguntas frecuentes" image="/assets/whistle.jpg" />
      <section className="section light">
        <div className={`container ${styles.wrap}`}>
          <p className="lead">
            Respondemos las dudas más comunes sobre nuestras formaciones,
            cursos, inscripciones y el funcionamiento del campus.
          </p>
          <div className={styles.items}>
            {faqs.map(([q, a], i) => (
              <article key={q}>
                <button
                  onClick={() => setActive(active === i ? -1 : i)}
                  aria-expanded={active === i}
                >
                  {q}
                  {active === i ? <Minus /> : <Plus />}
                </button>
                {active === i && <p>{a}</p>}
              </article>
            ))}
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