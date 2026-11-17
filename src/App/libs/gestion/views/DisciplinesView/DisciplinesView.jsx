import { useEffect, useState, useMemo, useCallback } from 'react';
import { CONFIG_BACKEND } from '../../../../config/config';
import { csvExportacion } from '../../lib/exportar';
import { money, today } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Panel from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import DisciplinaModal from '../../modals/DisciplinaModal/DisciplinaModal';
import styles from './DisciplinesView.module.css';

export default function DisciplinasView() {
  const { nombreUsuario } = useData();
  const { abrirModal } = useUi();
  const { descargar } = useAcciones();
  
  const [disciplinasList, setDisciplinasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('1');

  // Función reutilizable para traer las disciplinas del backend
  const fetchDisciplinas = useCallback(async () => {
    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/getDisciplinesAll`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      const text = await res.text();
      if (text && text.trim() !== '') {
        const data = JSON.parse(text);
        if (data.success && Array.isArray(data.result)) {
          setDisciplinasList(data.result);
        }
      }
    } catch (error) {
      console.error("Error al cargar disciplinas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisciplinas();
  }, [fetchDisciplinas]);

  const lista = useMemo(() => {
    const qq = q.toLowerCase();
    return disciplinasList.filter((d) => {
      let rawStatus = String(d.status ?? '1').trim().toLowerCase();
      let normalizedStatus = (rawStatus === '0' || rawStatus === 'inactive' || rawStatus === 'baja' || rawStatus === 'false') ? '0' : '1';

      const matchEstado = !estado || normalizedStatus === estado;
      const nombreDisc = (d.name_discip || '').toLowerCase();
      const matchQuery = !qq || nombreDisc.includes(qq);
      
      return matchEstado && matchQuery;
    }).sort((a, b) => (a.name_discip || '').localeCompare(b.name_discip || ''));
  }, [disciplinasList, q, estado]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Disciplinas y Costos"
        description="Gestión de disciplinas deportivas, precios y estado de habilitación."
        actions={<>
          <Button onClick={() => descargar(`arbitra-disciplinas-${today()}.csv`, "id,nombre,precio\n", 'text/csv')}>Exportar CSV</Button>
          {/* Al crear nueva, le pasamos el onSuccess para que refresque */}
          <Button variant="primary" onClick={() => abrirModal(DisciplinaModal, { onSuccess: fetchDisciplinas })}>+ Nueva disciplina</Button>
        </>}
      />
      {/*<ExampleBanner />*/}
      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar disciplina..." />
        <SegmentedControl 
          ariaLabel="Estado" 
          value={estado} 
          onChange={setEstado} 
          options={[['1', 'Activas'], ['0', 'Inactivas'], ['', 'Todas']]} 
        />
      </Toolbar>
      <Panel flush>
        <div className={styles.containerList}>
          {loading ? (
            <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>Cargando disciplinas...</p>
          ) : lista.length ? (
            <div className={styles.gridCards}>
              {lista.map((d) => {
                let rawStatus = String(d.status ?? '1').trim().toLowerCase();
                const isActive = rawStatus === '1' || rawStatus === 'active';
                const precioVal = Number(d.price || 0);

                return (
                  <div key={d.id_discip} className={styles.cardItem}>
                    <div className={styles.cardHeader}>
                      <div className={styles.disciplinaInfo}>
                        <span className={styles.nombreDisciplina}>{d.name_discip}</span>
                        <span className={styles.idSub}>ID: #{d.id_discip}</span>
                      </div>
                      <div className={styles.headerActions}>
                        <button 
                          type="button" 
                          className={styles.btnEditar}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Pasamos el id, la data y el callback onSuccess para recargar la lista al guardar
                            abrirModal(DisciplinaModal, { 
                              id: d.id_discip, 
                              disciplina: d, 
                              onSuccess: fetchDisciplinas 
                            });
                          }}
                        >
                          Editar
                        </button>
                        <Pill tono={isActive ? 'ok' : 'bad'}>
                          {isActive ? 'Activa' : 'Inactiva'}
                        </Pill>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.metricsGridSingle}>
                        <div className={styles.metricBox}>
                          <span className={styles.metricLabel}>Costo / Precio</span>
                          <span className={styles.metricValue}>{money(precioVal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyWrapper}>
              <EmptyState title="Sin disciplinas para mostrar">
                No se encontraron disciplinas registradas con los filtros seleccionados.
              </EmptyState>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}