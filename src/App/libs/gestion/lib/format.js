// Formato de fechas, importes y textos (es-AR).

const fmtARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const money = (n) => fmtARS.format(Math.round(+n || 0));
export const pad = (n) => String(n).padStart(2, '0');
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => iso(new Date());
export const parseD = (s) => {
  if (!s) return null;
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d || 1);
};
export const fdate = (s) => {
  const d = parseD(s);
  return d ? d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
};
export const fshort = (s) => {
  const d = parseD(s);
  return d ? d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) : '—';
};
export const fechaLarga = (s) => (parseD(s) || new Date()).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
export const ym = (s) => (s || '').slice(0, 7);
export const monthName = (k) => {
  const [y, m] = k.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
};
export const monthLong = (k) => {
  const [y, m] = k.split('-').map(Number);
  return new Date(y, m - 1, 2).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
};
/** Suma `n` meses a una fecha ISO y la lleva al día `day` (o al último del mes). */
export const addMonths = (s, n, day) => {
  const d = parseD(s);
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(day || d.getDate(), last));
  return iso(t);
};
export const daysBetween = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
export const lastMonths = (n) => {
  const d = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${t.getFullYear()}-${pad(t.getMonth() + 1)}`);
  }
  return out;
};
export const nextMonths = (n) => {
  const d = new Date();
  return Array.from({ length: n }, (_, i) => {
    const t = new Date(d.getFullYear(), d.getMonth() + i, 1);
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}`;
  });
};

export const fullName = (a) => (a ? `${a.apellido || ''}, ${a.nombre || ''}`.replace(/^, |, $/, '') : '—');
export const firstName = (n) => String(n || '').trim().split(/\s+/)[0] || '';
export const dniFmt = (v) => {
  const n = String(v || '').replace(/\D/g, '');
  return n ? Number(n).toLocaleString('es-AR') : '—';
};
export const fmtNota = (n) => (n == null ? '—' : Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 }));
export const slug = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
/** Reemplaza {variable} por su valor; deja la marca si la variable no existe. */
export const fillVars = (t, v) => String(t ?? '').replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? String(v[k]) : m));
