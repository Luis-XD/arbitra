import styles from './Table.module.css';

/** Tabla con desplazamiento horizontal propio. `matrix` fija la primera columna. */
export default function Table({ head, children, matrix, compact }) {
  return (
    <div className={styles.wrap}>
      <table className={`${styles.table} ${matrix ? styles.matrix : ''} ${compact ? styles.compact : ''}`}>
        {head && <thead><tr>{head}</tr></thead>}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ num, children, ...rest }) {
  return <th className={num ? styles.num : ''} {...rest}>{children}</th>;
}

export function Td({ num, mono, center, children, className = '', ...rest }) {
  const cls = [num ? styles.num : '', mono ? styles.mono : '', center ? styles.center : '', className].filter(Boolean).join(' ');
  return <td className={cls} {...rest}>{children}</td>;
}

/** Fila; si recibe onClick se puede abrir con clic o con Enter. */
export function Tr({ onClick, muted, children }) {
  const props = onClick ? { onClick, tabIndex: 0, onKeyDown: (e) => { if (e.key === 'Enter') onClick(); } } : {};
  return <tr className={`${onClick ? styles.click : ''} ${muted ? styles.muted : ''}`} {...props}>{children}</tr>;
}

/** Texto secundario debajo del principal en una celda. */
export function Sub({ children, mono }) {
  return <span className={`${styles.sub} ${mono ? styles.mono : ''}`}>{children}</span>;
}

/** Fila que ocupa todo el ancho (estados vacíos). */
export function FullRow({ cols, children }) {
  return <tr><td colSpan={cols}>{children}</td></tr>;
}
