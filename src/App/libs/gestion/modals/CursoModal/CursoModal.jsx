import { ESTADOS_CURSO, MODALIDADES } from '../../config/constants';
import { CONFIG_INICIAL } from '../../config/defaults';
import { cuotaEstado, enEspera } from '../../lib/business';
import { addMonths, fdate, firstName, fullName, money, today } from '../../lib/format';
import { fillTpl, plantilla, varsCurso } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { SelectInput, TextArea, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal, { FooterSpacer } from '../../components/ui/Modal/Modal';
import Pill from '../../components/ui/Pill/Pill';
import SectionLabel from '../../components/ui/SectionLabel/SectionLabel';
import Table, { FullRow, Sub, Td } from '../../components/ui/Table/Table';
import InscripcionModal from '../InscripcionModal/InscripcionModal';
import WhatsAppModal from '../WhatsAppModal/WhatsAppModal';
import styles from './CursoModal.module.css';

const FORM_ID = 'arbitra-curso';
const NUMEROS = ['duracionMeses', 'cargaHoraria', 'cupo', 'matricula', 'valorCuota', 'cuotas'];
const CAMPOS = ['nombre', 'codigo', 'area', 'modalidad', 'horario', 'inicio', 'duracionMeses', 'cargaHoraria', 'cupo', 'matricula', 'valorCuota', 'cuotas', 'docenteId', 'estado', 'certTitulo', 'certTexto', 'descripcion'];

/** Alta o ficha de un curso: datos, precios, inscriptos y lista de espera. */
export default function CursoModal({ id, onClose }) {
  const { db, guardar, eliminar } = useData();
  const { abrirModal, toast } = useUi();
  const { confirmar } = useAcciones();
  const original = id ? db.get('cursos', id) : null;
  const esNuevo = !original;
  const c = original || { estado: 'Inscripción abierta', modalidad: 'Presencial', duracionMeses: 6, cuotas: 6, cupo: 20, inicio: addMonths(today(), 1, 1) };
  const [f, set] = useForm(Object.fromEntries(CAMPOS.map((k) => [k, c[k] ?? ''])));
  const inscriptos = esNuevo ? [] : db.inscripciones.filter((i) => i.cursoId === id && i.estado === 'Activa');
  const espera = esNuevo ? [] : enEspera(db, id);
  const cfg = db.config;

  const enviar = async () => {
    if (!f.nombre.trim()) { toast('Completá el nombre del curso'); return; }
    const d = { ...c, ...f, nombre: f.nombre.trim() };
    NUMEROS.forEach((k) => { d[k] = +d[k] || 0; });
    try { await guardar('cursos', d); onClose(); toast(esNuevo ? 'Curso creado' : 'Curso actualizado'); } catch (e) { /* aviso */ }
  };

  const borrar = () => {
    if (db.inscripciones.some((i) => i.cursoId === c.id)) { toast('No se puede eliminar: tiene inscripciones. Marcalo como Finalizado.'); return; }
    confirmar(<>¿Eliminar el curso <b>{c.nombre}</b>?</>, 'Eliminar', async () => { await eliminar('cursos', c.id); toast('Curso eliminado'); });
  };

  const duplicar = async () => {
    const { id: _id, ejemplo, creadoPor, creadoEn, modificadoPor, actualizado, ...resto } = c;
    try {
      await guardar('cursos', { ...resto, codigo: `${c.codigo || ''}-B`, estado: 'Borrador', inicio: addMonths(c.inicio || today(), +c.duracionMeses || 6, 1) });
      onClose(); toast('Comisión duplicada como Borrador');
    } catch (e) { /* aviso */ }
  };

  const avisarLugar = (p) => {
    const v = { nombre: firstName(p.nombre), ...varsCurso(c) };
    abrirModal(WhatsAppModal, {
      tel: p.telefono, nombre: p.nombre,
      opciones: [{ key: 'tplEspera', label: 'Aviso de lugar disponible', text: fillTpl(plantilla(cfg, 'tplEspera'), v, cfg) }, { key: 'libre', label: 'Mensaje libre', text: `Hola ${v.nombre}, ` }],
      onOpen: async () => {
        const cur = db.get('prospectos', p.id); if (!cur) return;
        await guardar('prospectos', { ...cur, historial: [...(cur.historial || []), { fecha: today(), texto: `Se le avisó por WhatsApp que hay lugar en ${c.nombre}.` }] });
      },
    });
  };

  return (
    <Modal wide={!esNuevo} title={esNuevo ? 'Nuevo curso' : c.nombre} onClose={onClose} footer={<>
      {!esNuevo && <><Button variant="danger" onClick={borrar}>Eliminar</Button><FooterSpacer /><Button onClick={duplicar}>Duplicar como nueva comisión</Button></>}
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Guardar</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput full label="Nombre del curso *" value={f.nombre} onChange={set('nombre')} required />
        <TextInput label="Código / comisión" value={f.codigo} onChange={set('codigo')} placeholder="ELEC-2026-T" />
        <TextInput label="Área" value={f.area} onChange={set('area')} placeholder="Oficios, Administración, Tecnología…" />
        <SelectInput label="Modalidad" value={f.modalidad} onChange={set('modalidad')} options={MODALIDADES} />
        <TextInput label="Días y horario" value={f.horario} onChange={set('horario')} placeholder="Lun y Mié 18 a 21 h" />
        <TextInput label="Fecha de inicio" type="date" value={f.inicio} onChange={set('inicio')} />
        <TextInput label="Duración (meses)" type="number" min="0" value={f.duracionMeses} onChange={set('duracionMeses')} />
        <TextInput label="Carga horaria total (h)" type="number" min="0" value={f.cargaHoraria} onChange={set('cargaHoraria')} />
        <TextInput label="Cupo" type="number" min="0" value={f.cupo} onChange={set('cupo')} hint="0 = sin límite." />
        <TextInput label="Matrícula ($)" type="number" min="0" value={f.matricula} onChange={set('matricula')} />
        <TextInput label="Valor de cuota ($)" type="number" min="0" value={f.valorCuota} onChange={set('valorCuota')} />
        <TextInput label="Cantidad de cuotas" type="number" min="0" value={f.cuotas} onChange={set('cuotas')} />
        <SelectInput label="Docente a cargo" value={f.docenteId} onChange={set('docenteId')} options={[['', 'Sin asignar'], ...db.docentes.map((d) => [d.id, d.nombre])]} />
        <SelectInput label="Estado" value={f.estado} onChange={set('estado')} options={ESTADOS_CURSO} />
        <TextInput label="Título que otorga (certificado)" value={f.certTitulo} onChange={set('certTitulo')} placeholder={cfg.certTitulo || CONFIG_INICIAL.certTitulo} hint="Vacío = el título general de Ajustes." />
        <TextInput full label="Frase del certificado" value={f.certTexto} onChange={set('certTexto')} placeholder={cfg.certTexto || CONFIG_INICIAL.certTexto} hint="Vacío = la frase general de Ajustes. Podés usar {curso} y {horas}." />
        <TextArea label="Descripción / contenidos" value={f.descripcion} onChange={set('descripcion')} />
      </FormGrid>

      {!esNuevo && <>
        <div className={styles.bloque}>
          <SectionLabel>Inscriptos activos ({inscriptos.length}/{c.cupo || '∞'})</SectionLabel>
          <Table compact>
            {inscriptos.length ? inscriptos.map((i) => {
              const a = db.get('alumnos', i.alumnoId);
              const debe = (i.cuotas || []).reduce((s, q) => { const st = cuotaEstado(q); return s + (st.k === 'vencida' ? st.saldo : 0); }, 0);
              return (
                <tr key={i.id}>
                  <Td>{fullName(a)}</Td><Td mono>{(a && a.telefono) || ''}</Td>
                  <Td num>{debe ? <span className={styles.debe}>Debe {money(debe)}</span> : <Pill tono="ok">Al día</Pill>}</Td>
                </tr>
              );
            }) : <FullRow cols={3}><EmptyState>Sin inscriptos</EmptyState></FullRow>}
          </Table>
        </div>
        <div className={styles.bloque}>
          <SectionLabel>Lista de espera ({espera.length})</SectionLabel>
          <Table compact>
            {espera.length ? espera.map((p, k) => (
              <tr key={p.id}>
                <Td mono className={styles.pos}>{k + 1}</Td>
                <Td><b>{p.nombre}</b><Sub>{p.telefono || 'Sin teléfono'} · desde {fdate(p.esperaDesde || p.creado)}</Sub></Td>
                <Td>
                  <span className={styles.acciones}>
                    <Button size="sm" variant="waGhost" onClick={() => avisarLugar(p)}>Avisar lugar</Button>
                    <Button size="sm" variant="primary" onClick={() => abrirModal(InscripcionModal, { prospectoId: p.id })}>Inscribir</Button>
                  </span>
                </Td>
              </tr>
            )) : <FullRow cols={3}><EmptyState>Nadie en espera. Cuando el cupo se completa, al inscribir aparece la opción de anotar en la lista.</EmptyState></FullRow>}
          </Table>
        </div>
      </>}
    </Modal>
  );
}
