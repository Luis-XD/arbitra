import { useContext, useEffect, useState } from 'react'
import styles from './css/Home.module.css'
import Section from '../components/Section'
import Publication from '../components/Publication'
import Elementor from '../components/Elementor'
import LoadData from '../components/LoadData'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserProvider'

function Home() {
  const [configData, setConfigData]  = useState(null)
  const [cargando, setCargando] = useState(false)
  
  // ---> AGREGADO: Estados para controlar el modal y el formulario <---
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })

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

  // ---> AGREGADO: Función para procesar el envío del formulario <---
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
  const phoneNumber = '5491155792122';

  // Mensaje predeterminado opcional (codificado para URL)
  const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus capacitaciones.');
  
  // URL de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
  <>  
      <Publication
        type="xtreme2"
        home={true}
      >        
        {/* 1. SECCIÓN SUPERIOR: Iconos destacados */}
        <Section>
          <h2>{configData?.contentConfig}</h2>
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

        {/* 2. SECCIÓN INTERMEDIA: ¿Por qué elegir Arbitra? 
        <Section>
          <div className={styles.whyContainer}>
            <div className={styles.whyHeader}>
              <div className={styles.whyIndicator}></div>
              <h2 className={styles.whyTitle}>¿Por qué elegir Arbitra?</h2>
            </div>
            
            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>
                <h4 className={styles.whyCardTitle}>Árbitro de campo de Fútbol 11</h4>
                <img src="/images/home/futbol11.jpg" alt="Fútbol 11" className={styles.whyCardImage} />
              </div>

              <div className={styles.whyCard}>
                <h4 className={styles.whyCardTitle}>Árbitro de Fútbol 8 y 5</h4>
                <img src="/images/home/futbol8-5.jpg" alt="Fútbol 8 y 5" className={styles.whyCardImage} />
              </div>

              <div className={styles.whyCard}>
                <h4 className={styles.whyCardTitle}>Árbitro de Futsal</h4>
                <img src="/images/home/futsal.jpg" alt="Futsal" className={styles.whyCardImage} />
              </div>
            </div>
          </div>
        </Section>*/}

        {/* aqui escribe -  fin*/}
        <Section>
            {/* TARJETA 1: FÚTBOL 11 */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <h3 className={styles.cardTitle}>Árbitro de Fútbol 11</h3>
                    <ul className={styles.cardList}>
                        <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Duración: 6 meses</li>
                        <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Nivel: Inicial / Intermedio</li>
                    </ul>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <button className={styles.cardButton}>
                            Ver Programa
                        </button>
                    </div>
                  </div>
                <img src="/images/home/futbol11.jpg" alt="Futsal" className={styles.whyCardImage} />
                </div>
            </Elementor>

            {/* TARJETA 1: FÚTBOL 11 */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <div>
                        <h3 className={styles.cardTitle}>Árbitro de Fútbol 8 y 5</h3>
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Duración: 4 meses</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Nivel: Inicial</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <button onClick={() => setShowModal(true)} className={styles.cardButton}>
                            Ver Programa
                        </button>
                    </div>
                  </div>
                <img src="/images/home/futbol8-5.jpg" alt="Futsal" className={styles.whyCardImage} />
                </div>
            </Elementor>

            {/* TARJETA 1: FÚTBOL 11 */}
            <Elementor>
                <div className={styles.cardContainer}>
                  <div className={styles.contElm}>
                    <div>
                        <h3 className={styles.cardTitle}>Árbitro de Futsal</h3>                        
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i>Duración: 3 meses</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i>Nivel: Inicial</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <button onClick={() => setShowModal(true)} className={styles.cardButton}>
                            Ver Programa
                        </button>
                    </div>
                  </div>
                <img src="/images/home/futsal.jpg" alt="Futsal" className={styles.whyCardImage} />
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
                <a href={whatsappUrl} target='_blank' className={styles.ctaButton}>
                  <img src="/iconsArbitra/utilities/whatsapp.png" alt="WhatsApp" className={styles.ctaButtonIcon} /> 
                  Iniciá tu formación hoy
                </a>
              </div>
            </div>
            <img src="/images/home/silvato.jpg" alt="Silbato" className={styles.ctaIcon} />
          </div>
        </Section>
      </Publication>

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
            <h3 className={styles.modalTitle}>Consulta sobre el Programa</h3>
            
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
      </>
  )
}

export default Home