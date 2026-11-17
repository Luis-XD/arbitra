// Listas fijas que usa todo el módulo.

export const COLECCIONES = [
  'cursos', 'docentes', 'prospectos', 'alumnos', 'inscripciones',
  'caja', 'asistencia', 'evaluaciones', 'certificados', 'cierres',
];

export const ETAPAS = ['Nuevo', 'Contactado', 'Interesado', 'Entrevista', 'En espera', 'Inscripto', 'Perdido'];
export const ORIGENES = ['Instagram', 'Facebook', 'WhatsApp', 'Sitio web', 'Referido', 'Volante / vía pública', 'Feria / evento', 'Otro'];
export const MOTIVOS_PERDIDA = ['Precio', 'Horario no compatible', 'Eligió otra institución', 'No respondió', 'Curso no disponible', 'Distancia / traslado', 'Otro'];
export const MEDIOS = ['Efectivo', 'Transferencia', 'Mercado Pago', 'Tarjeta de débito', 'Tarjeta de crédito'];
export const CAT_EGRESO = ['Honorarios docentes', 'Sueldos administrativos', 'Alquiler', 'Servicios', 'Insumos y materiales', 'Marketing', 'Impuestos y tasas', 'Mantenimiento', 'Otros egresos'];
export const CAT_INGRESO = ['Cuotas y matrículas', 'Venta de materiales', 'Certificados', 'Subsidios / convenios', 'Otros ingresos'];
export const MODALIDADES = ['Presencial', 'Virtual', 'Híbrida'];
export const ESTADOS_CURSO = ['Inscripción abierta', 'En curso', 'Finalizado', 'Borrador'];
export const ESTADOS_ALUMNO = ['Activo', 'Egresado', 'Baja'];
export const ESTADOS_INSCRIPCION = ['Activa', 'Finalizada', 'Baja'];
export const CONDICIONES_DOCENTE = ['Monotributista', 'Relación de dependencia', 'Voluntario / convenio'];

export const MARCAS = { P: 'Presente', A: 'Ausente', T: 'Tarde', J: 'Justificada' };
export const MARCAS_CORTAS = { P: 'Presente', A: 'Ausente', T: 'Tarde', J: 'Justif.' };

/** Vistas del módulo, agrupadas como en la barra lateral. */
export const RUTAS = [
  //{ grupo: 'General', items: [{ id: 'panel', titulo: 'Panel', icono: 'panel' }] },
  { grupo: 'Comercial (CRM)', items: [
    //{ id: 'prospectos', titulo: 'Prospectos', icono: 'prospectos' },
    { id: 'alumnos', titulo: 'Alumnos', icono: 'alumnos' },
    { id: 'disciplines', titulo: 'Disciplinas', icono: 'inscripciones' },
  ] },/*
  { grupo: 'Académico', items: [
    { id: 'cursos', titulo: 'Cursos', icono: 'cursos' },
    { id: 'inscripciones', titulo: 'Inscripciones', icono: 'inscripciones' },
    { id: 'asistencia', titulo: 'Asistencia y notas', icono: 'asistencia' },
    { id: 'docentes', titulo: 'Docentes', icono: 'docentes' },
  ] },
  { grupo: 'Administración (ERP)', items: [
    { id: 'cobranzas', titulo: 'Cobranzas', icono: 'cobranzas' },
    { id: 'caja', titulo: 'Caja y gastos', icono: 'caja' },
    { id: 'reportes', titulo: 'Reportes', icono: 'reportes' },
    { id: 'ajustes', titulo: 'Ajustes', icono: 'ajustes' },
  ] },*/
];
export const IDS_RUTAS = RUTAS.flatMap((g) => g.items.map((i) => i.id));
