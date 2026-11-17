// Exportaciones a CSV (se abren en Excel o Google Sheets).
import { allCuotas, conceptoMov, deudaAlumno, cajaMes, indicadores, totalPlan, totalPagado } from './business';
import { fullName, lastMonths } from './format';
import { toCsv } from './files';

export function filasExportacion(db, tipo, nombreUsuario) {
  const curso = (id) => (db.get('cursos', id) || {}).nombre;
  switch (tipo) {
    case 'prospectos':
      return [['Nombre', 'Teléfono', 'Email', 'Curso', 'Origen', 'Etapa', 'Próximo seguimiento', 'Motivo pérdida', 'Alta'],
        ...db.prospectos.map((p) => [p.nombre, p.telefono, p.email, curso(p.cursoId), p.origen, p.etapa, p.proximoContacto, p.motivoPerdida, p.creado])];
    case 'alumnos':
      return [['Apellido', 'Nombre', 'DNI', 'Nacimiento', 'Teléfono', 'Email', 'Domicilio', 'Localidad', 'Estado', 'Deuda', 'Deuda vencida'],
        ...db.alumnos.map((a) => { const d = deudaAlumno(db, a.id); return [a.apellido, a.nombre, a.dni, a.nacimiento, a.telefono, a.email, a.direccion, a.localidad, a.estado, d.deuda, d.vencida]; })];
    case 'inscripciones':
      return [['Fecha', 'Alumno', 'DNI', 'Curso', 'Beca %', 'Estado', 'Total plan', 'Pagado', 'Saldo'],
        ...db.inscripciones.map((i) => { const a = db.get('alumnos', i.alumnoId); const t = totalPlan(i); const p = totalPagado(i); return [i.fecha, fullName(a), a && a.dni, curso(i.cursoId), i.becaPct, i.estado, t, p, t - p]; })];
    case 'morosos':
      return [['Alumno', 'DNI', 'Teléfono', 'Curso', 'Concepto', 'Vencimiento', 'Días de atraso', 'Saldo'],
        ...allCuotas(db).filter((c) => c.st.k === 'vencida').map((c) => [fullName(c.alumno), c.alumno && c.alumno.dni, c.alumno && c.alumno.telefono, c.curso && c.curso.nombre, c.q.concepto, c.q.vence, c.st.dias, c.st.saldo])];
    case 'caja':
      return [['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Medio', 'Importe', 'Recibo', 'Comprobante', 'Estado', 'Registró'],
        ...db.caja.slice().sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '')).map((m) => [m.fecha, m.tipo, m.categoria, conceptoMov(db, m), m.medio, m.importe, m.recibo, m.comprobante || m.comprobanteUrl || '', m.anulado ? `Anulado: ${m.motivoAnulacion || ''}` : 'Vigente', nombreUsuario(m.creadoPor)])];
    case 'indicadores': {
      const I = indicadores(db);
      return [['Curso', 'Estado', 'Inscriptos', 'Bajas %', 'Morosidad %', 'Asistencia %', 'Aprobados %', 'En espera'],
        ...I.cursos.map((x) => [x.c.nombre, x.c.estado, x.ins, x.bajas, x.mora, x.asis, x.aprob, x.espera])];
    }
    case 'resultado':
      return [['Mes', 'Ingresos', 'Egresos', 'Resultado'], ...lastMonths(12).map((m) => { const r = cajaMes(db, m); return [m, r.ing, r.egr, r.ing - r.egr]; })];
    default:
      return [];
  }
}

export const csvExportacion = (db, tipo, nombreUsuario) => toCsv(filasExportacion(db, tipo, nombreUsuario));
