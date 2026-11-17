// Mensajes de WhatsApp: normalización de teléfonos argentinos y plantillas.

import { CONFIG_INICIAL } from '../config/defaults';
import { cuotaEstado } from './business';
import { fdate, money } from './format';

/** Devuelve el número en formato internacional para wa.me (549 + área + número) o "" si no es válido. */
export function waPhone(t, areaDefecto = '11') {
  const raw = String(t || '').trim();
  let d = raw.replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (raw.startsWith('+') && !d.startsWith('54')) return d.length >= 8 ? d : '';
  if (d.startsWith('54')) { d = d.slice(2); if (d.startsWith('9')) d = d.slice(1); }
  if (d.startsWith('0')) d = d.slice(1);
  if (d.length === 12) {
    for (const L of [2, 3, 4]) { if (d.substr(L, 2) === '15') { d = d.slice(0, L) + d.slice(L + 2); break; } }
  }
  if (d.length === 10 && d.startsWith('15')) d = d.slice(2);
  if (d.length === 8) d = String(areaDefecto || '11').replace(/\D/g, '').replace(/^0/, '') + d;
  return d.length === 10 ? `549${d}` : '';
}

export const waLink = (num, text) => `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const plantilla = (config, k) => (config[k] && String(config[k]).trim()) || CONFIG_INICIAL[k];

export function fillTpl(text, vars, config) {
  const all = { institucion: config.institucion, alias: config.aliasPago || '(consultá en la sede)', ...vars };
  return String(text).replace(/\{(\w+)\}/g, (m, k) => (all[k] != null && all[k] !== '' ? String(all[k]) : m));
}

export const varsCurso = (c) => ({ curso: c ? c.nombre : '', inicio: c && c.inicio ? fdate(c.inicio) : '', horario: c && c.horario ? c.horario : '' });

export function varsCuota(a, c, q) {
  const st = cuotaEstado(q);
  return { nombre: a ? a.nombre : '', ...varsCurso(c), concepto: String(q.concepto || '').toLowerCase(), importe: money(st.saldo || q.importe), vence: fdate(q.vence) };
}

/** Opciones de mensaje para una cuota: aviso de deuda si está vencida, recordatorio si no. */
export function opcionesCuota(config, a, c, q) {
  const v = varsCuota(a, c, q);
  const vencida = cuotaEstado(q).k === 'vencida';
  const o = [['tplDeuda', 'Aviso de deuda vencida'], ['tplRecordatorio', 'Recordatorio de vencimiento']];
  if (!vencida) o.reverse();
  return [...o.map(([key, label]) => ({ key, label, text: fillTpl(plantilla(config, key), v, config) })), { key: 'libre', label: 'Mensaje libre', text: `Hola ${v.nombre}, ` }];
}
