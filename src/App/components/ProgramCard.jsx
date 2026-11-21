import { Link } from "react-router-dom";
import styles from "./css/ProgramCard.module.css";
export default function ProgramCard({ item }) {
  return (
    <article
      className={styles.card}
      style={{ "--photo": `url("${item.image}")` }}
    >
      <div className={styles.content}>
        <h3>{item.name}</h3>
        <p>◷ Duración: {item.duration}</p>
        <p>▥ Nivel: {item.level}</p>
        <Link className={styles.link} to={"/formacion/" + item.slug}>
          Ver programa →
        </Link>
      </div>
    </article>
  );
}
