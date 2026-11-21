import { Link } from "react-router-dom";
import styles from "./css/CourseCard.module.css";

export default function CourseCard({ nameImg="", sport="", title="", descrip="", to }) {
  const imgRoute = "/images/home/"

  return (
    <article className={styles.course}>
      <img
        className={styles.courseImage}
        src={imgRoute+nameImg}
        alt="imagen"
        loading="lazy"
      />
      <div className={styles.courseBody}>
        <span className={styles.courseTag}>{sport}</span>
        <h3>{title}</h3>
        <p>{descrip}</p>
        <div className={styles.courseBottom}>
          <span className={styles.noticeInline}>
            Programa y fechas: consultar
          </span>
          <Link className={styles.textLink} to={to}>
            Consultar ↗
          </Link>
        </div>
      </div>
    </article>
  );
}