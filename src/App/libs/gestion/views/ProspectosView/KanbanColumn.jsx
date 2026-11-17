import { useState } from 'react';
import styles from './KanbanColumn.module.css';

/** Columna del embudo que acepta tarjetas arrastradas. */
export default function KanbanColumn({ titulo, cantidad, onDrop, children }) {
  const [sobre, setSobre] = useState(false);
  return (
    <div
      className={`${styles.col} ${sobre ? styles.drop : ''}`}
      onDragOver={(e) => { e.preventDefault(); setSobre(true); }}
      onDragLeave={() => setSobre(false)}
      onDrop={(e) => { e.preventDefault(); setSobre(false); const id = e.dataTransfer.getData('text/plain'); if (id) onDrop(id); }}
    >
      <div className={styles.head}><span>{titulo}</span><span className={styles.n}>{cantidad}</span></div>
      {children}
      {!cantidad && <div className={styles.vacia}>Sin prospectos</div>}
    </div>
  );
}
