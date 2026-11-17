import styles from './css/Form.module.css'
import { useState, useEffect } from 'react'
import Button from './Button'
import Loader from './Loader'
import LoadData from './LoadData'
import ContFormInput from './ContFormInput'
import LeftTopButton from './LeftTopButton'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import { UserContext } from './UserProvider'
import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopButtons from './TopButtons'

function FormConfigEdit() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()
    const passedData = location.state?.configData
    const [configData, setConfigData]  = useState(passedData || null)
    const [cargando, setCargando] = useState(false)
    const ROUTE = `${CONFIG_BACKEND.API_DIR}/config/getDataConfig`
    const loadConfigData = LoadData(setCargando, setConfigData, 'GET', ROUTE)
    const [message, setMessage] = useState("")
    
    // Función auxiliar para extraer el objeto de configuración real (maneja si viene envuelto en 'result')
    const parseConfig = (data) => {
        if (!data) return null;
        return data.result ? data.result : data;
    }

    const currentConfig = parseConfig(configData);
    const passedConfig = parseConfig(passedData);

    const initialStatus = passedConfig?.campusStatus !== undefined && passedConfig?.campusStatus !== null 
        ? passedConfig.campusStatus 
        : (currentConfig?.campusStatus !== undefined && currentConfig?.campusStatus !== null 
            ? currentConfig.campusStatus 
            : '0');

    const [form, setForm] = useState({
        nameWebConfig: passedConfig?.nameWebConfig || currentConfig?.nameWebConfig || '',
        yearConfig: passedConfig?.yearConfig || currentConfig?.yearConfig || '',
        emailConfig: passedConfig?.emailConfig || currentConfig?.emailConfig || '',
        contentConfig: passedConfig?.contentConfig || currentConfig?.contentConfig || '',
        campusStatus: String(initialStatus)
    })
    
    useEffect(() => {
        if (!passedData) {
            loadConfigData()
        }
    }, [])

    useEffect(() => {
        if (configData && !passedData) {
            const parsed = parseConfig(configData);
            if (parsed) {
                setForm({
                    nameWebConfig: parsed.nameWebConfig || '',
                    yearConfig: parsed.yearConfig || '',
                    emailConfig: parsed.emailConfig || '',
                    contentConfig: parsed.contentConfig || '',
                    campusStatus: parsed.campusStatus !== undefined && parsed.campusStatus !== null ? String(parsed.campusStatus) : '0'
                })
            }
        }
    }, [configData, passedData])
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setCargando(true)
        const alertContainer = document.getElementById('alertContainer')

        const formData = new FormData()
        if (form.nameWebConfig) formData.append('nameWebConfig', form.nameWebConfig)
        if (form.yearConfig) formData.append('yearConfig', form.yearConfig)
        if (form.emailConfig) formData.append('emailConfig', form.emailConfig)    
        if (form.contentConfig) formData.append('contentConfig', form.contentConfig)
        formData.append('campusStatus', form.campusStatus)

        if (user.roleId === 1) {
            try {
                const response = await fetch(`${CONFIG_BACKEND.API_DIR}/config/updateData`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                })
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()

                if(data.success){
                    alertContainer.classList.add("success")
                    setMessage("✅ ¡"+data.message+"!")
                    
                    if (data.configData) {
                        setConfigData(prev => ({ ...prev, ...data.configData }))
                    }

                    setTimeout(() => {
                        alertContainer.classList.remove("success")
                        setMessage("")
                    }, 3000)
                }else{
                    alertContainer.classList.add("error")
                    setMessage("❌ ¡"+data.error+"!")
                    setTimeout(() => {
                        alertContainer.classList.remove("error")
                        setMessage("")
                    }, 3000)
                }
            } catch (errorCatch) {
                alertContainer.classList.add("error")
                setMessage("❌ ¡Error de conexión!")
                setTimeout(() => {
                    alertContainer.classList.remove("error")
                    setMessage("")
                }, 3000)
            } finally {
                setCargando(false)
            }
        } else {
            navigate(CONFIG_PATHS.HOME_PATH)
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    
    return ( 
        <>
        <div className={styles.contForm}>
            <form className={styles.form} id='formConfigUpdate' onSubmit={handleSubmit}>
                <div className={styles.alertContainer} id="alertContainer">{message}</div>
                <TopButtons>
                    <LeftTopButton text="Configuración" locationElm="/campus/configuracion" typeElm='expand'/>
                </TopButtons>
                <div className={styles.contElmsForm}>
                    <h1>Editar</h1>
                    <ContFormInput nameElm="Nombre:">
                        <input type="text" name="nameWebConfig" value={form.nameWebConfig} placeholder={currentConfig?.nameWebConfig || ''} onChange={handleChange}/>
                    </ContFormInput>
                    
                    <ContFormInput nameElm="Copyright:">
                        <input type="number" name="yearConfig" value={form.yearConfig} placeholder={currentConfig?.yearConfig || ''} min={2025} max={2026} onChange={handleChange}/>
                    </ContFormInput>
                    
                    <ContFormInput nameElm="Email:">
                        <input type="text" name="emailConfig" value={form.emailConfig} placeholder={currentConfig?.emailConfig || ''} onChange={handleChange}/>
                    </ContFormInput>
                    
                    <ContFormInput nameElm="Texto de presentación:">
                        <textarea name="contentConfig" value={form.contentConfig} placeholder={currentConfig?.contentConfig || ''} onChange={handleChange}></textarea>
                    </ContFormInput>

                    {/* Selector unificado para los 4 escenarios del Campus */}
                    <ContFormInput nameElm="Estado del Campus: * El admin siempre tiene acceso">
                        <select name="campusStatus" value={form.campusStatus} onChange={handleChange}>
                            <option value="0">1. Cerrado total (Nadie se registra e inicia sesión)</option>
                            <option value="1">2. Solo Profesores (Registro y acceso exclusivo para Profesores)</option>
                            <option value="2">3. Abierto Total (Registro y acceso libre para Alumnos y Profesores)</option>
                            <option value="3">4. Clases en curso (Inscripciones cerradas, solo login para ya registrados)</option>
                        </select>
                    </ContFormInput>

                    <Button
                        typeBtn="submit"
                        altName="Guardar cambios"
                        title="Guardar cambios"
                        id="guadarCambios"
                        styleBtn={2}
                        disabled={cargando}
                    >
                        {cargando ? <Loader mini={true}/> : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </div>
        </>
     )
}

export default FormConfigEdit