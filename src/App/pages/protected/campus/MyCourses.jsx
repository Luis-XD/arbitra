import { useEffect, useState,useContext } from "react"
import { CONFIG_BACKEND } from "../../../config/config"
import { UserContext } from '../../../components/UserProvider'
import Card from '../../../components/Card'
import TopButtons from "../../../components/TopButtons"
import LeftTopButton from "../../../components/LeftTopButton"
import { useNavigate } from "react-router-dom"

function MyCourses() {
    const [cargando, setCargando] = useState(false)
    const [inscript, setInscript] = useState([])
    const { user } = useContext(UserContext)
    const navigate = useNavigate();

    const consult = async () => {
        if (!user) {
            setInscript([])
            setCargando(false)
            return
        }

        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/inscriptions`, {
                method: 'POST',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            if (data && data.success) {
                setInscript(data.result)
            } else {
                navigate('/campus', { replace: true });
                setInscript([])
            }
        } catch (error) {
            setInscript([])
        } finally {
            setCargando(false)
        }
    }

    useEffect(()=>{
        consult()
    },[])

    return (
            <>
            <TopButtons>
                {user && (
                    <LeftTopButton 
                        locationElm={'/campus'} 
                        text="Inicio" 
                        typeElm="expand" />
                )}
            </TopButtons>
            
            <h2 style={{marginTop:'1rem', color:'white'}}>Estás inscrito en:</h2>
                {inscript?.length > 0 ? (
                    inscript.map(inscp => (
                        <Card 
                            key={inscp.id_inscript}
                            cardTitle={inscp.title_course}
                            link={`/campus/mis-cursos/${inscp.id_course}`}
                            ubication="disciplines/cards"
                            imgCard={inscp.img_discip}
                        />
                    ))
                ) : (<span style={{margin:'2rem 0'}}>Ningún curso inscrito</span>)}
            </>
    )
}

export default MyCourses