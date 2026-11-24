import styles from "./css/Instructors.module.css";
import { ArrowRight } from "lucide-react";
import {INSTRUCTORS_DATA} from '../data/instructors'

function Instructors() {
  return (
    <section className={`section ${styles.darkBg}`}>
      <div className={`container ${styles.wrap}`}>
        <div className="sectionTitle">
          <div className="cursoTituloDestacado">
            <h2 className={styles.titleIntst}>
              <span className="slash"></span>Nuestros instructores
            </h2>
          </div>
          <p className="lead">
            Conocé a los profesionales que lideran nuestras capacitaciones y
            acompañan tu crecimiento.
          </p>
        </div>
        <div className={styles.cont}>
            <div className={styles.grid}>
            {INSTRUCTORS_DATA.map((ins) => (
                <article key={ins.id} className={styles.card}>
                <div className={styles.imageContainer}>
                    <img
                    src={ins.image}
                    alt={`Instructor ${ins.name}`}
                    className={ins.image}
                    loading="lazy"
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.badge}>
                    <span className={styles.line}></span>
                    {ins.category}
                    </div>
                    <h3>{ins.name}</h3>
                    <h4>{ins.role}</h4>
                    <p>{ins.bio}</p>
                    {ins.link && (
                    <a href={ins.link} className="button">
                        Saber más <ArrowRight size={16} />
                    </a>
                    )}
                </div>
                </article>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}

export default Instructors;