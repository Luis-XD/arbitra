import { useContext, useEffect, useState } from 'react'
import styles from './css/Home.module.css'
import Section from '../components/Section'
import Publication from '../components/Publication'
import Elementor from '../components/Elementor'
import LoadData from '../components/LoadData'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserProvider'
import WhatsAppButton from '../components/WhatsAppButton'

function Home() {
  const [configData, setConfigData]  = useState(null)
  const [cargando, setCargando] = useState(false)
  const ROUTE = `${CONFIG_BACKEND.API_DIR}/config/getDataConfig`
  const loadConfigData = LoadData(setCargando, setConfigData, 'GET', ROUTE)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
      if (user) {
        navigate(CONFIG_PATHS.CAMPUS_PATH, { replace: true })
      }
  }, [user, navigate])

  useEffect(() => {
    loadConfigData()
  }, [])

  return (
  <>  
      <Publication
        type="xtreme2"
        home={true}
      >        
        {/* 1. SECCIÓN SUPERIOR: Iconos destacados */}
        <Section>
          <h2>{configData?.contentConfig}</h2>
        </Section>

        <Section>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <img src="/iconsArbitra/utilities/graduation.png" alt="Formación" className={styles.featureIcon} />
              <span className={styles.featureText}>Formación especializada</span>
            </div>
            <div className={styles.featureItem}>
              <img src="/iconsArbitra/utilities/focus.png" alt="Enfoque" className={styles.featureIcon} />
              <span className={styles.featureText}>Enfoque práctico</span>
            </div>
            <div className={styles.featureItem}>
              <img src="/iconsArbitra/utilities/group.png" alt="Docentes" className={styles.featureIcon} />
              <span className={styles.featureText}>Docentes con experiencia</span>
            </div>
            <div className={styles.featureItem}>
              <img src="/iconsArbitra/utilities/certificate.png" alt="Certificación" className={styles.featureIcon} />
              <span className={styles.featureText}>Certificación de cursada</span>
            </div>
          </div>
        </Section>

        {/* aqui escribe -  fin*/}
        <Section>
            {/* TARJETA 1: FÚTBOL 11 */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <h3 className={styles.cardTitle}>Árbitro de Fútbol 11</h3>
                    <ul className={styles.cardList}>
                        <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/calendar.png'/> Duración: 6 meses</li>
                        <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/signal.png'/>   Nivel: Inicial / Intermedio</li>
                    </ul>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <Link to='/deportes/disciplina/9' className={styles.cardButton}>
                            Ver Programa
                        </Link>
                    </div>
                  </div>
                <img src="/images/home/futbol11.jpg" alt="Futsal" className={styles.whyCardImage} />
                </div>
            </Elementor>

            {/* TARJETA 1: FÚTBOL 8 y 5 */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <div>
                        <h3 className={styles.cardTitle}>Árbitro de Fútbol 8 y 5</h3>
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/calendar.png'/> Duración: 4 meses</li>
                            <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/signal.png'/>   Nivel: Inicial</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <Link to='/deportes/disciplina/20' className={styles.cardButton}>
                            Ver Programa
                        </Link>
                    </div>
                  </div>
                <img src="/images/home/futbol8-5.jpg" alt="Futsal" className={styles.whyCardImage} />
                </div>
            </Elementor>

            {/* TARJETA 1: FUTSAL */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <div>
                        <h3 className={styles.cardTitle}>Árbitro de Futsal</h3>                        
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/calendar.png'/> Duración: 3 meses</li>
                            <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/signal.png'/>   Nivel: Inicial</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <Link to='/deportes/disciplina/25' className={styles.cardButton}>
                            Ver Programa
                        </Link>
                    </div>
                  </div>
                <img src="/images/home/futsal.jpg" alt="Futsal" className={styles.whyCardImage} />
                </div>
            </Elementor>

            {/* TARJETA 1: FÚTBOL PLAYA */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <div>
                        <h3 className={styles.cardTitle}>Árbitro de Futbol playa</h3>                        
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/calendar.png'/> Duración: 3 meses</li>
                            <li className={styles.cardListItem}><img src='/iconsArbitra/utilities/signal.png'/>   Nivel: Inicial</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <Link to='/deportes/disciplina/24' className={styles.cardButton}>
                            Ver Programa
                        </Link>
                    </div>
                  </div>
                <img src="/images/home/futbol_playa.jpg" alt="Futsal" className={styles.whyCardImage} />
                </div>
            </Elementor>

        </Section>

        {/* 3. BANNER INFERIOR: El deporte también se dirige */}
        <Section>
          <div className={styles.ctaBanner}>
            <div className={styles.contElmBanner}>
              <div className={styles.ctaContent}>
                  <h3 className={styles.ctaTitle}>
                    El deporte
                    <span>también se dirige</span>
                  </h3>
                  <p className={styles.ctaSubtitle}>Comenzá tu camino profesional en el arbitraje hoy mismo.</p>
              </div>
              <div className={styles.contBtn}>
                <WhatsAppButton expandButton={true} textBtn='Iniciá tu formación hoy'/>
              </div>
            </div>
            <div className={styles.opacity}></div>
            <img src="/images/home/silvato.jpg" alt="Silbato" className={styles.ctaIcon} />
          </div>
        </Section>
      </Publication>
      </>
  )
}

export default Home