import { useState, useEffect } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import styles from './css/FormManageSports.module.css';
import Button from './Button';
import EditDisciplineModal from './EditDisciplineModal';

function FormManageSports() {
  const [deportes, setDeportes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [availableIcons, setAvailableIcons] = useState([]);
  const [dir, setDir] = useState('');

  // Selección de deporte existente
  const [selectedSport, setSelectedSport] = useState('');

  // Creación de nuevo deporte
  const [nuevoDeporte, setNuevoDeporte] = useState('');
  const [deporteSinDisciplina, setDeporteSinDisciplina] = useState(false);

  // Campos de la disciplina (aplica a nueva disciplina de deporte existente O deporte sin subdisciplinas)
  const [nuevaDisciplina, setNuevaDisciplina] = useState('');
  const [descripcionDisciplina, setDescripcionDisciplina] = useState('');
  const [iconDiscip, setIconDiscip] = useState('');
  const [imagenDisciplina, setImagenDisciplina] = useState(null); // Card
  const [imagenBannerDisciplina, setImagenBannerDisciplina] = useState(null); // Banner

  // Modales y estado de UI
  const [showIconModal, setShowIconModal] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [expandedSports, setExpandedSports] = useState({});
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const deporteActual = deportes.find(d => Number(d.id) === Number(selectedSport));
  const esInactivo = deporteActual && Number(deporteActual.activo) === 0;

  // Habilita los campos de ficha (descripción, ícono, card, banner) si hay un deporte activo seleccionado O si se está creando un deporte único
  const habilitaFichaDisciplina = (Boolean(selectedSport) && !esInactivo) || (Boolean(nuevoDeporte.trim()) && deporteSinDisciplina);

  const disciplinasDelDeporteSeleccionado = disciplinas.filter(
    d => Number(d.deporte_id) === Number(selectedSport)
  );

  const fetchDeportes = async () => {
    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/showSportsDisciplines`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setDeportes(data.deportes || []);
        setDisciplinas(data.disciplinas || []);
        setAvailableIcons(data.availableIcons || []);
        setDir(data.dir || '');
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  useEffect(() => {
    fetchDeportes();
  }, []);

  const limpiarCamposFicha = () => {
    setNuevaDisciplina('');
    setDescripcionDisciplina('');
    setIconDiscip('');
    setImagenDisciplina(null);
    setImagenBannerDisciplina(null);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => (input.value = ''));
  };

  const handleToggleEstadoDeporte = async (idSport, estadoActual) => {
    const nuevoEstado = Number(estadoActual) === 0 ? 1 : 0;
    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/updateDisciplineSport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          deporte_id: idSport,
          activar_deporte: nuevoEstado
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeportes();
      } else {
        alert(data.error || 'Error al cambiar el estado del deporte.');
      }
    } catch (err) {
      console.error('Error al cambiar el estado del deporte:', err);
    }
  };

  const handleToggleEstadoDisciplina = async (idDiscip, estadoActual) => {
    const nuevoEstado = Number(estadoActual) === 0 ? 1 : 0;
    try {
      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/updateDisciplineSport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          disciplina_id: idDiscip,
          activar_disciplina: nuevoEstado
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeportes();
      } else {
        alert(data.error || 'Error al cambiar el estado de la disciplina.');
      }
    } catch (err) {
      console.error('Error al cambiar el estado de la disciplina:', err);
    }
  };

  const toggleExpandSport = (sportId) => {
    setExpandedSports(prev => ({
      ...prev,
      [sportId]: !prev[sportId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    if (esInactivo && nuevaDisciplina.trim()) {
      setStatus({ loading: false, success: null, error: 'No se pueden agregar disciplinas a un deporte inactivo. Habilítalo primero.' });
      return;
    }

    if (!selectedSport && !nuevoDeporte.trim()) {
      setStatus({ loading: false, success: null, error: 'Selecciona un deporte existente o escribe el nombre de uno nuevo.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('deporte_id', selectedSport);
      formData.append('nuevo_deporte', nuevoDeporte.trim());
      formData.append('sin_disciplina', deporteSinDisciplina ? '1' : '0');

      // Si es deporte existente, enviamos el nombre de la nueva disciplina.
      // Si es deporte nuevo sin subdisciplinas, el backend usará el nombre del deporte automáticamente.
      if (selectedSport) {
        formData.append('nueva_disciplina', nuevaDisciplina.trim());
      }

      if (habilitaFichaDisciplina) {
        if (descripcionDisciplina.trim()) {
          formData.append('descripcion_disciplina', descripcionDisciplina.trim());
        }
        if (iconDiscip) {
          formData.append('icon_discip', iconDiscip);
        }
        if (imagenDisciplina) {
          formData.append('img_discip', imagenDisciplina);
        }
        if (imagenBannerDisciplina) {
          formData.append('img_banner', imagenBannerDisciplina);
        }
      }

      const response = await fetch(`${CONFIG_BACKEND.API_DIR}/createSportDiscipline`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setNuevoDeporte('');
        setDeporteSinDisciplina(false);
        setSelectedSport('');
        limpiarCamposFicha();

        setStatus({ loading: false, success: 'Registro guardado correctamente.', error: null });
        fetchDeportes();

        setTimeout(() => {
          setStatus(prev => ({ ...prev, success: null }));
        }, 3000);
      } else {
        setStatus({ loading: false, success: null, error: data.error || 'Error al procesar la solicitud.' });
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setStatus({ loading: false, success: null, error: 'Error de conexión con el servidor.' });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Deportes y Disciplinas</h2>

      <div className={styles.gridContainer}>
        {/* COLUMNA IZQUIERDA: Formulario de Creación */}
        <form onSubmit={handleSubmit} className={styles.formColumn}>
          <h3 className={styles.subtitle}>Alta de Deportes y Disciplinas</h3>

          {/* SECCIÓN CREAR UN DEPORTE */}
          <div className={styles.contFormEdit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nuevo Deporte</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Ej: Fútbol, Básquet, Boxeo..."
                value={nuevoDeporte}
                onChange={(e) => {
                  setNuevoDeporte(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedSport('');
                    setNuevaDisciplina('');
                  } else {
                    setDeporteSinDisciplina(false);
                    limpiarCamposFicha();
                  }
                }}
                disabled={Boolean(selectedSport)}
              />

              {nuevoDeporte.trim() && (
                <div className={styles.newSportContainer} style={{ marginTop: '10px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={deporteSinDisciplina}
                      onChange={(e) => {
                        setDeporteSinDisciplina(e.target.checked);
                        if (!e.target.checked) {
                          limpiarCamposFicha();
                        }
                      }}
                    />
                    Este deporte no tiene subdisciplinas <br />(cargar descripción, ícono e imágenes ahora)
                  </label>
                  <p className={styles.newSportDescription} style={{ marginTop: '6px' }}>
                    {deporteSinDisciplina
                      ? `ℹ️ Se creará "${nuevoDeporte}" como disciplina única con los datos que completes abajo.`
                      : `ℹ️ Se creará el deporte "${nuevoDeporte}" con su registro base. Luego podrás agregarle disciplinas desde el selector de arriba.`}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.divider}>— O editar un deporte existente —</div>

          <div className={styles.contFormEdit}>  
            <div className={styles.formGroup}>
              <label className={styles.label}>Deporte Existente</label>
              {dir && <p className={styles.dirText}>{dir}</p>}
              <select
                className={styles.select}
                value={selectedSport}
                onChange={(e) => {
                  setSelectedSport(e.target.value);
                  limpiarCamposFicha();
                  if (e.target.value) {
                    setNuevoDeporte('');
                    setDeporteSinDisciplina(false);
                  }
                }}
              >
                <option value="">-- Seleccionar Deporte --</option>
                {deportes.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nombre} {Number(dep.activo) === 0 ? ' (Inactivo)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedSport && disciplinasDelDeporteSeleccionado.length > 0 && (
              <div className={styles.registeredDisciplinesBox}>
                <span className={styles.registeredTitle}>
                  📌 Disciplinas ya registradas en este deporte:
                </span>
                <ul className={styles.registeredList}>
                  {disciplinasDelDeporteSeleccionado.map((disc) => (
                    <li key={disc.id}>{disc.nombre}</li>
                  ))}
                </ul>
              </div>
            )}


            {/* CAJA DE CONFIGURACIÓN DE FICHA DE DISCIPLINA */}
            <div className={`${styles.disciplineBox} ${!habilitaFichaDisciplina ? styles.disabledBox : ''}`}>
              {/* Nombre de nueva disciplina: solo visible/editable cuando se selecciona un deporte existente */}
              {!deporteSinDisciplina && (
                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${(!selectedSport || esInactivo) ? styles.disabledLabel : ''}`}>
                    Nueva Disciplina para este Deporte {!habilitaFichaDisciplina ? <span style={{color:"red"}}>(DESHABILITADO)</span> : <span style={{color:"green"}}>(HABILITADO)</span>}
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={
                      !selectedSport
                        ? 'Seleccione un deporte arriba o marque deporte único...'
                        : esInactivo
                        ? 'Deporte inactivo (no disponible)'
                        : 'Ej: Futsal, Fútbol 11, Táctica...'
                    }
                    value={nuevaDisciplina}
                    onChange={(e) => setNuevaDisciplina(e.target.value)}
                    disabled={!selectedSport || esInactivo}
                  />
                </div>
              )}

              {/* Descripción */}
              <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                <label className={`${styles.label} ${!habilitaFichaDisciplina ? styles.disabledLabel : ''}`}>
                  Descripción de la Disciplina
                </label>
                <textarea
                  className={styles.input}
                  rows="3"
                  placeholder="Escribe una breve descripción de la disciplina..."
                  value={descripcionDisciplina}
                  onChange={(e) => setDescripcionDisciplina(e.target.value)}
                  disabled={!habilitaFichaDisciplina}
                />
              </div>

              {/* Selección de Icono */}
              <div className={`${styles.formGroup} ${styles.iconSectionGroup}`}>
                <label className={`${styles.label} ${!habilitaFichaDisciplina ? styles.disabledLabel : ''}`}>
                  Icono para el SidePanel:
                </label>
                <div className={styles.iconActionsRow}>
                  <button
                    type="button"
                    onClick={() => setShowIconModal(true)}
                    disabled={!habilitaFichaDisciplina}
                    className={`${styles.openIconModalBtn} ${!habilitaFichaDisciplina ? styles.openIconModalBtnDisabled : ''}`}
                  >
                    {iconDiscip ? `Cambiar Icono (${iconDiscip})` : '🖼️ Seleccionar Icono de la Galería'}
                  </button>

                  {iconDiscip && (
                    <div className={styles.selectedIconWrapper}>
                      <img
                        src={`/iconsArbitra/links/sports/${iconDiscip}`}
                        alt="Icono seleccionado"
                        className={styles.selectedIconPreview}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setIconDiscip('')}
                        className={styles.removeIconBtn}
                        title="Quitar icono"
                      >
                        ❌ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal de Iconos */}
              {showIconModal && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h4 className={styles.modalTitle}>Selecciona un Icono PNG</h4>
                      <button
                        type="button"
                        onClick={() => setShowIconModal(false)}
                        className={styles.modalCloseBtn}
                      >
                        ✕ Cerrar
                      </button>
                    </div>

                    <div className={styles.modalIconsGrid}>
                      {availableIcons.map((iconFile) => {
                        const iconUrl = `/iconsArbitra/links/sports/${iconFile}`;
                        const isSelected = iconDiscip === iconFile;

                        return (
                          <div
                            key={iconFile}
                            onClick={() => {
                              setIconDiscip(iconFile);
                              setShowIconModal(false);
                            }}
                            className={`${styles.modalIconCard} ${isSelected ? styles.modalIconCardSelected : ''}`}
                          >
                            <img
                              src={iconUrl}
                              alt={iconFile}
                              className={styles.modalIconImage}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className={styles.modalIconName}>{iconFile}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Imagen de Tarjeta */}
              <div className={`${styles.fileInputWrapper} ${styles.fileWrapperSpacing}`}>
                <label className={`${styles.label} ${!habilitaFichaDisciplina ? styles.disabledLabel : ''}`}>
                  Imagen de Fondo para la Tarjeta (Pequeña)
                </label>

                <div className={styles.fileInputRow}>
                  <input
                    id="inputFileCard"
                    type="file"
                    accept="image/*"
                    className={styles.input}
                    onChange={(e) => setImagenDisciplina(e.target.files[0] || null)}
                    disabled={!habilitaFichaDisciplina}
                  />
                  {imagenDisciplina && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagenDisciplina(null);
                        const inputElem = document.getElementById('inputFileCard');
                        if (inputElem) inputElem.value = '';
                      }}
                      className={styles.clearFileBtn}
                      title="Quitar archivo seleccionado"
                    >
                      🗑️ Quitar
                    </button>
                  )}
                </div>
              </div>

              {/* Imagen de Banner */}
              <div className={`${styles.fileInputWrapper} ${styles.fileWrapperSpacing}`}>
                <label className={`${styles.label} ${!habilitaFichaDisciplina ? styles.disabledLabel : ''}`}>
                  Imagen de Banner para la Disciplina (Principal)
                </label>

                <div className={styles.fileInputRow}>
                  <input
                    id="inputFileBanner"
                    type="file"
                    accept="image/*"
                    className={styles.input}
                    onChange={(e) => setImagenBannerDisciplina(e.target.files[0] || null)}
                    disabled={!habilitaFichaDisciplina}
                  />
                  {imagenBannerDisciplina && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagenBannerDisciplina(null);
                        const inputElem = document.getElementById('inputFileBanner');
                        if (inputElem) inputElem.value = '';
                      }}
                      className={styles.clearFileBtn}
                      title="Quitar archivo seleccionado"
                    >
                      🗑️ Quitar
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.warningMessageWrapper}>
                {esInactivo && (
                  <span className={styles.warningText}>
                    ⚠️ Habilítalo en el listado de la derecha para poder agregar disciplinas.
                  </span>
                )}
              </div>
            </div>
            </div>

            <div className={styles.contBtn}>
            <Button
              type="submit"
              className={`${styles.submitBtn} ${styles.submitBtnClass}`}
              styleBtn={2}
              disabled={status.loading || (esInactivo && Boolean(nuevaDisciplina))}
            >
              {status.loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>

          {status.success && <div className={styles.successMsg}>✔ {status.success}</div>}
          {status.error && <div className={styles.errorMsg}>❌ {status.error}</div>}
        </form>

        <hr />

        {/* COLUMNA DERECHA: Listado de Deportes */}
        <div className={styles.listColumn}>
          <div className={styles.listHeaderWrapper}>
            <h3 className={`${styles.subtitle} ${styles.listTitleReset}`}>Listado de Deportes</h3>
            <span className={styles.activeCountBadge}>
              ({deportes.filter(d => Number(d.activo) === 1).length} activos)
            </span>
          </div>
          <p className={styles.listDescription}>Estado actual y disciplinas en el sistema.</p>
          <div className={styles.sportsListScroll}>
            {deportes.length === 0 ? (
              <p className={styles.emptyText}>No hay deportes registrados.</p>
            ) : (
              deportes.map((dep) => {
                const isInactivo = Number(dep.activo) === 0;
                const disciplinasDelDep = disciplinas.filter(d => Number(d.deporte_id) === Number(dep.id));
                const isExpanded = !!expandedSports[dep.id];

                return (
                  <div
                    key={dep.id}
                    className={`${styles.sportCard} ${isInactivo ? styles.inactiveCard : styles.activeCard}`}
                  >
                    <div className={styles.sportHeaderRow}>
                      <span className={styles.sportName}>{dep.nombre}</span>
                      <div className={styles.sportHeaderActions}>
                        <span className={`${styles.statusBadge} ${isInactivo ? styles.inactiveText : styles.activeText}`}>
                          {isInactivo ? '🔴 Inactivo' : '🟢 Activo'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleEstadoDeporte(dep.id, dep.activo)}
                          className={isInactivo ? styles.enableBtn : styles.disableBtn}
                        >
                          {isInactivo ? 'Habilitar ✅' : 'Deshabilitar ❌'}
                        </button>

                        {disciplinasDelDep.length === 1 && (
                          <button
                            type="button"
                            onClick={() => setEditingDiscipline(disciplinasDelDep[0])}
                            className={styles.disciplineActionButton}
                            style={{ background: '#007bff', cursor: 'pointer' }}
                          >
                            ✏️ Editar
                          </button>
                        )}
                      </div>
                    </div>

                    {disciplinasDelDep.length > 0 &&
                      !(disciplinasDelDep.length === 1 && disciplinasDelDep[0].nombre.trim().toLowerCase() === dep.nombre.trim().toLowerCase()) && (
                        <div className={styles.disciplinesToggleSection}>
                          <div
                            onClick={() => toggleExpandSport(dep.id)}
                            className={styles.disciplinesClickableHeader}
                          >
                            <span className={styles.disciplinesHeaderText}>
                              <strong>Disciplinas:</strong> {disciplinasDelDep.map(d => d.nombre).join(', ')}
                            </span>
                            <span className={styles.expandBadge}>
                              {isExpanded ? 'Ocultar ▲' : 'Gestionar ▾'}
                            </span>
                          </div>

                          {isExpanded && (
                            <div className={styles.expandedDisciplinesContent}>
                              <p className={styles.expandedHelpMsg}>
                                {isInactivo ? '⚠️ Deporte inactivo: disciplinas bloqueadas en cascada.' : 'Estado independiente de disciplinas:'}
                              </p>
                              <div className={styles.disciplineRowsList}>
                                {disciplinasDelDep.map(disc => {
                                  const isDiscInactivo = Number(disc.status) === 0 || Number(disc.activo) === 0;
                                  return (
                                    <div key={disc.id} className={styles.disciplineSingleRow}>
                                      <span className={isInactivo ? styles.disciplineItemNameInactive : styles.disciplineItemNameActive}>
                                        - {disc.nombre}
                                      </span>
                                      <div className={styles.disciplineStatusContainer}>
                                        <span className={(isInactivo || isDiscInactivo) ? styles.disciplineStatusIndicatorInactive : styles.disciplineStatusIndicatorActive}>
                                          {isInactivo ? '🔴 Bloqueada' : isDiscInactivo ? 'Inactiva' : 'Activa'}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() => setEditingDiscipline(disc)}
                                          className={styles.disciplineActionButton}
                                          style={{ background: '#007bff', cursor: 'pointer' }}
                                        >
                                          ✏️ Editar
                                        </button>

                                        <button
                                          type="button"
                                          disabled={isInactivo}
                                          onClick={() => handleToggleEstadoDisciplina(disc.id, disc.activo)}
                                          className={`${styles.disciplineActionButton} ${
                                            isInactivo
                                              ? styles.disciplineActionBtnBlocked
                                              : isDiscInactivo
                                              ? styles.disciplineActionBtnEnable
                                              : styles.disciplineActionBtnDisable
                                          }`}
                                        >
                                          {isDiscInactivo ? 'Habilitar' : 'Deshabilitar'}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {editingDiscipline && (
        <EditDisciplineModal
          discipline={editingDiscipline}
          availableIcons={availableIcons}
          onClose={() => setEditingDiscipline(null)}
          onSuccess={fetchDeportes}
        />
      )}
    </div>
  );
}

export default FormManageSports;