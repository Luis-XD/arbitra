// Arma el snapshot de lectura `db` a partir del estado guardado.
// Los pagos de cada cuota no se guardan en la inscripción: se calculan desde
// los movimientos de Caja. Así dos cobros simultáneos nunca se pisan.
import { COLECCIONES } from '../config/constants';
import { CONFIG_INICIAL } from '../config/defaults';

export function hidratarInscripciones(inscripciones, caja) {
  const idx = new Map();
  for (const m of caja) {
    if (m.refTipo === 'cuota' && !m.anulado) {
      const k = `${m.refId}|${m.cuotaIdx}`;
      if (!idx.has(k)) idx.set(k, []);
      idx.get(k).push(m);
    }
  }
  return inscripciones.map((ins) => ({
    ...ins,
    cuotas: (ins.cuotas || []).map((q, i) => {
      // Pagos guardados por versiones anteriores dentro de la cuota (solo para leer recargos viejos).
      const legado = Array.isArray(q.pagos) ? q.pagos : [];
      const ms = (idx.get(`${ins.id}|${i}`) || []).slice()
        .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '') || (a.creadoEn || '').localeCompare(b.creadoEn || ''));
      const pagos = ms.map((m) => {
        const lg = legado.find((x) => x.recibo === m.recibo);
        const recargo = m.recargo != null ? +m.recargo : (lg ? (+lg.recargo || 0) : 0);
        const importe = m.aplicado != null ? +m.aplicado : (lg ? +lg.importe : (+m.importe || 0) - recargo);
        return { fecha: m.fecha, importe, recargo, medio: m.medio, referencia: m.referencia || '', recibo: m.recibo, movId: m.id, por: m.creadoPor || '' };
      });
      return { ...q, pagos, pagado: pagos.reduce((t, x) => t + x.importe, 0), fechaPago: pagos.length ? pagos[pagos.length - 1].fecha : '' };
    }),
  }));
}

/** Quita de una inscripción los campos calculados antes de guardarla. */
export function limpiarInscripcion(ins, original) {
  const orig = original || {};
  return {
    ...ins,
    cuotas: (ins.cuotas || []).map((q, i) => {
      const { pagos, pagado, fechaPago, ...resto } = q;
      const o = (orig.cuotas || [])[i];
      if (o && Array.isArray(o.pagos) && o.pagos.length) return { ...resto, pagos: o.pagos, pagado: o.pagado };
      return resto;
    }),
  };
}

export function buildDb(estado) {
  const colecciones = { ...estado.colecciones };
  colecciones.inscripciones = hidratarInscripciones(colecciones.inscripciones || [], colecciones.caja || []);
  const mapas = {};
  COLECCIONES.forEach((c) => {
    colecciones[c] = colecciones[c] || [];
    mapas[c] = new Map(colecciones[c].map((d) => [d.id, d]));
  });
  return {
    ...colecciones,
    config: { ...CONFIG_INICIAL, ...(estado.config || {}) },
    counters: estado.contadores || {},
    get: (c, id) => (mapas[c] ? mapas[c].get(id) : undefined),
  };
}
