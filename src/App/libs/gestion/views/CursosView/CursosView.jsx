import { useState } from 'react';
import { ESTADOS_CURSO } from '../../config/constants';
import { enEspera, inscriptosActivos } from '../../lib/business';
import { fdate, money } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import BarRow from '../../components/ui/BarRow/BarRow';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Panel from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Table, { FullRow, Sub, Td, Th, Tr } from '../../components/ui/Table/Table';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import CursoModal from '../../modals/CursoModal/CursoModal';
import styles from './CursosView.module.css';

const TONO = { 'Inscripción abierta': 'ok', 'En curso': 'info', Finalizado: '', Borrador: 'mark' };

export default function CursosView() {
  const { db } = useData();
  const { abrirModal } = useUi();
  const [estado, setEstado] = useState('');
  const lista = db.cursos.filter((c) => !estado || c.estado === estado).sort((a, b) => (a.inicio || '').localeCompare(b.inicio || ''));

  return (
    <div className={styles.page}>
      <PageHeader
        title="Cursos"
        description="Oferta formativa: aranceles, cupos, docentes y cronograma de cada comisión."
        actions={<Button variant="primary" onClick={() => abrirModal(CursoModal, {})}>+ Nuevo curso</Button>}
      />
      <ExampleBanner />
      <Toolbar>
        <SegmentedControl ariaLabel="Estado" value={estado} onChange={setEstado} options={[['', 'Todos'], ...ESTADOS_CURSO.map((e) => [e, e])]} />
      </Toolbar>
      <Panel flush>
        <Table head={<><Th>Curso</Th><Th>Modalidad · horario</Th><Th>Docente</Th><Th>Inicio</Th><Th num>Matrícula</Th><Th num>Cuota</Th><Th>Ocupación</Th><Th>Estado</Th></>}>
          {lista.length ? lista.map((c) => {
            const n = inscriptosActivos(db, c.id); const cupo = +c.cupo || 0;
            const pct = cupo ? Math.min(100, Math.round((n / cupo) * 100)) : 0;
            const d = db.get('docentes', c.docenteId); const esp = enEspera(db, c.id).length;
            return (
              <Tr key={c.id} onClick={() => abrirModal(CursoModal, { id: c.id })}>
                <Td><b>{c.nombre}</b><ExampleTag item={c} /><Sub>{c.area} · {c.codigo}</Sub></Td>
                <Td>{c.modalidad}<Sub>{c.horario}</Sub></Td>
                <Td>{d ? d.nombre : '—'}</Td>
                <Td mono>{fdate(c.inicio)}<Sub>{c.duracionMeses || '—'} meses</Sub></Td>
                <Td num>{money(c.matricula)}</Td>
                <Td num>{money(c.valorCuota)}<Sub>× {c.cuotas || 0}</Sub></Td>
                <Td><div className={styles.ocupacion}><BarRow compact pct={pct} tono={pct >= 100 ? 'bad' : pct >= 80 ? 'mark' : ''} value={`${n}/${cupo || '∞'}`} /></div>{esp > 0 && <Sub>+{esp} en espera</Sub>}</Td>
                <Td><Pill tono={TONO[c.estado]}>{c.estado}</Pill></Td>
              </Tr>
            );
          }) : (
            <FullRow cols={8}><EmptyState title="Todavía no hay cursos" action={<Button variant="primary" onClick={() => abrirModal(CursoModal, {})}>+ Nuevo curso</Button>}>
              Creá cada curso con su arancel y cantidad de cuotas: con esos datos el sistema arma solo el plan de pagos de cada inscripto.
            </EmptyState></FullRow>
          )}
        </Table>
      </Panel>
    </div>
  );
}
