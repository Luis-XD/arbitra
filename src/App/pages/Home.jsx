import { useContext, useEffect, useState } from 'react'
import styles from './css/Home.module.css'
import Elementor from '../components/Elementor'
import LoadData from '../components/LoadData'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserProvider'
import WhatsAppButton from '../components/WhatsAppButton'
import SectionExpand from '../components/SectionExpand'
import ContainerWrapper from '../components/ContainerWrapper'
import ContentBannerLogo from '../components/ContentBannerLogo'
import PublicationStd from '../components/PublicationStd'

function Home_prueba() {
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
        <PublicationStd>
          <SectionExpand>
            <ContainerWrapper images={['/images/others/img1.png']}>
            <ContentBannerLogo />
            </ContainerWrapper>
          </SectionExpand>
          <SectionExpand bgAssing='#000F16'>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <img src="/iconsArbitra/utilities/graduation.png" alt="Formación" className={styles.featureIcon} />
                <span className={styles.featureText}>Formación especializada</span>
              </div>
              <span></span>
              <div className={styles.featureItem}>
                <img src="/iconsArbitra/utilities/focus.png" alt="Enfoque" className={styles.featureIcon} />
                <span className={styles.featureText}>Enfoque práctico</span>
              </div>
              <span></span>
              <div className={styles.featureItem}>
                <img src="/iconsArbitra/utilities/group.png" alt="Docentes" className={styles.featureIcon} />
                <span className={styles.featureText}>Docentes con experiencia</span>
              </div>
              <span></span>
              <div className={styles.featureItem}>
                <img src="/iconsArbitra/utilities/certificate.png" alt="Certificación" className={styles.featureIcon} />
                <span className={styles.featureText}>Certificación de cursada</span>
              </div>
            </div>
          </SectionExpand>
          <SectionExpand bgAssing='#fff' pdgAssign='2rem 0 2rem 0' titleElm='Nuestras formaciones'>
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
                              Ver Programa →
                          </Link>
                      </div>
                    </div>
                    <img src="/images/home/arbitra_futbol_11.svg" alt="Futsal" className={styles.whyCardImage} />
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
                              Ver Programa →
                          </Link>
                      </div>
                    </div>
                  <img src="/images/home/arbitra_futbol_8_y_5.svg" alt="Futsal" className={styles.whyCardImage} />
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
                              Ver Programa →
                          </Link>
                      </div>
                    </div>
                  <img src="/images/home/arbitra_futsal.svg" alt="Futsal" className={styles.whyCardImage} />
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
                              Ver Programa →
                          </Link>
                      </div>
                    </div>
                  <img src="/images/home/arbitra_futbol_playa.svg" alt="Futsal" className={styles.whyCardImage} />
                  </div>
              </Elementor>
          </SectionExpand>
          <SectionExpand>
            <div className={styles.contGroupElm}>
              <div className={styles.contTitle}>
                <h2>¿Por qué elegir <br /><span>ARBITRA</span>?</h2>
              </div>
              <div className={styles.featuresGridBenefit}>
                <div className={styles.featureItem}>
                  <img src="/iconsArbitra/utilities/graduation.svg" alt="Formación" className={styles.featureIcon} />
                  <span className={styles.featureText}>Contenido actualizado</span>
                </div>
                <span></span>
                <div className={styles.featureItem}>
                  <img src="/iconsArbitra/utilities/run.png" alt="Enfoque" className={styles.featureIcon} />
                  <span className={styles.featureText}>Preparación fisica y arbitral</span>
                </div>
                <span></span>
                <div className={styles.featureItem}>
                  <img src="/iconsArbitra/utilities/book.svg" alt="Docentes" className={styles.featureIcon} />
                  <span className={styles.featureText}>Reglamentación oficial (IFAB)</span>
                </div>
                <div className={styles.featureItem}>
                  <img src="/iconsArbitra/utilities/increase.svg" alt="Docentes" className={styles.featureIcon} />
                  
                  <span className={styles.featureText}>Desarrollo de competencias</span>
                </div>
              </div>
            </div>
          </SectionExpand>
          <SectionExpand bgAssing='#0f1520'>
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
          </SectionExpand>
        </PublicationStd>
      </>
  )
}

export default Home_prueba