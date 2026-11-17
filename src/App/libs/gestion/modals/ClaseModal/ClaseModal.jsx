import { useState } from 'react';
import { MARCAS, MARCAS_CORTAS } from '../../config/constants';
import { resumenCurso } from '../../lib/business';
import { fdate, fullName, today } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal, { FooterSpacer } from '../../components/ui/Modal/Modal';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Table, { Td } from '../../components/ui/Table/Table';
import styles from './ClaseModal.module.css';

const FORM_ID = 'arbitra-clase';
const OPCIONES = Object.keys(MARCAS).map((k) => [k, MARCAS_CORTAS[k]]);

/** Toma o corrige la asistencia de una clase. El id de la clase es `${cursoId}_${fecha}`. */
export default function ClaseModal({ cursoId, claseId, onClose }) {
  const { db, guardar, eliminar, nombreUsuario } = useData();
  const { toast } = useUi();
  const { confirmar } = useAcciones();
  const c = db.get('cursos', cursoId);
  const R = resumenCurso(db, cursoId);
  const cl = claseId ? db.get('asistencia', claseId) : null;
  const [fecha, setFecha] = useState(cl ? cl.fecha : today());
  const [tema, setTema] = useState(cl ? cl.tema || '' : '');
  const [marcas, setMarcas] = useState(() => {
    const m = { ...(cl ? cl.marcas : {}) };
    R.rows.forEach((r) => { if (!m[r.ins.id]) m[r.ins.id] = cl ? '' : 'P'; });
    return m;
  });

  if (!c || !R.rows.length) {
    return <Modal title="Tomar asistencia" onClose={onClose} footer={<Button onClick={onClose}>Cerrar</Button>}><EmptyState>Este curso no tiene alumnos inscriptos.</EmptyState></Modal>;
  }

  const valores = Object.values(marcas);
  const resumen = `${valores.filter((x) => x === 'P' || x === 'T').length} presentes · ${valores.filter((x) => x === 'A').length} ausentes · ${valores.filter((x) => !x).length} sin marcar`;

  const enviar = async () => {
    if (!fecha) { toast('Elegí la fecha de la clase.'); return; }
    const id = `${cursoId}_${fecha}`;
    if (db.get('asistencia', id) && (!cl || cl.id !== id)) { toast('Ya hay una clase registrada en esa fecha. Abrila desde la planilla para editarla.'); return; }
    const doc = { ...(cl || {}), id, cursoId, fecha, tema: tema.trim(), marcas: Object.fromEntries(Object.entries(marcas).filter(([, x]) => x)) };
    try {
      await guardar('asistencia', doc);
      if (cl && cl.id !== id) await eliminar('asistencia', cl.id);
      onClose(); toast('Asistencia guardada');
    } catch (e) { /* aviso */ }
  };
  const borrar = () => confirmar(`¿Eliminar la clase del ${fdate(cl.fecha)} y su asistencia?`, 'Eliminar', async () => { await eliminar('asistencia', cl.id); toast('Clase eliminada'); });

  return (
    <Modal wide title={cl ? `Clase del ${fdate(cl.fecha)}` : `Tomar asistencia · ${c.nombre}`} onClose={onClose} footer={<>
      {cl && <><Button variant="danger" onClick={borrar}>Eliminar clase</Button><FooterSpacer /></>}
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Guardar asistencia</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput label="Fecha de la clase" type="date" value={fecha} onChange={setFecha} />
        <TextInput label="Tema o contenido de la clase" value={tema} onChange={setTema} placeholder="Ej.: Circuitos en serie y en paralelo" />
      </FormGrid>
      <div className={styles.barra}>
        <Button size="sm" onClick={() => setMarcas((m) => Object.fromEntries(Object.keys(m).map((k) => [k, 'P'])))}>Marcar todos presentes</Button>
        <span className={styles.resumen}>{resumen}</span>
        {cl && cl.creadoPor && <span className={styles.quien}>Tomada por {nombreUsuario(cl.creadoPor)}</span>}
      </div>
      <Table compact>
        {R.rows.map((r) => (
          <tr key={r.ins.id}>
            <Td><b>{fullName(r.a)}</b></Td>
            <Td className={styles.marcas}>
              <SegmentedControl compact ariaLabel={`Asistencia de ${fullName(r.a)}`} value={marcas[r.ins.id]} options={OPCIONES}
                onChange={(x) => setMarcas((m) => ({ ...m, [r.ins.id]: x }))} />
            </Td>
          </tr>
        ))}
      </Table>
    </Modal>
  );
}
