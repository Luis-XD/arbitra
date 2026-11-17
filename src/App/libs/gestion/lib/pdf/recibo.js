// Recibo de pago en A5, con el detalle de una o varias cuotas.
import { dniFmt, fdate, fullName, money } from '../format';
import { recursosPdf } from './recursos';

/**
 * @param {object} R  resultado de reciboData()
 * @param {object} config  configuración del centro
 * @param {(id:string)=>string} nombreUsuario
 * @returns {Promise<Blob>}
 */
export async function pdfRecibo(R, config, nombreUsuario) {
  const { jsPDF, logoOscuro } = await recursosPdf();
  const d = new jsPDF({ unit: 'mm', format: 'a5' });
  const W = 148; const a = R.alumno;
  d.addImage(logoOscuro, 'PNG', 12, 11, 17, 17);
  d.setTextColor(24, 30, 30); d.setFont('helvetica', 'bold'); d.setFontSize(12);
  d.text(d.splitTextToSize(config.institucion || '', 72), 33, 17);
  d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(95, 104, 102);
  d.text([config.cuit ? `CUIT ${config.cuit}` : '', config.direccion || '', [config.telefono, config.email].filter(Boolean).join(' · ')].filter(Boolean), 33, 26);
  d.setTextColor(24, 30, 30); d.setFont('helvetica', 'bold'); d.setFontSize(13); d.text('RECIBO', W - 12, 16, { align: 'right' });
  d.setFont('helvetica', 'normal'); d.setFontSize(9);
  d.text(`N° ${R.numero}`, W - 12, 22, { align: 'right' }); d.text(fdate(R.fecha), W - 12, 27, { align: 'right' });
  d.setDrawColor(200, 206, 204); d.setLineWidth(0.3); d.line(12, 36, W - 12, 36);

  let y = 46;
  const fila = (lbl, val, bold) => {
    d.setFont('helvetica', 'normal'); d.setFontSize(8); d.setTextColor(95, 104, 102); d.text(lbl.toUpperCase(), 12, y);
    d.setFont('helvetica', bold ? 'bold' : 'normal'); d.setFontSize(10.5); d.setTextColor(24, 30, 30);
    const lines = d.splitTextToSize(String(val || '—'), W - 60); d.text(lines, 48, y); y += Math.max(7, lines.length * 5 + 2);
  };
  fila('Recibimos de', fullName(a), true);
  fila('DNI', dniFmt(a && a.dni));
  fila('Medio de pago', R.medio + (R.referencia ? ` · Ref. ${R.referencia}` : ''));

  y += 1; d.setFont('helvetica', 'normal'); d.setFontSize(8); d.setTextColor(95, 104, 102);
  d.text('CONCEPTO', 12, y); d.text('IMPORTE', W - 12, y, { align: 'right' }); y += 2; d.line(12, y, W - 12, y); y += 5;
  d.setTextColor(24, 30, 30);
  R.lines.forEach((l) => {
    d.setFont('helvetica', 'normal'); d.setFontSize(9.5);
    const t = d.splitTextToSize(`${l.concepto} · ${l.curso}`, W - 60);
    d.text(t, 12, y); d.text(money(l.importe), W - 12, y, { align: 'right' }); y += t.length * 4.6;
    if (l.recargo) {
      d.setFontSize(8.5); d.setTextColor(95, 104, 102); d.text('Recargo por mora', 16, y); d.text(money(l.recargo), W - 12, y, { align: 'right' });
      d.setTextColor(24, 30, 30); y += 4.6;
    }
    y += 1.5;
  });
  y += 1; d.setFillColor(241, 244, 243); d.roundedRect(12, y, W - 24, 14, 2, 2, 'F');
  d.setFont('helvetica', 'bold'); d.setFontSize(13); d.text('TOTAL', 17, y + 9); d.text(money(R.importe + R.recargo), W - 17, y + 9, { align: 'right' });
  y += 24;
  d.setFont('helvetica', 'normal'); d.setFontSize(9); d.setTextColor(60, 68, 66);
  d.text(`Saldo pendiente de ${R.lines.length > 1 ? 'estas cuotas' : 'la cuota'}: ${money(R.saldo)}`, 12, y);
  if (R.por) { y += 5.5; d.text(`Registrado por: ${nombreUsuario(R.por)}`, 12, y); }
  d.setFontSize(7.5); d.setTextColor(120, 128, 126);
  d.text('Comprobante interno de pago, no válido como factura.', W / 2, 196, { align: 'center' });
  d.text('Emitido con Arbitra Gestión', W / 2, 200.5, { align: 'center' });
  return d.output('blob');
}

export function textoRecibo(R, config, nombreUsuario) {
  const a = R.alumno;
  const det = R.lines.map((l) => `- ${l.curso} · ${l.concepto}: ${money(l.importe)}${l.recargo ? ` + recargo ${money(l.recargo)}` : ''}`).join('\n');
  return `${config.institucion}${config.cuit ? `\nCUIT ${config.cuit}` : ''}${config.direccion ? `\n${config.direccion}` : ''}\n\nRECIBO ${R.numero}\nFecha: ${fdate(R.fecha)}\n\nRecibimos de: ${fullName(a)} (DNI ${a ? a.dni : ''})\n${det}\nTOTAL: ${money(R.importe + R.recargo)}\nMedio de pago: ${R.medio}${R.referencia ? ` · Ref. ${R.referencia}` : ''}${R.por ? `\nRegistrado por: ${nombreUsuario(R.por)}` : ''}\n\nSaldo pendiente de ${R.lines.length > 1 ? 'estas cuotas' : 'la cuota'}: ${money(R.saldo)}\n\nComprobante interno no válido como factura.`;
}
