import { useState } from 'react';
import { MEDIOS } from '../../config/constants';
import { cuotaEstado, recargoDe } from '../../lib/business';
import { fdate, fullName, money, today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { FileInput, SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import Summary from '../../components/ui/Summary/Summary';
import ReciboModal from '../ReciboModal/ReciboModal';
import styles from './PagoModal.module.css';

const FORM_ID = 'arbitra-pago';

/** Cobro de una cuota (total o parcial), con recargo por mora sugerido y comprobante opcional. */
export default function PagoModal({ insId, idx, onClose }) {
  const { db, guardar, siguienteNumero, subirComprobante, puedeSubirArchivos } = useData();
  const { abrirModal, toast } = useUi();
  const ins = db.get('inscripciones', insId);
  const q = ins && ins.cuotas[idx];
  const st = q ? cuotaEstado(q) : null;
  const sugerido = q ? recargoDe(q, db.config) : 0;
  const [f, set] = useForm({ importe: st ? st.saldo : 0, recargo: sugerido, medio: MEDIOS[0], fecha: today(), referencia: '' });
  const [archivo, setArchivo] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  if (!q) return null;
  const a = db.get('alumnos', ins.alumnoId); const c = db.get('cursos', ins.cursoId);

  const enviar = async () => {
    const imp = Math.round(+f.importe || 0); const rec = Math.round(+f.recargo || 0);
    if (imp <= 0 && rec <= 0) { toast('Ingresá un importe'); return; }
    setOcupado(true);
    try {
      const comp = await subirComprobante(archivo);
      const recibo = await siguienteNumero('recibos');
      await guardar('caja', {
        fecha: f.fecha || today(), tipo: 'ingreso', categoria: 'Cuotas y matrículas',
        concepto: `${q.concepto} · ${fullName(a)} · ${c ? c.nombre : ''}${rec ? ` (incluye recargo ${money(rec)})` : ''}`,
        importe: imp + rec, aplicado: imp, recargo: rec, medio: f.medio, referencia: f.referencia || '',
        refTipo: 'cuota', refId: ins.id, cuotaIdx: idx, alumnoId: ins.alumnoId, cursoId: ins.cursoId, recibo, ...comp,
      });
      toast(`Cobro registrado · Recibo ${recibo}`);
      abrirModal(ReciboModal, { numero: recibo });
    } catch (e) {
      setOcupado(false);
      toast('No se pudo registrar el cobro. Probá de nuevo en unos segundos.');
    }
  };

  return (
    <Modal title="Registrar cobro" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID} disabled={ocupado}>{ocupado ? 'Registrando…' : 'Confirmar cobro y emitir recibo'}</Button>
    </>}>
      <Summary items={[
        { label: 'Alumno', value: fullName(a), plain: true }, { label: 'Curso', value: c ? c.nombre : '', plain: true },
        { label: 'Concepto', value: q.concepto, plain: true }, { label: 'Vencimiento', value: fdate(q.vence) }, { label: 'Saldo', value: money(st.saldo) },
      ]} />
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput label="Importe a cobrar ($)" type="number" min="0" value={f.importe} onChange={set('importe')} hint="Podés registrar un pago parcial." />
        <TextInput label="Recargo por mora ($)" type="number" min="0" value={f.recargo} onChange={set('recargo')}
          hint={sugerido ? `Sugerido: ${db.config.recargoMoraPct}% por ${st.dias} días de atraso.` : 'Sin recargo sugerido.'} />
        <SelectInput label="Medio de pago" value={f.medio} onChange={set('medio')} options={MEDIOS} />
        <TextInput label="Fecha" type="date" value={f.fecha} onChange={set('fecha')} />
        <TextInput full label="Referencia de la operación" value={f.referencia} onChange={set('referencia')} placeholder="N° de operación, últimos 4 dígitos…" />
        {puedeSubirArchivos && <FileInput label="Comprobante (foto o PDF)" hint="Opcional: captura de la transferencia, Mercado Pago o ticket." onChange={setArchivo} />}
      </FormGrid>
      <div className={styles.total}><Summary items={[{ label: 'Total a cobrar', value: money((+f.importe || 0) + (+f.recargo || 0)), big: true }]} /></div>
    </Modal>
  );
}
