// Carga diferida de jsPDF y de los archivos que usan los PDF (se cachean).
import { ASSETS } from '../../config/assets';
import { urlToBase64, urlToDataUrl } from '../files';

let cache = null;

export async function recursosPdf() {
  if (!cache) {
    cache = (async () => {
      const mod = await import('jspdf');
      const jsPDF = mod.jsPDF || mod.default;
      const [logoOscuro, fondo, medium, bold] = await Promise.all([
        urlToDataUrl(ASSETS.logoOscuro), urlToDataUrl(ASSETS.certificadoFondo),
        urlToBase64(ASSETS.fuenteMedium), urlToBase64(ASSETS.fuenteBold),
      ]);
      return { jsPDF, logoOscuro, fondo, fuentes: { medium, bold } };
    })().catch((e) => { cache = null; throw e; });
  }
  return cache;
}

/** Registra Montserrat en un documento jsPDF. Devuelve el nombre de la familia a usar. */
export function registrarFuentes(doc, fuentes) {
  try {
    doc.addFileToVFS('Montserrat-Medium.ttf', fuentes.medium);
    doc.addFont('Montserrat-Medium.ttf', 'Montserrat', 'normal');
    doc.addFileToVFS('Montserrat-Bold.ttf', fuentes.bold);
    doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold');
    return 'Montserrat';
  } catch (e) {
    return 'helvetica';
  }
}
