import { useMemo, useState } from 'react';
import { cursosAsistencia, resumenCurso } from '../../lib/business';
import { fdate } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import MarcaAsistencia from '../../components/shared/MarcaAsistencia/MarcaAsistencia';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Kpi, { KpiGrid } from '../../components/ui/Kpi/Kpi';
import Panel from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import { ToolbarSelect } from '../../components/ui/SearchInput/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import ClaseModal from '../../modals/ClaseModal/ClaseModal';
import EvaluacionModal from '../../modals/EvaluacionModal/EvaluacionModal';
import CertificadoModal from '../../modals/CertificadoModal/CertificadoModal';
import PlanillaAsistencia from './PlanillaAsistencia';
import TablaNotas from './TablaNotas';
import styles from './AsistenciaView.module.css';

export default function AsistenciaView() {
  const { db, me, guardar } = useData();
  const { abrirModal, ir, toast } = useUi();
  const { confirmar, emitirCertificados } = useAcciones();
  const cursos = cursosAsistencia(db);
  const [cursoSel, setCursoSel] = useState(null);
  const [tab, setTab] = useState('asistencia');
  const [borrador, setBorrador] = useState({});
  const cursoId = cursoSel && db.get('cursos', cursoSel) ? cursoSel : (cursos[0] && cursos[0].id);
  const R = useMemo(() => (cursoId ? resumenCurso(db, cursoId) : null), [db, cursoId]);

  if (!cursos.length) {
    return (
      <div className={styles.page}>
        <PageHeader title="Asistencia y notas" description="Presentes por clase, evaluaciones y certificados de cada curso." />
        <Panel><EmptyState title="Todavía no hay cursos" action={<Button variant="primary" onClick={() => ir('cursos')}>Ir a Cursos</Button>}>Creá un curso e inscribí alumnos para tomar asistencia.</EmptyState></Panel>
      </div>
    );
  }

  const aprobados = R.rows.filter((r) => r.aprueba);
  const pcts = R.rows.map((r) => r.pct).filter((v) => v != null);
  const prom = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null;
  const bajo = R.rows.filter((r) => r.pct != null && r.pct < R.minA).length;
  const docente = R.c && db.get('docentes', R.c.docenteId);
  const hayCambios = Object.keys(borrador).length > 0;

  const cambiarCurso = (id) => { setCursoSel(id); setBorrador({}); };

  const guardarNotas = async () => {
    const ev = R.ev; const notas = JSON.parse(JSON.stringify(ev.notas || {}));
    let malo = false;
    Object.entries(borrador).forEach(([k, v]) => {
      const [insId, instId] = k.split('|'); notas[insId] = notas[insId] || {};
      const t = String(v).trim();
      if (t === '') { delete notas[insId][instId]; return; }
      const n = parseFloat(t.replace(',', '.'));
      if (Number.isNaN(n) || n < 1 || n > 10) { malo = true; return; }
      notas[insId][instId] = Math.round(n * 100) / 100;
    });
    if (malo) { toast('Revisá las notas: van de 1 a 10.'); return; }
    await guardar('evaluaciones', { ...ev, id: cursoId, cursoId, notas });
    setBorrador({}); toast('Notas guardadas');
  };

  const quitarEvaluacion = (it) => confirmar(<>¿Quitar la evaluación <b>{it.nombre}</b> y todas sus notas?</>, 'Quitar', async () => {
    const ev = R.ev; const notas = JSON.parse(JSON.stringify(ev.notas || {}));
    Object.values(notas).forEach((o) => { delete o[it.id]; });
    setBorrador((b) => Object.fromEntries(Object.entries(b).filter(([k]) => !k.endsWith(`|${it.id}`))));
    await guardar('evaluaciones', { ...ev, instancias: ev.instancias.filter((x) => x.id !== it.id), notas });
    toast('Evaluación quitada');
  });

  const emitirTodos = () => {
    const ids = aprobados.map((r) => r.ins.id);
    const nuevos = aprobados.filter((r) => !r.cert).length;
    confirmar(<>Se generará un PDF con <b>{ids.length}</b> certificados{nuevos ? ` (${nuevos} nuevos, con número correlativo)` : ''}.</>, 'Emitir certificados', () => emitirCertificados(ids), { peligro: false });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Asistencia y notas"
        description="Presentes por clase, evaluaciones y certificados de cada curso."
        actions={tab === 'asistencia'
          ? <Button variant="primary" onClick={() => abrirModal(ClaseModal, { cursoId })}>+ Tomar asistencia</Button>
          : <>
            <Button onClick={() => abrirModal(EvaluacionModal, { cursoId })}>+ Evaluación</Button>
            <Button variant="primary" disabled={!aprobados.length} onClick={emitirTodos}>Emitir certificados ({aprobados.length})</Button>
          </>}
      />
      <ExampleBanner />
      <Toolbar>
        <ToolbarSelect wide ariaLabel="Curso" value={cursoId} onChange={cambiarCurso}
          options={cursos.map((c) => [c.id, `${c.nombre}${c.codigo ? ` · ${c.codigo}` : ''} — ${c.estado}`])} />
        <SegmentedControl ariaLabel="Sección" value={tab} onChange={setTab} options={[['asistencia', 'Asistencia'], ['notas', 'Notas y certificados']]} />
      </Toolbar>

      {tab === 'asistencia' ? (
        <>
          <KpiGrid>
            <Kpi label="Clases registradas" value={R.clases.length} sub={R.clases.length ? `Última: ${fdate(R.clases[R.clases.length - 1].fecha)}` : 'Sin clases aún'} />
            <Kpi tono={prom != null && prom < R.minA ? 'bad' : ''} label="Asistencia promedio" value={prom == null ? '—' : `${prom}%`} sub={`Mínimo para aprobar: ${R.minA}%`} />
            <Kpi tono={bajo ? 'bad' : ''} label="Bajo el mínimo" value={bajo} sub={`de ${R.rows.length} alumnos`} />
            <Kpi small label="Docente" value={docente ? docente.nombre : 'Sin asignar'} sub={R.c && R.c.horario} />
          </KpiGrid>
          <Panel flush title="Planilla de asistencia" actions={
            <span className={styles.leyenda}><MarcaAsistencia marca="P" /> presente <MarcaAsistencia marca="A" /> ausente <MarcaAsistencia marca="T" /> tarde <MarcaAsistencia marca="J" /> justificada</span>
          }>
            {!R.rows.length ? <EmptyState>Este curso no tiene alumnos inscriptos.</EmptyState>
              : !R.clases.length ? (
                <EmptyState title="Todavía no se tomó asistencia" action={<Button variant="primary" onClick={() => abrirModal(ClaseModal, { cursoId })}>+ Tomar asistencia</Button>}>
                  Tocá “+ Tomar asistencia” al comienzo de cada clase. Todos arrancan como presentes y marcás solo a quienes faltaron.
                </EmptyState>
              ) : <PlanillaAsistencia resumen={R} onAbrirClase={(claseId) => abrirModal(ClaseModal, { cursoId, claseId })} />}
          </Panel>
        </>
      ) : (
        <Panel flush title="Notas, condición y certificados"
          actions={<>{hayCambios && <Pill tono="mark">Cambios sin guardar</Pill>}<Button size="sm" variant="primary" disabled={!hayCambios} onClick={guardarNotas}>Guardar notas</Button></>}
          footer={`Aprueba quien tiene promedio de ${R.minN} o más y al menos ${R.minA}% de asistencia. Los mínimos se cambian en Ajustes. El certificado lleva número correlativo y se vuelve a descargar con el mismo número.`}>
          {!R.rows.length ? <EmptyState>Este curso no tiene alumnos inscriptos.</EmptyState> : (
            <TablaNotas resumen={R} borrador={borrador} puedeQuitar={me.admin}
              onCambiarNota={(k, v) => setBorrador((b) => ({ ...b, [k]: v }))}
              onQuitarEvaluacion={quitarEvaluacion}
              onCertificado={(insId) => abrirModal(CertificadoModal, { insId })} />
          )}
          {!(R.ev.instancias || []).length && <EmptyState>Agregá la primera evaluación del curso (por ejemplo, Parcial 1) con “+ Evaluación”.</EmptyState>}
        </Panel>
      )}
    </div>
  );
}
