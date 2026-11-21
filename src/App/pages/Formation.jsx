import { Link } from "lucide-react";
import { ArrowRight } from "lucide-react";
import PageHero from "../components/PageHero";
import FormationCard from "../components/FormationCard";
import { formations } from "../data/content";
import styles from './css/Formation.module.css'

function Formation() {
    return ( <>
    
      <PageHero title="Formación" image="/assets/referee.jpg" />
      <section className="section light">
        <div className="container">
          <div className="sectionTitle">
              <div className="cursoTituloDestacado">
                  <h2>
                      <span className="slash"></span>Nuestras capacitaciones
                  </h2>
              </div>
              <p>
                Conocé nuestras propuestas de formación arbitral y consultá por
                los programas disponibles.
              </p>
          </div>
          <div className="cards4">
            {formations.map((item, i) => (
              <FormationCard key={item.title} item={item} index={i} />
            ))}
          </div>
          <div className={styles.details}>
            {formations.map((item, i) => (
              <article key={item.title} id={`programa-${i + 1}`}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <small>
                    Duración orientativa: {item.duration} · Nivel: {item.level}
                  </small>
                </div>
                <Link className="button" to="/contacto">
                  Consultar <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </> );
}

export default Formation;