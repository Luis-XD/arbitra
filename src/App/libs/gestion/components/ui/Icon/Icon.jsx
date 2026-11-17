import styles from './Icon.module.css';

const PATHS = {
  panel: 'M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z',
  prospectos: 'M4 6h16M7 12h10M10 18h4',
  alumnos: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c0-3.9 3.1-6 7-6s7 2.1 7 6',
  cursos: 'M4 5h11a3 3 0 0 1 3 3v12H7a3 3 0 0 1-3-3zm14 3h2v12',
  inscripciones: 'M9 4h6v3H9zM6 6H5v15h14V6h-1M9 13l2 2 4-4',
  asistencia: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M8.5 14.5l2.5 2.5 4.5-4.5',
  cobranzas: 'M3 7h18v10H3zM3 11h18M7 15h3',
  caja: 'M12 3v18M17 7.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 2.7 5 3.2 5 1.4 5 3.3-2.2 3-5 3-5-1.1-5-3',
  docentes: 'M3 8l9-4 9 4-9 4zm4 2v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5',
  reportes: 'M5 20V10M12 20V4M19 20v-7',
  ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-3 2 1-2 4-2-.5-1.7 1-.3 2.5h-4l-.3-2.5-1.7-1-2 .5-2-4 2-1v-2l-2-1 2-4 2 .5 1.7-1L10 2h4l.3 2.5 1.7 1 2-.5 2 4-2 1z',
};

export default function Icon({ name }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] || ''} />
    </svg>
  );
}
