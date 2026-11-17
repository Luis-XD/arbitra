import styles from './EmptyState.module.css';

export default function EmptyState({ title, children, action }) {
  return (
    <div className={styles.empty}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children && <p className={styles.text}>{children}</p>}
      {action}
    </div>
  );
}
