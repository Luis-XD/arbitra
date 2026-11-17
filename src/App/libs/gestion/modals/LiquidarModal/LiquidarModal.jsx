import { MEDIOS } from '../../config/constants';
import { money, monthLong, today, ym } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import Summary from '../../components/ui/Summary/Summary';
import styles from './LiquidarModal.module.css';

const FORM_ID = 'arbitra-liquidar';

/** Registra el pago de honorarios de un docente como egreso de caja. */
export default function LiquidarModal({ docenteId, onClose }) {
  const { db, guardar } = useData();
  const { toast } = useUi();
  const d0 = (docenteId && db.get('docentes', docenteId)) || db.docentes[0];
  const [f, set, setF] = useForm({
    docenteId: d0 ? d0.id : '', periodo: ym(today()), horas: '', valorHora: d0 ? d0.valorHora || 0 : 0,
    adicional: 0, medio: 'Transferencia', fecha: today(),
  });

  if (!d0) {
    return (
      <Modal title="Liquidar honorarios" onClose={onClose} footer={<Button onClick={onClose}>Cerrar</Button>}>
        <EmptyState>Primero cargá al menos un docente.</EmptyState>
      </Modal>
    );
  }

  const total = (+f.horas || 0) * (+f.valorHora || 0) + (+f.adicional || 0);
  const cambiarDocente = (idDoc) => { const d = db.get('docentes', idDoc); setF((x) => ({ ...x, docenteId: idDoc, valorHora: d ? d.valorHora || 0 : 0 })); };

  const enviar = async () => {
    if (total <= 0) { toast('Ingresá las horas dictadas'); return; }
    const d = db.get('docentes', f.docenteId);
    try {
      await guardar('caja', {
        fecha: f.fecha || today(), tipo: 'egreso', categoria: 'Honorarios docentes',
        concepto: `Honorarios ${d.nombre} · ${monthLong(f.periodo)} (${f.horas} h)`, importe: Math.round(total), medio: f.medio, refTipo: 'docente', refId: d.id,
      });
      onClose(); toast('Honorarios registrados en caja');
    } catch (e) { /* aviso */ }
  };

  return (
    <Modal title="Liquidar honorarios" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Registrar pago</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <SelectInput full label="Docente" value={f.docenteId} onChange={cambiarDocente} options={db.docentes.map((d) => [d.id, d.nombre])} />
        <TextInput label="Período" type="month" value={f.periodo} onChange={set('periodo')} />
        <TextInput label="Horas dictadas" type="number" min="0" step="0.5" value={f.horas} onChange={set('horas')} />
        <TextInput label="Valor hora ($)" type="number" min="0" value={f.valorHora} onChange={set('valorHora')} />
        <TextInput label="Adicionales / descuentos ($)" type="number" value={f.adicional} onChange={set('adicional')} hint="Negativo para descuentos." />
        <SelectInput label="Medio de pago" value={f.medio} onChange={set('medio')} options={MEDIOS} />
        <TextInput label="Fecha de pago" type="date" value={f.fecha} onChange={set('fecha')} />
      </FormGrid>
      <div className={styles.total}><Summary items={[{ label: 'Total a pagar', value: money(total), big: true }]} /></div>
    </Modal>
  );
}
