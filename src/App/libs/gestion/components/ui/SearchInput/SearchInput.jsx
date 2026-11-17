import styles from './SearchInput.module.css';

export default function SearchInput({ value, onChange, placeholder = 'Buscar', ariaLabel }) {
  return (
    <input type="search" className={styles.search} value={value} placeholder={placeholder} aria-label={ariaLabel || placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

/** Selector compacto para barras de herramientas. options: [valor, etiqueta][] */
export function ToolbarSelect({ value, onChange, options, ariaLabel, wide }) {
  return (
    <select className={`${styles.select} ${wide ? styles.wide : ''}`} value={value} aria-label={ariaLabel} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
