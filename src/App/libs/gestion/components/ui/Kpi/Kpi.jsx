import styles from './Kpi.module.css';

/** Indicador numérico. tono: good | bad | '' */
export default function Kpi({ label, value, sub, tono = '', small }) {
  return (
    <div className={`${styles.kpi} ${tono ? styles[tono] : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${small ? styles.small : ''}`}>{value}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}

export function KpiGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}
