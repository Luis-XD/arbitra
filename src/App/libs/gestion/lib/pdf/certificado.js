// Certificado de egreso en A4 apaisado sobre el diseño oficial de Arbitra.
import { fdate } from '../format';
import { qrMatriz } from '../qr';
import { CERT_POS, CERT_ANCHO, enMayusculas } from './certificadoLayout';
import { recursosPdf, registrarFuentes } from './recursos';

function pagina(d, D, fam, fondo) {
  const k = 297 / CERT_ANCHO; const mm = (pt) => pt * 0.3528;
  d.addImage(fondo, 'JPEG', 0, 0, 297, 210, 'certbg', 'FAST');
  d.setTextColor(244, 247, 247);
  const linea = (txt, P, align = 'center') => {
    let pt = P.pt; d.setFont(fam, P.b ? 'bold' : 'normal'); d.setFontSize(pt);
    while (d.getTextWidth(txt) > P.w * k && pt > 7) { pt -= 0.5; d.setFontSize(pt); }
    d.text(txt, P.x * k, P.y * k + mm(pt) * 0.36, { align });
  };
  linea(enMayusculas(D, D.nombre), CERT_POS.nombre);
  {
    const P = CERT_POS.texto; let pt = P.pt; let lines;
    d.setFont(fam, 'normal');
    do { d.setFontSize(pt); lines = d.splitTextToSize(D.texto || '', P.w * k); if (lines.length <= 2) break; pt -= 0.5; } while (pt > 9);
    const lh = mm(pt) * 1.16; const y0 = P.y * k - ((lines.length - 1) * lh) / 2 + mm(pt) * 0.36;
    lines.forEach((l, i) => d.text(l, P.x * k, y0 + i * lh, { align: 'center' }));
  }
  linea(enMayusculas(D, D.titulo), CERT_POS.titulo);
  linea(`Fecha de emisión: ${fdate(D.fecha)}`, CERT_POS.fecha);
  linea(D.firma1Rol || '', CERT_POS.rol1); if (D.firma1Nombre) linea(D.firma1Nombre, CERT_POS.nom1);
  linea(D.firma2Rol || '', CERT_POS.rol2); if (D.firma2Nombre) linea(D.firma2Nombre, CERT_POS.nom2);
  linea(`N° de certificado: ${D.numero}`, CERT_POS.numero, 'left');
  const m = qrMatriz(D.qr);
  if (m) {
    const Q = CERT_POS.qr; const n = m.length; const s = (Q.s * k) / n; const x0 = Q.x * k; const y0 = Q.y * k;
    d.setFillColor(12, 22, 26);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m[r][c]) d.rect(x0 + c * s, y0 + r * s, s + 0.03, s + 0.03, 'F');
  }
}

/** Genera un PDF con una página por certificado. `lista` = textos de datosCertificado(). */
export async function pdfCertificados(lista) {
  const { jsPDF, fondo, fuentes } = await recursosPdf();
  const d = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const fam = registrarFuentes(d, fuentes);
  lista.forEach((D, i) => { if (i) d.addPage(); pagina(d, D, fam, fondo); });
  return d.output('blob');
}
