import styles from './css/CourseProgressWrapper.module.css';

const CourseProgressWrapper = ({ 
    courses = [], 
    completedCount = 0, 
    userAvatar = '/iconsArbitra/links/campus.png', // Imagen por defecto
    children 
}) => {
    // El 100% se calcula dinámicamente según la cantidad de elementos en la tabla/array
    const totalCourses = courses.length;

    // Cálculo del porcentaje de progreso
    const progressPercentage = totalCourses > 0 
        ? Math.min(Math.round((completedCount / totalCourses) * 100), 100) 
        : 0;

    return (
        <div className={styles.container}>
            {/* Cabecera con la imagen circular y la info de progreso */}
            <div className={styles.progressHeader}>
                <div className={styles.userInfo}>
                    <img 
                        src={userAvatar} 
                        alt="Avatar o icono de usuario" 
                        className={styles.circularImage} 
                    />
                    <span>Progreso de Cursos</span>
                </div>
                <span className={styles.progressText}>
                    {completedCount} de {totalCourses} ({progressPercentage}%)
                </span>
            </div>
            
            {/* Barra de progreso */}
            <div className={styles.progressBarBackground}>
                <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* Contenedor de los hijos (aquí irá tu tabla) */}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default CourseProgressWrapper;