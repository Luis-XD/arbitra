// Matriz de un código QR (texto UTF-8), para dibujarla en SVG o en PDF.
import qrcode from 'qrcode-generator';

if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
}

/** Devuelve una matriz booleana [fila][columna] o null si el texto no entra. */
export function qrMatriz(text) {
  try {
    const q = qrcode(0, 'M');
    q.addData(text || ' ');
    q.make();
    const n = q.getModuleCount();
    const m = [];
    for (let r = 0; r < n; r++) {
      const row = [];
      for (let c = 0; c < n; c++) row.push(q.isDark(r, c));
      m.push(row);
    }
    return m;
  } catch (e) {
    return null;
  }
}
