import { useEffect, useState, useMemo } from 'react';
import { CONFIG_BACKEND } from '../../../../config/config';
import { fdate, fullName, money, today } from '../../lib/format';
import { csvExportacion } from '../../lib/exportar';
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
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import InscripcionModal from '../../modals/InscripcionModal/InscripcionModal';
import InscripcionDetalleModal from '../../modals/InscripcionDetalleModal/InscripcionDetalleModal';
import styles from './InscripcionesView.module.css';

export default function InscripcionesView() {
  const { db, nombreUsuario } = useData();
  const { abrirModal } = useUi();
  const { descargar } = useAcciones();
  
  const [inscripcionesList, setInscripcionesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('Activa');

  // 🔄 Petición fetch asíncrona para obtener las inscripciones del backend
  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const res = await fetch(`${CONFIG_BACKEND.API_DIR}/getDisciplines`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        const text = await res.text();
        if (text && text.trim() !== '') {
          const data = JSON.parse(text);
          if (data.success && Array.isArray(data.result)) {
            setInscripcionesList(data.result);
          }
        }
      } catch (error) {
        console.error("Error al cargar inscripciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInscripciones();
  }, []);

  const lista = useMemo(() => {
    const qq = q.toLowerCase();
    return inscripcionesList.filter((item) => {
      const matchEstado = !estado || item.estado === estado;
      const nombreAlumno = `${item.nombre_alumno || ''} ${item.apellido_alumno || ''}`.toLowerCase();
      const cursoNombre = (item.curso_nombre || '').toLowerCase();
      const dniStr = String(item.dni || '');
      
      const matchQuery = !qq || nombreAlumno.includes(qq) || cursoNombre.includes(qq) || dniStr.includes(qq);
      return matchEstado && matchQuery;
    }).sort((x, y) => (y.fecha || '').localeCompare(x.fecha || ''));
  }, [inscripcionesList, q, estado]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Inscripciones"
        description="Cada inscripción une un alumno con un curso y genera su plan de cuotas."
        actions={<>
          <Button onClick={() => descargar(`arbitra-inscripciones-${today()}.csv`, csvExportacion(db, 'inscripciones', nombreUsuario), 'text/csv')}>Exportar CSV</Button>
          <Button variant="primary" onClick={() => abrirModal(InscripcionModal, {})}>+ Nueva inscripción</Button>
        </>}
      />
      <ExampleBanner />
      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar alumno, DNI o curso" />
        <SegmentedControl ariaLabel="Estado" value={estado} onChange={setEstado} options={[['Activa', 'Activa'], ['Finalizada', 'Finalizada'], ['Baja', 'Baja'], ['', 'Todas']]} />
      </Toolbar>
      <Panel flush>
        <div className={styles.containerList}>
          {loading ? (
            <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>Cargando inscripciones...</p>
          ) : lista.length ? (
            <div className={styles.gridCards}>
              {lista.map((i) => {
                const tot = Number(i.total_plan || 0); 
                const pag = Number(i.pagado || 0); 
                const venc = Boolean(i.tiene_vencidas);
                const deuda = venc && i.estado !== 'Baja';
                const saldo = tot - pag;

                // Objeto simulado o estructurado del alumno para formateo de nombre
                const alumnoObj = { nombre: i.nombre_alumno, apellido: i.apellido_alumno };

                return (
                  <div 
                    key={i.id} 
                    className={styles.cardItem} 
                    onClick={() => abrirModal(InscripcionDetalleModal, { id: i.id })}
                  >
                    {/* Cabecera de la tarjeta */}
                    <div className={styles.cardHeader}>
                      <div className={styles.alumnoInfo}>
                        <span className={styles.nombreAlumno}>{fullName(alumnoObj)}</span>
                        <ExampleTag item={i} />
                        <span className={styles.dniSub}>DNI {i.dni ? i.dni : '—'}</span>
                      </div>
                      <Pill tono={i.estado === 'Activa' ? (venc ? 'bad' : 'ok') : i.estado === 'Baja' ? '' : 'info'}>
                        {i.estado === 'Activa' && venc ? 'Con deuda' : i.estado}
                      </Pill>
                    </div>

                    {/* Cuerpo de la tarjeta */}
                    <div className={styles.cardBody}>
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Curso:</span>
                        <span className={styles.valueText}>{i.curso_nombre || '—'}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.label}>Fecha:</span>
                        <span className={styles.valueMono}>{fdate(i.fecha)}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.label}>Beca:</span>
                        <span className={styles.valueText}>{i.becaPct ? `${i.becaPct}%` : '—'}</span>
                      </div>

                      <div className={styles.metricsGrid}>
                        <div className={styles.metricBox}>
                          <span className={styles.metricLabel}>Total plan</span>
                          <span className={styles.metricValue}>{money(tot)}</span>
                        </div>
                        <div className={styles.metricBox}>
                          <span className={styles.metricLabel}>Pagado</span>
                          <span className={styles.metricValue}>{money(pag)}</span>
                        </div>
                        <div className={styles.metricBox}>
                          <span className={styles.metricLabel}>Saldo</span>
                          <span className={`${styles.metricValue} ${deuda ? styles.debe : ''}`}>{money(saldo)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyWrapper}>
              <EmptyState title="Sin inscripciones en este estado">
                Usá “Nueva inscripción” o convertí un prospecto desde el embudo.
              </EmptyState>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}