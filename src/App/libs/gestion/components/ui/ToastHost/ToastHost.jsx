import { useUi } from '../../../state/UiProvider';
import styles from './ToastHost.module.css';

/** Muestra el último aviso. */
export default function ToastHost() {
  const { aviso } = useUi();
  if (!aviso) return null;
  return <div key={aviso.key} className={styles.toast} role="status">{aviso.mensaje}</div>;
}
