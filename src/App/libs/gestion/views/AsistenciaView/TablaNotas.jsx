import { fmtNota, fullName } from '../../lib/format';
import Button from '../../components/ui/Button/Button';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Pill from '../../components/ui/Pill/Pill';
import Table, { Sub, Td, Th } from '../../components/ui/Table/Table';
import styles from './TablaNotas.module.css';

/**
 * Notas por evaluación, promedio, asistencia, condición y certificado.
 * borrador: { "insId|instId": "7,5" } con los cambios sin guardar.
 */
export default function TablaNotas({ resumen: R, borrador, onCambiarNota, onQuitarEvaluacion, onCertificado, puedeQuitar }) {
  const inst = R.ev.instancias || [];
  return (
    <Table matrix head={<>
      <Th>Alumno</Th>
      {inst.map((it) => (
        <Th key={it.id} num>{it.nombre}{puedeQuitar && <button type="button" className={styles.quitar} aria-label={`Quitar ${it.nombre}`} onClick={() => onQuitarEvaluacion(it)}>✕</button>}</Th>
      ))}
      <Th num>Promedio</Th><Th num>Asistencia</Th><Th>Condición</Th><Th>Certificado</Th>
    </>}>
      {R.rows.map((r) => (
        <tr key={r.ins.id}>
          <Td><b>{fullName(r.a)}</b><ExampleTag item={r.ins} /></Td>
          {inst.map((it, j) => {
            const k = `${r.ins.id}|${it.id}`;
            const enBorrador = borrador[k] != null;
            const v = enBorrador ? borrador[k] : (r.ns[j] == null ? '' : String(r.ns[j]).replace('.', ','));
            return (
              <Td key={it.id} num>
                <input className={`${styles.nota} ${enBorrador ? styles.dirty : ''}`} inputMode="decimal" value={v}
                  aria-label={`${it.nombre} de ${fullName(r.a)}`} onChange={(e) => onCambiarNota(k, e.target.value)} />
              </Td>
            );
          })}
          <Td num><b>{fmtNota(r.prom)}</b></Td>
          <Td num>{r.pct == null ? '—' : `${r.pct}%`}</Td>
          <Td><Pill tono={r.tono}>{r.cond}</Pill></Td>
          <Td>
            {r.cert ? <Button size="sm" onClick={() => onCertificado(r.ins.id)}>N° {r.cert.numero}</Button>
              : r.aprueba ? <Button size="sm" variant="primary" onClick={() => onCertificado(r.ins.id)}>Emitir</Button>
                : <Sub>—</Sub>}
          </Td>
        </tr>
      ))}
    </Table>
  );
}
