import { useMemo } from 'react';
import { RUTAS } from '../../../config/constants';
import { ASSETS } from '../../../config/assets';
import { allCuotas } from '../../../lib/business';
import { today } from '../../../lib/format';
import { useData } from '../../../state/DataProvider';
import { useUi } from '../../../state/UiProvider';
import Icon from '../../ui/Icon/Icon';
import styles from './Sidebar.module.css';

const ROLES = { admin: 'Editor', colaborador: 'Colaborador', lector: 'Solo lectura' };

export default function Sidebar({ nombreModo }) {
  const { db, me } = useData();
  const { vista, ir } = useUi();

  const contadores = useMemo(() => {
    const t = today();
    const seguimientos = db.prospectos.filter((p) => !['Inscripto', 'Perdido'].includes(p.etapa) && p.proximoContacto && p.proximoContacto <= t).length;
    const vencidas = allCuotas(db).filter((c) => c.st.k === 'vencida').length;
    const activos = db.alumnos.filter((a) => a.estado === 'Activo').length;
    return {
      prospectos: seguimientos ? { n: seguimientos, alerta: true, titulo: 'Seguimientos para hoy o atrasados' } : null,
      cobranzas: vencidas ? { n: vencidas, alerta: true, titulo: 'Cuotas vencidas' } : null,
      alumnos: { n: activos, alerta: false, titulo: 'Alumnos activos' },
    };
  }, [db]);

  return (
    <aside className={styles.side} aria-label="Módulos">
      <div className={styles.brand}>
        <img className={styles.logo} src={ASSETS.logo} alt="Arbitra" />
        <div className={styles.brandText}><b>Arbitra Gestión</b><small>Centro de Formación Profesional</small></div>
      </div>
      <div className={styles.navManage}>
        {RUTAS.map((g) => (
          <div key={g.grupo} className={styles.group}>
            <div className={styles.groupTitle}>{g.grupo}</div>
            {g.items.map((r) => {
              const c = contadores[r.id];
              return (
                <button key={r.id} type="button" className={styles.link} aria-current={vista === r.id ? 'page' : undefined} onClick={() => ir(r.id)}>
                  <Icon name={r.icono} />{r.titulo}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.foot}>
        <div><span className={styles.dot} />{nombreModo}</div>
        {me.nombre && <div className={styles.user}>{me.nombre} · {ROLES[me.rol] || me.rol}</div>}
        <div>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      </div>
    </aside>
  );
}
