import { fshort, fullName } from '../../lib/format';
import MarcaAsistencia from '../../components/shared/MarcaAsistencia/MarcaAsistencia';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Pill from '../../components/ui/Pill/Pill';
import Table, { Td, Th } from '../../components/ui/Table/Table';
import styles from './PlanillaAsistencia.module.css';

/** Matriz alumnos × clases con el porcentaje de asistencia. */
export default function PlanillaAsistencia({ resumen: R, onAbrirClase }) {
  return (
    <Table matrix head={<>
      <Th>Alumno</Th>
      {R.clases.map((cl) => (
        <th key={cl.id} className={styles.col}>
          <button type="button" className={styles.fecha} title={cl.tema || 'Editar la clase'} onClick={() => onAbrirClase(cl.id)}>{fshort(cl.fecha)}</button>
        </th>
      ))}
      <Th num>Asist.</Th>
    </>}>
      {R.rows.map((r) => (
        <tr key={r.ins.id}>
          <Td><b>{fullName(r.a)}</b><ExampleTag item={r.ins} /></Td>
          {R.clases.map((cl) => <Td key={cl.id} center><MarcaAsistencia marca={(cl.marcas || {})[r.ins.id]} /></Td>)}
          <Td num><Pill tono={r.pct == null ? '' : r.pct < R.minA ? 'bad' : 'ok'}>{r.pct == null ? '—' : `${r.pct}%`}</Pill></Td>
        </tr>
      ))}
    </Table>
  );
}
