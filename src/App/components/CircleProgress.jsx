import React from 'react';
import styles from './css/CircleProgress.module.css'; // O ajusta la ruta según dónde guardes tus CSS

export default function CircleProgress({ percentage = 0 }) {
  const size = 52; // Tamaño exacto de 24px
  const strokeWidth = 2.5; // Grosor del anillo
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  // Calculamos el avance del círculo en base al porcentaje (0 a 100)
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className={styles.cont}>
        <div 
        className={styles.container}
        title={`${clampedPercentage}% completado`}
        >
        <svg width={size} height={size} className={styles.svg}>
            {/* Anillo de fondo (gris claro) */}
            <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            className={styles.bgCircle}
            />
            {/* Anillo de progreso dinámico (con el tono púrpura de tu app) */}
            <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={styles.progressCircle}
            />
        </svg>
        
        {/* Porcentaje en el centro */}
        <span className={styles.percentageText}>
            {Math.round(clampedPercentage)}%
        </span>
        </div>
    </div>
  );
}