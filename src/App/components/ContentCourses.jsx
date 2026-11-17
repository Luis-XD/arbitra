import { useState, useEffect } from 'react'
import styles from './css/Campus.module.css'
import { useParams } from 'react-router-dom'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import Card from './Card'

function ContentCourses() {
    const [cargando, setCargando] = useState(true)
    const [matters, setMatters] = useState(null)
    const [discipline, setDiscipline] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        if (!id) return

        async function fetchMatters() {
            try {
                const res = await fetch(`${CONFIG_BACKEND.API_DIR}/showMyMatters?id=${id}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                
                const text = await res.text()
                if (!text || text.trim() === '') {
                    console.error("El endpoint showMyMatters devolvió una respuesta vacía.")
                    return
                }

                const data = JSON.parse(text)
                if (data.success) {
                    setDiscipline(data.discipline)
                    setMatters(data.result || [])
                } else {
                    console.error('El backend reportó un error: ', data.error)
                }
            } catch (error) {
                console.error('Error de red o parseo: ', error)
            } finally {
                setCargando(false)
            }
        }

        fetchMatters()
    }, [id])

    return ( 
        <>
            <div className={styles.panelCampus}>
                <div className={styles.panelContainer}>
                    <h2 style={{marginTop:'1rem'}}>{cargando ? "Cargando ..." : discipline ? 'Curso: ' + discipline.name_discip: "No se encontró"}</h2>
                        {cargando ? (
                            <p>Cargando curso...</p>
                        ) : matters?.length > 0 ? (
                                matters.map(matter => (
                                <Card 
                                    data={matter.percentage}
                                    key={matter.id_matter}
                                    link={`/campus/${CONFIG_PATHS.CAMPUS_MY_COURSES_PATH}/detalles/${matter.id_matter}`}
                                    className={styles.matterCard}
                                    cardTitle={matter.name_matter}
                                    descriptCard={matter.descript_matter}
                                />
                            ))
                        ) : (
                            <p>No se encontró el curso o no estás inscrito.</p>
                        )}
                </div>
            </div>
        </>
    )
}

export default ContentCourses