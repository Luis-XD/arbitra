import { Link } from "lucide-react";
import { ArrowRight } from "lucide-react";
import PageHero from "../components/PageHero";
import styles from './css/Formation.module.css'
import {
  METHODOLOGY_STEPS,
  FIELD_PRACTICE_NOTE,
  COURSE_DYNAMICS
} from '../data/formationData'

function Formation() {
    return ( <>
    
      <PageHero title="Formación" image="/assets/referee.jpg" />
      <section className="section light">
        <div className="container">
          <div className="sectionTitle">
            <div className="cursoTituloDestacado">
              <h2>
                <span className="slash"></span>Metodología de enseñanza
              </h2>
            </div>
            <p>
              Cómo enseñamos en la escuela: teoría aplicada, análisis real,
              práctica en campo, preparación física y estudio autónomo.
            </p>
          </div>

          <div className={styles.methodologyGrid}>
            {METHODOLOGY_STEPS.map((item) => (
              <article
                key={item.number}
                className={`${styles.methodCard} ${
                  item.fullWidth ? styles.fullWidthCard : ""
                }`.trim()}
              >
                <span className={styles.cardTag}>
                  {item.number} · {item.tag}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <p className={styles.footnote}>{FIELD_PRACTICE_NOTE}</p>

          <div className={styles.dynamicsBar}>
            <div className={styles.dynamicsList}>
              {COURSE_DYNAMICS.map((dyn) => (
                <div key={dyn.step} className={styles.dynamicsItem}>
                  <strong>{dyn.step}</strong>
                  <span>{dyn.detail}</span>
                </div>
              ))}
            </div>
            <Link className="button" to="/contacto">
              Consultar <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </> );
}

export default Formation;