import { useId } from 'react';
import styles from './Field.module.css';

/** Etiqueta + control + ayuda. `full` ocupa las dos columnas del formulario. */
export function Field({ label, hint, error, full, id, children }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ''}`}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

function useFieldId(id) {
  const auto = useId();
  return id || `f${auto.replace(/:/g, '')}`;
}

export function TextInput({ label, hint, full, id, value, onChange, type = 'text', ...rest }) {
  const fid = useFieldId(id);
  return (
    <Field label={label} hint={hint} full={full} id={fid}>
      <input id={fid} className={styles.control} type={type} value={value ?? ''} onChange={(e) => onChange && onChange(e.target.value)} {...rest} />
    </Field>
  );
}

/** options: [valor, etiqueta][] o string[] */
export function SelectInput({ label, hint, full, id, value, onChange, options, ...rest }) {
  const fid = useFieldId(id);
  return (
    <Field label={label} hint={hint} full={full} id={fid}>
      <select id={fid} className={styles.control} value={value ?? ''} onChange={(e) => onChange && onChange(e.target.value)} {...rest}>
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </Field>
  );
}

export function TextArea({ label, hint, full = true, id, value, onChange, rows = 3, ...rest }) {
  const fid = useFieldId(id);
  return (
    <Field label={label} hint={hint} full={full} id={fid}>
      <textarea id={fid} className={`${styles.control} ${styles.textarea}`} rows={rows} value={value ?? ''} onChange={(e) => onChange && onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function Checkbox({ label, checked, onChange, id, ...rest }) {
  const fid = useFieldId(id);
  return (
    <label className={styles.check} htmlFor={fid}>
      <input id={fid} type="checkbox" checked={!!checked} onChange={(e) => onChange && onChange(e.target.checked)} {...rest} />
      {label}
    </label>
  );
}

/** Selector de archivo (comprobantes). Devuelve el File elegido o null. */
export function FileInput({ label, hint, full = true, id, onChange, accept = 'image/*,application/pdf' }) {
  const fid = useFieldId(id);
  return (
    <Field label={label} hint={hint} full={full} id={fid}>
      <input id={fid} className={styles.file} type="file" accept={accept} onChange={(e) => onChange && onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
    </Field>
  );
}

export default Field;
