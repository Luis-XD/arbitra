import { money, today, ym } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Panel from '../../components/ui/Panel/Panel';
import Table, { FullRow, Sub, Td, Th, Tr } from '../../components/ui/Table/Table';
import DocenteModal from '../../modals/DocenteModal/DocenteModal';
import LiquidarModal from '../../modals/LiquidarModal/LiquidarModal';
import styles from './DocentesView.module.css';

export default function DocentesView() {
  const { db } = useData();
  const { abrirModal } = useUi();
  const mk = ym(today());
  const lista = [...db.docentes].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

  return (
    <div className={styles.page}>
      <PageHeader
        title="Docentes"
        description="Plantel, cursos a cargo y liquidación de honorarios."
        actions={<>
          <Button onClick={() => abrirModal(LiquidarModal, {})}>Liquidar honorarios</Button>
          <Button variant="primary" onClick={() => abrirModal(DocenteModal, {})}>+ Nuevo docente</Button>
        </>}
      />
      <ExampleBanner />
      <Panel flush>
        <Table head={<><Th>Docente</Th><Th>Especialidad</Th><Th>Contacto</Th><Th>Cursos a cargo</Th><Th num>Valor hora</Th><Th num>Pagado este mes</Th><Th /></>}>
          {lista.length ? lista.map((d) => {
            const cs = db.cursos.filter((c) => c.docenteId === d.id && c.estado !== 'Finalizado');
            const pagado = db.caja.filter((m) => !m.anulado && m.refTipo === 'docente' && m.refId === d.id && ym(m.fecha) === mk)
              .reduce((s, m) => s + (+m.importe || 0), 0);
            return (
              <Tr key={d.id} onClick={() => abrirModal(DocenteModal, { id: d.id })}>
                <Td><b>{d.nombre}</b><ExampleTag item={d} /><Sub mono>CUIT {d.cuit || '—'}</Sub></Td>
                <Td>{d.especialidad || ''}</Td>
                <Td>{d.telefono || ''}<Sub>{d.email || ''}</Sub></Td>
                <Td>{cs.length ? <span className={styles.cursos}>{cs.map((c) => <span key={c.id}>{c.nombre}</span>)}</span> : <Sub>—</Sub>}</Td>
                <Td num>{money(d.valorHora)}</Td>
                <Td num>{pagado ? money(pagado) : '—'}</Td>
                <Td><Button size="sm" onClick={(e) => { e.stopPropagation(); abrirModal(LiquidarModal, { docenteId: d.id }); }}>Liquidar</Button></Td>
              </Tr>
            );
          }) : (
            <FullRow cols={7}><EmptyState title="Sin docentes cargados">Sumá a tu plantel para asignarlo a los cursos y liquidar honorarios.</EmptyState></FullRow>
          )}
        </Table>
      </Panel>
    </div>
  );
}
