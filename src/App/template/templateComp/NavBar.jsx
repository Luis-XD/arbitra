import {useState, useContext, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'

import styles from "./css/NavBar.module.css"
import isotipo from "/logo.png"
import Button from '../../components/Button'
import ImgProfile from '../../components/ImgProfile'
import menu from '/iconsArbitra/responsive/menu.png'
import imgSports from '/iconsArbitra/links/sports.png'
import imgCommissions from '/iconsArbitra/links/commissions.png'
import imgProfessors from '/iconsArbitra/links/professors.png'
import imgStudents from '/iconsArbitra/links/students.png'
import imgCourses from '/iconsArbitra/links/courses.png'
import imgTokens from '/iconsArbitra/links/tokens.png'
import close from '/iconsArbitra/responsive/close.png'
import imgManage from '/iconsArbitra/links/manage.png'
import imgDownload from '/iconsArbitra/links/download.png'
import arrowBottom from "/iconsArbitra/utilities/arrowBottom.png"
import imgHome from '/iconsArbitra/links/home.png'
import imgConfiguration from '/iconsArbitra/links/configuration.png'
 
import imgHelp from '/iconsArbitra/links/help.png'
import { UserContext } from '../../components/UserProvider'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../../config/config'

function NavBar() {
    const { user, setUser } = useContext(UserContext)
    const [menuProfileOpen, setMenuProfileOpen] = useState(false)
    const [togglePanel, setTogglePanel] = useState(false)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()
    const apiUrl = CONFIG_BACKEND.API_DIR
    const [visible, setVisible] = useState(false)
    const [inscript, setInscript] = useState([])
    const location = useLocation()
    
    // NUEVO: Estado para almacenar el valor de campus_status obtenido del backend
    const [campusStatus, setCampusStatus] = useState(null)

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

    // NUEVO: Función para consultar el estado actual del campus
    const fetchCampusStatus = async () => {
        try {
            const response = await fetch(`${apiUrl}/config/getDataConfig`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.result !== undefined) {
                    setCampusStatus(String(data.result.campusStatus));
                }
            }
        } catch (error) {
            console.error("Error al consultar el estado del campus:", error);
        }
    }

    const getSportIcon = (imgDiscip) => {
        if (imgDiscip) {
            return `/iconsArbitra/links/sports/${imgDiscip}`
        }
        // Icono por defecto en la carpeta assets si el registro en BD es NULL o vacío
        return `/iconsArbitra/links/sports/default.png`
    }

    useEffect(() => {
        consult()
        fetchCampusStatus() // Consulta inicial al cargar el componente

        const handleInscriptionChange = () => { consult() }
        window.addEventListener('inscriptionUpdated', handleInscriptionChange)

        return () => {
            window.removeEventListener('inscriptionUpdated', handleInscriptionChange)
        };
    }, [user]) // 3. Quitamos campusStatus de aquí para evitar bucles

    // 4. Agregamos un useEffect separado que se ejecute cada vez que cambie la ruta (pathname)
    useEffect(() => {
        fetchCampusStatus()
    }, [location.pathname])


    function toggleMenuProfile() {
        setMenuProfileOpen(!menuProfileOpen)
    }
    
    function toggleMenuPanel(){
        setTogglePanel(!togglePanel)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setCargando(true)

        try {
            setUser(null)

            await fetch(`${apiUrl}/user/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            navigate('/login', { replace: true })

        } catch (error) {
            if (import.meta.env.DEV) { 
                console.error('Error al cerrar sesión:', error); 
            }
            navigate('/login', { replace: true })
        } finally {
            setCargando(false)
        }
    }

    useEffect(()=>{
        const handleScroll = ()=>{
            setVisible(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        
        return ()=> window.removeEventListener('scroll', handleScroll)
    },[])

    return ( 
        <>
            <div className={`${styles.navbar} ${styles.navVisible}`} id='navbar'>
                <div className={styles.contMobile}>
                    <Link to={user ? '/campus' : '/'} className={styles.navbarLogoLinkMobile}>
                        <div className={styles.navbarLogo}>
                            <img src={isotipo} alt="Logo" className={styles.logoImage} />
                        </div>
                    </Link>
                    <p>ARBITRA</p>
                    <div className={styles.buttonPanel} alt='buttonPanel' onClick={toggleMenuPanel}>
                        <img src={togglePanel ? close : menu} className={styles.imgMenuButtonPanel} alt="Menu Toggle"/>
                    </div>
                </div>
                <div className={`${styles.contNavbarContent} ${styles.contNavbarContentVisible} ${togglePanel && styles.panelOpen}`} id="contNavbarContent">
                    <nav className={styles.navbarContent} id="navbarContent">
                        <div className={styles.navbarLinks} id='navbarLinks' >
                            {user && (
                                <Link to={CONFIG_PATHS.CAMPUS_PROFILE_PATH} className={styles.linkCont}>
                                    <div className={styles.imgProfilePanel}>
                                        <ImgProfile/>
                                        <p>{user.names}</p>
                                    </div>
                                </Link>
                            )}
                            <Link to={user ? '/campus' : '/'} className={styles.navbarLogoLink}>
                                <div className={styles.navbarLogo}>
                                    <img src={isotipo} alt="Logo" className={`${styles.logoImage} ${styles.imgInvert}`} />
                                </div>
                                <p>ARBITRA</p>
                            </Link>
                            <div className={styles.navbarLinksGroup}>
                                {!user ?(
                                    <>
                                    <Link to={CONFIG_PATHS.HOME_PATH} className={styles.linkHome} onClick={toggleMenuPanel}>
                                        <img src={imgHome} className={styles.imgMobile}/>
                                        Inicio
                                    </Link>
                                    <Link to={CONFIG_PATHS.WHO_WE_ARE_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/info24.png' className={styles.imgMobile}/>
                                        Quiénes somos
                                    </Link>
                                    <Link to={CONFIG_PATHS.FORMATION_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/formation.png' className={styles.imgMobile}/>
                                        Formación
                                    </Link>
                                    <Link to={CONFIG_PATHS.COURSES_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/courses.png' className={styles.imgMobile}/>
                                        Cursos
                                    </Link>
                                    <Link to={CONFIG_PATHS.FAQ_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/faq.png' className={styles.imgMobile}/>
                                        F.A.Q.
                                    </Link>

                                    {/* CONDICIONAL: Mostrar el botón Campus solo si el campus está Abierto Total (estado '2') */}
                                    {campusStatus === '0' ? (
                                        <Link to={CONFIG_PATHS.INSCRIPTION_PATH} onClick={toggleMenuPanel} className={styles.inscription}>
                                            <img src='/iconsArbitra/links/campus.png' className={styles.imgMobile}/>
                                            <p>
                                                Incribite ahora
                                                <img src='/iconsArbitra/links/forward.png'/>
                                            </p>
                                        </Link>
                                    ): campusStatus === '1' || campusStatus === '2' ? (
                                        <Link to={CONFIG_PATHS.REGISTER_PATH} onClick={toggleMenuPanel} className={styles.inscription}>
                                            <img src='/iconsArbitra/links/campus.png' className={styles.imgMobile}/>
                                            <p>
                                                Incribite ahora
                                                <img src='/iconsArbitra/links/forward.png'/>
                                            </p>
                                        </Link>
                                    ) : (
                                        <Link to={CONFIG_PATHS.CAMPUS_PATH} onClick={toggleMenuPanel}>
                                            <img src='/iconsArbitra/links/campus.png' className={styles.imgMobile}/>
                                            Campus
                                        </Link>
                                    )}
                                    </>
                                ):(
                                    <Link to={CONFIG_PATHS.CAMPUS_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/home.png' className={styles.imgMobile}/>
                                        Inicio
                                    </Link>
                                )}
                            </div>
                            
                            <div className={styles.elmPanel}>
                                {user && (
                                <>
                                    <Link to="/campus/perfil" onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/profile_men.png' className={styles.imgMobile}/>
                                        Perfil
                                    </Link>

                                    <Link to={CONFIG_PATHS.CAMPUS_HELP_PATH} onClick={toggleMenuPanel}>
                                        <img src={imgHelp} className={styles.imgMobile}/>
                                        Ayuda
                                    </Link>
                                    <Link to={CONFIG_PATHS.CAMPUS_CONFIG_PATH} onClick={toggleMenuPanel}>
                                        <img src={imgConfiguration} className={styles.imgMobile}/>
                                        Configuración
                                    </Link>

                                    {/* 🎓 SECCIÓN PARA ALUMNOS */}
                                    {user.roleId === 3 && (
                                        <div className={styles.adminSectionMobile}>
                                            <Link to={CONFIG_PATHS.CAMPUS_COURSE_INSCRIPTIONS} onClick={toggleMenuPanel}>
                                                <img src='/iconsArbitra/links/inscription.png' className={styles.imgMobile}/>Inscribirme a más cursos
                                            </Link>
                                            <Link to={CONFIG_PATHS.CAMPUS_MY_COURSES_PATH} onClick={toggleMenuPanel}>
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
                                            <span className={styles.adminTitleMobile}>Cursos inscriptos</span>
                                            {inscript?.length > 0 ? (
                                                <>
                                                {inscript.map(inscp => (
                                                        <Link 
                                                            key={inscp.id_inscript}
                                                            to={`/campus/mis-cursos/${inscp.id_course}`}
                                                            title={inscp.title_course}
                                                            onClick={toggleMenuPanel}
                                                        >
                                                            <img 
                                                                src={getSportIcon(inscp.icon_discip)} 
                                                                alt="Sport Icon" 
                                                                style={{ objectFit: 'contain' }} 
                                                            />&nbsp;
                                                            {inscp.title_course}
                                                        </Link>
                                                ))}
                                                </>
                                            ) : (<span>Ningún curso inscrito</span>)}
                                        </div>
                                    )}

                                    {/* 👨‍🏫 SECCIÓN PARA PROFESORES */}
                                    {user.roleId === 2 && (
                                        <div className={styles.adminSectionMobile}>
                                            <span className={styles.adminTitleMobile}>Docencia</span>
                                            <Link to={CONFIG_PATHS.CAMPUS_COURSES_LIST_PROFESSOR_PATH} onClick={toggleMenuPanel}>
                                                <img src={imgCourses} className={styles.imgMobile}/>
                                                Cursos habilitados
                                            </Link>
                                        </div>
                                    )}

                                    {/* ⚙️ SECCIÓN PARA ADMINISTRADORES */}
                                    {user.roleId === 1 && (
                                        <>                                           
                                            <div className={styles.adminSectionMobile}>
                                                <span className={styles.adminTitleMobile}>Administración</span>
                                                
                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_SPORTS_AND_DISCIPLINES_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgSports} className={styles.imgMobile}/>
                                                    Crear deportes y disciplinas
                                                </Link>

                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_COMISSIONS_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgCommissions} className={styles.imgMobile}/>
                                                    Comisiones
                                                </Link>
                                                
                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_PROFESSORS_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgProfessors} className={styles.imgMobile}/>
                                                    Profesores
                                                </Link>
                                                
                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_STUDENTS_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgStudents} className={styles.imgMobile}/>
                                                    Alumnos
                                                </Link>

                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_MATTERS_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgCourses} className={styles.imgMobile}/>
                                                    Materias
                                                </Link>

                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_TOKEN_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgTokens} className={styles.imgMobile}/>
                                                    Asignar tokens
                                                </Link>

                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_DOWNLOAD_FILE_PATH}`}  onClick={toggleMenuPanel}>
                                                    <img src={imgDownload} className={styles.imgMobile}/>
                                                    Descarga de archivos
                                                </Link>

                                                <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_MANAGE_GENERAL_PATH}`} onClick={toggleMenuPanel}>
                                                    <img src={imgManage} className={styles.imgMobile}/>
                                                    Gestión
                                                </Link>

                                            </div>
                                        </>
                                    )}
                                    
                                    <form onSubmit={handleSubmit}>
                                        <Button
                                            typeBtn="submit"
                                            altNameBtn="logout"
                                            titleBtn="Cerrar Sesión"
                                            disabled={cargando}
                                            styleBtn={2}
                                        >Cerrar sesión</Button>
                                    </form>
                                </>
                                )}
                            </div>
                        </div>
                        {/* 🖥️ Menú desplegable flotante original de Escritorio */}
                        {user && (
                            <menu className={`${styles.menuProfile} ${menuProfileOpen ? styles.menuProfileActive : ''}`} id="menuProfile">
                                <div className={`${styles.menuButton} ${styles.menuProfileButton}`} id="menuProfileButton" onClick={() => toggleMenuProfile()}>
                                    <div className={`${styles.contWellcome} ${menuProfileOpen ? styles.wellcomeActive : ''}`} id="contWellcome">
                                        <div className={styles.contContImgProfile} id="contContImgProfile">
                                            <ImgProfile id="imgProfile"/>
                                        </div>
                                        <p className={`${styles.wellcomeName} ${menuProfileOpen ? styles.nameVisible : ''}`} id="wellcomeName">
                                            Hola <br />
                                            {user.names ? user.names.split(' ')[0] : ''}
                                        </p>
                                    </div>
                                    <img src={arrowBottom} alt="arrowMenu" id="imgMenu" className={`${styles.menuIcon} ${styles.menuIconProfile} ${menuProfileOpen ? styles.rotateArrow : ''}`}/>
                                </div>
                                <ul className={`${styles.menu} ${styles.ulMenuProfile} ${menuProfileOpen ? styles.menuOpen : ''}`} id="ulMenuProfile">
                                    <li>
                                        <Link to="/campus/perfil">Perfil</Link>
                                    </li>
                                    <li>
                                        <Link to="/campus/perfil/editar-perfil">Editar perfil</Link>
                                    </li>
                                    {(user.roleId === 1) && (
                                        <li>
                                            <Link to="/campus/configuracion">Configuración</Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link to="/campus/ayuda">Ayuda</Link>
                                    </li>
                                    <form onSubmit={handleSubmit}>
                                        <Button
                                            typeBtn="submit"
                                            altNameBtn="logout"
                                            styleBtn={1}
                                            titleBtn="Cerrar Sesión"
                                            disabled={cargando}
                                        >Cerrar sesión</Button>
                                    </form>
                                </ul>
                            </menu>
                        )}
                    </nav>
                </div>
            </div>
        </>
     )
}

export default NavBar