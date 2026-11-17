import { useMemo, useState } from 'react';
import { cajaMes, conceptoMov, difLabel } from '../../lib/business';
import { csvExportacion } from '../../lib/exportar';
import { fdate, money, monthLong, today, ym } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import LinkComprobante from '../../components/shared/LinkComprobante/LinkComprobante';
import BarRow from '../../components/ui/BarRow/BarRow';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Kpi, { KpiGrid } from '../../components/ui/Kpi/Kpi';
import Panel, { Columns, PanelItem, Stack } from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import { ToolbarSelect } from '../../components/ui/SearchInput/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Table, { FullRow, Sub, Td, Th, Tr } from '../../components/ui/Table/Table';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import CierreModal from '../../modals/CierreModal/CierreModal';
import MovimientoModal from '../../modals/MovimientoModal/MovimientoModal';
import styles from './CajaView.module.css';

export default function CajaView() {
  const { db, me, nombreUsuario } = useData();
  const { abrirModal } = useUi();
  const { descargar } = useAcciones();
  // Arranca en el mes actual; si todavía no tiene movimientos, en el último mes con datos.
  const [mes, setMes] = useState(() => {
    const actual = ym(today());
    if (db.caja.some((m) => ym(m.fecha) === actual)) return actual;
    return db.caja.map((m) => ym(m.fecha)).filter(Boolean).sort().pop() || actual;
  });
  const [tipo, setTipo] = useState('');

  const meses = useMemo(() => [...new Set([...db.caja.map((m) => ym(m.fecha)), ym(today())])].filter(Boolean).sort().reverse(), [db.caja]);
  const lista = useMemo(() => db.caja.filter((m) => ym(m.fecha) === mes && (!tipo || m.tipo === tipo))
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '') || (b.actualizado || '').localeCompare(a.actualizado || '')), [db.caja, mes, tipo]);
  const { ing, egr } = cajaMes(db, mes);

  const vigentes = db.caja.filter((m) => !m.anulado && ym(m.fecha) === mes);
  const porMedio = {};
  vigentes.forEach((m) => { const k = m.medio || 'Sin especificar'; porMedio[k] = (porMedio[k] || 0) + (m.tipo === 'ingreso' ? 1 : -1) * (+m.importe || 0); });
  const porCat = {};
  vigentes.filter((m) => m.tipo === 'egreso').forEach((m) => { porCat[m.categoria] = (porCat[m.categoria] || 0) + (+m.importe || 0); });
  const maxCat = Math.max(1, ...Object.values(porCat));
  const cierres = db.cierres.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 8);
  const hoyCerrada = !!db.get('cierres', today());

  const editable = (m) => m.refTipo !== 'cuota' && !m.anulado && (me.admin || !m.creadoPor || m.creadoPor === me.id);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Caja y gastos"
        description="Libro de movimientos: cada cobro entra automáticamente; los gastos y otros ingresos se cargan acá."
        actions={<>
          <Button onClick={() => descargar(`arbitra-caja-${today()}.csv`, csvExportacion(db, 'caja', nombreUsuario), 'text/csv')}>Exportar CSV</Button>
          <Button onClick={() => abrirModal(CierreModal, { fecha: today() })}>Cierre de caja</Button>
          <Button onClick={() => abrirModal(MovimientoModal, { tipo: 'ingreso' })}>+ Otro ingreso</Button>
          <Button variant="primary" onClick={() => abrirModal(MovimientoModal, { tipo: 'egreso' })}>+ Registrar gasto</Button>
        </>}
      />
      <ExampleBanner />
      <Toolbar>
        <ToolbarSelect ariaLabel="Mes" value={mes} onChange={setMes} options={meses.map((k) => [k, monthLong(k)])} />
        <SegmentedControl ariaLabel="Tipo" value={tipo} onChange={setTipo} options={[['', 'Todos'], ['ingreso', 'Ingresos'], ['egreso', 'Egresos']]} />
      </Toolbar>
      <KpiGrid>
        <Kpi tono="good" label="Ingresos" value={money(ing)} />
        <Kpi label="Egresos" value={money(egr)} />
        <Kpi tono={ing - egr < 0 ? 'bad' : ''} label="Resultado del mes" value={money(ing - egr)} />
      </KpiGrid>
      <Columns>
        <Panel flush title={`Movimientos (${lista.length})`}>
          <Table head={<><Th>Fecha</Th><Th>Concepto</Th><Th>Categoría</Th><Th>Medio</Th><Th num>Importe</Th><Th /></>}>
            {lista.length ? lista.map((m) => (
              <Tr key={m.id} muted={m.anulado}>
                <Td mono>{fdate(m.fecha)}</Td>
                <Td>
                  {conceptoMov(db, m)}<ExampleTag item={m} />
                  {m.recibo && <Sub mono>Recibo {m.recibo}{m.grupoCuotas > 1 ? ` · ${m.grupoCuotas} cuotas` : ''}</Sub>}
                  <LinkComprobante mov={m} />
                  {m.anulado && (
                    <span className={styles.anulado}><Pill tono="bad">Anulado</Pill>{m.motivoAnulacion || ''}{m.anuladoPor ? ` · por ${nombreUsuario(m.anuladoPor)}` : ''}</span>
                  )}
                  {m.creadoPor && <span className={styles.quien}>Registró {nombreUsuario(m.creadoPor)}</span>}
                </Td>
                <Td>{m.categoria}</Td>
                <Td>{m.medio || '—'}</Td>
                <Td num><span className={m.tipo === 'ingreso' ? styles.ingreso : styles.egreso}>{m.tipo === 'ingreso' ? '+' : '−'} {money(m.importe)}</span></Td>
                <Td>{editable(m) && <Button size="sm" variant="ghost" aria-label="Editar movimiento" onClick={() => abrirModal(MovimientoModal, { tipo: m.tipo, id: m.id })}>Editar</Button>}</Td>
              </Tr>
            )) : <FullRow cols={6}><EmptyState>Sin movimientos en este mes.</EmptyState></FullRow>}
          </Table>
        </Panel>
        <Stack>
          <Panel flush title="Cierres de caja" actions={hoyCerrada ? <Pill tono="ok">Hoy cerrada</Pill> : <Button size="sm" variant="primary" onClick={() => abrirModal(CierreModal, { fecha: today() })}>Cerrar hoy</Button>}>
            {cierres.length ? cierres.map((ci) => {
              const [lbl, tono] = difLabel(+ci.diferencia || 0);
              return (
                <PanelItem key={ci.id} onClick={() => abrirModal(CierreModal, { fecha: ci.fecha })}
                  title={<span className={styles.mono}>{fdate(ci.fecha)}</span>}
                  sub={`Contado ${money(ci.contado)}${ci.creadoPor ? ` · por ${nombreUsuario(ci.creadoPor)}` : ''}`}
                  aside={<Pill tono={tono}>{lbl}</Pill>} />
              );
            }) : <EmptyState>Todavía no se cerró la caja. Al final de cada día, contá el efectivo y tocá “Cerrar hoy”.</EmptyState>}
          </Panel>
          <Panel flush title="Saldo por medio de pago">
            {Object.keys(porMedio).length ? Object.entries(porMedio).map(([k, v]) => (
              <PanelItem key={k} title={k} aside={<span className={`${styles.mono} ${v < 0 ? styles.negativo : ''}`}>{money(v)}</span>} />
            )) : <EmptyState>Sin datos</EmptyState>}
          </Panel>
          <Panel title="Egresos por categoría">
            {Object.keys(porCat).length ? Object.entries(porCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <BarRow key={k} label={k} value={money(v)} pct={(v / maxCat) * 100} tono="mark" />
            )) : <p className={styles.vacio}>Sin egresos</p>}
          </Panel>
        </Stack>
      </Columns>
    </div>
  );
}
