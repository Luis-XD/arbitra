import { useEffect, useRef } from 'react';
import Button from '../../components/ui/Button/Button';
import Modal from '../../components/ui/Modal/Modal';
import styles from './CopiarModal.module.css';

/** Respaldo cuando el navegador no deja copiar al portapapeles: muestra el texto seleccionado. */
export default function CopiarModal({ texto, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current && ref.current.select(), 60); return () => clearTimeout(t); }, []);
  return (
    <Modal title="Copiar texto" onClose={onClose} footer={<Button variant="primary" onClick={onClose}>Listo</Button>}>
      <p className={styles.ayuda}>El navegador no permitió copiar automáticamente. El texto ya está seleccionado: copialo con Ctrl+C (o mantené presionado en el celular).</p>
      <textarea ref={ref} className={styles.area} readOnly value={texto} aria-label="Texto para copiar" />
    </Modal>
  );
}
