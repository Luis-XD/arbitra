import { UserContext } from '../components/UserProvider'
import { useState, useEffect, useContext } from 'react'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import styles from './css/Courses.module.css'

function Courses() {
    const [disciplines, setDisciplines] = useState([])
    const [loadingDisciplines, setLoadingDisciplines] = useState(true)
    const [selectedDiscipline, setSelectedDiscipline] = useState(null) // Estado para controlar el curso seleccionado en el modal
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate(CONFIG_PATHS.CAMPUS_PATH, { replace: true })
        }
    }, [user, navigate])

    useEffect(() => {
        fetch(`${CONFIG_BACKEND.API_DIR}/disciplines`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Filtramos estrictamente que tanto el deporte como la disciplina estén en 1
                const cursosActivos = (data.result || []).filter(
                    item => Number(item.sport_status) === 1 && Number(item.status) === 1
                );
                setDisciplines(cursosActivos);
            } else {
                if (import.meta.env.DEV) { console.error('Error en deportes: ', data.message) }
            }
        })
        .catch(error => {
            if (import.meta.env.DEV) console.error('Error en API: ', error)
        })
        .finally(() => {
            setLoadingDisciplines(false)
        })
    }, [])

    return ( 
        <>
            {/* Modal para mostrar los detalles del curso seleccionado */}
            {selectedDiscipline && (
                <Modal
                    id="containerFloat"
                    onClickElm={() => setSelectedDiscipline(null)}
                >
                    <div style={{ padding: '10px 20px', color: '#000', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                        <h2 style={{ color: '#000', fontSize: '2rem' }}>{selectedDiscipline.name_discip}</h2>
                        <p style={{ marginTop: '15px', color: '#000', lineHeight: '1.6', textAlign: 'left' }}>
                            {selectedDiscipline.descript_discip || 'Este curso no cuenta con una descripción detallada por el mismo momento.'}
                        </p>
                        
                        {selectedDiscipline.img_discip && (
                            <div style={{ marginTop: '20px' }}>
                                <img 
                                    src={`${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/${selectedDiscipline.img_discip}`} 
                                    alt={selectedDiscipline.name_discip} 
                                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '2rem' }} 
                                />
                            </div>
                        )}
                    </div>
                </Modal>
            )}
            <PageHero title="Cursos" image="/assets/course.jpg" />
                <section className="section light">
                    <div className="container">
                        <div className="cursoTituloDestacado">
                            <h2>
                                <span className="slash"></span>Nuestras cursos habilitados
                            </h2>
                        </div>
                        <p className="lead">
                            Propuestas breves para seguir desarrollando conocimientos y
                            herramientas en el ámbito arbitral. Consultá por fechas y
                            disponibilidad.
                        </p>
                        <div className={styles.list}>
                            {loadingDisciplines ? (
                                <p>Cargando cursos...</p>
                            ) : disciplines.length > 0 ? (
                                disciplines.map(discipline => (
                                    <div 
                                        key={discipline.id_discip} 
                                        //onClick={() => setSelectedDiscipline(discipline)} 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Card 
                                            cardTitle={discipline.name_discip} 
                                            ubication='disciplines/cards'
                                            descriptionCard={discipline.descript_discip}
                                            imgCard={discipline.img_discip}
                                            link={`${CONFIG_PATHS.COURSES_PATH}/disciplina/${discipline.id_discip}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>Estamos trabajando en nuevos cursos para ti.</p>
                            )}
                        </div>
                    </div>
                </section>
      
        </>
     )
}

export default Courses