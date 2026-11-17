import styles from './SegmentedControl.module.css';

/** Grupo de botones excluyentes. options: [valor, etiqueta][] */
export default function SegmentedControl({ options, value, onChange, ariaLabel, compact }) {
  return (
    <div className={`${styles.seg} ${compact ? styles.compact : ''}`} role="group" aria-label={ariaLabel}>
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={value === v} className={value === v ? styles.on : ''} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );
}
