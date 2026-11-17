import { useMemo, useState } from 'react';
import { allCuotas } from '../../lib/business';
import { fdate, fullName, money } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { SelectInput } from '../../components/ui/Field/Field';
import Modal from '../../components/ui/Modal/Modal';
import Pill from '../../components/ui/Pill/Pill';
import SectionLabel from '../../components/ui/SectionLabel/SectionLabel';
import Table, { Sub, Td } from '../../components/ui/Table/Table';
import PagoModal from '../PagoModal/PagoModal';
import PagoMultipleModal from '../PagoMultipleModal/PagoMultipleModal';
import styles from './SelectorCobroModal.module.css';

/** Elegir alumno y cuotas a cobrar: una sola o varias juntas en un recibo. */
export default function SelectorCobroModal({ onClose }) {
  const { db } = useData();
  const { abrirModal } = useUi();
  const pend = useMemo(() => allCuotas(db).filter((c) => c.st.k !== 'pagada' && c.ins.estado !== 'Baja'), [db]);
  const alumnos = useMemo(() => [...new Map(pend.map((c) => [c.ins.alumnoId, c.alumno])).values()].filter(Boolean).sort((x, y) => fullName(x).localeCompare(fullName(y))), [pend]);
  const [alumnoId, setAlumnoId] = useState(alumnos[0] ? alumnos[0].id : '');
  const [sel, setSel] = useState(() => new Set());

  if (!alumnos.length) {
    return <Modal title="Registrar cobro" onClose={onClose} footer={<Button onClick={onClose}>Cerrar</Button>}><EmptyState>No hay cuotas pendientes para cobrar.</EmptyState></Modal>;
  }

  const filas = pend.filter((c) => c.ins.alumnoId === alumnoId).sort((a, b) => a.q.vence.localeCompare(b.q.vence));
  const elegidas = filas.filter((r) => sel.has(`${r.ins.id}|${r.i}`));
  const total = elegidas.reduce((t, r) => t + r.st.saldo, 0);
  const alternar = (k) => setSel((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const cobrar = () => {
    const items = elegidas.map((r) => ({ insId: r.ins.id, idx: r.i }));
    if (items.length === 1) abrirModal(PagoModal, items[0]); else abrirModal(PagoMultipleModal, { items });
  };

  return (
    <Modal title="Registrar cobro" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" disabled={!elegidas.length} onClick={cobrar}>
        {elegidas.length ? `Cobrar ${elegidas.length} ${elegidas.length === 1 ? 'cuota' : 'cuotas'} · ${money(total)}` : 'Cobrar seleccionadas'}
      </Button>
    </>}>
      <SelectInput label="Alumno" value={alumnoId} onChange={(v) => { setAlumnoId(v); setSel(new Set()); }} options={alumnos.map((a) => [a.id, `${fullName(a)} · DNI ${a.dni}`])} />
      <div className={styles.lista}>
        <SectionLabel>Cuotas pendientes · marcá las que paga juntas o cobrá una sola</SectionLabel>
        <Table compact>
          {filas.map((r) => {
            const k = `${r.ins.id}|${r.i}`;
            return (
              <tr key={k}>
                <Td className={styles.check}><input type="checkbox" checked={sel.has(k)} onChange={() => alternar(k)} aria-label={`Seleccionar ${r.q.concepto}`} /></Td>
                <Td>{r.curso ? r.curso.nombre : ''}<Sub>{r.q.concepto} · vence {fdate(r.q.vence)}</Sub></Td>
                <Td><Pill tono={r.st.tono}>{r.st.lbl}</Pill></Td>
                <Td num>{money(r.st.saldo)}</Td>
                <Td><Button size="sm" onClick={() => abrirModal(PagoModal, { insId: r.ins.id, idx: r.i })}>Cobrar sola</Button></Td>
              </tr>
            );
          })}
        </Table>
      </div>
    </Modal>
  );
}
