import { Link } from "react-router-dom";
import styles from "./css/CourseCard.module.css";

export default function CourseCard({ nameImg = "", sport = "", title = "", descrip = "", to = "/contacto" }) {
  const imageSrc = `/images/home/${nameImg}`;

  return (
    <article className={styles.course}>
      {nameImg && <img className={styles.courseImage} src={imageSrc} alt={title || sport || "Formación arbitral"} loading="lazy" />}
      <div className={styles.courseOverlay} aria-hidden="true" />
      <div className={styles.courseBody}>
        <div className={styles.courseContent}>
          {sport && <span className={styles.courseTag}>{sport}</span>}
          <h3 className={styles.courseTitle}>{title}</h3>
          {descrip && <p className={styles.courseDescription}>{descrip}</p>}
        </div>
        <div className={styles.courseBottom}>
          <span className={styles.noticeInline}>Programa y fechas: consultar</span>
          <Link className={styles.textLink} to={to} aria-label={`Consultar sobre ${title || sport}`}>
            Consultar <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
