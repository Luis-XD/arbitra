import { useContext, useEffect, useState } from "react";
import styles from "./css/Home.module.css";
import LoadData from "../components/LoadData";
import { CONFIG_BACKEND, CONFIG_PATHS } from "../config/config";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserProvider";
import WhatsAppButton from "../components/WhatsAppButton";
import SectionExpand from "../components/SectionExpand";
import ContainerWrapper from "../components/ContainerWrapper";
import ContentBannerLogo from "../components/ContentBannerLogo";
import PublicationStd from "../components/PublicationStd";
import CourseCard from "../components/CourseCard";
import TopTitle from "../components/TopTitle";
import ContainerWrap from "../components/ContainerWrap";
import WhyChooseArbitra from "../components/WhyChooseArbitra";
import { MODALIDADES_ARBITRAJE } from "../data/content";
import CardVertical from "../components/CardVertical";

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
          <ContainerWrapper images={["/images/others/img1.png"]}>
            <ContentBannerLogo />
          </ContainerWrapper>
        </SectionExpand>
        <SectionExpand>
          <ContainerWrap>
            <TopTitle />
            <div className={styles.courseGrid}>
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
          <WhyChooseArbitra />
        </SectionExpand>

        <SectionExpand bgAssing="#0A101B">
          <CardVertical
            nameImg="arbitra_futbol_playa.svg"
            typeTitle={MODALIDADES_ARBITRAJE.presencial.mode}
            title={MODALIDADES_ARBITRAJE.presencial.title}
            descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
            items={MODALIDADES_ARBITRAJE.presencial.items}
            accent="ambar"
            sale={MODALIDADES_ARBITRAJE.presencial.investment}
            to="/contacto"
          />
          <CardVertical
            nameImg="arbitra_futbol_playa.svg"
            typeTitle={MODALIDADES_ARBITRAJE.distanciaPresencial.mode}
            title={MODALIDADES_ARBITRAJE.distanciaPresencial.title}
            descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
            items={MODALIDADES_ARBITRAJE.distanciaPresencial.items}
            accent="turquoise"
            sale={MODALIDADES_ARBITRAJE.distanciaPresencial.investment}
            to="/contacto"
          />
          <CardVertical
            nameImg="arbitra_futbol_playa.svg"
            typeTitle={MODALIDADES_ARBITRAJE.distanciaIntensiva.mode}
            title={MODALIDADES_ARBITRAJE.distanciaIntensiva.title}
            descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
            items={MODALIDADES_ARBITRAJE.distanciaIntensiva.items}
            accent="purple"
            sale={MODALIDADES_ARBITRAJE.distanciaIntensiva.investment}
            to="/contacto"
          />
          <CardVertical
            nameImg="arbitra_futbol_playa.svg"
            typeTitle={MODALIDADES_ARBITRAJE.online.mode}
            title={MODALIDADES_ARBITRAJE.online.title}
            descrip="Formación orientada al arbitraje de encuentros de fútbol de once jugadores."
            items={MODALIDADES_ARBITRAJE.online.items}
            accent="green"
            sale={MODALIDADES_ARBITRAJE.online.investment}
            to="/contacto"
          />
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
  );
}

export default Home;
