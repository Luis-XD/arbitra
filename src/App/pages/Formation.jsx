import { Link } from "lucide-react";
import { ArrowRight } from "lucide-react";
import PageHero from "../components/PageHero";
import styles from './css/Formation.module.css'
import {
  METHODOLOGY_STEPS,
  FIELD_PRACTICE_NOTE,
  COURSE_DYNAMICS
} from '../data/formationData'
import TopTitle from "../components/TopTitle";

function Formation() {
    return ( <>
    
      <PageHero title="Formación" image="/assets/banners/formacion_arbitral.png" />
      <section className="section light">
        <div className="container">
          <TopTitle
            header="ARBITRA"
            wordOne="Metodología de"
            wordTwo='enseñanza'
            dark={true}
            paragraph="Cómo enseñamos en la escuela: teoría aplicada, análisis real, práctica en campo, preparación física y estudio autónomo."
          />

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