import { useData } from '../../../state/DataProvider';
import { useUi } from '../../../state/UiProvider';
import EmptyState from '../../ui/EmptyState/EmptyState';
import Sidebar from '../Sidebar/Sidebar';
import PanelView from '../../../views/PanelView/PanelView';
import ProspectosView from '../../../views/ProspectosView/ProspectosView';
import AlumnosView from '../../../views/AlumnosView/AlumnosView';
import CursosView from '../../../views/CursosView/CursosView';
import InscripcionesView from '../../../views/InscripcionesView/InscripcionesView';
import AsistenciaView from '../../../views/AsistenciaView/AsistenciaView';
import DocentesView from '../../../views/DocentesView/DocentesView';
import CobranzasView from '../../../views/CobranzasView/CobranzasView';
import CajaView from '../../../views/CajaView/CajaView';
import ReportesView from '../../../views/ReportesView/ReportesView';
import AjustesView from '../../../views/AjustesView/AjustesView';
import styles from './Shell.module.css';
import DisciplinasView from '../../../views/DisciplinesView/DisciplinesView';

const VISTAS = {
  panel: PanelView, prospectos: ProspectosView, alumnos: AlumnosView, cursos: CursosView,
  inscripciones: InscripcionesView, asistencia: AsistenciaView, docentes: DocentesView,
  cobranzas: CobranzasView, caja: CajaView, reportes: ReportesView, ajustes: AjustesView,
  disciplines: DisciplinasView
};

export default function Shell({ nombreModo }) {
  const { listo, error } = useData();
  const { vista } = useUi();
  const Vista = VISTAS[vista] || PanelView;
  let contenido;
  if (!listo) contenido = <div className={styles.loading}><EmptyState title="Cargando datos…">Conectando con la base del centro.</EmptyState></div>;
  else if (error) contenido = <div className={styles.loading}><EmptyState title="No se pudieron cargar los datos">Revisá la conexión con el servidor y recargá la página.</EmptyState></div>;
  else contenido = <Vista />;
  return (
    <div className={styles.app}>
      <Sidebar nombreModo={nombreModo} />
      <main className={styles.main}><div className={styles.wrap}>{contenido}</div></main>
    </div>
  );
}
