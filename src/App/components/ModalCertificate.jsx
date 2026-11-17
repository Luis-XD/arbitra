import React, { useState } from 'react';
import Modal from './Modal';
import styles from './css/ModalCertificate.module.css'; // Ajusta la ruta según donde guardes tus estilos
import { CONFIG_BACKEND } from '../config/config';

export default function ModalCertificate({ disciplina, alumnoDefault, onClose }) {
  const [nombreCompleto, setNombreCompleto] = useState(alumnoDefault?.nombreCompleto || '');
  const [dni, setDni] = useState(alumnoDefault?.dni || '');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/certificateGenerate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: alumnoDefault.id,
          id_discipline: disciplina.id_discipline,
          nombre_completo: nombreCompleto,
          dni: dni
        })
      });

      const data = await res.json();
      if (data.success) {
        window.open(data.url_certificado, '_blank');
        onClose();
      } else {
        alert(data.message || 'No se pudo generar el certificado.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal id="modalCertificate" onClickElm={onClose}>
      <form onSubmit={handleSubmit} className={styles.certificateForm}>
        <h3 className={styles.title}>Solicitar Certificado</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Disciplina:</label>
          <input 
            type="text" 
            value={disciplina.name_discip} 
            disabled 
            className={`${styles.input} ${styles.inputDisabled}`} 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre completo (como figurará en el certificado):</label>
          <input 
            type="text" 
            value={nombreCompleto} 
            onChange={(e) => setNombreCompleto(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>DNI:</label>
          <input 
            type="text" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>

        <div className={styles.modalActions}>
          <button 
            type="button" 
            onClick={onClose} 
            className={styles.btnSecondary}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={cargando} 
            className={styles.btnPrimary}
          >
            {cargando ? 'Generando...' : 'Aceptar y Generar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}