import styles from './BarRow.module.css';

/** Barra horizontal con etiqueta y valor. pct de 0 a 100. tono: '' | mark | bad */
export default function BarRow({ label, value, pct, tono = '', compact }) {
  return (
    <div className={`${styles.row} ${compact ? styles.compact : ''}`}>
      {label != null && <span className={styles.label}>{label}</span>}
      <div className={styles.track}><div className={`${styles.fill} ${tono ? styles[tono] : ''}`} style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%` }} /></div>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
