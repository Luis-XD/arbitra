import { MARCAS } from '../../../config/constants';
import styles from './MarcaAsistencia.module.css';

/** Casillero de la planilla: P, A, T, J o sin registrar. */
export default function MarcaAsistencia({ marca }) {
  return <span className={`${styles.mk} ${styles[marca || 'x']}`} title={marca ? MARCAS[marca] : 'Sin registrar'}>{marca || '·'}</span>;
}
