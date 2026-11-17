import styles from './LinkComprobante.module.css';

/** Enlace "Ver comprobante" de un movimiento con archivo adjunto. */
export default function LinkComprobante({ mov }) {
  if (!mov || !mov.comprobanteUrl) return null;
  return <a className={styles.link} href={mov.comprobanteUrl} target="_blank" rel="noopener noreferrer">Ver comprobante</a>;
}
