import { MOTIVOS_PERDIDA } from '../../config/constants';
import { today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { SelectInput, TextArea } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import styles from './PerdidoModal.module.css';

const FORM_ID = 'arbitra-perdido';

/** Cierra un prospecto como perdido registrando el motivo (alimenta el reporte de pérdidas). */
export default function PerdidoModal({ id, onClose }) {
  const { db, guardar } = useData();
  const { toast } = useUi();
  const p = db.get('prospectos', id);
  const [f, set] = useForm({ motivo: MOTIVOS_PERDIDA[0], nota: '' });
  if (!p) return null;

  const enviar = async () => {
    try {
      await guardar('prospectos', {
        ...p, etapa: 'Perdido', motivoPerdida: f.motivo, proximoContacto: '',
        historial: [...(p.historial || []), { fecha: today(), texto: `Perdido: ${f.motivo}${f.nota.trim() ? `. ${f.nota.trim()}` : ''}` }],
      });
      onClose(); toast('Prospecto marcado como perdido');
    } catch (e) { /* aviso en el proveedor */ }
  };

  return (
    <Modal title={`Marcar como perdido: ${p.nombre}`} onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Marcar perdido</Button>
    </>}>
      <div className={styles.form}>
        <FormGrid id={FORM_ID} columns={1} onSubmit={enviar}>
          <SelectInput full label="Motivo" value={f.motivo} onChange={set('motivo')} options={MOTIVOS_PERDIDA} />
          <TextArea label="Comentario" value={f.nota} onChange={set('nota')} />
        </FormGrid>
      </div>
    </Modal>
  );
}
