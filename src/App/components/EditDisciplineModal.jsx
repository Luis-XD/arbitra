import { useState, useEffect } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import styles from './css/FormManageSports.module.css';

function EditDisciplineModal({ 
  discipline, 
  availableIcons, 
  onClose, 
  onSuccess 
}) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [iconDiscip, setIconDiscip] = useState('');
  const [imagenTarjeta, setImagenTarjeta] = useState(null);
  const [imagenBanner, setImagenBanner] = useState(null);
  const [showIconGallery, setShowIconGallery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos actuales de la disciplina al abrir
  useEffect(() => {
    if (discipline) {
      setNombre(discipline.nombre || '');
      setDescripcion(discipline.descripcion || discipline.desc_discip || '');
      setIconDiscip(discipline.icon_discip || '');
    }
  }, [discipline]);

  if (!discipline) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('disciplina_id', discipline.id);
      formData.append('nombre_disciplina', nombre);
      formData.append('descripcion_disciplina', descripcion);
      formData.append('icon_discip', iconDiscip);

      if (imagenTarjeta) {
        formData.append('img_discip', imagenTarjeta);
      }
      if (imagenBanner) {
        formData.append('img_banner', imagenBanner);
      }

      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/updateDisciplineSport`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(); // Refresca la lista en el padre
        onClose();   // Cierra el modal
      } else {
        setError(data.error || 'Error al actualizar la disciplina.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ width: '520px' }}>
        <div className={styles.modalHeader}>
          <h4 className={styles.modalTitle}>Editar Disciplina: {discipline.nombre}</h4>
          <button type="button" onClick={onClose} className={styles.modalCloseBtn}>
            ✕ Cerrar
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Nombre */}
          <div>
            <label className={styles.label}>Nombre de la Disciplina</label>
            <input
              type="text"
              className={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.input}
              rows="4"
              placeholder="Escribe la descripción de la disciplina..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* Icono */}
          <div>
            <label className={styles.label}>Icono del SidePanel</label>
            <div className={styles.iconActionsRow}>
              <button
                type="button"
                onClick={() => setShowIconGallery(!showIconGallery)}
                className={styles.openIconModalBtn}
              >
                {iconDiscip ? `Cambiar Icono (${iconDiscip})` : '🖼️ Elegir Icono'}
              </button>

              {iconDiscip && (
                <div className={styles.selectedIconWrapper}>
                  <img
                    src={`/iconsArbitra/links/sports/${iconDiscip}`}
                    alt="Icono"
                    className={styles.selectedIconPreview}
                    style={{ width: '32px', height: '32px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setIconDiscip('')}
                    className={styles.removeIconBtn}
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>

            {showIconGallery && (
              <div className={styles.modalIconsGrid} style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto', padding: '8px', background: '#f4f4f4', borderRadius: '6px' }}>
                {availableIcons.map((iconFile) => (
                  <div
                    key={iconFile}
                    onClick={() => {
                      setIconDiscip(iconFile);
                      setShowIconGallery(false);
                    }}
                    className={`${styles.modalIconCard} ${iconDiscip === iconFile ? styles.modalIconCardSelected : ''}`}
                  >
                    <img src={`/iconsArbitra/links/sports/${iconFile}`} alt={iconFile} className={styles.modalIconImage} />
                    <span className={styles.modalIconName}>{iconFile}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Imagen Tarjeta */}
          <div>
            <label className={styles.label}>Imagen Tarjeta (Actual: {discipline.img_discip || 'Ninguna'})</label>
            <input
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={(e) => setImagenTarjeta(e.target.files[0] || null)}
            />
          </div>

          {/* Imagen Banner */}
          <div>
            <label className={styles.label}>Imagen Banner (Actual: {discipline.img_banner || 'Ninguna'})</label>
            <input
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={(e) => setImagenBanner(e.target.files[0] || null)}
            />
          </div>

          {error && <div className={styles.errorMsg}>❌ {error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className={styles.clearFileBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.enableBtn} style={{ width: 'auto', padding: '8px 16px' }}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDisciplineModal;