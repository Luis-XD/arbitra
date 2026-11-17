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

  return (
  <>  
      <Publication
        type="xtreme2"
        home={true}
      >
        <Section>
          <h2>{configData?.contentConfig}</h2>
        </Section>
        <Section>
            {/* TARJETA 1: FÚTBOL 11 */}
            <Elementor>
                <div className={styles.cardContainer}>
                    <div>
                        <div className={styles.cardHeader}>
                            <span className={styles.badgeLevel}>Nivel Inicial / Intermedio</span>
                            <span className={styles.cardDuration}><i className="fa-regular fa-clock mr-1"></i> 6 Meses</span>
                            <img src='/images/cards/img1.jpg'/>
                        </div>
                        <h3 className={styles.cardTitle}>Árbitro de Campo (Fútbol 11)</h3>
                        <p className={styles.cardDescription}>Dominio completo de las 17 reglas del juego IFAB, posicionamiento táctico, lenguaje corporal y señalética oficial.</p>
                        
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Táctica y Posicionamiento de Diagonal</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Preparación Física &amp; Test Yo-Yo</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Redacción de Actas e Informes Oficiales</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        <div>
                            <span className={styles.investmentLabel}>Inversión</span>
                            <span className={styles.investmentPrice}>Consultar <span className={styles.investmentSub}>/mes</span></span>
                        </div>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ: De etiqueta <a> a <button> con onClick para abrir el modal <--- */}
                        <button onClick={() => setShowModal(true)} className={styles.cardButton}>
                            Ver Programa
                        </button>
                    </div>
                </div>
            </Elementor>

            {/* TARJETA 2: FÚTBOL 8 Y FÚTBOL 5 (DESTACADA) */}
            <Elementor>
                <div className={`${styles.cardContainer} ${styles.cardFeatured}`}>
                    <div>
                        <div className={styles.cardHeader}>
                            <span className={styles.badgeLevel}>Avanzado / Formativo</span>
                            <span className={styles.cardDuration}><i className="fa-regular fa-clock mr-1"></i> 4 Meses</span>
                        </div>
                        <h3 className={styles.cardTitle}>Árbitro de Fútbol 8 y 5</h3>
                        <p className={styles.cardDescription}>Gestión de espacios reducidos, control de faltas tácticas, arbitraje dinámico y manejo de banco de suplentes.</p>
                        
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Criterio de Ley de Ventaja en Espacios Reducidos</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Control Disciplinario y Tarjetas en F5/F8</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Coordinación con Cronometraje y Planilleros</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        <div>
                            <span className={styles.investmentLabel}>Inversión</span>
                            <span className={styles.investmentPrice}>Consultar <span className={styles.investmentSub}>/mes</span></span>
                        </div>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ <--- */}
                        <button onClick={() => setShowModal(true)} className={styles.cardButton}>
                            Ver Programa
                        </button>
                    </div>
                </div>
            </Elementor>

            {/* TARJETA 3: FUTSAL / FÚTBOL SALA */}
            <Elementor>
                <div className={styles.cardContainer}>
                    <div>
                        <div className={styles.cardHeader}>
                            <span className={styles.badgeLevel}>Especialidad</span>
                            <span className={styles.cardDuration}><i className="fa-regular fa-clock mr-1"></i> 3 Meses</span>
                        </div>
                        <h3 className={styles.cardTitle}>Árbitro de Futsal (Fútbol Sala)</h3>
                        <p className={styles.cardDescription}>Reglamentación específica FIFA/AFA de superficies indoor, faltas acumuladas, doble penal y conteo de 4 segundos.</p>
                        
                        <ul className={styles.cardList}>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Reglas Oficiales de Futsal y Dinámica de Dupla</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Manejo de Cronómetro Electrónico y Tiempos Muertos</li>
                            <li className={styles.cardListItem}><i className="fa-solid fa-check"></i> Protocolo de Sustituciones y Área Técnica</li>
                        </ul>
                    </div>
                    <div className={styles.cardFooter}>
                        <div>
                            <span className={styles.investmentLabel}>Inversión</span>
                            <span className={styles.investmentPrice}>Consultar <span className={styles.investmentSub}>/mes</span></span>
                        </div>
                        {/* ---> CAMBIADO ÚNICAMENTE AQUÍ <--- */}
                        <button onClick={() => setShowModal(true)} className={styles.cardButton}>
                            Ver Programa
                        </button>
                    </div>
                </div>
            </Elementor>
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