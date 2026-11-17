import { useMemo, useState } from 'react';
import { deudaAlumno } from '../../lib/business';
import { csvExportacion } from '../../lib/exportar';
import { fullName, money, today } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Panel from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Table, { FullRow, Sub, Td, Th, Tr } from '../../components/ui/Table/Table';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import AlumnoModal from '../../modals/AlumnoModal/AlumnoModal';
import styles from './AlumnosView.module.css';

const TONO = { Activo: 'ok', Baja: 'bad', Egresado: 'info' };

export default function AlumnosView() {
  const { db, nombreUsuario } = useData();
  const { abrirModal } = useUi();
  const { descargar } = useAcciones();
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('Activo');

  const lista = useMemo(() => {
    const qq = q.toLowerCase();
    return db.alumnos.filter((a) => (!estado || a.estado === estado) && (!qq || [a.nombre, a.apellido, a.dni, a.email, a.telefono].join(' ').toLowerCase().includes(qq)))
      .sort((a, b) => fullName(a).localeCompare(fullName(b)));
  }, [db.alumnos, q, estado]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Alumnos"
        description="Legajo de cada estudiante con sus cursos, estado de cuenta e historial."
        actions={<>
          <Button onClick={() => descargar(`arbitra-alumnos-${today()}.csv`, csvExportacion(db, 'alumnos', nombreUsuario), 'text/csv')}>Exportar CSV</Button>
          <Button variant="primary" onClick={() => abrirModal(AlumnoModal, {})}>+ Nuevo alumno</Button>
        </>}
      />
      <ExampleBanner />
      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre, DNI, email o teléfono" />
        <SegmentedControl ariaLabel="Estado" value={estado} onChange={setEstado} options={[['Activo', 'Activo'], ['Egresado', 'Egresado'], ['Baja', 'Baja'], ['', 'Todos']]} />
      </Toolbar>
      <Panel flush>
        <Table head={<><Th>Alumno</Th><Th>DNI</Th><Th>Contacto</Th><Th>Cursos</Th><Th num>Deuda</Th><Th>Estado</Th></>}>
          {lista.length ? lista.map((a) => {
            const ins = db.inscripciones.filter((i) => i.alumnoId === a.id && i.estado === 'Activa');
            const d = deudaAlumno(db, a.id);
            return (
              <Tr key={a.id} onClick={() => abrirModal(AlumnoModal, { id: a.id })}>
                <Td><b>{fullName(a)}</b><ExampleTag item={a} /><Sub>{a.localidad}</Sub></Td>
                <Td mono>{a.dni || '—'}</Td>
                <Td>{a.telefono || '—'}<Sub>{a.email}</Sub></Td>
                <Td>{ins.length ? ins.map((i) => <div key={i.id}>{(db.get('cursos', i.cursoId) || {}).nombre || '—'}</div>) : <Sub>Sin curso activo</Sub>}</Td>
                <Td num>{d.deuda ? <span className={d.vencida ? styles.debe : ''}>{money(d.deuda)}</span> : '—'}</Td>
                <Td><Pill tono={TONO[a.estado]}>{a.estado}</Pill></Td>
              </Tr>
            );
          }) : (
            <FullRow cols={6}><EmptyState title={`No hay alumnos ${estado ? `${estado.toLowerCase()}s ` : ''}para mostrar`}>Los alumnos se crean al inscribir a alguien o al convertir un prospecto.</EmptyState></FullRow>
          )}
        </Table>
      </Panel>
    </div>
  );
}
