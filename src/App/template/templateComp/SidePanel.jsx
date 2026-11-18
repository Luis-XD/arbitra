import styles from './css/SidePanel.module.css'
import arrowLeft from '/iconsArbitra/utilities/arrowLeft.png'
import close from '/iconsArbitra/responsive/close.png'
import GroupPanel from '../../components/GroupPanel'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../../config/config'
import { UserContext } from '../../components/UserProvider'
import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import imgProfessors from '/iconsArbitra/links/professors.png'
import imgCourses from '/iconsArbitra/links/courses.png'
import imgStudents from '/iconsArbitra/links/students.png'
import imgTokens from '/iconsArbitra/links/tokens.png'
import imgManage from '/iconsArbitra/links/manage.png'
import imgDownload from '/iconsArbitra/links/download.png'
import imgSports from '/iconsArbitra/links/sports.png'
import imgAvailableCourses from '/iconsArbitra/links/available_courses.png'
import imgCommissions from '/iconsArbitra/links/commissions.png'
import classBtn from '../../components/css/Button.module.css'

function SidePanel() {
    const [cargando, setCargando] = useState(false)
    const [inscript, setInscript] = useState([])
    const { user } = useContext(UserContext)
    
    // Inicia abierto en desktop (> 1280px) y cerrado en tablets/móviles (<= 1280px)
    const [togglePanel, setTogglePanel] = useState(() => window.innerWidth > 1280)

    function toggleMenuPanel(){
        setTogglePanel(!togglePanel)
    }

    // Retorna la URL del icono utilizando la propiedad 'img_discip' enviada por el backend desde la BD
    const getSportIcon = (imgDiscip) => {
        if (imgDiscip) {
            return `/iconsArbitra/links/sports/${imgDiscip}`
        }
        // Icono por defecto en la carpeta assets si el registro en BD es NULL o vacío
        return '/iconsArbitra/links/sports/default.png'
    }

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
                setInscript([])
            }
        } catch (error) {
            console.log("❌ Error " + error)
            setInscript([])
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        consult()

        const handleInscriptionChange = () => {
            consult()
        }

        window.addEventListener('inscriptionUpdated', handleInscriptionChange)

        return () => {
            window.removeEventListener('inscriptionUpdated', handleInscriptionChange)
        }
    }, [user])

    return ( 
        <>
            <div className={`${styles.sidePanel} ${togglePanel ? styles.panelOpen : styles.panelClosed}`}>
                <div className={styles.buttonPanel} alt='buttonPanel' onClick={toggleMenuPanel}>
                    <img src={togglePanel ? close : arrowLeft} className={styles.imgMenuButtonPanel} alt="Menu Toggle"/>
                </div>
                <h2>Campus</h2>
                {user && (user.roleId === 1) ? (
                    <>
                    <h3>Gestionar:</h3>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_SPORTS_AND_DISCIPLINES_PATH} className={classBtn.button3}>
                            <img src={imgSports} className={styles.imgMobile}/>
                            Deportes y disciplinas
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_COMISSIONS_PATH} className={classBtn.button3}>
                            <img src={imgCommissions} className={styles.imgMobile}/>
                            Comisiones
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_PROFESSORS_PATH} className={classBtn.button3}>
                            <img src={imgProfessors} className={styles.imgMobile}/>
                            Profesores
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_STUDENTS_PATH} className={classBtn.button3}>
                            <img src={imgStudents} className={styles.imgMobile}/>
                            Alumnos
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_MATTERS_PATH} className={classBtn.button3}>
                            <img src={imgCourses} className={styles.imgMobile}/>
                            Materias
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_CAMPUS_PATH} className={classBtn.button3}>
                        <img src={imgTokens} className={styles.imgMobile}/>
                            Asignar tokens
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_DOWNLOAD_FILE_PATH} className={classBtn.button3}>
                        <img src={imgDownload} className={styles.imgMobile}/>
                            Descarga de archivos
                        </Link>
                    </div>
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_MANAGE_GENERAL_PATH} className={classBtn.button3}>
                        <img src={imgManage} className={styles.imgMobile}/>
                            Gestión
                        </Link>
                    </div>
                    </>
                ) : user && (user.roleId === 2) ? (
                    <div className={styles.panelSection}>
                        <Link to={CONFIG_PATHS.CAMPUS_COURSES_LIST_PROFESSOR_PATH} className={classBtn.button3}>
                        <img src={imgAvailableCourses} className={styles.imgMobile}/>
                            Cursos habilitados
                        </Link>
                    </div>
                ):(
                    <GroupPanel titleElm='Cursos inscriptos'>
                        {inscript?.length > 0 ? (
                            <>
                            <Link to={CONFIG_PATHS.CAMPUS_COURSE_INSCRIPTIONS}>
                                <img 
                                    src="/iconsArbitra/links/inscription.png" 
                                    alt="Inscribirme a más cursos" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/icons/default.png`;
                                    }}
                                />&nbsp;
                                Inscribirme a cursos
                            </Link>
                            <Link to={CONFIG_PATHS.CAMPUS_MY_COURSES_PATH}>
                                <img 
                                    src="/iconsArbitra/links/see-courses.png" 
                                    alt="Mis cursos" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/icons/default.png`;
                                    }}
                                />&nbsp;
                                Ver mis cursos
                            </Link>
                            {inscript.map(inscp => (
                                <Link 
                                    key={inscp.id_inscript}
                                    to={`/campus/mis-cursos/${inscp.id_course}`}
                                    title={inscp.title_course}
                                >
                                    <img 
                                        src={getSportIcon(inscp.icon_discip)} 
                                        alt={inscp.name_sport || "Disciplina"} 
                                        style={{ objectFit: 'contain' }} 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/icons/default.png`;
                                        }}
                                    />&nbsp;
                                    {inscp.title_course}
                                </Link>
                            ))}
                            </>
                        ) : (
                            <>
                            <span>Ningún curso inscrito</span>
                            <Link to={CONFIG_PATHS.CAMPUS_COURSE_INSCRIPTIONS}>
                                <img 
                                    src="/iconsArbitra/links/inscription.png" 
                                    alt="Inscribirme a más cursos" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/icons/default.png`;
                                    }}
                                />&nbsp;
                                Inscribirme
                            </Link>
                            </>
                        )}
                    </GroupPanel>
                )}
            </div>
        </>
     )
}

export default SidePanel