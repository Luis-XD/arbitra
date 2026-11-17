import styles from './ExampleTag.module.css';

/** Marca "Ejemplo" junto a los registros de muestra. */
export default function ExampleTag({ item }) {
  if (!item || !item.ejemplo) return null;
  return <span className={styles.tag}>Ejemplo</span>;
}
