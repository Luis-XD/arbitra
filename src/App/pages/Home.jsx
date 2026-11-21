import { useContext, useEffect, useState } from 'react'
import styles from './css/Home.module.css'
import LoadData from '../components/LoadData'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserProvider'
import WhatsAppButton from '../components/WhatsAppButton'
import SectionExpand from '../components/SectionExpand'
import ContainerWrapper from '../components/ContainerWrapper'
import ContentBannerLogo from '../components/ContentBannerLogo'
import PublicationStd from '../components/PublicationStd'
import CourseCard from '../components/CourseCard'
import TopTitle from '../components/TopTitle'
import ContainerWrap from '../components/ContainerWrap'
import WhyChooseArbitra from '../components/WhyChooseArbitra'

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
          <SectionExpand>
            <ContainerWrap>
              <TopTitle />
              <div className={styles.courseGrid}>
                <CourseCard 
                  nameImg='arbitra_futbol_11.svg'
                  sport='futbol'
                  title='Árbitro de Campo · Fútbol 11'
                  descrip='Formación orientada al arbitraje de encuentros de fútbol de once jugadores.'
                  to='/deportes/disciplina/9'
                />
                <CourseCard 
                  nameImg='arbitra_futbol_11.svg'
                  sport='futbol'
                  title='Árbitro de Campo · Fútbol 11'
                  descrip='Formación orientada al arbitraje de encuentros de fútbol de once jugadores.'
                  mailto='info@arbitra.com?subject=Consulta%20F%C3%BAtbol%2011'
                />
                <CourseCard 
                  nameImg='arbitra_futbol_11.svg'
                  sport='futbol'
                  title='Árbitro de Campo · Fútbol 11'
                  descrip='Formación orientada al arbitraje de encuentros de fútbol de once jugadores.'
                  mailto='info@arbitra.com?subject=Consulta%20F%C3%BAtbol%2011'
                />
                <CourseCard 
                  nameImg='arbitra_futbol_11.svg'
                  sport='futbol'
                  title='Árbitro de Campo · Fútbol 11'
                  descrip='Formación orientada al arbitraje de encuentros de fútbol de once jugadores.'
                  mailto='info@arbitra.com?subject=Consulta%20F%C3%BAtbol%2011'
                />
              </div>
            </ContainerWrap>
          </SectionExpand>
          
          <SectionExpand bgAssing='#0A101B'>
            <WhyChooseArbitra />
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
              <img src="/images/home/silvato.png" alt="Silbato" className={styles.ctaIcon} />
            </div>
          </SectionExpand>
        </PublicationStd>
      </>
  )
}

export default Home_prueba