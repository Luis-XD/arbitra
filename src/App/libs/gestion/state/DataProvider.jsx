'use client';
// Datos del centro: carga, guardado optimista, numeración y permisos.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { COLECCIONES } from '../config/constants';
import { CONFIG_INICIAL } from '../config/defaults';
import { fmtNumero } from '../lib/business';
import { uid } from '../lib/format';
import { buildDb, limpiarInscripcion } from './buildDb';
import { useUi } from './UiProvider';

const DataContext = createContext(null);
const vacias = () => Object.fromEntries(COLECCIONES.map((c) => [c, []]));

function mensajeError(e) {
  if (e && (e.status === 401 || e.status === 403)) return 'No tenés permiso para esta acción.';
  if (e && e.status === 413) return 'El archivo o el registro es demasiado grande.';
  return 'No se pudo guardar. Revisá la conexión y probá de nuevo.';
}

/**
 * @param {object} props
 * @param {object} props.adapter  capa de datos (ver data/adapters)
 * @param {{id:string, nombre?:string, rol?:'admin'|'colaborador'|'lector'}} [props.usuario]
 * @param {{id:string, nombre:string}[]} [props.usuarios]  para mostrar quién registró cada cosa
 */
export function DataProvider({ adapter, usuario, usuarios, children }) {
  const { toast } = useUi();
  const [estado, setEstado] = useState({ listo: false, error: null, colecciones: vacias(), config: {}, contadores: {} });
  const ref = useRef(estado);
  ref.current = estado;

  useEffect(() => {
    let vivo = true;
    setEstado((s) => ({ ...s, listo: false, error: null }));
    adapter.cargar().then((d) => {
      if (!vivo) return;
      const colecciones = vacias();
      COLECCIONES.forEach((c) => { if (Array.isArray(d?.colecciones?.[c])) colecciones[c] = d.colecciones[c]; });
      setEstado({ listo: true, error: null, colecciones, config: d?.config || {}, contadores: d?.contadores || {} });
    }).catch((error) => { if (vivo) setEstado((s) => ({ ...s, listo: true, error })); });
    // Cambios en tiempo real que el adaptador quiera empujar (opcional).
    const off = adapter.suscribir ? adapter.suscribir((cambio) => setEstado((s) => {
      if (cambio.coleccion) return { ...s, colecciones: { ...s.colecciones, [cambio.coleccion]: cambio.docs } };
      if (cambio.config) return { ...s, config: cambio.config };
      if (cambio.contadores) return { ...s, contadores: { ...s.contadores, ...cambio.contadores } };
      return s;
    })) : null;
    return () => { vivo = false; if (typeof off === 'function') off(); };
  }, [adapter]);

  const db = useMemo(() => buildDb(estado), [estado]);

  const rol = usuario?.rol || 'admin';
  const me = useMemo(() => ({
    id: usuario?.id || 'local', nombre: usuario?.nombre || '', rol,
    admin: rol === 'admin', puedeEscribir: rol !== 'lector',
  }), [usuario?.id, usuario?.nombre, rol]);

  const nombreUsuario = useCallback((id) => {
    if (!id) return '';
    if (id === me.id && me.nombre) return me.nombre;
    const u = (usuarios || []).find((x) => x.id === id);
    return u ? u.nombre : 'Usuario';
  }, [me.id, me.nombre, usuarios]);

  const exigirEscritura = useCallback(() => {
    if (!me.puedeEscribir) { toast('Tenés acceso de solo lectura.'); throw new Error('solo-lectura'); }
  }, [me.puedeEscribir, toast]);

  const guardar = useCallback(async (col, doc) => {
    exigirEscritura();
    const lista = ref.current.colecciones[col] || [];
    const d = { ...doc };
    if (!d.id) d.id = uid();
    const previo = lista.find((x) => x.id === d.id);
    const ahora = new Date().toISOString();
    if (!previo) { d.creadoPor = d.creadoPor || me.id; d.creadoEn = d.creadoEn || ahora; }
    d.modificadoPor = me.id; d.actualizado = ahora;
    const limpio = col === 'inscripciones' ? limpiarInscripcion(d, previo) : d;
    setEstado((s) => {
      const arr = s.colecciones[col] || [];
      const i = arr.findIndex((x) => x.id === limpio.id);
      const nueva = i >= 0 ? arr.map((x, k) => (k === i ? limpio : x)) : [...arr, limpio];
      return { ...s, colecciones: { ...s.colecciones, [col]: nueva } };
    });
    try {
      await adapter.guardar(col, limpio);
    } catch (e) {
      setEstado((s) => {
        const arr = s.colecciones[col] || [];
        const nueva = previo ? arr.map((x) => (x.id === previo.id ? previo : x)) : arr.filter((x) => x.id !== limpio.id);
        return { ...s, colecciones: { ...s.colecciones, [col]: nueva } };
      });
      toast(mensajeError(e)); throw e;
    }
    return limpio;
  }, [adapter, exigirEscritura, me.id, toast]);

  const eliminar = useCallback(async (col, id) => {
    exigirEscritura();
    const previo = (ref.current.colecciones[col] || []).find((x) => x.id === id);
    setEstado((s) => ({ ...s, colecciones: { ...s.colecciones, [col]: (s.colecciones[col] || []).filter((x) => x.id !== id) } }));
    try { await adapter.eliminar(col, id); } catch (e) {
      if (previo) setEstado((s) => ({ ...s, colecciones: { ...s.colecciones, [col]: [...(s.colecciones[col] || []), previo] } }));
      toast(mensajeError(e)); throw e;
    }
  }, [adapter, exigirEscritura, toast]);

  const guardarConfig = useCallback(async (parcial) => {
    if (!me.admin) { toast('Solo un Editor puede cambiar los ajustes.'); throw new Error('sin-permiso'); }
    const anterior = ref.current.config;
    const nueva = { ...anterior, ...parcial };
    setEstado((s) => ({ ...s, config: nueva }));
    try { await adapter.guardarConfig(nueva); } catch (e) { setEstado((s) => ({ ...s, config: anterior })); toast(mensajeError(e)); throw e; }
  }, [adapter, me.admin, toast]);

  /** Pide al adaptador el próximo número (recibos | certificados) y lo devuelve formateado. */
  const siguienteNumero = useCallback(async (tipo) => {
    exigirEscritura();
    const n = await adapter.siguienteNumero(tipo);
    setEstado((s) => ({ ...s, contadores: { ...s.contadores, [tipo]: n } }));
    return fmtNumero(tipo, n, { ...CONFIG_INICIAL, ...ref.current.config });
  }, [adapter, exigirEscritura]);

  const fijarContador = useCallback(async (tipo, ultimo) => {
    await adapter.fijarContador(tipo, ultimo);
    setEstado((s) => ({ ...s, contadores: { ...s.contadores, [tipo]: ultimo } }));
  }, [adapter]);

  /** Borra todos los registros marcados como ejemplo. Devuelve cuántos borró. */
  const eliminarEjemplos = useCallback(async () => {
    if (!me.admin) { toast('Solo un Editor puede borrar datos.'); throw new Error('sin-permiso'); }
    const items = [];
    COLECCIONES.forEach((c) => (ref.current.colecciones[c] || []).filter((x) => x.ejemplo).forEach((x) => items.push([c, x.id])));
    setEstado((s) => ({ ...s, colecciones: Object.fromEntries(Object.entries(s.colecciones).map(([c, arr]) => [c, arr.filter((x) => !x.ejemplo)])) }));
    if (adapter.eliminarLote) await adapter.eliminarLote(items);
    else for (const [c, id] of items) await adapter.eliminar(c, id); // eslint-disable-line no-await-in-loop
    return items.length;
  }, [adapter, me.admin, toast]);

  /** Guarda muchos registros de una vez (restaurar respaldo). items = [[coleccion, doc], ...] */
  const guardarLote = useCallback(async (items) => {
    if (!me.admin) { toast('Solo un Editor puede restaurar respaldos.'); throw new Error('sin-permiso'); }
    setEstado((s) => {
      const col = { ...s.colecciones };
      items.forEach(([c, doc]) => {
        const arr = col[c] ? [...col[c]] : [];
        const i = arr.findIndex((x) => x.id === doc.id);
        if (i >= 0) arr[i] = doc; else arr.push(doc);
        col[c] = arr;
      });
      return { ...s, colecciones: col };
    });
    if (adapter.guardarLote) await adapter.guardarLote(items);
    else for (const [c, doc] of items) await adapter.guardar(c, doc); // eslint-disable-line no-await-in-loop
  }, [adapter, me.admin, toast]);

  const puedeSubirArchivos = typeof adapter.subirArchivo === 'function';
  /** Sube un comprobante. Devuelve campos para guardar en el movimiento, o {} si no se pudo. */
  const subirComprobante = useCallback(async (file) => {
    if (!file || !puedeSubirArchivos) return {};
    if (file.size > 20 * 1024 * 1024) { toast('El comprobante supera los 20 MB y no se adjuntó.'); return {}; }
    try {
      const r = await adapter.subirArchivo(file);
      return { comprobanteId: r.id, comprobanteUrl: r.url, comprobanteNombre: r.nombre || file.name };
    } catch (e) {
      toast(e && e.message ? e.message : 'No se pudo subir el comprobante; el registro se guarda igual sin adjunto.');
      return {};
    }
  }, [adapter, puedeSubirArchivos, toast]);

  const value = useMemo(() => ({
    listo: estado.listo, error: estado.error, db, me, nombreUsuario,
    guardar, eliminar, guardarConfig, siguienteNumero, fijarContador, subirComprobante, puedeSubirArchivos,
    eliminarEjemplos, guardarLote, descripcionDatos: adapter.descripcion || '',
    reiniciar: adapter.reiniciar ? async () => { const d = await adapter.reiniciar(); setEstado({ listo: true, error: null, colecciones: { ...vacias(), ...d.colecciones }, config: d.config || {}, contadores: d.contadores || {} }); } : null,
  }), [estado.listo, estado.error, db, me, nombreUsuario, guardar, eliminar, guardarConfig, siguienteNumero, fijarContador, subirComprobante, puedeSubirArchivos, eliminarEjemplos, guardarLote, adapter]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <ArbitraGestion>');
  return ctx;
}
