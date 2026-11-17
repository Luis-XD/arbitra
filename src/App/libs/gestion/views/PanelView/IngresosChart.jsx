import { monthName, money } from '../../lib/format';
import styles from './IngresosChart.module.css';

/** Barras de ingresos y egresos por mes. meses: { k, ing, egr }[] */
export default function IngresosChart({ meses, mesActual }) {
  const max = Math.max(1, ...meses.map((m) => Math.max(m.ing, m.egr)));
  const W = 560; const H = 210; const pl = 56; const pb = 26; const pt = 10;
  const cw = (W - pl - 8) / meses.length; const bw = Math.min(26, cw / 3.2);
  const y = (v) => pt + (H - pt - pb) * (1 - v / max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const tick = (v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1).replace('.', ',')} M` : `${Math.round(v / 1000)} k`);
  return (
    <div className={styles.chart}>
      <div className={styles.legend}><span><i className={styles.ing} />Ingresos</span><span><i className={styles.egr} />Egresos</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ingresos y egresos de los últimos seis meses">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pl} x2={W - 4} y1={y(v)} y2={y(v)} className={styles.grid} />
            <text x={pl - 6} y={y(v) + 3.5} textAnchor="end" className={styles.axis}>{tick(v)}</text>
          </g>
        ))}
        {meses.map((m, i) => {
          const cx = pl + cw * i + cw / 2;
          return (
            <g key={m.k}>
              <rect x={cx - bw - 2} y={y(m.ing)} width={bw} height={Math.max(0, H - pb - y(m.ing))} rx="2" className={styles.barIng}><title>{`Ingresos ${monthName(m.k)}: ${money(m.ing)}`}</title></rect>
              <rect x={cx + 2} y={y(m.egr)} width={bw} height={Math.max(0, H - pb - y(m.egr))} rx="2" className={styles.barEgr}><title>{`Egresos ${monthName(m.k)}: ${money(m.egr)}`}</title></rect>
              <text x={cx} y={H - 8} textAnchor="middle" className={`${styles.axis} ${m.k === mesActual ? styles.current : ''}`}>{monthName(m.k)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
