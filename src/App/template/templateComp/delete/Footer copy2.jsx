import styles from './css/Footer.module.css'
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import Brand from "../../components/Brand"

function Footer() {
    return ( 
        <>
            <footer className={styles.footer}>
                <div className={`container ${styles.grid}`}>
                    <div>
                        <Link to="/">
                            <Brand large="true" />
                        </Link>
                        <p>Formación arbitral para quienes hacen avanzar el deporte.</p>
                    </div>
                    <div>
                        <h3>Institucional</h3>
                        <Link to="/quienes-somos">Quiénes somos</Link>
                        <Link to="/contacto">Contacto</Link>
                    </div>
                    <div>
                        <h3>Formación</h3>
                        <Link to="/formacion">Programas</Link>
                        <Link to="/cursos">Cursos</Link>
                        <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
                    </div>
                    <div>
                        <h3>Información</h3>
                        <Link to="/politica-de-privacidad">Política de privacidad</Link>
                        <Link to="/campus">Campus Virtual</Link>
                    </div>
                    <div>
                        <h3>Contacto</h3>
                        <Link to="/contacto">
                            <Mail size={15} /> Escribinos
                        </Link>
                        <p>
                            <MapPin size={15} /> Argentina
                        </p>
                        <div className={styles.social}>
                            <span aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </span>
                            <span aria-label="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </span>
                            <span aria-label="TikTok" className={styles.tiktok}>
                                ♪
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`container ${styles.bottom}`}>
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