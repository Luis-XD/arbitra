import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom"
import styles from './css/ContentCampus.module.css'
import { CONFIG_BACKEND } from '../config/config'

function ContentCampus() {
    const [commissions, setCommissions] = useState([])
    const [disciplines, setDisciplines] = useState([])
    const [cargando, setCargando] = useState(true)

    const fetchCampusData = async (force = false) => {
        // Si ya tenemos datos y no se fuerza, no volvemos a solicitar
        if (commissions.length > 0 && !force) return;

        try {
            if (commissions.length === 0) setCargando(true)

            const [resComms, resDiscs] = await Promise.all([
                fetch(`${CONFIG_BACKEND.API_DIR}/getCommissions`, { credentials: 'include', headers: { 'Accept': 'application/json' } }),
                fetch(`${CONFIG_BACKEND.API_DIR}/getDisciplines`, { credentials: 'include', headers: { 'Accept': 'application/json' } })
            ]);

            const dataComms = await resComms.json()
            const dataDiscs = await resDiscs.json()

            if (dataComms.success) setCommissions(dataComms.result)
            if (dataDiscs.success) setDisciplines(dataDiscs.result)
        } catch (error) {
            console.error("Error al cargar datos del campus:", error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        fetchCampusData()
    }, [])

    return (
        <div className={styles.contentCampusWrapper}>
            {/* Compartimos los datos y funciones a través del Outlet */}
            <Outlet context={{ commissions, disciplines, cargando, refreshCampusData: () => fetchCampusData(true) }} />
        </div>
    )
}

export default ContentCampus