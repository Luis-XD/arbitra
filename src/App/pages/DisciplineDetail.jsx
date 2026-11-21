import {  useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import LeftTopButton from '../components/LeftTopButton'
import Container from '../components/Container'
import Loader from '../components/Loader'
import TopButtons from '../components/TopButtons'
import PageHero from '../components/PageHero'

function DisciplineDetail() {
    const {id_discipline} = useParams()
    const [discipline, setDiscipline] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    useEffect(()=>{
        if (!id_discipline) return
        loadCourse()
    },[id_discipline])

    const loadCourse = async ()=>{
        try {
            const res = await fetch(`${CONFIG_BACKEND.API_DIR}/discipline/detail?id=${id_discipline}`)
            const data = await res.json()

            if(data.success){
                setDiscipline(data.result)
            }
        }catch (error) {
            setLoading(false)
            setDiscipline(null)
        }finally{
            setLoading(false)
        }
    }

    if(loading) return <Loader />
    if(error) return <p>Error en detalles: {error}</p>

    return (
        <>
        <PageHero title="Formación" image= {`${discipline.img_banner} ? ${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/banners/${discipline.img_banner} : "/assets/course.jpg"}`} />
        <section className="section light">
            <div className="container">
                <TopButtons>
                    <LeftTopButton
                        locationElm={CONFIG_PATHS.COURSES_PATH}
                        typeElm='expand'
                        text="Cursos"
                    />
                </TopButtons>
                    <span style={{height:'2rem'}}></span>
            <div className="sectionTitle">
                <div className="cursoTituloDestacado">
                    <h2>
                        <span className="slash"></span>Nuestras capacitaciones
                    </h2>
                </div>
                <p>
                    Conocé nuestras propuestas de formación arbitral y consultá por
                    los programas disponibles.
                </p>
            </div>
            <Container hiddenStyle={true}>
                <p>{discipline.descript_discip}</p>
            </Container>
                    
            </div>
        </section>
        </>
    )
}

export default DisciplineDetail