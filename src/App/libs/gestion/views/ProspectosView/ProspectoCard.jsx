import { fshort } from '../../lib/format';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import styles from './ProspectoCard.module.css';

/** Tarjeta arrastrable del embudo. */
export default function ProspectoCard({ prospecto: p, curso, atrasado, cerrado, onOpen }) {
  return (
    <div
      className={styles.card} draggable tabIndex={0} role="button"
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', p.id); e.dataTransfer.effectAllowed = 'move'; }}
      onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
    >
      <b className={styles.name}>{p.nombre}<ExampleTag item={p} /></b>
      <div className={styles.meta}>{curso ? curso.nombre : 'Curso a definir'}</div>
      <div className={styles.meta}>
        <span className={styles.origen}>{p.origen || '—'}</span>
        {p.etapa === 'En espera' && p.esperaDesde && <span className={styles.due}>En espera desde {fshort(p.esperaDesde)}</span>}
        {p.proximoContacto && !cerrado && <span className={`${styles.due} ${atrasado ? styles.late : ''}`}>Seguimiento {fshort(p.proximoContacto)}</span>}
      </div>
    </div>
  );
}
