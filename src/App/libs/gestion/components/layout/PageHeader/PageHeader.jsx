import styles from './PageHeader.module.css';

/** Título de la vista, descripción y acciones principales. */
export default function PageHeader({ title, description, actions }) {
  return (
    <div className={styles.head}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
