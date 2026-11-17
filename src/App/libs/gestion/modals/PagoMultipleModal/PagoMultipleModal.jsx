import { useMemo, useState } from 'react';
import { MEDIOS } from '../../config/constants';
import { cuotaEstado, recargoDe } from '../../lib/business';
import { fdate, fullName, money, today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { FileInput, SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import Summary from '../../components/ui/Summary/Summary';
import Table, { Sub, Td, Th } from '../../components/ui/Table/Table';
import ReciboModal from '../ReciboModal/ReciboModal';
import styles from './PagoMultipleModal.module.css';

const FORM_ID = 'arbitra-pago-multiple';

/** Cobro de varias cuotas del mismo alumno con un solo recibo. items: { insId, idx }[] */
export default function PagoMultipleModal({ items, onClose }) {
  const { db, guardar, siguienteNumero, subirComprobante, puedeSubirArchivos } = useData();
  const { abrirModal, toast } = useUi();
  // Las filas se fijan al abrir: así no desaparecen mientras se registran los pagos.
  const [filas] = useState(() => items.map((it) => {
    const ins = db.get('inscripciones', it.insId); const q = ins && ins.cuotas[it.idx];
    return q ? { ins, idx: it.idx, q, st: cuotaEstado(q), rec: recargoDe(q, db.config), c: db.get('cursos', ins.cursoId) } : null;
  }).filter((r) => r && r.st.saldo > 0));
  const [recargos, setRecargos] = useState(() => filas.map((r) => r.rec));
  const [f, set] = useForm({ medio: MEDIOS[0], fecha: today(), referencia: '' });
  const [archivo, setArchivo] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const saldo = useMemo(() => filas.reduce((t, r) => t + r.st.saldo, 0), [filas]);

  if (!filas.length) {
    return <Modal title="Registrar cobro" onClose={onClose} footer={<Button onClick={onClose}>Cerrar</Button>}><EmptyState>Esas cuotas ya están pagas.</EmptyState></Modal>;
  }
  const a = db.get('alumnos', filas[0].ins.alumnoId);
  const rc = recargos.map((v) => Math.max(0, Math.round(+v || 0)));
  const totalRec = rc.reduce((t, v) => t + v, 0);

  const enviar = async () => {
    setOcupado(true);
    try {
      const comp = await subirComprobante(archivo);
      const recibo = await siguienteNumero('recibos');
      for (let i = 0; i < filas.length; i++) {
        const r = filas[i];
        await guardar('caja', { // eslint-disable-line no-await-in-loop
          fecha: f.fecha || today(), tipo: 'ingreso', categoria: 'Cuotas y matrículas', concepto: `${r.q.concepto} · ${fullName(a)} · ${r.c ? r.c.nombre : ''}`,
          importe: r.st.saldo + rc[i], aplicado: r.st.saldo, recargo: rc[i], medio: f.medio, referencia: f.referencia || '',
          refTipo: 'cuota', refId: r.ins.id, cuotaIdx: r.idx, alumnoId: r.ins.alumnoId, cursoId: r.ins.cursoId, recibo, grupoCuotas: filas.length, ...comp,
        });
      }
      toast(`Cobro registrado · Recibo ${recibo}`);
      abrirModal(ReciboModal, { numero: recibo });
    } catch (e) {
      setOcupado(false);
      toast('No se pudo registrar el cobro. Probá de nuevo en unos segundos.');
    }
  };

  return (
    <Modal wide title={`Cobrar ${filas.length} cuotas · ${fullName(a)}`} onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID} disabled={ocupado}>{ocupado ? 'Registrando…' : 'Confirmar cobro y emitir recibo'}</Button>
    </>}>
      <Table compact head={<><Th>Cuota</Th><Th>Vence</Th><Th num>Saldo</Th><Th num>Recargo mora</Th></>}>
        {filas.map((r, i) => (
          <tr key={`${r.ins.id}|${r.idx}`}>
            <Td>{r.c ? r.c.nombre : ''}<Sub>{r.q.concepto}</Sub></Td>
            <Td mono>{fdate(r.q.vence)}</Td>
            <Td num>{money(r.st.saldo)}</Td>
            <Td num><input type="number" min="0" className={styles.recargo} value={recargos[i]} aria-label={`Recargo ${r.q.concepto}`}
              onChange={(e) => { const v = e.target.value; setRecargos((x) => x.map((y, k) => (k === i ? v : y))); }} /></Td>
          </tr>
        ))}
      </Table>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <SelectInput label="Medio de pago" value={f.medio} onChange={set('medio')} options={MEDIOS} />
        <TextInput label="Fecha" type="date" value={f.fecha} onChange={set('fecha')} />
        <TextInput full label="Referencia de la operación" value={f.referencia} onChange={set('referencia')} placeholder="N° de operación, últimos 4 dígitos…" />
        {puedeSubirArchivos && <FileInput label="Comprobante (foto o PDF)" hint="Opcional: captura de la transferencia, Mercado Pago o ticket." onChange={setArchivo} />}
      </FormGrid>
      <Summary items={[{ label: 'Cuotas', value: money(saldo) }, { label: 'Recargos', value: money(totalRec) }, { label: 'Total a cobrar', value: money(saldo + totalRec), big: true }]} />
      <p className={styles.ayuda}>Se emite un solo recibo con el detalle de cada cuota. Cada cuota se salda por completo.</p>
    </Modal>
  );
}
