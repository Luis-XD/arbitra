import { useEffect, useState, useMemo } from 'react';
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
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Pill from '../../components/ui/Pill/Pill';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import AlumnoModal from '../../modals/AlumnoModal/AlumnoModal';
import styles from './css/AlumnosView.module.css';

const TONO = { Activo: 'ok', Baja: 'bad', Egresado: 'info' };

export default function AlumnosView() {
  const { nombreUsuario } = useData();
  const { abrirModal } = useUi();
  const { descargar } = useAcciones();
  
  const [alumnosList, setAlumnosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');

  // 🔄 Cargar alumnos reales desde el backend
  // 1. Definir fetchAlumnos fuera del useEffect
  const fetchAlumnos = async () => {
    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/getAlumnos`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      const text = await res.text();
      if (text && text.trim() !== '') {
        const data = JSON.parse(text);
        if (data.success && Array.isArray(data.result)) {
          setAlumnosList(data.result);
        }
      }
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const lista = useMemo(() => {
    const qq = q.toLowerCase();
    return alumnosList.filter((a) => {
      // Validar estado de forma flexible (si viene vacío o null se adapta)
      const alumnoEstado = a.estado || 'Activo';
      const matchEstado = !estado || alumnoEstado === estado;
      
      const nombreCompleto = `${a.nombre || ''} ${a.apellido || ''}`.toLowerCase();
      const matchQuery = !qq || nombreCompleto.includes(qq) || String(a.dni || '').includes(qq) || String(a.email || '').toLowerCase().includes(qq);
      
      return matchEstado && matchQuery;
    }).sort((a, b) => `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`));
  }, [alumnosList, q, estado]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Alumnos y Estado de Cuenta"
        description="Legajo de cada estudiante con sus cursos, detalle de pagos, deudas e historial."
        actions={<>
          {/*<Button onClick={() => descargar(`arbitra-alumnos-${today()}.csv`, "nombre,apellido,dni\n", 'text/csv')}>Exportar CSV</Button>
          <Button variant="primary" onClick={() => abrirModal(AlumnoModal, {})}>+ Nuevo alumno</Button>*/}
        </>}
      />
      <ExampleBanner />
      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre, DNI o email" />
        <SegmentedControl ariaLabel="Estado" value={estado} onChange={setEstado} options={[['Activo', 'Activo'], ['Egresado', 'Egresado'], ['Baja', 'Baja'], ['', 'Todos']]} />
      </Toolbar>

      <div className={styles.container}>
        {loading ? (
          <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>Cargando alumnos...</p>
        ) : lista.length ? (
          <div className={styles.grid}>
            {lista.map((a) => {
              const deudaAmount = Number(a.amount_due || 0);
              const costoCurso = Number(a.course_cost || a.disciplina_precio || 0);
              const tieneDeuda = deudaAmount > 0;
              const estadoAlumno = a.estado || 'Activo';

              return (
                <div 
                  key={a.id} 
                  className={styles.card} 
                  onClick={() => abrirModal(AlumnoModal, { 
                    id: a.id, 
                    alumnoObj: a, 
                    onSuccess: () => fetchAlumnos() // 👈 Recarga la lista de alumnos al guardar
                  })}
                >
                  {/* Cabecera de la tarjeta */}
                  <div className={styles.cardHeader}>
                    <div className={styles.alumnoInfo}>
                      <span className={styles.nombre}>{a.apellido}, {a.nombre}</span>
                      <ExampleTag item={a} />
                    </div>
                    <Pill tono={TONO[estadoAlumno] || 'info'}>{estadoAlumno}</Pill>
                  </div>

                  {/* Cuerpo de la tarjeta con datos y cursos */}
                  <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>DNI:</span>
                      <span className={styles.valueMono}>{a.dni || '—'}</span>
                    </div>

                    <div className={styles.infoRow}>
                      <span className={styles.label}>Contacto:</span>
                      <div className={styles.contactDetails}>
                        <span className={styles.subEmail}>{a.email || '—'}</span>
                      </div>
                    </div>

                    <div className={styles.infoRow}>
                      <span className={styles.label}>Curso / Disciplina:</span>
                      <div className={styles.cursosContainer}>
                        <div className={styles.cursoItem}>
                          <div className={styles.cursoHeaderRow}>
                            <span className={styles.cursoNombre}>{a.disciplina_nombre || 'Sin curso asignado'}</span>
                            <span className={styles.cursoPrecio}>{money(costoCurso)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pie de tarjeta con control de deuda */}
                  <div className={styles.cardFooter}>
                    <div className={styles.deudaSection}>
                      <span className={styles.label}>Saldo / Deuda:</span>
                      <span className={tieneDeuda ? styles.debe : styles.pagado}>
                        {tieneDeuda ? money(deudaAmount) : 'Al día (Pagado)'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title={`No hay alumnos ${estado ? `${estado.toLowerCase()}s ` : ''}para mostrar`}>
            Los alumnos se crean al inscribir a alguien o al convertir un prospecto.
          </EmptyState>
        )}
      </div>
    </div>
  );
}