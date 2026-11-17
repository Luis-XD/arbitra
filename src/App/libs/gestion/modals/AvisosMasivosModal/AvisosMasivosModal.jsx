import { useState } from 'react';
import { fdate, fullName, money } from '../../lib/format';
import { opcionesCuota, waLink, waPhone } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import Button from '../../components/ui/Button/Button';
import Modal from '../../components/ui/Modal/Modal';
import Pill from '../../components/ui/Pill/Pill';
import Summary from '../../components/ui/Summary/Summary';
import Table, { Sub, Td, Th } from '../../components/ui/Table/Table';
import styles from './AvisosMasivosModal.module.css';

/** Lista de cuotas pendientes con un botón por alumno para abrir WhatsApp de a uno. filas: allCuotas() filtradas */
export default function AvisosMasivosModal({ filas, onClose }) {
  const { db } = useData();
  const { marcarAviso } = useAcciones();
  const [hechos, setHechos] = useState(() => new Set());
  const area = db.config.waArea;
  const conCelular = filas.filter((r) => waPhone(r.alumno && r.alumno.telefono, area)).length;

  const abrir = (k, r) => {
    setHechos((s) => new Set(s).add(k));
    setTimeout(() => { marcarAviso(r.ins.id, r.i).catch(() => {}); }, 60);
  };

  return (
    <Modal wide title="Avisos por WhatsApp" onClose={onClose} footer={<Button variant="primary" onClick={onClose}>Terminar</Button>}>
      <p className={styles.ayuda}>Cada botón abre WhatsApp con el mensaje armado para ese alumno. Enviá el mensaje en WhatsApp, volvé a esta ventana y seguí con el siguiente. Las vencidas usan la plantilla <b>Aviso de deuda</b>; el resto, <b>Recordatorio de vencimiento</b>.</p>
      <Summary items={[{ label: 'Progreso', value: `${hechos.size} de ${conCelular} abiertos en WhatsApp${filas.length > conCelular ? ` · ${filas.length - conCelular} sin celular válido` : ''}`, plain: true }]} />
      <Table compact head={<><Th>Alumno</Th><Th>Cuota</Th><Th num>Saldo</Th><Th>Último aviso</Th><Th /></>}>
        {filas.map((r) => {
          const k = `${r.ins.id}|${r.i}`;
          const num = waPhone(r.alumno && r.alumno.telefono, area);
          const texto = opcionesCuota(db.config, r.alumno, r.curso, r.q)[0].text;
          const actual = (db.get('inscripciones', r.ins.id) || r.ins).cuotas[r.i] || r.q;
          const hecho = hechos.has(k);
          return (
            <tr key={k} className={hecho ? styles.hecho : ''}>
              <Td><b>{fullName(r.alumno)}</b><Sub>{(r.alumno && r.alumno.telefono) || 'Sin teléfono'}</Sub></Td>
              <Td>{r.q.concepto}<Sub>{r.curso ? r.curso.nombre : ''} · vence {fdate(r.q.vence)}</Sub></Td>
              <Td num>{money(r.st.saldo)}</Td>
              <Td mono>{actual.ultimoAviso ? fdate(actual.ultimoAviso) : '—'}</Td>
              <Td>{num ? <Button size="sm" variant={hecho ? 'default' : 'wa'} href={waLink(num, texto)} onClick={() => abrir(k, r)}>{hecho ? 'Reabrir' : 'Abrir'}</Button> : <Pill tono="warn">Revisar teléfono</Pill>}</Td>
            </tr>
          );
        })}
      </Table>
    </Modal>
  );
}
