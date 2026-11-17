import styles from './Panel.module.css';

/** Bloque con título, acciones y contenido. `flush` quita el relleno (para tablas y listas). */
export default function Panel({ title, actions, flush, footer, children }) {
  return (
    <section className={styles.panel}>
      {(title || actions) && (
        <div className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={flush ? styles.flush : styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </section>
  );
}

/** Fila de lista dentro de un panel. */
export function PanelItem({ title, sub, aside, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`${styles.item} ${onClick ? styles.clickable : ''}`} onClick={onClick}>
      <span className={styles.itemText}><b>{title}</b>{sub && <span className={styles.itemSub}>{sub}</span>}</span>
      {aside}
    </Tag>
  );
}

export function Columns({ children, ratio = 'wide' }) {
  return <div className={`${styles.columns} ${ratio === 'equal' ? styles.equal : ''}`}>{children}</div>;
}

export function Stack({ children }) {
  return <div className={styles.stack}>{children}</div>;
}
