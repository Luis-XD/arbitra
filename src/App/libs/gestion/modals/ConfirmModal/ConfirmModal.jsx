import { useState } from 'react';
import Button from '../../components/ui/Button/Button';
import Modal from '../../components/ui/Modal/Modal';
import styles from './ConfirmModal.module.css';

/** Pide confirmación antes de una acción. `mensaje` puede ser texto o JSX. */
export default function ConfirmModal({ mensaje, okLabel = 'Confirmar', onOk, peligro = true, onClose }) {
  const [ocupado, setOcupado] = useState(false);
  const ok = async () => {
    setOcupado(true);
    onClose();
    try { await onOk(); } catch (e) { /* el aviso lo muestra quien hizo la acción */ }
  };
  return (
    <Modal title="Confirmar" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant={peligro ? 'dangerSolid' : 'primary'} disabled={ocupado} onClick={ok}>{okLabel}</Button>
    </>}>
      <p className={styles.texto}>{mensaje}</p>
    </Modal>
  );
}
