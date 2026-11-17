import { useMemo, useState } from 'react';
import { ETAPAS, ORIGENES } from '../../config/constants';
import { csvExportacion } from '../../lib/exportar';
import { today } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import Button from '../../components/ui/Button/Button';
import Kpi, { KpiGrid } from '../../components/ui/Kpi/Kpi';
import SearchInput, { ToolbarSelect } from '../../components/ui/SearchInput/SearchInput';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import ProspectoModal from '../../modals/ProspectoModal/ProspectoModal';
import PerdidoModal from '../../modals/PerdidoModal/PerdidoModal';
import InscripcionModal from '../../modals/InscripcionModal/InscripcionModal';
import KanbanColumn from './KanbanColumn';
import ProspectoCard from './ProspectoCard';
import styles from './ProspectosView.module.css';

export default function ProspectosView() {
  const { db, guardar, nombreUsuario } = useData();
  const { abrirModal, toast } = useUi();
  const { descargar } = useAcciones();
  const [q, setQ] = useState('');
  const [origen, setOrigen] = useState('');
  const t = today();

  const lista = useMemo(() => {
    const qq = q.toLowerCase();
    return db.prospectos.filter((p) => (!qq || [p.nombre, p.telefono, p.email].join(' ').toLowerCase().includes(qq)) && (!origen || p.origen === origen));
  }, [db.prospectos, q, origen]);

  const total = db.prospectos.length;
  const ins = db.prospectos.filter((p) => p.etapa === 'Inscripto').length;
  const perd = db.prospectos.filter((p) => p.etapa === 'Perdido').length;

  const mover = async (id, etapa) => {
    const p = db.get('prospectos', id);
    if (!p || p.etapa === etapa) return;
    if (etapa === 'Inscripto') { abrirModal(InscripcionModal, { prospectoId: p.id }); return; }
    if (etapa === 'Perdido') { abrirModal(PerdidoModal, { id: p.id }); return; }
    const np = { ...p, etapa, historial: [...(p.historial || []), { fecha: t, texto: `Pasó a la etapa “${etapa}”.` }] };
    if (etapa === 'En espera' && !np.esperaDesde) np.esperaDesde = t;
    await guardar('prospectos', np);
    toast(`${p.nombre}: ${etapa}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Prospectos"
        description="Embudo comercial: arrastrá cada tarjeta a la etapa que corresponda o abrila para registrar el contacto."
        actions={<>
          <Button onClick={() => descargar(`arbitra-prospectos-${t}.csv`, csvExportacion(db, 'prospectos', nombreUsuario), 'text/csv')}>Exportar CSV</Button>
          <Button variant="primary" onClick={() => abrirModal(ProspectoModal, {})}>+ Nuevo prospecto</Button>
        </>}
      />
      <ExampleBanner />
      <KpiGrid>
        <Kpi label="Total registrados" value={total} />
        <Kpi label="En gestión" value={total - ins - perd} />
        <Kpi tono="good" label="Inscriptos" value={ins} sub={`Conversión ${total ? Math.round((ins / total) * 100) : 0}%`} />
        <Kpi label="Perdidos" value={perd} />
      </KpiGrid>
      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre, teléfono o email" />
        <ToolbarSelect value={origen} onChange={setOrigen} ariaLabel="Filtrar por origen" options={[['', 'Todos los orígenes'], ...ORIGENES.map((o) => [o, o])]} />
      </Toolbar>
      <div className={styles.kanban}>
        {ETAPAS.map((et) => {
          const items = lista.filter((p) => p.etapa === et).sort((a, b) => (et === 'En espera'
            ? (a.esperaDesde || '').localeCompare(b.esperaDesde || '')
            : (a.proximoContacto || '9').localeCompare(b.proximoContacto || '9')));
          const cerrado = ['Inscripto', 'Perdido', 'En espera'].includes(et);
          return (
            <KanbanColumn key={et} titulo={et} cantidad={items.length} onDrop={(id) => mover(id, et)}>
              {items.map((p) => (
                <ProspectoCard key={p.id} prospecto={p} curso={db.get('cursos', p.cursoId)} cerrado={cerrado}
                  atrasado={!!p.proximoContacto && p.proximoContacto < t && !cerrado}
                  onOpen={() => abrirModal(ProspectoModal, { id: p.id })} />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </div>
  );
}
