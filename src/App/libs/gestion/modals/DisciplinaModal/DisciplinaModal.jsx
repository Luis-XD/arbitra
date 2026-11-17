import { useState } from 'react';
import { CONFIG_BACKEND } from '../../../../config/config';
import Button from '../../components/ui/Button/Button';
import styles from './DisciplinaModal.module.css'; // Asegúrate de tener tus clases flotantes aquí

export default function DisciplinaModal({ id, disciplina, onClose, onSuccess }) {
  const [nombre, setNombre] = useState(disciplina?.name_discip || '');
  const [precio, setPrecio] = useState(disciplina?.price || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/saveDisciplinePrice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_discip: id, name_discip: nombre, price: precio })
      });
      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al guardar disciplina:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2>{id ? 'Editar Disciplina' : 'Nueva Disciplina'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8d8d99', marginBottom: '0.3rem' }}>Nombre</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', background: '#121214', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8d8d99', marginBottom: '0.3rem' }}>Precio</label>
            <input 
              type="number" 
              step="0.01"
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', background: '#121214', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}