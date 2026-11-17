import styles from './Summary.module.css';

/** Grupo de datos clave-valor. items: { label, value, big?, plain? }[] */
export default function Summary({ items, transparent }) {
  return (
    <div className={`${styles.summary} ${transparent ? styles.transparent : ''}`}>
      {items.filter(Boolean).map((it) => (
        <div key={it.label}>
          <span className={styles.label}>{it.label}</span>
          <b className={`${styles.value} ${it.big ? styles.big : ''} ${it.plain ? styles.plain : ''}`} style={it.color ? { color: it.color } : undefined}>{it.value}</b>
        </div>
      ))}
    </div>
  );
}
