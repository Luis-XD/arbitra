import { useState, useEffect } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import styles from './css/FormManageSports.module.css';
import Button from './Button';

function FormManageSports() {
  const [deportes, setDeportes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [availableIcons, setAvailableIcons] = useState([]); // Iconos escaneados del backend
  const [nuevoDeporte, setNuevoDeporte] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  
  // Nuevos estados para gestionar disciplina existente, banner, icono y modo de acción
  const [modoAccionDisciplina, setModoAccionDisciplina] = useState('nueva'); // 'nueva' | 'existente'
  const [selectedExistingDiscipline, setSelectedExistingDiscipline] = useState('');
  const [nuevaDisciplina, setNuevaDisciplina] = useState('');
  const [imagenDisciplina, setImagenDisciplina] = useState(null); // Imagen de tarjeta
  const [imagenBannerDisciplina, setImagenBannerDisciplina] = useState(null); // Imagen de banner
  const [iconDiscip, setIconDiscip] = useState(''); // Icono independiente
  
  // Estados de previsualización y control visual de archivos
  const [previewImgDiscip, setPreviewImgDiscip] = useState('');
  const [previewImgBanner, setPreviewImgBanner] = useState('');
  const [showIconModal, setShowIconModal] = useState(false);
  
  const [imagenNuevoDeporte, setImagenNuevoDeporte] = useState(null);
  const [status, setStatus] = useState({ loading: false, success: null, error: null });
  
  const [expandedSports, setExpandedSports] = useState({});

  const deporteActual = deportes.find(d => d.id == selectedSport);
  const esInactivo = deporteActual && Number(deporteActual.activo) === 0;

  const disciplinasDelDeporteSeleccionado = disciplinas.filter(
    d => Number(d.deporte_id) === Number(selectedSport)
  );

  const [dir, setDir] = useState('')

  // Sincronizar icono y previsualizaciones al seleccionar disciplina existente
  useEffect(() => {
    if (modoAccionDisciplina === 'existente' && selectedExistingDiscipline) {
      const discEncontrada = disciplinas.find(d => Number(d.id) === Number(selectedExistingDiscipline));
      if (discEncontrada) {
        setIconDiscip(discEncontrada.icon_discip || '');
        setPreviewImgDiscip(discEncontrada.img_discip || '');
        setPreviewImgBanner(discEncontrada.img_banner || '');
      }
    } else {
      setIconDiscip('');
      setPreviewImgDiscip('');
      setPreviewImgBanner('');
    }
  }, [selectedExistingDiscipline, modoAccionDisciplina, disciplinas]);

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
        setDir(data.dir)
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  useEffect(() => {
    fetchDeportes();
  }, []);

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

    if (esInactivo && (nuevaDisciplina.trim() || selectedExistingDiscipline)) {
      setStatus({ loading: false, success: null, error: 'No se pueden modificar disciplinas para un deporte inactivo. Habilítalo primero.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('deporte_id', selectedSport);
      formData.append('nuevo_deporte', nuevoDeporte);

      // Bifurcación: Actualizar disciplina existente o crear nueva
      const esActualizacion = modoAccionDisciplina === 'existente' && selectedExistingDiscipline;
      const endpointDestino = esActualizacion ? 'updateDisciplineSport' : 'createSportDiscipline';

      if (esActualizacion) {
        formData.append('disciplina_id', selectedExistingDiscipline);
      } else {
        formData.append('nueva_disciplina', nuevaDisciplina);
      }

      // Adjuntar icono, tarjeta y banner independientes
      if (iconDiscip) {
        formData.append('icon_discip', iconDiscip);
      }
      if (imagenDisciplina) {
        formData.append('img_discip', imagenDisciplina);
      }
      if (imagenBannerDisciplina) {
        formData.append('img_banner', imagenBannerDisciplina);
      }

      if (nuevoDeporte.trim() && imagenNuevoDeporte) {
        formData.append('img_discip', imagenNuevoDeporte);
      }

      const response = await fetch(`${CONFIG_BACKEND.API_DIR}/${endpointDestino}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setNuevoDeporte('');
        setSelectedSport('');
        setNuevaDisciplina('');
        setSelectedExistingDiscipline('');
        setIconDiscip('');
        setImagenDisciplina(null);
        setImagenBannerDisciplina(null);
        setImagenNuevoDeporte(null);
        setModoAccionDisciplina('nueva');
        setPreviewImgDiscip('');
        setPreviewImgBanner('');
        
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');

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
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <form onSubmit={handleSubmit} className={styles.formColumn}>
          <h3 className={styles.subtitle}>Formulario de Edición</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Deporte Existente</label>
            <p style={{color:'#000'}}>{dir}</p>
            <select 
              className={styles.select}
              value={selectedSport} 
              onChange={(e) => {
                setSelectedSport(e.target.value);
                setNuevaDisciplina('');
                setSelectedExistingDiscipline('');
                setIconDiscip('');
                setPreviewImgDiscip('');
                setPreviewImgBanner('');
                if (e.target.value) {
                  setNuevoDeporte('');
                  setImagenNuevoDeporte(null);
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

          <div className={`${styles.disciplineBox} ${(!selectedSport || esInactivo) ? styles.disabledBox : ''}`}>
            
            {selectedSport && !esInactivo && (
              <div style={{ marginBottom: '12px', display: 'flex', gap: '15px' }}>
                <label style={{ cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="radio" 
                    name="modoDisciplina" 
                    checked={modoAccionDisciplina === 'nueva'} 
                    onChange={() => { setModoAccionDisciplina('nueva'); setSelectedExistingDiscipline(''); }} 
                  />{' '}
                  Crear nueva disciplina <br /> (Asignar nueva disciplina)
                </label>
                <label style={{ cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="radio" 
                    name="modoDisciplina" 
                    checked={modoAccionDisciplina === 'existente'} 
                    onChange={() => { setModoAccionDisciplina('existente'); setNuevaDisciplina(''); }} 
                  />{' '}
                  Elegir existente <br /> (Actualizar información)
                </label>
              </div>
            )}

            {modoAccionDisciplina === 'nueva' ? (
              <>
                <label className={`${styles.label} ${(!selectedSport || esInactivo) ? styles.disabledLabel : ''}`}>
                  Nueva Disciplina para este Deporte
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={!selectedSport ? "Seleccione un deporte primero..." : esInactivo ? "Deporte inactivo (no disponible)" : "Ej: Futsal, Táctica, etc."}
                  value={nuevaDisciplina}
                  onChange={(e) => setNuevaDisciplina(e.target.value)}
                  disabled={!selectedSport || esInactivo}
                />
              </>
            ) : (
              <>
                <label className={`${styles.label} ${(!selectedSport || esInactivo) ? styles.disabledLabel : ''}`}>
                  Seleccionar Disciplina Existente
                </label>
                <select
                  className={styles.select}
                  value={selectedExistingDiscipline}
                  onChange={(e) => setSelectedExistingDiscipline(e.target.value)}
                  disabled={!selectedSport || esInactivo}
                >
                  <option value="">-- Seleccionar Disciplina --</option>
                  {disciplinasDelDeporteSeleccionado.map(disc => (
                    <option key={disc.id} value={disc.id}>
                      {disc.nombre}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* SELECCIÓN DE ICONO CON VENTANA FLOTANTE (MODAL) */}
            <div className={styles.formGroup} style={{ marginTop: '15px' }}>
              <label className={`${styles.label} ${(!selectedSport || esInactivo) ? styles.disabledLabel : ''}`}>
                Icono para el SidePanel:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                <button
                  type="button"
                  onClick={() => setShowIconModal(true)}
                  disabled={!selectedSport || esInactivo}
                  style={{
                    padding: '8px 12px',
                    background: '#2b3a4a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (!selectedSport || esInactivo) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {iconDiscip ? `Cambiar Icono (${iconDiscip})` : '🖼️ Seleccionar Icono de la Galería'}
                </button>

                {iconDiscip && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img 
                      src={`${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/icons/${iconDiscip}`} 
                      alt="Icono seleccionado" 
                      style={{ width: 'auto', height: '100%',borderRadius:'100%', objectFit: 'contain', background:'#131b2e', padding:'0.2rem'}}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setIconDiscip('')}
                      style={{ background: '#FF0707', fontWeight:'bold', padding:'0.4rem', borderRadius: '0.5rem', border:'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
                      title="Quitar icono"
                    >
                      ❌ Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* VENTANA FLOTANTE (MODAL) DE ICONOS */}
            {showIconModal && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  width: '450px',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  display:'flex',
                  justifyContent:'center',
                  flexDirection:'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>Selecciona un Icono PNG</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowIconModal(false)}
                      style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✕ Cerrar
                    </button>
                  </div>

                  <div style={{
                    gap: '10px',
                    display:'flex',
                    flexWrap:'wrap',
                    justifyContent:'center'
                  }}>
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
                          style={{
                            border: isSelected ? '2px solid #059c38' : '1px solid #ddd',
                            borderRadius: '6px',
                            padding: '8px',
                            textAlign: 'center',
                            width:'7.5rem',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#059c38' : '#131b2e'
                          }}
                        >
                          <img 
                            src={iconUrl} 
                            alt={iconFile} 
                            style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span style={{ display: 'block', fontSize: '9px', marginTop: '5px', wordBreak: 'break-all', color: '#fff' }}>
                            {iconFile}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* IMAGEN DE TARJETA CON PREVISUALIZACIÓN Y BOTÓN DE ELIMINAR */}
            <div className={styles.fileInputWrapper} style={{ marginTop: '10px' }}>
              <label className={`${styles.label} ${(!selectedSport || esInactivo) ? styles.disabledLabel : ''}`}>
                Imagen de Fondo para la Tarjeta (Pequeña)
              </label>

              {previewImgDiscip && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', background: '#f8f9fa', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <img 
                    src={`${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/cards/${previewImgDiscip}`} 
                    alt="Tarjeta actual" 
                    style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '11px', color: '#555' }}>Actual: {previewImgDiscip}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="inputFileCard"
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={(e) => setImagenDisciplina(e.target.files[0] || null)}
                  disabled={!selectedSport || esInactivo}
                />
                {imagenDisciplina && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagenDisciplina(null);
                      const inputElem = document.getElementById('inputFileCard');
                      if (inputElem) inputElem.value = '';
                    }}
                    style={{ padding: '6px 10px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    title="Quitar archivo seleccionado"
                  >
                    🗑️ Quitar
                  </button>
                )}
              </div>
            </div>

            {/* IMAGEN DE BANNER CON PREVISUALIZACIÓN Y BOTÓN DE ELIMINAR */}
            <div className={styles.fileInputWrapper} style={{ marginTop: '10px' }}>
              <label className={`${styles.label} ${(!selectedSport || esInactivo) ? styles.disabledLabel : ''}`}>
                Imagen de Banner para la Disciplina (Principal)
              </label>

              {previewImgBanner && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', background: '#f8f9fa', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <img 
                    src={`${CONFIG_BACKEND.API_DIR}/src/assets/disciplines/banners/${previewImgBanner}`} 
                    alt="Banner actual" 
                    style={{ width: 'auto', height: '30px', objectFit: 'cover', borderRadius: '4px', overflow:'hidden' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '11px', color: '#555' }}>Actual: {previewImgBanner}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="inputFileBanner"
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={(e) => setImagenBannerDisciplina(e.target.files[0] || null)}
                  disabled={!selectedSport || esInactivo}
                />
                {imagenBannerDisciplina && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagenBannerDisciplina(null);
                      const inputElem = document.getElementById('inputFileBanner');
                      if (inputElem) inputElem.value = '';
                    }}
                    style={{ padding: '6px 10px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
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
                  ⚠️ Habilítalo en el listado de la derecha para poder agregar o modificar disciplinas.
                </span>
              )}
            </div>
          </div>

          <div className={styles.divider}>— O crear nuevo deporte —</div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nuevo Deporte</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Ej: Fútbol, Básquet..."
              value={nuevoDeporte}
              onChange={(e) => {
                setNuevoDeporte(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedSport('');
                  setNuevaDisciplina('');
                  setSelectedExistingDiscipline('');
                  setIconDiscip('');
                  setImagenDisciplina(null);
                  setImagenBannerDisciplina(null);
                }
              }}
              disabled={Boolean(selectedSport)}
            />

            {nuevoDeporte.trim() && (
              <div className={styles.newSportContainer}>
                <label className={`${styles.label} ${styles.newSportLabel}`}>
                  Imagen inicial para este Deporte (*)
                </label>
                <p className={styles.newSportDescription}>
                  ℹ️ Al crear un deporte nuevo, se generará su disciplina base con este nombre e imagen. Podrás agregar más disciplinas después.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={(e) => setImagenNuevoDeporte(e.target.files[0])}
                />
              </div>
            )}
          </div>

          <div className={styles.contBtn}>
            <Button type="submit" className={`${styles.submitBtn} ${styles.submitBtnClass}`} styleBtn={2} disabled={status.loading || (esInactivo && (Boolean(nuevaDisciplina) || Boolean(selectedExistingDiscipline)))}>
              {status.loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>

          {status.success && <div className={styles.successMsg}>✔ {status.success}</div>}
          {status.error && <div className={styles.errorMsg}>❌ {status.error}</div>}
        </form>
        <hr />
        {/* COLUMNA DERECHA: Listado de Deportes */}
        <div className={styles.listColumn}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 className={styles.subtitle} style={{ margin: 0 }}>Listado de Deportes</h3>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#059c38' }}>
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
                      </div>
                    </div>

                    {disciplinasDelDep.length > 0 && (
                      // Ocultar sección de gestionar si hay una sola disciplina y se llama exactamente igual que el deporte
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
                                        • {disc.nombre}
                                      </span>
                                      <div className={styles.disciplineStatusContainer}>
                                        <span className={(isInactivo || isDiscInactivo) ? styles.disciplineStatusIndicatorInactive : styles.disciplineStatusIndicatorActive}>
                                          {isInactivo ? '🔴 Bloqueada' : isDiscInactivo ? 'Inactiva' : 'Activa'}
                                        </span>
                                        <button
                                          type="button"
                                          disabled={isInactivo}
                                          onClick={() => handleToggleEstadoDisciplina(disc.id, disc.activo)}
                                          className={styles.disciplineActionButton}
                                          style={{
                                            cursor: isInactivo ? 'not-allowed' : 'pointer',
                                            background: isInactivo ? '#e0e0e0' : (isDiscInactivo ? '#5cb85c' : '#d9534f'),
                                            opacity: isInactivo ? 0.6 : 1
                                          }}
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
                      )
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FormManageSports;