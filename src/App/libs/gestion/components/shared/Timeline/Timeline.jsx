import { fdate } from '../../../lib/format';
import styles from './Timeline.module.css';

/** Historial de contactos, del más nuevo al más viejo. items: { fecha, texto }[] */
export default function Timeline({ items }) {
  return (
    <ol className={styles.list}>
      {[...items].reverse().map((h, i) => (
        <li key={`${h.fecha}-${i}`} className={styles.item}>
          <small className={styles.fecha}>{fdate(h.fecha)}</small>
          <span>{h.texto}</span>
        </li>
      ))}
    </ol>
  );
}
