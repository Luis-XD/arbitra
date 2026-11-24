import { Link } from "react-router-dom";
import styles from "./css/CardVertical.module.css";

const ACCENT_CLASSES = {
  green: styles.accentGreen,
  purple: styles.accentPurple,
  turquoise: styles.accentTurquoise,
  ambar: styles.accentAmbar,
};

const BENEFIT_ICONS = ["▤", "◇", "⬡", "▣", "♧", "★", "♙", "✓"];

export default function CardVertical({
  nameImg = "",
  typeTitle = "Modalidad",
  title = "",
  descrip = "",
  items = [],
  accent = "green",
  sale = "",
  to = "/contacto",
}) {
  const accentClass = ACCENT_CLASSES[accent] || styles.accentGreen;
  const imageSrc = nameImg ? `/images/home/${nameImg.replace(/^\/+/, "")}` : null;
  return (
    <article className={`${styles.course} ${accentClass}`}>
      {imageSrc && (
        <div className={styles.imageWrap}>
          <img className={styles.courseImage} src={imageSrc} alt={`Modalidad ${title}`} loading="lazy" />
          <span className={styles.imageSlash} aria-hidden="true" />
        </div>
      )}
      <div className={styles.courseBody}>
        <div className={styles.contHeading}>
          <div className={styles.heading}>
            <span className={styles.modeSymbol} aria-hidden="true">{accent === "purple" ? "◷" : accent === "turquoise" ? "▣" : accent === "ambar" ? "♧" : "▤"}</span>
            <div>
              <span className={styles.courseTag}>{typeTitle}</span>
              <h3 className={styles.courseTitle}>{title}</h3>
            </div>
          </div>
          {descrip && <p className={styles.description}>{descrip.replace(/\s*Inversión:\s*\$[\d.,]+\.?\s*$/i, "").trim()}</p>}
        </div>
        {items.length > 0 && (
          <ul className={styles.courseList}>
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <span className={styles.benefitIcon} aria-hidden="true">{BENEFIT_ICONS[i % BENEFIT_ICONS.length]}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.courseBottom}>
          <strong className={styles.noticeInline}>{sale}</strong>
          <Link className={styles.textLink} to={to} aria-label={`Consultar por la modalidad ${title}`}>
            Consultar <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
