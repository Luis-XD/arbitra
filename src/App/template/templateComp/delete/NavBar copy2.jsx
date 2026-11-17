import {useState, useContext, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'

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
                console.log(data.result)
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
            // 1. Limpiamos el usuario de forma instantánea en la interfaz
            setUser(null)

            // 2. Destruimos la sesión en el servidor PHP
            await fetch(`${apiUrl}/user/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            // 3. Redirigimos al login sin requerir F5
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
                                        Home
                                    </Link>
                                    <Link to={CONFIG_PATHS.ABOUT_US_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/info24.png' className={styles.imgMobile}/>
                                        Quiénes somos
                                    </Link>
                                    <Link to={CONFIG_PATHS.FORMATION_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/formation.png' className={styles.imgMobile}/>
                                        Formación
                                    </Link>
                                    <Link to={CONFIG_PATHS.SPORTS_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/courses.png' className={styles.imgMobile}/>
                                        Cursos
                                    </Link>
                                    <Link to={CONFIG_PATHS.FAQ_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/faq.png' className={styles.imgMobile}/>
                                        F.A.Q.
                                    </Link>
                                    <Link to={CONFIG_PATHS.LOGIN_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/campus.png' className={styles.imgMobile}/>
                                        Campus
                                    </Link>
                                    </>
                                ):(
                                    <Link to={CONFIG_PATHS.CAMPUS_PATH} onClick={toggleMenuPanel}>
                                        <img src='/iconsArbitra/links/home.png' className={styles.imgMobile}/>
                                        Home
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

                                    {/* 🎓 SECCIÓN PARA ALUMNOS */}
                                    {user.roleId === 3 && (
                                        <div className={styles.adminSectionMobile}>
                                            <span className={styles.adminTitleMobile}>Cursos inscriptos</span>
                                            {inscript?.length > 0 ? (
                                                <>
                                                <Link to={CONFIG_PATHS.CAMPUS_MY_COURSES_PATH}>Mis Cursos</Link>
                                                {inscript.map(inscp => (
                                                        <Link 
                                                            key={inscp.id_inscript}
                                                            to={`/campus/mis-cursos/${inscp.id_course}`}
                                                            title={inscp.title_course}
                                                            onClick={toggleMenuPanel}
                                                        >
                                                            <img 
                                                                src={`/iconsArbitra/links/sport/${inscp.icons_discip}`} 
                                                                alt="Sport Icon" 
                                                                style={{ objectFit: 'contain' }} 
                                                            />&nbsp;
                                                            {inscp.title_course}
                                                        </Link>
                                                ))}
                                                </>
                                            ) : (<span>Ningún curso inscrito</span>)}
                                            <Link to={CONFIG_PATHS.CAMPUS_COURSE_INSCRIPTIONS} onClick={toggleMenuPanel}>
                                                <img src='/iconsArbitra/links/publication.png' className={styles.imgMobile}/>Inscribirme a más cursos
                                            </Link>
                                        </div>
                                    )}

                                    {/* 👨‍🏫 SECCIÓN PARA PROFESORES */}
                                    {user.roleId === 2 && (
                                        <div className={styles.adminSectionMobile}>
                                            <span className={styles.adminTitleMobile}>Docencia</span>
                                            {/* Asegúrate de colocar la ruta exacta configurada en tu router */}
                                            <Link to={CONFIG_PATHS.CAMPUS_COURSES_LIST_PROFESSOR_PATH} onClick={toggleMenuPanel}>
                                                <img src={imgCourses} className={styles.imgMobile}/>
                                                Cursos habilitados
                                            </Link>
                                        </div>
                                    )}

                                    {/* ⚙️ SECCIÓN PARA ADMINISTRADORES */}
                                    {user.roleId === 1 && (
                                        <>
                                            <Link to={CONFIG_PATHS.CAMPUS_CONFIG_PATH} onClick={toggleMenuPanel}>
                                                <img src={imgConfiguration} className={styles.imgMobile}/>
                                                Configuración
                                            </Link>
                                            
                                            <div className={styles.adminSectionMobile}>
                                                <span className={styles.adminTitleMobile}>Administración</span>
                                                
                                                {/* Asegúrate de anteponer /campus/ o usar la ruta correcta */}
                                                <Link to="/campus/gestion-deportes-disciplinas" onClick={toggleMenuPanel}>
                                                    <img src={imgSports} className={styles.imgMobile}/>
                                                    Deportes y disciplinas
                                                </Link>

                                                <Link to="/campus/gestion-comisiones" onClick={toggleMenuPanel}>
                                                    <img src={imgCommissions} className={styles.imgMobile}/>
                                                    Comisiones
                                                </Link>
                                                
                                                <Link to="/campus/gestion-profesores" onClick={toggleMenuPanel}>
                                                    <img src={imgProfessors} className={styles.imgMobile}/>
                                                    Profesores
                                                </Link>
                                                
                                                <Link to="/campus/gestion-alumnos" onClick={toggleMenuPanel}>
                                                    <img src={imgStudents} className={styles.imgMobile}/>
                                                    Alumnos
                                                </Link>

                                                <Link to="/campus/gestion-materias" onClick={toggleMenuPanel}>
                                                    <img src={imgCourses} className={styles.imgMobile}/>
                                                    Materias
                                                </Link>

                                                <Link to="/campus/gestion-campus" onClick={toggleMenuPanel}>
                                                    <img src={imgTokens} className={styles.imgMobile}/>
                                                    Asignar tokens
                                                </Link>

                                                <Link to="/campus/gestion-descargar-archivos" onClick={toggleMenuPanel}>
                                                    <img src={imgTokens} className={styles.imgMobile}/>
                                                    Descarga de archivos
                                                </Link>

                                                <Link to="/campus/gestion-general" onClick={toggleMenuPanel}>
                                                    <img src={imgTokens} className={styles.imgMobile}/>
                                                    Gestión
                                                </Link>

                                            </div>
                                        </>
                                    )}

                                    <Link to={CONFIG_PATHS.CAMPUS_HELP_PATH} onClick={toggleMenuPanel}>
                                        <img src={imgHelp} className={styles.imgMobile}/>
                                        Ayuda
                                    </Link>
                                    
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