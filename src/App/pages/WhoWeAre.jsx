import { useState, useEffect } from 'react'
import { CONFIG_BACKEND } from '../config/config'
import { Target, Eye, Gem, Users } from "lucide-react";
import styles from './css/WhoWeAre.module.css'
import LoadData from '../components/LoadData'
import PageHero from '../components/PageHero'

function WhoWeAre() {
  const [configData, setConfigData]  = useState(null)
  const [cargando, setCargando] = useState(false)
  const ROUTE = `${CONFIG_BACKEND.API_DIR}/config/getDataConfig`
  const loadConfigData = LoadData(setCargando, setConfigData, 'GET', ROUTE)

  useEffect(() => {
      loadConfigData()
  }, [])

  return (
    <>
       <PageHero
        title="Quiénes somos"
        subtitle="Conocé la identidad, el propósito y la proyección de ARBITRA."
        image="/assets/wwa.png"
      />
      <section className="section light">
        <div className={`container ${styles.intro}`}>
          <div>
            <span className="eyebrow">ARBITRA</span>
            <h2>Centro de Formación Profesional</h2>
            <p>
              Somos un proyecto de formación profesional dedicado al arbitraje
              deportivo. Nuestro objetivo es acompañar el aprendizaje de reglas,
              criterios y responsabilidades que hacen posible el desarrollo del
              juego.
            </p>
            <p>
              Comenzamos con especialidades vinculadas al fútbol, con una visión
              de crecimiento hacia otras disciplinas.
            </p>
          </div>
          <div className={styles.photo}>
            <img
              src="/logo_arbitra.png"
              alt="Balón de fútbol playa en su cancha"
            />
          </div>
        </div>
      </section>
      <section className="section light">
        <div className={`container ${styles.values}`}>
          <article>
            <Target />
            <h3>Propósito</h3>
            <p>Formar árbitros con criterio, responsabilidad y compromiso.</p>
          </article>
          <article>
            <Eye />
            <h3>Visión</h3>
            <p>
              Construir una propuesta de formación arbitral multidisciplinaria.
            </p>
          </article>
          <article>
            <Gem />
            <h3>Valores</h3>
            <p>Respeto, aprendizaje, inclusión y juego limpio.</p>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Users color="#10B981" />
          <h2>Nuestro enfoque</h2>
          <p>
            Buscamos conectar los fundamentos teóricos con la preparación para
            situaciones reales del arbitraje deportivo.
          </p>
        </div>
      </section>
    </>
  )
}

export default WhoWeAre