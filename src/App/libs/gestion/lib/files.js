// Descargas, portapapeles y CSV.

/** Descarga un archivo en el navegador. Devuelve false si no se pudo. */
export function downloadBlob(filename, data, type = 'application/octet-stream') {
  try {
    const blob = data instanceof Blob ? data : new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch (e) {
    return false;
  }
}

/** Copia texto. Resuelve true si funcionó. */
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
}

/** CSV separado por punto y coma, con BOM para que Excel respete los acentos. */
export function toCsv(rows) {
  return `﻿${rows.map((r) => r.map((v) => {
    const s = String(v ?? '');
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(';')).join('\n')}`;
}

export async function urlToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(blob);
  });
}

export async function urlToBase64(url) {
  const dataUrl = await urlToDataUrl(url);
  return String(dataUrl).split(',')[1];
}
