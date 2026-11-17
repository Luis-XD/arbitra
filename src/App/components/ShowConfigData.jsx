import styles from './css/Form.module.css'
import { useState, useEffect, useContext } from 'react'
import LoadData from './LoadData'
import { useNavigate } from 'react-router-dom'
import { CONFIG_PATHS, CONFIG_BACKEND } from '../config/config'
import ShowData from './ShowData'
import pencil from '/iconsArbitra/utilities/pencil.png'
import ContFormInput from './ContFormInput'
import RightTopButton from './RightTopButton'
import TopButtons from './TopButtons'
import { UserContext } from './UserProvider'
import Loader from './Loader'

function ShowConfigData() {
    const [configData, setConfigData]  = useState(null)
    const { user } = useContext(UserContext)
    const [cargando, setLoading] = useState(false)
    const navigate = useNavigate()
    const ROUTE = `${CONFIG_BACKEND.API_DIR}/config/getDataConfig`
    const loadConfigData = LoadData(setLoading, setConfigData, 'GET', ROUTE)

    useEffect(() => {
        loadConfigData()
    }, [])

    let name = ""
    if(configData?.campusStatus === 0){
        name="1. Cerrado total (Nadie se registra e inicia sesión)"
    }else if(configData?.campusStatus === 1){
        name="2. Solo Profesores (Registro y acceso exclusivo para Profesores)"
    }else if(configData?.campusStatus === 2){
        name="3. Abierto Total (Registro y acceso libre para Alumnos y Profesores)"
    }else if(configData?.campusStatus === 3){
        name="4. Clases en curso (Inscripciones cerradas, solo login para ya registrados)"
    }
    useEffect(()=>{
        if(user && user.roleId !== 1){
            navigate(CONFIG_PATHS.HOME_PATH)
        }
    },[])
    
    return ( 
        <>
        {!user ? (
            <Loader />
        ): user.roleId === 1 && (
            <div className={styles.contForm}>
                <form className={styles.form} id='formUpdate'>
                    <TopButtons>
                        <div className={styles.alertContainer} id="alertContainer"></div>
                        <RightTopButton onClick={() => navigate(CONFIG_PATHS.CAMPUS_CONFIG_EDIT_PATH, { state: { configData } })} locationElm={CONFIG_PATHS.CAMPUS_CONFIG_EDIT_PATH} typeElm='expand' text="Editar" imgElm={pencil}/>
                    </TopButtons>
                    <div className={styles.contElmsForm}>
                        <h1>Configuración</h1>
                        <ContFormInput nameElm={"Nombre :"}>
                            <ShowData>{configData?.nameWebConfig}</ShowData>
                        </ContFormInput>
                        
                        <ContFormInput nameElm={"Copyright :"}>
                            <ShowData>{configData?.yearConfig}</ShowData>
                        </ContFormInput>
                        
                        <ContFormInput nameElm="Email :">
                            <ShowData>{configData?.emailConfig}</ShowData>
                        </ContFormInput>
                        
                        <ContFormInput nameElm={"Contenido :"}>
                            <ShowData>{configData?.contentConfig}</ShowData>
                        </ContFormInput>
                        
                        <ContFormInput nameElm={"Estado del Campus: "}>
                            <ShowData>{name}</ShowData>
                        </ContFormInput>
                    </div>
                </form>
            </div>
        )}
        </>
     )
}

export default ShowConfigData