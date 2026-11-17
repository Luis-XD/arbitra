// Datos de ejemplo de un centro de formación de árbitros. Todos los registros
// llevan `ejemplo: true` y se borran juntos desde Ajustes.
import cursos from './cursos.json';
import docentes from './docentes.json';
import prospectos from './prospectos.json';
import alumnos from './alumnos.json';
import inscripciones from './inscripciones.json';
import caja from './caja.json';
import asistencia from './asistencia.json';
import evaluaciones from './evaluaciones.json';

export const datosEjemplo = {
  colecciones: { cursos, docentes, prospectos, alumnos, inscripciones, caja, asistencia, evaluaciones, certificados: [], cierres: [] },
  config: {},
  contadores: {},
};

export default datosEjemplo;
