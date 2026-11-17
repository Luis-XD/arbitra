// Configuración inicial del centro. Todo se puede cambiar desde Ajustes.

export const CONFIG_INICIAL = {
  institucion: 'Arbitra Centro de Formación Profesional',
  cuit: '', direccion: '', telefono: '', email: '',
  recargoMoraPct: 10, diaVencimiento: 10, diasGracia: 5,
  puntoVenta: 1, notaMinima: 6, asistenciaMinima: 75,
  directorNombre: '', ciudad: 'Buenos Aires',
  // Certificado de egreso
  certTexto: 'ha completado satisfactoriamente la formación en {curso} y se recibe como',
  certTitulo: 'Árbitro/a en formación',
  certMayus: true,
  certFirma1Rol: 'Directora Académica', certFirma1Nombre: '{director}',
  certFirma2Rol: 'Instructor', certFirma2Nombre: '{docente}',
  certQR: 'Arbitra Centro de Formación Profesional\nCertificado N° {numero}\n{nombre} - DNI {dni}\n{curso} - {titulo}\nEmitido el {fecha}',
  // WhatsApp
  waNumero: '', waArea: '11', aliasPago: '',
  tplProspecto: 'Hola {nombre}, te escribimos de {institucion}. Gracias por consultar por el curso {curso}. ¿Querés que te enviemos el programa, los horarios y los valores?',
  tplSeguimiento: 'Hola {nombre}, ¿cómo estás? Te escribo de {institucion} para saber si pudiste ver la información del curso {curso}. Comienza el {inicio} ({horario}) y quedan pocos lugares. ¿Te reservo uno?',
  tplBienvenida: '¡Hola {nombre}! Te damos la bienvenida a {curso} en {institucion}. Comenzamos el {inicio}, {horario}. Guardá este número: por acá te vamos a avisar novedades.',
  tplRecordatorio: 'Hola {nombre}, te recordamos que la {concepto} de {curso} por {importe} vence el {vence}. Podés abonar por transferencia al alias {alias} o en la sede. ¡Gracias!',
  tplEspera: 'Hola {nombre}, te escribimos de {institucion}: se liberó un lugar en {curso} ({horario}), que empieza el {inicio}. ¿Te lo reservamos? Respondé este mensaje para confirmar.',
  tplDeuda: 'Hola {nombre}, registramos pendiente la {concepto} de {curso} por {importe}, vencida el {vence}. Si ya la abonaste, envianos el comprobante por acá. Si necesitás un plan de pago, respondé este mensaje y lo vemos.',
};

/** Plantillas de WhatsApp editables en Ajustes: [clave, etiqueta]. */
export const PLANTILLAS = [
  ['tplProspecto', 'Primer contacto con prospecto'],
  ['tplSeguimiento', 'Seguimiento de prospecto'],
  ['tplBienvenida', 'Bienvenida al alumno'],
  ['tplRecordatorio', 'Recordatorio de vencimiento'],
  ['tplDeuda', 'Aviso de deuda vencida'],
  ['tplEspera', 'Aviso de lugar disponible (lista de espera)'],
];

export const VARIABLES_PLANTILLA = '{nombre} {curso} {inicio} {horario} {concepto} {importe} {vence} {institucion} {alias}';
export const VARIABLES_CERTIFICADO = '{nombre} {dni} {curso} {horas} {titulo} {docente} {director} {numero} {fecha}';
