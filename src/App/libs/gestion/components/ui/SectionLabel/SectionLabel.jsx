import styles from './SectionLabel.module.css';

/** Rótulo chico en mayúsculas para separar bloques dentro de una ventana. */
export default function SectionLabel({ children, action }) {
  return (
    <div className={styles.row}>
      <b className={styles.label}>{children}</b>
      {action}
    </div>
  );
}
