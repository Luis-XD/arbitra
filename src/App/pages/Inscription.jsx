import { useContext, useEffect, useState } from "react"
import Publication from "../components/Publication"
import { UserContext } from "../components/UserProvider"
import { CONFIG_BACKEND } from "../config/config"

function Inscription() {
    const { user, setUser } = useContext(UserContext)
    const apiUrl = CONFIG_BACKEND.API_DIR
    const [campusStatus, setCampusStatus] = useState(null)

     const fetchCampusStatus = async () => {
        try {
            const response = await fetch(`${apiUrl}/config/getDataConfig`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json()
                if (data && data.result !== undefined) {
                    setCampusStatus(String(data.result.campusStatus))
                }
            }
        } catch (error) {
            console.error("Error al consultar el estado del campus:", error)
        }
    }

    useEffect(()=>{
        fetchCampusStatus()
    },[user])

    let value
    if (campusStatus === '0') {
        value = "Por el momento no estan abiertas las inscripciones e inicios de sesión."
    }else if (campusStatus === '1') {
        value = "Solo Profesores (Registro y acceso exclusivo para Profesores)"
    }else if (campusStatus === '2') {
        value = "Abierto Total (Registro y acceso libre para Alumnos y Profesores)"
    }else if (campusStatus === '3') {
        value = "Clases en curso (Inscripciones cerradas, solo login para ya registrados)"
    }

    return ( 
        <Publication title="Formación" nameAsset='banner_inscription.jpg' typeElm='img' description="Información sobre la formación de árbitros y cursos disponibles.">
            <p>{value}</p>
        </Publication>
     )
}

export default Inscription