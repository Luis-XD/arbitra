import styles from './Toolbar.module.css';

/** Fila de filtros, búsqueda y acciones que se acomoda en varias líneas. */
export default function Toolbar({ children, between }) {
  return <div className={`${styles.bar} ${between ? styles.between : ''}`}>{children}</div>;
}
