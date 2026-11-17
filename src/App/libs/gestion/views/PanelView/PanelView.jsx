import { useMemo } from 'react';
import { allCuotas, cajaMes } from '../../lib/business';
import { fdate, fshort, fullName, lastMonths, money, today, ym } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Kpi, { KpiGrid } from '../../components/ui/Kpi/Kpi';
import Panel, { Columns, PanelItem } from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import Table, { Td, Th, Tr, FullRow } from '../../components/ui/Table/Table';
import ProspectoModal from '../../modals/ProspectoModal/ProspectoModal';
import InscripcionModal from '../../modals/InscripcionModal/InscripcionModal';
import SelectorCobroModal from '../../modals/SelectorCobroModal/SelectorCobroModal';
import PagoModal from '../../modals/PagoModal/PagoModal';
import IngresosChart from './IngresosChart';
import styles from './PanelView.module.css';

export default function PanelView() {
  const { db } = useData();
  const { abrirModal, ir } = useUi();
  const t = today(); const mk = ym(t);

  const d = useMemo(() => {
    const cq = allCuotas(db);
    const vencidas = cq.filter((c) => c.st.k === 'vencida');
    const cobrables = cq.filter((c) => ym(c.q.vence) === mk);
    return {
      activos: db.alumnos.filter((a) => a.estado === 'Activo').length,
      vigentes: db.inscripciones.filter((i) => i.estado === 'Activa').length,
      abiertos: db.prospectos.filter((p) => !['Inscripto', 'Perdido'].includes(p.etapa)).length,
      convertidos: db.prospectos.filter((p) => p.etapa === 'Inscripto' && ym(p.actualizado || p.creado) === mk).length,
      caja: cajaMes(db, mk),
      esperado: cobrables.reduce((a, c) => a + (c.q.importe || 0), 0),
      cobrado: cobrables.reduce((a, c) => a + Math.min(c.q.pagado || 0, c.q.importe || 0), 0),
      deudaV: vencidas.reduce((a, c) => a + c.st.saldo, 0), nVencidas: vencidas.length,
      nDeudores: new Set(vencidas.map((c) => c.ins.alumnoId)).size,
      meses: lastMonths(6).map((k) => ({ k, ...cajaMes(db, k) })),
      seguimientos: db.prospectos.filter((p) => !['Inscripto', 'Perdido'].includes(p.etapa) && p.proximoContacto).sort((a, b) => a.proximoContacto.localeCompare(b.proximoContacto)).slice(0, 6),
      proximos: cq.filter((c) => c.st.k !== 'pagada').sort((a, b) => a.q.vence.localeCompare(b.q.vence)).slice(0, 6),
    };
  }, [db, mk]);

  const vacio = !db.cursos.length && !db.alumnos.length && !db.prospectos.length;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Panel del centro"
        description={`Resumen al ${fdate(t)} · ${db.config.institucion}`}
        actions={<>
          <Button onClick={() => abrirModal(ProspectoModal, {})}>+ Prospecto</Button>
          <Button onClick={() => abrirModal(InscripcionModal, {})}>+ Inscripción</Button>
          <Button variant="primary" onClick={() => abrirModal(SelectorCobroModal, {})}>Registrar cobro</Button>
        </>}
      />
      {/*
      <ExampleBanner />
      {vacio && (
        <Panel><EmptyState title="Todavía no hay datos cargados" action={<Button variant="primary" onClick={() => ir('cursos')}>Crear el primer curso</Button>}>
          Empezá por crear los cursos que dicta el centro, sumá a tus docentes y luego cargá prospectos o inscribí alumnos. El panel se completa solo a medida que trabajás.
        </EmptyState></Panel>
      )}
      <KpiGrid>
        <Kpi label="Alumnos activos" value={d.activos} sub={`${d.vigentes} inscripciones vigentes`} />
        <Kpi label="Prospectos abiertos" value={d.abiertos} sub={`${d.convertidos} convertidos este mes`} />
        <Kpi tono="good" label="Ingresos del mes" value={money(d.caja.ing)} sub={`Egresos ${money(d.caja.egr)} · Resultado ${money(d.caja.ing - d.caja.egr)}`} />
        <Kpi label="Cobranza del mes" value={`${d.esperado ? Math.round((d.cobrado / d.esperado) * 100) : 0}%`} sub={`${money(d.cobrado)} de ${money(d.esperado)} con vencimiento en el mes`} />
        <Kpi tono={d.deudaV ? 'bad' : ''} label="Deuda vencida" value={money(d.deudaV)} sub={`${d.nVencidas} cuotas · ${d.nDeudores} alumnos`} />
      </KpiGrid>
      <Columns>
        <Panel title="Ingresos y egresos · últimos 6 meses" actions={<Button size="sm" variant="ghost" onClick={() => ir('caja')}>Ver caja</Button>}>
          <IngresosChart meses={d.meses} mesActual={mk} />
        </Panel>
        <Panel title="Seguimientos comerciales" flush actions={<Button size="sm" variant="ghost" onClick={() => ir('prospectos')}>Ver embudo</Button>}>
          {d.seguimientos.length ? d.seguimientos.map((p) => {
            const late = p.proximoContacto < t; const c = db.get('cursos', p.cursoId);
            return (
              <PanelItem key={p.id} onClick={() => abrirModal(ProspectoModal, { id: p.id })}
                title={<>{p.nombre}<ExampleTag item={p} /></>} sub={`${c ? c.nombre : 'Sin curso definido'} · ${p.etapa}`}
                aside={<Pill tono={late ? 'bad' : p.proximoContacto === t ? 'warn' : ''}>{late ? 'Atrasado · ' : ''}{fshort(p.proximoContacto)}</Pill>} />
            );
          }) : <EmptyState>No hay seguimientos agendados.</EmptyState>}
        </Panel>
      </Columns>
      <Panel title="Próximos vencimientos y deudas" flush actions={<Button size="sm" variant="ghost" onClick={() => ir('cobranzas')}>Ir a cobranzas</Button>}>
        <Table head={<><Th>Alumno</Th><Th>Curso</Th><Th>Concepto</Th><Th>Vence</Th><Th num>Saldo</Th><Th>Estado</Th><Th /></>}>
          {d.proximos.length ? d.proximos.map((c) => (
            <Tr key={`${c.ins.id}-${c.i}`}>
              <Td>{fullName(c.alumno)}<ExampleTag item={c.ins} /></Td>
              <Td>{c.curso ? c.curso.nombre : '—'}</Td>
              <Td>{c.q.concepto}</Td>
              <Td mono>{fdate(c.q.vence)}</Td>
              <Td num>{money(c.st.saldo)}</Td>
              <Td><Pill tono={c.st.tono}>{c.st.lbl}</Pill></Td>
              <Td><Button size="sm" onClick={() => abrirModal(PagoModal, { insId: c.ins.id, idx: c.i })}>Cobrar</Button></Td>
            </Tr>
          )) : <FullRow cols={7}><EmptyState>No hay cuotas pendientes.</EmptyState></FullRow>}
        </Table>
      </Panel>*/}
    </div>
  );
}
