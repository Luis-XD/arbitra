import styles from './css/Footer.module.css'
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import Brand from "../../components/Brand"
import { CONFIG_PATHS } from '../../config/config';

function Footer() {
    return ( 
        <>
            <footer className={styles.footer}>
                <div className={`${styles.container} ${styles.grid}`}>
                    <div>
                        <Link to="/">
                            <Brand large="true" />
                        </Link>
                        <p>Formación arbitral para quienes hacen avanzar el deporte.</p>
                    </div>
                    <div>
                        <h3>Institucional</h3>
                        <Link to={CONFIG_PATHS.WHO_WE_ARE_PATH}>Quiénes somos</Link>
                        <Link to={CONFIG_PATHS.PROFESSORS_PATH}>Nuestros profesores</Link>
                    </div>
                    <div>
                        <h3>Formación</h3>
                        <Link to={CONFIG_PATHS.FORMATION_PATH}>Programas</Link>
                        <Link to={CONFIG_PATHS.COURSES_PATH}>Cursos</Link>
                        <Link to={CONFIG_PATHS.FAQ_PATH}>Preguntas frecuentes</Link>
                    </div>
                    <div>
                        <h3>Información</h3>
                        <Link to={CONFIG_PATHS.PRIVACY_PATH}>Política de privacidad</Link>
                        <Link to={CONFIG_PATHS.CAMPUS_PATH}>Campus Virtual</Link>
                    </div>
                    <div>
                        <h3>Contacto</h3>
                        <Link to={CONFIG_PATHS.CONTACT_PATH}>
                            <Mail size={15} /> Escribinos
                        </Link>
                        <p>
                            <MapPin size={15} /> Argentina
                        </p>
                        <div className={styles.social}>
                            <a href="https://www.instagram.com/arbitracfp/" target='_blanck' aria-label="Instagram">
                                <img src="/iconsArbitra/social/instagram.svg" title="Instagram"/>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61595848211808" target='_blanck' aria-label="Facebook">
                                <img src="/iconsArbitra/social/facebook.svg" title="Facebook"/>
                            </a>
                            <a href="https://wa.me/5491155792122?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20capacitaciones." target='_blanck' aria-label="Whatsapp">
                                <img src="/iconsArbitra/social/wp.svg" title="Whatsapp"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`${styles.container} ${styles.bottom}`}>
                    © {new Date().getFullYear()} ARBITRA. Todos los derechos reservados.{" "}
                    <span>
                        Redes sociales: agregar enlaces oficiales antes de publicar.
                    </span>
                </div>
            </footer>
        </>
     )
}

export default Footer