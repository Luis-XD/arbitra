import { useContext, useEffect, useState } from "react";
import styles from "./css/Home.module.css";
import LoadData from "../components/LoadData";
import { CONFIG_BACKEND, CONFIG_PATHS } from "../config/config";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserProvider";
import WhatsAppButton from "../components/WhatsAppButton";
import SectionExpand from "../components/SectionExpand";
import PublicationStd from "../components/PublicationStd";
import CourseCard from "../components/CourseCard";
import TopTitle from "../components/TopTitle";
import ContainerWrap from "../components/ContainerWrap";
import WhyChooseArbitra from "../components/WhyChooseArbitra";
import Modalidades from "../components/Modalidades";
import { HERO_SLIDES } from '../data/heroSlides';
import HeroSlider from '../components/HeroSlider';
import PartnerSlider from '../components/PartnerSlider';

function Home() {
  const [configData, setConfigData] = useState(null);
  const [cargando, setCargando] = useState(false);
  const ROUTE = `${CONFIG_BACKEND.API_DIR}/config/getDataConfig`;
  const loadConfigData = LoadData(setCargando, setConfigData, "GET", ROUTE);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
          <HeroSlider slides={HERO_SLIDES} autoPlay interval={6500} />
        </SectionExpand>

        <SectionExpand>
          <ContainerWrap>
            <TopTitle 
              header="OFERTA FORMATIVA"
              wordOne="Nuestras"
              wordTwo="formaciones"
              paragraph="Explorá las especialidades de arbitraje de nuestras distintas disciplinas. Consultá los programas, requisitos y próximas fechas de cursada."
            />
            <div className={styles.courseCont}>
              <CourseCard
                nameImg="arbitra_futbol_11.svg"
                sport="futbol"
                title="Árbitro de Campo · Fútbol 11"
                descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
                to="/cursos/disciplina/9"
              />
              <CourseCard
                nameImg="arbitra_futbol_8_y_5.svg"
                sport="futbol"
                title="Árbitro de · Fútbol 8 y 5"
                descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
                to="/cursos/disciplina/20"
              />
              <CourseCard
                nameImg="arbitra_futsal.svg"
                sport="futbol"
                title="Árbitro de Futsal"
                descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
                to="/cursos/disciplina/21"
              />
              <CourseCard
                nameImg="arbitra_futbol_playa.svg"
                sport="futbol"
                title="Árbitro de Futbol Playa"
                descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
                to="/cursos/disciplina//24"
              />
            </div>
          </ContainerWrap>
        </SectionExpand>

        <SectionExpand bgAssing="#0A101B">
          <ContainerWrap>
            <WhyChooseArbitra
              comp={
                  <TopTitle 
                    header="NUESTROS BENEFICIOS"
                    wordOne="¿Por qué elegir"
                    wordTwo="ARBITRA?"
                  />
                }
            />
          </ContainerWrap>
        </SectionExpand>

        <SectionExpand bgAssing="#06161f">
          <ContainerWrap>
            <Modalidades 
              comp={
                <TopTitle 
                    header="MODALIDADES DE FORMACIÓN"
                    wordOne="Elegí la modalidad que"
                    wordTwo="mejor se adapte a vos"
                    subtitle="Conocé las opciones de cursada y elegí cómo querés formarte."
                  />
              }
            />
          </ContainerWrap>
        </SectionExpand>

        <SectionExpand bgAssing="#0A101B">
          <ContainerWrap>
            <PartnerSlider />
          </ContainerWrap>
        </SectionExpand>

        <SectionExpand bgAssing="#0f1520">
          <div className={styles.ctaBanner}>
            <div className={styles.contElmBanner}>
              <div className={styles.ctaContent}>
                <h3 className={styles.ctaTitle}>
                  El deporte
                  <span>también se dirige</span>
                </h3>
                <p className={styles.ctaSubtitle}>
                  Comenzá tu camino profesional en el arbitraje hoy mismo.
                </p>
              </div>
              <div className={styles.contBtn}>
                <WhatsAppButton
                  expandButton={true}
                  textBtn="Iniciá tu formación hoy"
                />
              </div>
            </div>
            <div className={styles.opacity}></div>
            <img
              src="/images/home/silvato.png"
              alt="Silbato"
              className={styles.ctaIcon}
            />
          </div>
        </SectionExpand>

      </PublicationStd>
    </>
  )
}

export default Home
