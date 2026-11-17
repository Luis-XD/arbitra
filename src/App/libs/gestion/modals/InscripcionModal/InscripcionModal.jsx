import { useMemo, useState } from 'react';
import { MEDIOS } from '../../config/constants';
import { cupoLleno, enEspera, inscriptosActivos, planCuotas } from '../../lib/business';
import { fdate, fullName, money, today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import AlumnoCampos, { ALUMNO_VACIO } from '../../components/shared/AlumnoCampos/AlumnoCampos';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import Summary from '../../components/ui/Summary/Summary';
import Table, { Td, Th } from '../../components/ui/Table/Table';
import ReciboModal from '../ReciboModal/ReciboModal';
import styles from './InscripcionModal.module.css';

const FORM_ID = 'arbitra-inscripcion';
const NUEVO = '__nuevo';

function alumnoDesdeProspecto(p) {
  const partes = (p.nombre || '').trim().split(/\s+/);
  return {
    ...ALUMNO_VACIO, nombre: partes.slice(0, -1).join(' ') || partes[0] || '', apellido: partes.length > 1 ? partes[partes.length - 1] : '',
    telefono: p.telefono || '', email: p.email || '',
  };
}

/** Nueva inscripción: alumno (existente o nuevo), curso, plan de cuotas y cobro opcional de matrícula. */
export default function InscripcionModal({ prospectoId, alumnoId, cursoId, onClose }) {
  const { db, guardar, siguienteNumero } = useData();
  const { abrirModal, ir, toast } = useUi();
  const prospecto = prospectoId ? db.get('prospectos', prospectoId) : null;
  const alumnoFijo = db.get('alumnos', alumnoId || (prospecto && prospecto.alumnoId)) || null;
  const [alumno, setAlumno] = useState(() => (prospecto ? alumnoDesdeProspecto(prospecto) : { ...ALUMNO_VACIO }));
  const [f, set] = useForm({
    alumnoId: alumnoFijo ? alumnoFijo.id : NUEVO,
    cursoId: cursoId || (prospecto && prospecto.cursoId) || '', fecha: today(), becaPct: 0, inicioCobro: '', cobrarMat: 'no', medio: MEDIOS[0],
  });
  const [ocupado, setOcupado] = useState(false);

  const abiertos = db.cursos.filter((c) => ['Inscripción abierta', 'En curso'].includes(c.estado) || c.id === f.cursoId);
  const c = db.get('cursos', f.cursoId);
  const plan = useMemo(() => (c ? planCuotas(c, f.fecha || today(), f.becaPct, f.inicioCobro ? `${f.inicioCobro}-01` : null, db.config) : null), [c, f.fecha, f.becaPct, f.inicioCobro, db.config]);
  const lleno = cupoLleno(db, c);
  const nIns = c ? inscriptosActivos(db, c.id) : 0;
  const esNuevo = f.alumnoId === NUEVO;

  if (!db.cursos.length) {
    return (
      <Modal title="Nueva inscripción" onClose={onClose} footer={<Button variant="primary" onClick={() => { onClose(); ir('cursos'); }}>Ir a Cursos</Button>}>
        <EmptyState>Primero creá un curso.</EmptyState>
      </Modal>
    );
  }

  const anotarEnEspera = async () => {
    if (!c) return;
    const desde = today();
    let p = prospecto;
    if (!p) {
      let nombre; let telefono; let email; let idAl = '';
      if (!esNuevo) { const a = db.get('alumnos', f.alumnoId); nombre = `${a.nombre} ${a.apellido}`; telefono = a.telefono || ''; email = a.email || ''; idAl = a.id; } else { nombre = `${alumno.nombre.trim()} ${alumno.apellido.trim()}`.trim(); telefono = alumno.telefono; email = alumno.email; }
      if (!nombre) { toast('Completá al menos el nombre para anotarlo en la lista.'); return; }
      p = { nombre, telefono, email, alumnoId: idAl, origen: 'Otro', creado: desde, historial: [{ fecha: desde, texto: 'Consulta ingresada desde Inscripciones.' }] };
    }
    try {
      await guardar('prospectos', {
        ...p, etapa: 'En espera', cursoId: c.id, esperaDesde: p.esperaDesde || desde, proximoContacto: '',
        historial: [...(p.historial || []), { fecha: desde, texto: `Anotado en la lista de espera de ${c.nombre}.` }],
      });
      onClose(); toast(`Anotado en la lista de espera de ${c.nombre} · posición ${enEspera(db, c.id).length + (p.etapa === 'En espera' && p.cursoId === c.id ? 0 : 1)}`);
    } catch (e) { /* aviso */ }
  };

  const confirmar = async () => {
    if (!c) { toast('Elegí un curso'); return; }
    let idAl = f.alumnoId;
    setOcupado(true);
    try {
      if (esNuevo) {
        const dni = alumno.dni.trim();
        if (!alumno.nombre.trim() || !alumno.apellido.trim() || !dni) { toast('Completá nombre, apellido y DNI del alumno'); setOcupado(false); return; }
        const dup = db.alumnos.find((x) => x.dni === dni);
        if (dup) { idAl = dup.id; toast(`Se usó el legajo existente de ${fullName(dup)}`); } else {
          const nuevo = await guardar('alumnos', { ...alumno, nombre: alumno.nombre.trim(), apellido: alumno.apellido.trim(), dni, estado: 'Activo', creado: today(), prospectoId: prospecto ? prospecto.id : '' });
          idAl = nuevo.id;
        }
      }
      if (db.inscripciones.some((i) => i.alumnoId === idAl && i.cursoId === c.id && i.estado === 'Activa')) { toast('Este alumno ya está inscripto en ese curso.'); setOcupado(false); return; }
      const al = db.get('alumnos', idAl);
      if (al && al.estado !== 'Activo') await guardar('alumnos', { ...al, estado: 'Activo' });
      const ins = await guardar('inscripciones', { alumnoId: idAl, cursoId: c.id, fecha: f.fecha || today(), becaPct: +f.becaPct || 0, estado: 'Activa', cuotas: plan });
      let recibo = null;
      if (f.cobrarMat === 'si' && plan[0] && plan[0].n === 0) {
        try {
          recibo = await siguienteNumero('recibos');
          const nombreAl = al ? fullName(al) : `${alumno.apellido}, ${alumno.nombre}`;
          await guardar('caja', {
            fecha: f.fecha || today(), tipo: 'ingreso', categoria: 'Cuotas y matrículas', concepto: `Matrícula · ${nombreAl} · ${c.nombre}`,
            importe: plan[0].importe, aplicado: plan[0].importe, recargo: 0, medio: f.medio, referencia: '', refTipo: 'cuota', refId: ins.id, cuotaIdx: 0, alumnoId: idAl, cursoId: c.id, recibo,
          });
        } catch (e) { recibo = null; toast('La inscripción quedó guardada, pero no se pudo registrar el cobro de la matrícula. Registralo desde Cobranzas.'); }
      }
      if (prospecto) {
        await guardar('prospectos', { ...prospecto, etapa: 'Inscripto', proximoContacto: '', alumnoId: idAl, historial: [...(prospecto.historial || []), { fecha: today(), texto: `Se inscribió en ${c.nombre}.` }] });
      }
      onClose(); toast('Inscripción registrada');
      if (recibo) abrirModal(ReciboModal, { numero: recibo });
    } catch (e) { setOcupado(false); }
  };

  const alumnosOpts = [[NUEVO, '+ Alumno nuevo'], ...db.alumnos.filter((x) => x.estado !== 'Baja').sort((x, y) => fullName(x).localeCompare(fullName(y))).map((x) => [x.id, `${fullName(x)} · DNI ${x.dni}`])];
  const cuotas = plan ? plan.filter((q) => q.n > 0) : [];

  return (
    <Modal wide title={prospecto ? `Inscribir a ${prospecto.nombre}` : 'Nueva inscripción'} onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      {lleno && <Button onClick={anotarEnEspera}>Anotar en lista de espera</Button>}
      <Button variant="primary" type="submit" form={FORM_ID} disabled={ocupado}>{lleno ? 'Inscribir igual (sobrecupo)' : 'Confirmar inscripción'}</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={confirmar}>
        {alumnoFijo ? (
          <TextInput full label="Alumno" value={`${fullName(alumnoFijo)} · DNI ${alumnoFijo.dni}`} readOnly />
        ) : !prospecto && (
          <SelectInput full label="Alumno" value={f.alumnoId} onChange={set('alumnoId')} options={alumnosOpts} hint="Elegí un alumno existente o cargá uno nuevo." />
        )}
        {esNuevo && <AlumnoCampos valor={alumno} onCambio={setAlumno} />}
        <SelectInput full label="Curso *" value={f.cursoId} onChange={set('cursoId')} options={[['', 'Seleccioná un curso'], ...abiertos.map((x) => [x.id, `${x.nombre}${x.horario ? ` · ${x.horario}` : ''}`])]} />
        <TextInput label="Fecha de inscripción" type="date" value={f.fecha} onChange={set('fecha')} />
        <TextInput label="Beca / descuento en cuotas (%)" type="number" min="0" max="100" value={f.becaPct} onChange={set('becaPct')} />
        <TextInput label="Primer vencimiento de cuota (mes)" type="month" value={f.inicioCobro} onChange={set('inicioCobro')} hint="Vacío = mes de inicio del curso." />
        <SelectInput label="Cobrar matrícula ahora" value={f.cobrarMat} onChange={set('cobrarMat')} options={[['no', 'No, queda pendiente'], ['si', 'Sí, registrar el pago']]} />
        {f.cobrarMat === 'si' && <SelectInput label="Medio de pago de matrícula" value={f.medio} onChange={set('medio')} options={MEDIOS} />}
      </FormGrid>

      {plan ? <>
        <Summary items={[
          { label: 'Total del plan', value: money(plan.reduce((x, q) => x + q.importe, 0)) },
          { label: 'Cuotas', value: `${cuotas.length} × ${money(cuotas[0] ? cuotas[0].importe : 0)}` },
          { label: 'Cupo', value: `${nIns}/${c.cupo || '∞'}${lleno ? ' · completo' : ''}`, color: lleno ? 'var(--bad)' : undefined },
        ]} />
        <div className={styles.plan}>
          <Table compact head={<><Th>Concepto</Th><Th>Vence</Th><Th num>Importe</Th></>}>
            {plan.map((q) => <tr key={q.n}><Td>{q.concepto}</Td><Td mono>{fdate(q.vence)}</Td><Td num>{money(q.importe)}</Td></tr>)}
          </Table>
        </div>
      </> : <Summary items={[{ label: 'Plan de pagos', value: 'Elegí un curso', plain: true }]} />}
    </Modal>
  );
}
