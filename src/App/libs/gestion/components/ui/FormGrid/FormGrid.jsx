import styles from './FormGrid.module.css';

/** Grilla de dos columnas para formularios; pasa a una columna en pantallas angostas. */
/** Con `id` + onSubmit, un botón fuera del formulario (en el pie del modal) puede enviarlo con form={id}. */
export default function FormGrid({ columns = 2, onSubmit, id, children }) {
  const cls = `${styles.grid} ${columns === 1 ? styles.one : ''}`;
  if (onSubmit) {
    return <form id={id} className={cls} noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>{children}</form>;
  }
  return <div className={cls}>{children}</div>;
}

export function FormSection({ title, children }) {
  return (
    <div className={styles.section}>
      <b className={styles.sectionTitle}>{title}</b>
      {children && <div className={styles.sectionText}>{children}</div>}
    </div>
  );
}
