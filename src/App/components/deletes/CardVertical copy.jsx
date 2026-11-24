import { Link } from "react-router-dom";
import styles from "./css/CardVertical.module.css";

const ACCENT_CLASSES = {
  green: styles.accentGreen,
  purple: styles.accentPurple,
  turquoise: styles.accentTurquoise,
  ambar: styles.accentAmbar,
};

export default function CardVertical({
  nameImg = "",
  typeTitle = "",
  title = "",
  descrip = "",
  items = [],
  accent = "",
  sale="",
  to,
}) {
  const imgRoute = "/images/home/";
  const accentClass = ACCENT_CLASSES[accent] || "";

  return (
    <article className={`${styles.course} ${accentClass}`}>
      <img
        className={styles.courseImage}
        src={`${imgRoute}${nameImg}`}
        alt={title || "imagen"}
        loading="lazy"
      />
      <div className={styles.courseBody}>
        <span className={styles.courseTag}>{typeTitle}</span>
        <h3>{title}</h3>
        <p>{descrip}</p>

        {items.length > 0 && (
          <ul className={styles.courseList}>
            {items.map((item, i) => (
              <li key={item.id ?? i}>{item.text}</li>
            ))}
          </ul>
        )}

        <div className={styles.courseBottom}>
          <span className={`${styles.noticeInline} ${accentClass}`}>
            {sale}
          </span>
          <Link className={styles.textLink} to={to}>
            Consultar ↗
          </Link>
        </div>
      </div>
    </article>
  );
}