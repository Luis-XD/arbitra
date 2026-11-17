import { useLayoutEffect, useRef } from 'react';
import { ASSETS } from '../../../config/assets';
import { fdate } from '../../../lib/format';
import { qrMatriz } from '../../../lib/qr';
import { CERT_ANCHO, CERT_ALTO, CERT_POS, enMayusculas } from '../../../lib/pdf/certificadoLayout';
import styles from './CertificadoPreview.module.css';

const pos = (P) => ({
  left: `${(P.x / CERT_ANCHO) * 100}%`, top: `${(P.y / CERT_ALTO) * 100}%`,
  fontSize: `${(P.pt * 0.3528 / 297) * 100}cqw`, fontWeight: P.b ? 700 : 500, maxWidth: `${(P.w / CERT_ANCHO) * 100}%`,
});

/** Vista previa del certificado con los mismos textos y posiciones que el PDF. */
export default function CertificadoPreview({ datos }) {
  const ref = useRef(null);
  const D = datos;
  const m = qrMatriz(D.qr);
  const Q = CERT_POS.qr;

  // Achica los textos de una línea que no entran en su espacio, como hace el PDF.
  useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const ajustar = () => root.querySelectorAll('[data-fit]').forEach((el) => {
      el.style.fontSize = el.dataset.fs; const max = (parseFloat(el.dataset.fit) / 100) * root.clientWidth;
      let fs = parseFloat(getComputedStyle(el).fontSize); let n = 0;
      while (el.getBoundingClientRect().width > max && fs > 5 && n++ < 80) { fs -= 0.5; el.style.fontSize = `${fs}px`; }
    });
    ajustar();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
  });

  const fit = (P) => ({ 'data-fit': (P.w / CERT_ANCHO) * 100, 'data-fs': pos(P).fontSize, style: { ...pos(P), maxWidth: 'none' } });

  return (
    <div ref={ref} className={styles.prev} style={{ backgroundImage: `url(${ASSETS.certificadoFondo})` }}>
      <span className={styles.t} {...fit(CERT_POS.nombre)}>{enMayusculas(D, D.nombre)}</span>
      <span className={`${styles.t} ${styles.wrap}`} style={{ ...pos(CERT_POS.texto), width: `${(CERT_POS.texto.w / CERT_ANCHO) * 100}%` }}>{D.texto}</span>
      <span className={styles.t} {...fit(CERT_POS.titulo)}>{enMayusculas(D, D.titulo)}</span>
      <span className={styles.t} style={pos(CERT_POS.fecha)}>Fecha de emisión: {fdate(D.fecha)}</span>
      <span className={styles.t} {...fit(CERT_POS.rol1)}>{D.firma1Rol}</span>
      <span className={styles.t} {...fit(CERT_POS.nom1)}>{D.firma1Nombre}</span>
      <span className={styles.t} {...fit(CERT_POS.rol2)}>{D.firma2Rol}</span>
      <span className={styles.t} {...fit(CERT_POS.nom2)}>{D.firma2Nombre}</span>
      <span className={`${styles.t} ${styles.left}`} style={pos(CERT_POS.numero)}>N° de certificado: {D.numero}{D.provisorio ? ' (se confirma al emitir)' : ''}</span>
      {m && (
        <div className={styles.qr} style={{ left: `${(Q.x / CERT_ANCHO) * 100}%`, top: `${(Q.y / CERT_ALTO) * 100}%`, width: `${(Q.s / CERT_ANCHO) * 100}%`, height: `${(Q.s / CERT_ALTO) * 100}%` }}>
          <svg viewBox={`0 0 ${m.length} ${m.length}`} shapeRendering="crispEdges" aria-label="Código QR">
            {m.flatMap((row, r) => row.map((v, c) => (v ? <rect key={`${r}-${c}`} x={c} y={r} width="1.02" height="1.02" fill="#0c161a" /> : null)))}
          </svg>
        </div>
      )}
    </div>
  );
}
