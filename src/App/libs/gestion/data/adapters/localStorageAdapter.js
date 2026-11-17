// Adaptador que guarda todo en el navegador (localStorage). Sirve para probar el
// módulo, para demos y para un uso de una sola computadora. Para producción con
// varios usuarios, usá createRestAdapter o escribí uno propio con la misma interfaz.
import { COLECCIONES } from '../../config/constants';

const vacio = () => ({ colecciones: Object.fromEntries(COLECCIONES.map((c) => [c, []])), config: {}, contadores: {} });
const clonar = (x) => JSON.parse(JSON.stringify(x));

function normalizar(d) {
  const base = vacio();
  COLECCIONES.forEach((c) => { base.colecciones[c] = Array.isArray(d?.colecciones?.[c]) ? d.colecciones[c] : []; });
  base.config = { ...(d?.config || {}) };
  base.contadores = { ...(d?.contadores || {}) };
  return base;
}

/**
 * @param {object} [opciones]
 * @param {string} [opciones.clave='arbitra-gestion'] clave en localStorage
 * @param {object|null} [opciones.datosIniciales] datos para la primera carga (por ejemplo, datosEjemplo)
 * @param {Storage} [opciones.storage] otro almacenamiento compatible (sessionStorage, etc.)
 */
export function createLocalStorageAdapter({ clave = 'arbitra-gestion', datosIniciales = null, storage } = {}) {
  const st = storage || (typeof window !== 'undefined' ? window.localStorage : null);
  let datos = null;

  const persistir = () => { try { st && st.setItem(clave, JSON.stringify(datos)); } catch (e) { /* almacenamiento lleno o bloqueado */ } };
  const asegurar = () => {
    if (datos) return datos;
    let guardado = null;
    try { guardado = st && st.getItem(clave); } catch (e) { guardado = null; }
    datos = guardado ? normalizar(JSON.parse(guardado)) : normalizar(datosIniciales ? clonar(datosIniciales) : vacio());
    if (!guardado) persistir();
    return datos;
  };

  return {
    descripcion: 'Datos solo en este navegador',
    async cargar() { return clonar(asegurar()); },
    async guardar(col, doc) {
      const d = asegurar(); const arr = d.colecciones[col] || (d.colecciones[col] = []);
      const i = arr.findIndex((x) => x.id === doc.id); if (i >= 0) arr[i] = clonar(doc); else arr.push(clonar(doc));
      persistir();
    },
    async eliminar(col, id) {
      const d = asegurar(); d.colecciones[col] = (d.colecciones[col] || []).filter((x) => x.id !== id); persistir();
    },
    async guardarConfig(config) { const d = asegurar(); d.config = clonar(config); persistir(); },
    async siguienteNumero(tipo) { const d = asegurar(); d.contadores[tipo] = (+d.contadores[tipo] || 0) + 1; persistir(); return d.contadores[tipo]; },
    async fijarContador(tipo, ultimo) { const d = asegurar(); d.contadores[tipo] = ultimo; persistir(); },
    /** Archivos adjuntos: en este adaptador se guardan como data URL (máx. 2 MB). */
    async subirArchivo(file) {
      if (file.size > 2 * 1024 * 1024) throw new Error('El archivo supera 2 MB, el máximo de este modo local.');
      const url = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
      return { id: `${Date.now()}`, url, nombre: file.name };
    },
    /** Vuelve a los datos iniciales (o a una base vacía). */
    async reiniciar() { datos = normalizar(datosIniciales ? clonar(datosIniciales) : vacio()); persistir(); return clonar(datos); },
  };
}
