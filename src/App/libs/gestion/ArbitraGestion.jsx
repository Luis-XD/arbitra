'use client';
// Componente raíz del CRM + ERP. Montalo en cualquier página de tu frontend:
//   <ArbitraGestion adapter={miAdaptador} usuario={{ id, nombre, rol }} />
import { useEffect, useMemo } from 'react';
import '@fontsource/ibm-plex-sans/400.css';
/*
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/bricolage-grotesque/500.css';
import '@fontsource/bricolage-grotesque/700.css';
*/
import { IDS_RUTAS } from './config/constants';
import { createLocalStorageAdapter } from './data/adapters/localStorageAdapter';
import { datosEjemplo } from './data/ejemplo';
import { DataProvider } from './state/DataProvider';
import { UiProvider, useUi } from './state/UiProvider';
import Shell from './components/layout/Shell/Shell';
import ModalHost from './components/shared/ModalHost/ModalHost';
import ToastHost from './components/ui/ToastHost/ToastHost';
import styles from './ArbitraGestion.module.css';

/**
 * @param {object} props
 * @param {object} [props.adapter]  capa de datos; por defecto guarda en localStorage con datos de ejemplo
 * @param {{id:string, nombre?:string, rol?:'admin'|'colaborador'|'lector'}} [props.usuario]
 * @param {{id:string, nombre:string}[]} [props.usuarios]  nombres para mostrar quién registró cada cosa
 * @param {'auto'|'light'|'dark'} [props.tema]
 * @param {string} [props.vistaInicial]  panel, prospectos, alumnos, cursos, inscripciones, asistencia, docentes, cobranzas, caja, reportes, ajustes
 * @param {(vista:string)=>void} [props.onNavegar]  para sincronizar con el router del proyecto
 * @param {boolean} [props.sincronizarHash]  refleja la vista en location.hash (#cobranzas)
 * @param {string} [props.className]
 */
export default function ArbitraGestion({
  adapter, usuario, usuarios, tema = 'auto', vistaInicial, onNavegar, sincronizarHash = false, className = '',
}) {
  const adaptador = useMemo(() => adapter || createLocalStorageAdapter({ datosIniciales: datosEjemplo }), [adapter]);
  const inicial = useMemo(() => {
    if (vistaInicial && IDS_RUTAS.includes(vistaInicial)) return vistaInicial;
    if (sincronizarHash && typeof window !== 'undefined') {
      const h = window.location.hash.replace('#', '');
      if (IDS_RUTAS.includes(h)) return h;
    }
    return 'panel';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navegar = useMemo(() => (id) => {
    if (typeof window !== 'undefined') {
      if (sincronizarHash) window.history.replaceState(null, '', `#${id}`);
      window.scrollTo(0, 0);
    }
    if (onNavegar) onNavegar(id);
  }, [onNavegar, sincronizarHash]);

  const modo = adaptador.descripcion || 'Datos del centro';

  return (
    <div className={`${styles.root} ${className}`} data-theme={tema === 'auto' ? undefined : tema}>
      <UiProvider vistaInicial={inicial} onNavegar={navegar}>
        <DataProvider adapter={adaptador} usuario={usuario} usuarios={usuarios}>
          <HashListener activo={sincronizarHash} />
          <Shell nombreModo={modo} />
          <ModalHost />
          <ToastHost />
        </DataProvider>
      </UiProvider>
    </div>
  );
}

/** Con sincronizarHash, responde a los botones atrás y adelante del navegador. */
function HashListener({ activo }) {
  const { ir } = useUi();
  useEffect(() => {
    if (!activo) return undefined;
    const onHash = () => { const h = window.location.hash.replace('#', ''); if (IDS_RUTAS.includes(h)) ir(h); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [activo, ir]);
  return null;
}
