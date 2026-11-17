import styles from './css/Footer.module.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadData from '../../components/LoadData'
import mail from '/iconsArbitra/links/mail.png'
import info from '/iconsArbitra/links/info.png'
import privacy from '/iconsArbitra/links/privacy.png'
import tiktok from '/iconsArbitra/social/tiktok.png'
import facebook from '/iconsArbitra/social/facebook.png'
import instagram from '/iconsArbitra/social/instagram.png'
import { CONFIG_BACKEND, CONFIG_SOCIAL_NETWORK, CONFIG_PATHS } from '../../config/config'

function Footer() {
    const [configData, setConfigData]  = useState(null)
    const [cargando, setCargando] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })
    const ROUTE = `${CONFIG_BACKEND.API_DIR}/config/getDataConfig`
    const loadConfigData = LoadData(setCargando, setConfigData, 'GET', ROUTE)
    
    const handleSubmitForm = async (e) => {
        e.preventDefault()

        try {
        // Reemplaza esta ruta con la ruta real de tu API/backend donde subiste el PHP
        const response = await fetch(`${CONFIG_BACKEND.API_DIR}/contact/submitMail`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const resultado = await response.json();

        if (resultado.status === 'success') {
            alert(`¡Gracias ${formData.nombre}! Tu consulta ha sido enviada correctamente.`);
            setShowModal(false);
            setFormData({ nombre: '', email: '', mensaje: '' });
        } else {
            alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
        }
        } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor.');
        }
    }
    
    useEffect(() => {
        loadConfigData()
    }, [])

    return ( 
        <>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.group}>
                        <p>Sobre nosotros:</p>
                        <ul>
                            <li>
                                <Link to={CONFIG_PATHS.ABOUT_US_PATH}>
                                    <img src={info} />
                                    Quiénes somos
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div className={styles.group}>
                        <p>Privacidad:</p>
                        <ul>
                            <li>
                                <Link to={CONFIG_PATHS.PRIVACY_PATH}>
                                    <img src={privacy} />
                                    Política de privacidad
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.group}>
                        <p>Contacto:</p>
                        <ul>
                            <li>
                                <button onClick={() => setShowModal(true)} >
                                    <img src={mail} /> Email
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.group}>
                        <p>Redes sociales:</p>
                        <ul>
                            <li>
                                <Link to={CONFIG_SOCIAL_NETWORK.FB} target="_blank" className={styles.facebook}>
                                    <img src={facebook} />
                                </Link>
                                <Link to={CONFIG_SOCIAL_NETWORK.TK} target="_blank" className={styles.tiktok}>
                                    <img src={tiktok} />
                                </Link>
                                <Link to={CONFIG_SOCIAL_NETWORK.IG} target="_blank" className={styles.instagram}>
                                    <img src={instagram} />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <p className={styles.copyright}>
                    {configData ? `© ${configData.yearConfig}` : "2026"} ARBITRA. Argentina. Todos los derechos reservados.
                </p>
            {/* ---> AGREGADO: Bloque del modal al final del JSX <--- */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                    <button 
                        onClick={() => setShowModal(false)}
                        className={styles.modalCloseButton}
                    >
                        ✕
                    </button>
                    <h3 className={styles.modalTitle}>Envíanos tu consulta</h3>
                    
                    <form onSubmit={handleSubmitForm} className={styles.modalForm}>
                        <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Nombre:</label>
                        <input 
                            type="text" 
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            className={styles.formInput}
                            placeholder="Tu nombre completo"
                        />
                        </div>
                        <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Correo electrónico:</label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={styles.formInput}
                            placeholder="correo@ejemplo.com"
                        />
                        </div>
                        <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Mensaje o Consulta:</label>
                        <textarea 
                            rows="4"
                            required
                            value={formData.mensaje}
                            onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                            className={`${styles.formInput} ${styles.formTextarea}`}
                            placeholder="Escribe tu consulta..."
                        />
                        </div>
                        <button 
                        type="submit"
                        className={styles.modalSubmitButton}
                        >
                        Enviar Consulta
                        </button>
                    </form>
                    </div>
                </div>
            )}
            </footer>
        </>
     )
}

export default Footer