import styles from './Pill.module.css';

/** Etiqueta de estado. tono: ok | warn | bad | info | mark | '' */
export default function Pill({ tono = '', title, children }) {
  return <span className={`${styles.pill} ${tono ? styles[tono] : ''}`} title={title}>{children}</span>;
}
