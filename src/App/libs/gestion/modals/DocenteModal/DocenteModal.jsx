import { CONDICIONES_DOCENTE } from '../../config/constants';
import { fdate, money } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal, { FooterSpacer } from '../../components/ui/Modal/Modal';
import SectionLabel from '../../components/ui/SectionLabel/SectionLabel';
import Table, { Td } from '../../components/ui/Table/Table';
import styles from './DocenteModal.module.css';

const FORM_ID = 'arbitra-docente';
const CAMPOS = ['nombre', 'especialidad', 'cuit', 'telefono', 'email', 'valorHora', 'condicion', 'cbu'];

/** Alta o ficha de un docente, con su historial de liquidaciones. */
export default function DocenteModal({ id, onClose }) {
  const { db, guardar, eliminar } = useData();
  const { toast } = useUi();
  const { confirmar } = useAcciones();
  const original = id ? db.get('docentes', id) : null;
  const esNuevo = !original;
  const d = original || { estado: 'Activo', condicion: CONDICIONES_DOCENTE[0] };
  const [f, set] = useForm(Object.fromEntries(CAMPOS.map((k) => [k, d[k] ?? ''])));
  const liquidaciones = esNuevo ? [] : db.caja.filter((m) => !m.anulado && m.refTipo === 'docente' && m.refId === id).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));

  const enviar = async () => {
    if (!f.nombre.trim()) { toast('Completá el nombre'); return; }
    try { await guardar('docentes', { ...d, ...f, nombre: f.nombre.trim(), valorHora: +f.valorHora || 0 }); onClose(); toast('Docente guardado'); } catch (e) { /* aviso */ }
  };
  const borrar = () => {
    if (db.cursos.some((c) => c.docenteId === d.id)) { toast('Reasigná sus cursos antes de eliminarlo.'); return; }
    confirmar(<>¿Eliminar a <b>{d.nombre}</b>?</>, 'Eliminar', async () => { await eliminar('docentes', d.id); toast('Docente eliminado'); });
  };

  return (
    <Modal title={esNuevo ? 'Nuevo docente' : d.nombre} onClose={onClose} footer={<>
      {!esNuevo && <><Button variant="danger" onClick={borrar}>Eliminar</Button><FooterSpacer /></>}
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Guardar</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput full label="Nombre y apellido *" value={f.nombre} onChange={set('nombre')} required />
        <TextInput label="Especialidad" value={f.especialidad} onChange={set('especialidad')} />
        <TextInput label="CUIT / CUIL" value={f.cuit} onChange={set('cuit')} />
        <TextInput label="Teléfono" type="tel" value={f.telefono} onChange={set('telefono')} />
        <TextInput label="Email" type="email" value={f.email} onChange={set('email')} />
        <TextInput label="Valor hora ($)" type="number" min="0" value={f.valorHora} onChange={set('valorHora')} />
        <SelectInput label="Condición" value={f.condicion} onChange={set('condicion')} options={CONDICIONES_DOCENTE} />
        <TextInput full label="CBU / alias" value={f.cbu} onChange={set('cbu')} />
      </FormGrid>
      {liquidaciones.length > 0 && (
        <div className={styles.bloque}>
          <SectionLabel>Liquidaciones</SectionLabel>
          <Table compact>
            {liquidaciones.map((m) => <tr key={m.id}><Td mono>{fdate(m.fecha)}</Td><Td>{m.concepto}</Td><Td num>{money(m.importe)}</Td></tr>)}
          </Table>
        </div>
      )}
    </Modal>
  );
}
