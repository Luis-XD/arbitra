// Reglas de negocio del centro. Funciones puras: reciben el snapshot `db`
// (ver state/buildDb.js) y devuelven datos calculados.

import { CONFIG_INICIAL } from '../config/defaults';
import {
  today, ym, daysBetween, addMonths, money, fullName, fdate, dniFmt, fillVars, nextMonths,
} from './format';

/* ---------- Cuotas ---------- */

export function cuotaEstado(q) {
  const saldo = Math.max(0, (q.importe || 0) - (q.pagado || 0));
  if (saldo <= 0.5) return { k: 'pagada', lbl: 'Pagada', tono: 'ok', saldo: 0 };
  const t = today();
  if (q.vence < t) {
    const dias = daysBetween(q.vence, t);
    return { k: 'vencida', lbl: q.pagado > 0 ? `Parcial · vencida ${dias} d` : `Vencida ${dias} d`, tono: 'bad', saldo, dias };
  }
  const d = daysBetween(t, q.vence);
  if (d <= 7) return { k: 'porvencer', lbl: d === 0 ? 'Vence hoy' : `Vence en ${d} d`, tono: 'warn', saldo };
  return { k: 'pendiente', lbl: q.pagado > 0 ? 'Parcial' : 'Pendiente', tono: '', saldo };
}

/** Todas las cuotas de todas las inscripciones, con su estado. Excluye lo impago de las bajas. */
export function allCuotas(db) {
  const out = [];
  db.inscripciones.forEach((ins) => {
    if (ins.estado === 'Baja' && !(ins.cuotas || []).some((q) => q.pagado > 0)) return;
    (ins.cuotas || []).forEach((q, i) => {
      if (ins.estado === 'Baja' && !(q.pagado > 0)) return;
      out.push({ ins, q, i, st: cuotaEstado(q), alumno: db.get('alumnos', ins.alumnoId), curso: db.get('cursos', ins.cursoId) });
    });
  });
  return out;
}

export function recargoDe(q, config) {
  const st = cuotaEstado(q);
  if (st.k !== 'vencida') return 0;
  if ((st.dias || 0) <= (+config.diasGracia || 0)) return 0;
  return Math.round((st.saldo * (+config.recargoMoraPct || 0)) / 100);
}

/** Arma el plan de pagos de una inscripción: matrícula + una cuota por mes. */
export function planCuotas(curso, fecha, becaPct, inicioCobro, config) {
  const beca = Math.min(100, Math.max(0, +becaPct || 0));
  const out = [];
  if (+curso.matricula > 0) out.push({ n: 0, concepto: 'Matrícula', vence: fecha, importe: Math.round(+curso.matricula) });
  const n = Math.max(0, parseInt(curso.cuotas, 10) || 0);
  const base = inicioCobro || (curso.inicio && curso.inicio > fecha ? curso.inicio : fecha);
  const dia = +config.diaVencimiento || 10;
  for (let k = 0; k < n; k++) {
    out.push({ n: k + 1, concepto: `Cuota ${k + 1} de ${n}`, vence: addMonths(`${base.slice(0, 8)}01`, k, dia), importe: Math.round(((+curso.valorCuota || 0) * (100 - beca)) / 100) });
  }
  return out;
}

export function deudaAlumno(db, alumnoId) {
  let deuda = 0; let vencida = 0;
  db.inscripciones.filter((i) => i.alumnoId === alumnoId && i.estado !== 'Baja').forEach((ins) => (ins.cuotas || []).forEach((q) => {
    const st = cuotaEstado(q); deuda += st.saldo; if (st.k === 'vencida') vencida += st.saldo;
  }));
  return { deuda, vencida };
}

export const totalPlan = (ins) => (ins.cuotas || []).reduce((s, q) => s + (q.importe || 0), 0);
export const totalPagado = (ins) => (ins.cuotas || []).reduce((s, q) => s + Math.min(q.pagado || 0, q.importe || 0), 0);
export const tieneVencidas = (ins) => (ins.cuotas || []).some((q) => cuotaEstado(q).k === 'vencida');

/* ---------- Cursos, cupo y lista de espera ---------- */

export const inscriptosActivos = (db, cursoId) => db.inscripciones.filter((i) => i.cursoId === cursoId && i.estado === 'Activa').length;
export const enEspera = (db, cid) => db.prospectos.filter((p) => p.etapa === 'En espera' && p.cursoId === cid)
  .sort((a, b) => (a.esperaDesde || a.creado || '').localeCompare(b.esperaDesde || b.creado || ''));
export const cupoLleno = (db, c) => !!(c && +c.cupo && inscriptosActivos(db, c.id) >= +c.cupo);
export const cursosAbiertos = (db) => db.cursos.filter((c) => ['Inscripción abierta', 'En curso'].includes(c.estado));

/* ---------- Caja ---------- */

export function cajaMes(db, k) {
  let ing = 0; let egr = 0;
  db.caja.forEach((m) => {
    if (!m.anulado && ym(m.fecha) === k) { if (m.tipo === 'ingreso') ing += +m.importe || 0; else egr += +m.importe || 0; }
  });
  return { ing, egr };
}

/** Concepto de un movimiento. Los cobros se describen con los datos actuales de alumno y curso. */
export function conceptoMov(db, m) {
  if (m.refTipo !== 'cuota') return m.concepto || '';
  const ins = db.get('inscripciones', m.refId);
  const q = ins && (ins.cuotas || [])[m.cuotaIdx];
  const a = db.get('alumnos', m.alumnoId); const c = db.get('cursos', m.cursoId);
  return `${q ? q.concepto : 'Cuota'} · ${fullName(a)} · ${c ? c.nombre : ''}${+m.recargo ? ` (incluye recargo ${money(m.recargo)})` : ''}`;
}

/** Datos de un recibo (puede agrupar varias cuotas pagadas juntas). */
export function reciboData(db, num) {
  const movs = db.caja.filter((m) => m.recibo === num && m.refTipo === 'cuota' && !m.anulado);
  if (!movs.length) return null;
  const m0 = movs[0]; const alumno = db.get('alumnos', m0.alumnoId);
  const lines = movs.map((m) => {
    const ins = db.get('inscripciones', m.refId); const q = ins && (ins.cuotas || [])[m.cuotaIdx]; const c = db.get('cursos', m.cursoId);
    const p = q && (q.pagos || []).find((x) => x.movId === m.id);
    const recargo = p ? p.recargo : (+m.recargo || 0);
    const importe = p ? p.importe : (+m.importe || 0) - recargo;
    return { concepto: q ? q.concepto : 'Cuota', curso: c ? c.nombre : '', importe, recargo, saldo: q ? Math.max(0, q.importe - q.pagado) : 0 };
  });
  return {
    numero: num, fecha: m0.fecha, alumno, lines, medio: m0.medio, referencia: m0.referencia || '', por: m0.creadoPor || '',
    comprobante: movs.find((m) => m.comprobanteUrl) || null, movs,
    importe: lines.reduce((t, l) => t + l.importe, 0), recargo: lines.reduce((t, l) => t + l.recargo, 0), saldo: lines.reduce((t, l) => t + l.saldo, 0),
  };
}

export function resumenDia(db, fecha) {
  const porMedio = {};
  db.caja.filter((m) => !m.anulado && m.fecha === fecha).forEach((m) => {
    const k = m.medio || 'Sin especificar';
    porMedio[k] = porMedio[k] || { ing: 0, egr: 0, n: 0 };
    porMedio[k][m.tipo === 'ingreso' ? 'ing' : 'egr'] += +m.importe || 0;
    porMedio[k].n++;
  });
  return porMedio;
}
export const cierreAnterior = (db, fecha) => db.cierres.filter((c) => c.fecha < fecha).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
export const fondoInicial = (db, fecha) => {
  const p = db.get('cierres', fecha); if (p) return p.saldoInicial;
  const a = cierreAnterior(db, fecha);
  return a ? Math.round((+a.contado || 0) - (+a.retiro || 0)) : 0;
};
/** [texto, tono] para una diferencia de arqueo. */
export const difLabel = (d) => (Math.abs(d) < 1 ? ['Sin diferencia', 'ok'] : d > 0 ? [`Sobrante ${money(d)}`, 'warn'] : [`Faltante ${money(-d)}`, 'bad']);

/* ---------- Numeración ---------- */

export const fmtNumero = (tipo, n, config) => (tipo === 'recibos'
  ? `${String(config.puntoVenta || 1).padStart(4, '0')}-${String(n).padStart(8, '0')}`
  : `CERT-${String(n).padStart(5, '0')}`);

/* ---------- Asistencia y notas ---------- */

export function cursosAsistencia(db) {
  const order = { 'En curso': 0, 'Inscripción abierta': 1, Finalizado: 2, Borrador: 3 };
  return db.cursos.slice().sort((a, b) => (order[a.estado] ?? 9) - (order[b.estado] ?? 9) || (b.inicio || '').localeCompare(a.inicio || ''));
}

export function resumenCurso(db, cid) {
  const alumnos = db.inscripciones.filter((i) => i.cursoId === cid && i.estado !== 'Baja')
    .map((i) => ({ ins: i, a: db.get('alumnos', i.alumnoId) }))
    .sort((x, y) => fullName(x.a).localeCompare(fullName(y.a)));
  const clases = db.asistencia.filter((x) => x.cursoId === cid).sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
  const ev = db.get('evaluaciones', cid) || { id: cid, cursoId: cid, instancias: [], notas: {} };
  const minN = +db.config.notaMinima || 6; const minA = +db.config.asistenciaMinima || 75;
  const rows = alumnos.map(({ ins, a }) => {
    let P = 0; let A = 0; let T = 0; let J = 0;
    clases.forEach((cl) => {
      const m = (cl.marcas || {})[ins.id];
      if (m === 'P') P++; else if (m === 'A') A++; else if (m === 'T') T++; else if (m === 'J') J++;
    });
    const den = P + A + T; const pct = den ? Math.round(((P + T) / den) * 100) : null;
    const ns = (ev.instancias || []).map((it) => {
      const v = ((ev.notas || {})[ins.id] || {})[it.id];
      return v === '' || v == null || Number.isNaN(+v) ? null : +v;
    });
    const vals = ns.filter((v) => v != null);
    const prom = vals.length ? Math.round((vals.reduce((t, v) => t + v, 0) / vals.length) * 100) / 100 : null;
    let cond = 'Sin datos'; let tono = '';
    if (prom == null && pct == null) cond = 'Sin datos';
    else if (pct != null && pct < minA) { cond = 'Asistencia insuficiente'; tono = 'bad'; }
    else if (prom == null) cond = 'Sin notas';
    else if (prom < minN) { cond = 'Nota insuficiente'; tono = 'bad'; }
    else { cond = 'Aprueba'; tono = 'ok'; }
    return { ins, a, P, A, T, J, pct, ns, prom, cond, tono, aprueba: cond === 'Aprueba', cert: db.get('certificados', ins.id) };
  });
  return { c: db.get('cursos', cid), clases, ev, rows, minN, minA };
}

export function filaCertificado(db, insId) {
  const ins = db.get('inscripciones', insId);
  if (!ins) return null;
  return resumenCurso(db, ins.cursoId).rows.find((x) => x.ins.id === insId) || null;
}

/** Textos finales de un certificado: configuración general, del curso, guardados y editados. */
export function datosCertificado(db, r, cert, over) {
  const cfg = db.config; const c = (r && db.get('cursos', r.ins.cursoId)) || {}; const a = (r && r.a) || {};
  const doc = db.get('docentes', c.docenteId);
  const numero = cert && cert.numero ? cert.numero : fmtNumero('certificados', (+db.counters.certificados || 0) + 1, cfg);
  const fecha = (cert && cert.fecha) || today();
  const v = { curso: c.nombre || '', horas: c.cargaHoraria || '', docente: doc ? doc.nombre : '', director: cfg.directorNombre || '', nombre: `${a.nombre || ''} ${a.apellido || ''}`.trim(), dni: dniFmt(a.dni), numero, fecha: fdate(fecha) };
  const pick = (k) => (cfg[k] != null && cfg[k] !== '' ? cfg[k] : CONFIG_INICIAL[k]);
  const base = {
    nombre: v.nombre, texto: fillVars(c.certTexto || pick('certTexto'), v), titulo: c.certTitulo || pick('certTitulo'), fecha,
    firma1Rol: pick('certFirma1Rol'), firma1Nombre: fillVars(cfg.certFirma1Nombre ?? CONFIG_INICIAL.certFirma1Nombre, v),
    firma2Rol: pick('certFirma2Rol'), firma2Nombre: fillVars(cfg.certFirma2Nombre ?? CONFIG_INICIAL.certFirma2Nombre, v),
  };
  const d = { ...base, ...((cert && cert.textos) || {}), ...(over || {}), numero, provisorio: !(cert && cert.numero) };
  d.qr = fillVars(pick('certQR'), { ...v, nombre: d.nombre, titulo: d.titulo, fecha: fdate(d.fecha) });
  d.mayus = cfg.certMayus !== false;
  return d;
}

/* ---------- Indicadores ---------- */

export function indicadores(db) {
  const t = today(); const cq = allCuotas(db);
  const atrasado = cq.filter((c) => c.st.k === 'vencida').reduce((s, c) => s + c.st.saldo, 0);
  const vencidoTotal = cq.filter((c) => c.q.vence < t).reduce((s, c) => s + (+c.q.importe || 0), 0);
  const proy = nextMonths(6).map((k) => {
    const qs = cq.filter((c) => c.st.k !== 'pagada' && c.st.k !== 'vencida' && ym(c.q.vence) === k);
    return { k, v: qs.reduce((s, c) => s + c.st.saldo, 0), n: qs.length };
  });
  const nIns = db.inscripciones.length; const nBajas = db.inscripciones.filter((i) => i.estado === 'Baja').length;
  let nEval = 0; let nAprob = 0;
  const cursos = db.cursos.map((c) => {
    const ins = db.inscripciones.filter((i) => i.cursoId === c.id);
    const espera = enEspera(db, c.id).length;
    if (!ins.length && !espera) return null;
    const R = resumenCurso(db, c.id);
    const ps = R.rows.map((r) => r.pct).filter((v) => v != null);
    const ev = R.rows.filter((r) => r.prom != null); const ap = ev.filter((r) => r.aprueba).length;
    nEval += ev.length; nAprob += ap;
    const cc = cq.filter((x) => x.ins.cursoId === c.id && x.q.vence < t);
    const vt = cc.reduce((s, x) => s + (+x.q.importe || 0), 0);
    const vi = cc.filter((x) => x.st.k === 'vencida').reduce((s, x) => s + x.st.saldo, 0);
    return {
      c, ins: ins.filter((i) => i.estado !== 'Baja').length,
      bajas: ins.length ? Math.round((ins.filter((i) => i.estado === 'Baja').length / ins.length) * 100) : null,
      mora: vt ? Math.round((vi / vt) * 100) : null,
      asis: ps.length ? Math.round(ps.reduce((a, b) => a + b, 0) / ps.length) : null,
      aprob: ev.length ? Math.round((ap / ev.length) * 100) : null, espera,
    };
  }).filter(Boolean).sort((a, b) => b.ins - a.ins);
  return {
    atrasado, proy, morosidad: vencidoTotal ? Math.round((atrasado / vencidoTotal) * 100) : null,
    nIns, nBajas, bajas: nIns ? Math.round((nBajas / nIns) * 100) : null,
    nEval, nAprob, aprob: nEval ? Math.round((nAprob / nEval) * 100) : null, cursos,
  };
}

export const cantidadEjemplos = (db, colecciones) => colecciones.reduce((a, c) => a + (db[c] || []).filter((x) => x.ejemplo).length, 0);
