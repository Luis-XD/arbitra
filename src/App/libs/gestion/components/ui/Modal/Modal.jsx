import { useEffect, useId, useRef } from 'react';
import styles from './Modal.module.css';

/** Ventana modal. Se cierra con Esc, con la X o tocando el fondo. */
export default function Modal({ title, wide, onClose, footer, children }) {
  const titleId = `m${useId().replace(/:/g, '')}`;
  const box = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const first = box.current && box.current.querySelector('.' + styles.body + ' input:not([type=hidden]):not([readonly]):not([type=checkbox]), .' + styles.body + ' select, .' + styles.body + ' textarea');
    const t = setTimeout(() => first && first.focus(), 30);
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [onClose]);

  return (
    <div className={styles.scrim} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={box} className={`${styles.modal} ${wide ? styles.wide : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className={styles.head}>
          <h3 id={titleId} className={styles.title}>{title}</h3>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}

/** Empuja el contenido siguiente del pie hacia la derecha (para botones de borrar a la izquierda). */
export function FooterSpacer() {
  return <span className={styles.spacer} />;
}
