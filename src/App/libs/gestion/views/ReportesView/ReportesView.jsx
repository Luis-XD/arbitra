import { useMemo } from 'react';
import { allCuotas, cajaMes, indicadores } from '../../lib/business';
import { csvExportacion } from '../../lib/exportar';
import { lastMonths, money, monthLong, today, ym } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import BarRow from '../../components/ui/BarRow/BarRow';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Kpi, { KpiGrid } from '../../components/ui/Kpi/Kpi';
import Panel, { Columns, PanelItem } from '../../components/ui/Panel/Panel';
import styles from './ReportesView.module.css';

const pct = (v, malo) => (v == null ? '—' : <span className={malo ? styles.malo : ''}>{v}%</span>);
const ordenar = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);

export default function ReportesView() {
  const { db, nombreUsuario } = useData();
  const { descargar } = useAcciones();

  const R = useMemo(() => {
    const meses = lastMonths(12); const desde = meses[0];
    const ingCurso = {};
    db.caja.filter((m) => !m.anulado && m.tipo === 'ingreso' && ym(m.fecha) >= desde).forEach((m) => {
      const k = m.cursoId ? ((db.get('cursos', m.cursoId) || {}).nombre || 'Curso eliminado') : m.categoria;
      ingCurso[k] = (ingCurso[k] || 0) + (+m.importe || 0);
    });
    const origen = {};
    db.prospectos.forEach((p) => { const k = p.origen || 'Otro'; origen[k] = origen[k] || { t: 0, i: 0 }; origen[k].t++; if (p.etapa === 'Inscripto') origen[k].i++; });
    const mora = {};
    allCuotas(db).filter((c) => c.st.k === 'vencida').forEach((c) => { const k = c.curso ? c.curso.nombre : '—'; mora[k] = (mora[k] || 0) + c.st.saldo; });
    const perdidos = {};
    db.prospectos.filter((p) => p.etapa === 'Perdido').forEach((p) => { const k = p.motivoPerdida || 'Sin motivo registrado'; perdidos[k] = (perdidos[k] || 0) + 1; });
    const resultado = meses.map((k) => ({ k, ...cajaMes(db, k) })).reverse();
    const IND = indicadores(db);
    return { ingCurso, origen, mora, perdidos, resultado, IND };
  }, [db]);

  const { IND } = R;
  const minA = +db.config.asistenciaMinima || 75;
  const maxP = Math.max(1, IND.atrasado, ...IND.proy.map((x) => x.v));
  const maxI = Math.max(1, ...Object.values(R.ingCurso));
  const maxM = Math.max(1, ...Object.values(R.mora));
  const exportar = (tipo) => descargar(`arbitra-${tipo}-${today()}.csv`, csvExportacion(db, tipo, nombreUsuario), 'text/csv');

  return (
    <div className={styles.page}>
      <PageHeader
        title="Reportes"
        description="Indicadores de gestión de los últimos 12 meses."
        actions={<>
          <Button onClick={() => exportar('indicadores')}>Exportar indicadores</Button>
          <Button onClick={() => exportar('resultado')}>Exportar resultado mensual</Button>
        </>}
      />
      <KpiGrid>
        <Kpi tono="good" label="Cobro esperado · 3 meses" value={money(IND.proy.slice(0, 3).reduce((t, x) => t + x.v, 0))} sub="Cuotas por vencer, sin contar lo atrasado" />
        <Kpi tono={IND.morosidad > 15 ? 'bad' : ''} label="Morosidad" value={IND.morosidad == null ? '—' : `${IND.morosidad}%`} sub={`De lo vencido, ${money(IND.atrasado)} sin cobrar`} />
        <Kpi tono={IND.bajas > 15 ? 'bad' : ''} label="Tasa de bajas" value={IND.bajas == null ? '—' : `${IND.bajas}%`} sub={`${IND.nBajas} de ${IND.nIns} inscripciones`} />
        <Kpi label="Aprobación" value={IND.aprob == null ? '—' : `${IND.aprob}%`} sub={`${IND.nAprob} de ${IND.nEval} alumnos con notas`} />
      </KpiGrid>

      <Panel title="Proyección de ingresos por cuotas" actions={<span className={styles.cuotas}>Saldo a cobrar según vencimientos</span>}>
        <BarRow label={<b>Vencido sin cobrar</b>} value={money(IND.atrasado)} pct={(IND.atrasado / maxP) * 100} tono="bad" />
        {IND.proy.map((x) => (
          <BarRow key={x.k} label={<><span className={styles.cap}>{monthLong(x.k)}</span> <span className={styles.cuotas}>· {x.n} cuotas</span></>} value={money(x.v)} pct={(x.v / maxP) * 100} />
        ))}
        <p className={styles.nota}>No incluye inscripciones futuras ni cursos que todavía no abrieron.</p>
      </Panel>

      {/* Indicadores por curso en diseño de tarjetas/grid */}
      <Panel flush title="Indicadores por curso">
        <div className={styles.cardListContainer}>
          {IND.cursos.length ? (
            IND.cursos.map((x) => (
              <div key={x.c.id} className={styles.dataCard}>
                <div className={styles.cardHeaderRow}>
                  <span className={styles.cursoTitle}>{x.c.nombre}</span>
                  <span className={styles.cursoBadge}>{x.c.estado}</span>
                </div>
                <div className={styles.cardGridMetrics}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Inscriptos</span>
                    <span className={styles.metricValue}>{x.ins}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Bajas</span>
                    <span className={styles.metricValue}>{pct(x.bajas, x.bajas > 15)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Morosidad</span>
                    <span className={styles.metricValue}>{pct(x.mora, x.mora > 15)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Asistencia</span>
                    <span className={styles.metricValue}>{pct(x.asis, x.asis < minA)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Aprobados</span>
                    <span className={styles.metricValue}>{pct(x.aprob)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>En espera</span>
                    <span className={styles.metricValue}>{x.espera || '—'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState>Sin cursos con inscripciones</EmptyState>
          )}
        </div>
      </Panel>

      <Columns ratio="equal">
        <Panel title="Ingresos por curso">
          {Object.keys(R.ingCurso).length ? ordenar(R.ingCurso).map(([k, v]) => <BarRow key={k} label={k} value={money(v)} pct={(v / maxI) * 100} />)
            : <p className={styles.vacio}>Sin ingresos registrados</p>}
        </Panel>

        {/* Conversión por origen en tarjetas */}
        <Panel flush title="Conversión por origen">
          <div className={styles.cardListContainer}>
            {Object.keys(R.origen).length ? (
              Object.entries(R.origen).sort((a, b) => b[1].t - a[1].t).map(([k, v]) => (
                <div key={k} className={styles.rowCard}>
                  <span className={styles.rowMainText}>{k}</span>
                  <div className={styles.rowMetricsGroup}>
                    <span>Prospectos: <b>{v.t}</b></span>
                    <span>Inscriptos: <b>{v.i}</b></span>
                    <span className={styles.highlightBadge}>Conv: {Math.round((v.i / v.t) * 100)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState>Sin prospectos</EmptyState>
            )}
          </div>
        </Panel>
      </Columns>

      <Columns ratio="equal">
        <Panel title="Deuda vencida por curso">
          {Object.keys(R.mora).length ? ordenar(R.mora).map(([k, v]) => <BarRow key={k} label={k} value={money(v)} pct={(v / maxM) * 100} tono="bad" />)
            : <p className={styles.vacio}>No hay deuda vencida</p>}
        </Panel>
        <Panel flush title="Motivos de pérdida">
          {Object.keys(R.perdidos).length ? ordenar(R.perdidos).map(([k, v]) => <PanelItem key={k} title={k} aside={<span className={styles.mono}>{v}</span>} />)
            : <EmptyState>Sin prospectos perdidos</EmptyState>}
        </Panel>
      </Columns>

      {/* Resultado mensual en tarjetas flexibles */}
      <Panel flush title="Resultado mensual">
        <div className={styles.cardListContainer}>
          {R.resultado.map((r) => {
            const resultadoNeto = r.ing - r.egr;
            const margenVal = r.ing ? Math.round((resultadoNeto / r.ing) * 100) : null;
            return (
              <div key={r.k} className={styles.dataCard}>
                <div className={styles.cardHeaderRow}>
                  <span className={styles.cursoTitle}><span className={styles.cap}>{monthLong(r.k)}</span></span>
                </div>
                <div className={styles.cardGridMetrics}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Ingresos</span>
                    <span className={styles.metricValue}>{money(r.ing)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Egresos</span>
                    <span className={styles.metricValue}>{money(r.egr)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Resultado</span>
                    <span className={`${styles.metricValue} ${resultadoNeto < 0 ? styles.malo : ''}`}>{money(resultadoNeto)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Margen</span>
                    <span className={styles.metricValue}>{margenVal !== null ? `${margenVal}%` : '—'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}