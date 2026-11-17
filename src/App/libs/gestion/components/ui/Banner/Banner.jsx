import styles from './Banner.module.css';

/** Aviso destacado con una acción opcional a la derecha. */
export default function Banner({ children, action }) {
  return (
    <div className={styles.banner}>
      <span>{children}</span>
      {action}
    </div>
  );
}
