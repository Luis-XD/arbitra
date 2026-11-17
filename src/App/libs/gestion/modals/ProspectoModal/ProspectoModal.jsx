import { ETAPAS, ORIGENES } from '../../config/constants';
import { firstName, today } from '../../lib/format';
import { fillTpl, plantilla, varsCurso } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Timeline from '../../components/shared/Timeline/Timeline';
import Button from '../../components/ui/Button/Button';
import { SelectInput, TextArea, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal, { FooterSpacer } from '../../components/ui/Modal/Modal';
import SectionLabel from '../../components/ui/SectionLabel/SectionLabel';
import InscripcionModal from '../InscripcionModal/InscripcionModal';
import PerdidoModal from '../PerdidoModal/PerdidoModal';
import WhatsAppModal from '../WhatsAppModal/WhatsAppModal';
import styles from './ProspectoModal.module.css';

const FORM_ID = 'arbitra-prospecto';

/** Alta o ficha de un prospecto del embudo de ventas. */
export default function ProspectoModal({ id, onClose }) {
  const { db, guardar, eliminar } = useData();
  const { abrirModal, toast } = useUi();
  const { confirmar } = useAcciones();
  const original = id ? db.get('prospectos', id) : null;
  const esNuevo = !original;
  const p = original || { etapa: 'Nuevo', origen: 'Instagram', proximoContacto: today(), historial: [] };
  const [f, set] = useForm({
    nombre: p.nombre || '', telefono: p.telefono || '', email: p.email || '', cursoId: p.cursoId || '',
    origen: p.origen || 'Otro', etapa: p.etapa, proximoContacto: p.proximoContacto || '', notas: p.notas || '', nuevoContacto: '',
  });
  const cursos = [['', 'Seleccioná un curso'], ...db.cursos.map((c) => [c.id, `${c.nombre}${c.horario ? ` · ${c.horario}` : ''}`])];
  const etapas = ETAPAS.filter((e) => e !== 'Inscripto' || p.etapa === 'Inscripto');

  const enviar = async () => {
    if (!f.nombre.trim()) { toast('Completá el nombre'); return; }
    const hist = [...(p.historial || [])];
    if (esNuevo) hist.push({ fecha: today(), texto: `Consulta ingresada por ${f.origen}.` });
    if (f.nuevoContacto.trim()) hist.push({ fecha: today(), texto: f.nuevoContacto.trim() });
    if (!esNuevo && f.etapa !== p.etapa) hist.push({ fecha: today(), texto: `Pasó a la etapa “${f.etapa}”.` });
    const { nuevoContacto, ...datos } = f;
    const np = { ...p, ...datos, nombre: f.nombre.trim(), historial: hist, creado: p.creado || today() };
    if (np.etapa === 'En espera' && !np.esperaDesde) np.esperaDesde = today();
    try { await guardar('prospectos', np); onClose(); toast(esNuevo ? 'Prospecto creado' : 'Prospecto actualizado'); } catch (e) { /* aviso en el proveedor */ }
  };

  const whatsapp = () => {
    const c = db.get('cursos', p.cursoId);
    const v = { nombre: firstName(p.nombre), ...varsCurso(c) };
    if (!c) v.curso = 'nuestros cursos';
    const orden = p.etapa === 'Nuevo' ? [['tplProspecto', 'Primer contacto'], ['tplSeguimiento', 'Seguimiento']] : [['tplSeguimiento', 'Seguimiento'], ['tplProspecto', 'Primer contacto']];
    abrirModal(WhatsAppModal, {
      tel: p.telefono, nombre: p.nombre,
      opciones: [...orden.map(([key, label]) => ({ key, label, text: fillTpl(plantilla(db.config, key), v, db.config) })), { key: 'libre', label: 'Mensaje libre', text: `Hola ${v.nombre}, ` }],
      onOpen: async (k, txt) => {
        const cur = db.get('prospectos', p.id); if (!cur) return;
        const historial = [...(cur.historial || []), { fecha: today(), texto: `WhatsApp abierto con el mensaje: “${txt.length > 140 ? `${txt.slice(0, 140)}…` : txt}”` }];
        const np = { ...cur, historial };
        if (cur.etapa === 'Nuevo') { np.etapa = 'Contactado'; historial.push({ fecha: today(), texto: 'Pasó a la etapa “Contactado”.' }); }
        await guardar('prospectos', np);
      },
    });
  };

  const borrar = () => confirmar(<>¿Eliminar a <b>{p.nombre}</b> del embudo? Esta acción no se puede deshacer.</>, 'Eliminar', async () => {
    await eliminar('prospectos', p.id); toast('Prospecto eliminado');
  });

  return (
    <Modal wide={!esNuevo} title={esNuevo ? 'Nuevo prospecto' : p.nombre} onClose={onClose} footer={<>
      {!esNuevo && <>
        <Button variant="danger" onClick={borrar}>Eliminar</Button><FooterSpacer />
        <Button variant="waGhost" onClick={whatsapp}>WhatsApp</Button>
        {p.etapa !== 'Inscripto' && <>
          <Button onClick={() => abrirModal(PerdidoModal, { id: p.id })}>Marcar perdido</Button>
          <Button onClick={() => abrirModal(InscripcionModal, { prospectoId: p.id })}>Inscribir como alumno</Button>
        </>}
      </>}
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Guardar</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput label="Nombre y apellido *" value={f.nombre} onChange={set('nombre')} required />
        <TextInput label="Teléfono / WhatsApp" type="tel" value={f.telefono} onChange={set('telefono')} />
        <TextInput label="Email" type="email" value={f.email} onChange={set('email')} />
        <SelectInput label="Curso de interés" value={f.cursoId} onChange={set('cursoId')} options={cursos} />
        <SelectInput label="¿Cómo nos conoció?" value={f.origen} onChange={set('origen')} options={ORIGENES} />
        <SelectInput label="Etapa" value={f.etapa} onChange={set('etapa')} options={etapas} />
        <TextInput label="Próximo seguimiento" type="date" value={f.proximoContacto} onChange={set('proximoContacto')} />
        <TextArea label="Notas" value={f.notas} onChange={set('notas')} />
        {!esNuevo && (
          <TextArea label="Registrar contacto" value={f.nuevoContacto} onChange={set('nuevoContacto')}
            placeholder="Ej.: Llamé, le envié el programa por WhatsApp. Vuelve a consultar el lunes." hint="Se agrega al historial con la fecha de hoy." />
        )}
      </FormGrid>
      {!esNuevo && (p.historial || []).length > 0 && (
        <div className={styles.historial}>
          <SectionLabel>Historial</SectionLabel>
          <Timeline items={p.historial} />
        </div>
      )}
    </Modal>
  );
}
