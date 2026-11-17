// Posiciones de los textos sobre el diseño del certificado de egreso,
// en píxeles de la imagen original (2000 × 1414). Las usan el PDF y la vista previa.
export const CERT_ANCHO = 2000;
export const CERT_ALTO = 1414;

export const CERT_POS = {
  nombre: { x: 997, y: 625, w: 1320, pt: 30, b: 1 },
  texto: { x: 993, y: 741, w: 1290, pt: 17.5, b: 0 },
  titulo: { x: 997, y: 847, w: 1250, pt: 33, b: 1 },
  fecha: { x: 997, y: 946, w: 560, pt: 15, b: 0 },
  rol1: { x: 705, y: 1177, w: 400, pt: 13, b: 1 },
  nom1: { x: 705, y: 1212, w: 400, pt: 11.5, b: 0 },
  rol2: { x: 1325, y: 1177, w: 400, pt: 13, b: 1 },
  nom2: { x: 1325, y: 1212, w: 400, pt: 11.5, b: 0 },
  numero: { x: 118, y: 1245, w: 520, pt: 12, b: 1 },
  qr: { x: 1676, y: 996, s: 186 },
};

export const enMayusculas = (D, t) => (D.mayus ? String(t || '').toLocaleUpperCase('es-AR') : String(t || ''));
