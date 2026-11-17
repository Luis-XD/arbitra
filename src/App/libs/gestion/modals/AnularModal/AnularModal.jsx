import { useState } from 'react';
import { conceptoMov } from '../../lib/business';
import { money, today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import styles from './AnularModal.module.css';

const FORM_ID = 'arbitra-anular';

/** Anula un cobro. Si el recibo agrupa varias cuotas, anula el recibo completo. */
export default function AnularModal({ movId, onClose }) {
  const { db, me, guardar } = useData();
  const { toast } = useUi();
  const [motivo, setMotivo] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const mov = db.get('caja', movId);
  if (!mov) return null;
  const grupo = mov.recibo ? db.caja.filter((m) => m.recibo === mov.recibo && m.refTipo === 'cuota' && !m.anulado) : [mov];

  const enviar = async () => {
    if (!me.admin) { toast('Solo un Editor puede anular cobros.'); return; }
    if (!motivo.trim()) { toast('Indicá el motivo de la anulación'); return; }
    setOcupado(true);
    try {
      for (const m of (grupo.length ? grupo : [mov])) { // eslint-disable-line no-restricted-syntax
        await guardar('caja', { ...m, anulado: true, anuladoPor: me.id, anuladoFecha: today(), motivoAnulacion: motivo.trim() }); // eslint-disable-line no-await-in-loop
      }
      onClose(); toast(`Recibo ${mov.recibo} anulado`);
    } catch (e) { setOcupado(false); }
  };

  return (
    <Modal title="Anular cobro" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="dangerSolid" type="submit" form={FORM_ID} disabled={ocupado || !me.admin}>Anular cobro</Button>
    </>}>
      {grupo.length > 1 ? (
        <p className={styles.texto}>El recibo <b>{mov.recibo}</b> incluye <b>{grupo.length} cuotas</b> por {money(grupo.reduce((t, m) => t + (+m.importe || 0), 0))}. Se anula el recibo completo: las {grupo.length} cuotas vuelven a quedar pendientes y los movimientos quedan en Caja marcados como anulados.</p>
      ) : (
        <p className={styles.texto}>Se anulará el recibo <b>{mov.recibo}</b> por {money(mov.importe)} ({conceptoMov(db, mov)}). La cuota vuelve a quedar pendiente y el movimiento queda en Caja marcado como anulado, con tu nombre y el motivo.</p>
      )}
      <FormGrid id={FORM_ID} columns={1} onSubmit={enviar}>
        <TextInput full label="Motivo de la anulación *" value={motivo} onChange={setMotivo} placeholder="Ej.: importe mal cargado" />
      </FormGrid>
    </Modal>
  );
}
