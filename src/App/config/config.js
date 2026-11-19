// Configuration file for the application
// This file contains constants that are used throughout the application

export const CONFIG_SOCIAL_NETWORK = {
    IG: 'https://www.instagram.com/arbitracfp/',
    FB: 'https://www.facebook.com/profile.php?id=61595848211808/',
    TK: 'https://www.tiktok.com/',
    EMAIL: 'mailto: info@arbitra.ar'
}

export const CONFIG_BACKEND = {
    SERVER: import.meta.env.VITE_API_BASE_URL,
    LOCAL: "http://localhost/api",
    get API_DIR() {
        return this.LOCAL;
    },
}

export const CONFIG_PATHS = {
    ROOT_PATH: "/",
    HOME_PATH: "/",
    INDEX_PATH: "/index.php",
    SPORTS_PATH: "/deportes",
    ABOUT_US_PATH: "/acerca-de",
    FORMATION_PATH: "/formacion",
    RESOURCES_PATH: "/recursos",
    CONTACT_PATH: "/contacto",
    PRIVACY_PATH: "/politica-de-privacidad",
    TOKEN_EXPIRED_PATH:"/tiempo-expirado",
    CERTIFICATES:"/public/certificados",

    REGISTER_PATH: "/registro",
    LOGIN_PATH: "/login",
    FORGET_PASSW_PATH:"/ForgetPassw",
    RESET_PASSW:"/ResetPassw",
    LOGOUT_PATH: "/logout",
    CONFIG_PASSW_PATH: "/passw",
    INSCRIPTION_PATH:"/inscribirse",

    FAQ_PATH: "/faq",
    SUCCESS_PATH: "/registro-exitoso",
    
    CAMPUS_PATH: "/campus",
    YOUR_WELLCOME_PATH: "bienvenida",
    
    CAMPUS_MANAGE_SPORTS_AND_DISCIPLINES_PATH: "gestion-deportes-disciplinas",
    CAMPUS_MANAGE_COMISSIONS_PATH: "gestion-comisiones",
    CAMPUS_MANAGE_PROFESSORS_PATH: "gestion-profesores",
    CAMPUS_MANAGE_STUDENTS_PATH:"gestion-alumnos",
    CAMPUS_MANAGE_MATTERS_PATH:"gestion-materias",
    CAMPUS_MANAGE_TOKEN_PATH:"gestion-token",
    CAMPUS_MANAGE_PASSWORD_PATH:"gestion-contraseña",
    CAMPUS_MANAGE_DOWNLOAD_FILE_PATH:"gestion-descargar-archivos",
    CAMPUS_MANAGE_GENERAL_PATH:"gestion-general",
    CAMPUS_PROFILE_PATH: "perfil",
    CAMPUS_PROFILE_EDIT_PATH: "editar-perfil",
    CAMPUS_CONFIG_PATH: "/campus/configuracion",
    CAMPUS_CONFIG_EDIT_PATH: "/campus/configuracion/editar-configuracion",
    CAMPUS_HELP_PATH: "ayuda",
    
    CAMPUS_CONFIG_PASSW:"gestion-contraseña",

    CAMPUS_COURSES_LIST_PROFESSOR_PATH: "profesor-cursos",
    
    CAMPUS_MY_COURSES_PATH: "mis-cursos",
    CAMPUS_MY_COURSES_DETAIL_PATH: "mis-cursos/detalles",
    CAMPUS_COURSE_INSCRIPTIONS: "inscribirme-a-cursos",
}