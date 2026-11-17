import { useState, useEffect } from 'react';
import styles from './css/ManageMatters.module.css';
import Loader from '../../../components/Loader';
import Modal from '../../../components/Modal';
import FormCreateMatter from '../../../components/FormCreateMatter';
import FormUpdateMatter from '../../../components/FormUpdateMatter';
import { CONFIG_BACKEND } from '../../../config/config';

function ManageMatters() {
    const [cargando, setCargando] = useState(true)
    const [matters, setMatters] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    
    // Control de modales y estado de preparación para la edición
    const [modalMode, setModalMode] = useState(null)
    const [selectedMatter, setSelectedMatter] = useState(null)
    const [isPreparingEdit, setIsPreparingEdit] = useState(false)

    const fetchMatters = async () => {
        setCargando(true);
        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/getMattersAdmin`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setMatters(data.result || []);
            } else {
                setErrorMessage(data.error || "No se pudieron cargar las materias");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            setErrorMessage("Error de conexión al cargar las materias");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchMatters();
    }, []);

    const filteredMatters = matters.filter(matter => 
        matter.name_matter.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCloseModal = () => {
        setModalMode(null);
        setSelectedMatter(null);
    };

    const handleSuccessAction = () => {
        fetchMatters();
        handleCloseModal();
    };

    const handleOpenEditModal = async (matter) => {
        setIsPreparingEdit(true);
        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/courseDetails?id=${matter.id_matter}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success && data.result) {
                setSelectedMatter(data.result); 
                setModalMode('edit');
            } else {
                alert(data.error || "No se pudo cargar la información de la materia");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión al intentar editar");
        } finally {
            setIsPreparingEdit(false);
        }
    };

    return (
        <div className={styles.manageContainer}>
            <h2>Gestión de Materias</h2>

            <div className={styles.topBar}>
                <input 
                    type="text" 
                    placeholder="🔍 Buscar materia por nombre..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
                
                <button 
                    onClick={() => setModalMode('create')} 
                    className={styles.createButton}
                >
                    + Crear Nueva Materia
                </button>
            </div>

            {errorMessage && (
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}

            {cargando ? (
                <div className={styles.loaderContainer}><Loader /></div>
            ) : (
                <div className={styles.listContainer} style={{ opacity: cargando ? 0.4 : 1, transition: 'opacity 0.2s ease' }}>
                    <div className={styles.listHeader}>
                        <div className={styles.colId}>ID</div>
                        <div className={styles.colName}>Nombre</div>
                        <div className={styles.colClasses}>Total Clases</div>
                        <div className={styles.colActions}>Acciones</div>
                    </div>

                    <div className={styles.listBody}>
                        {cargando && matters.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>Cargando materias...</div>
                        ) : filteredMatters.length > 0 ? (
                            filteredMatters.map((matter) => (
                                <div key={matter.id_matter} className={styles.matterRow}>
                                    <div className={styles.colId}>{matter.id_matter}</div>
                                    <div className={styles.colName} style={{ fontWeight: '500' }}>{matter.name_matter}</div>
                                    <div className={styles.colClasses}>
                                        <span className={styles.classesBadge}>
                                            {matter.total_classes} clases
                                        </span>
                                    </div>
                                    <div className={styles.colActions}>
                                        <div className={styles.actionButtons}>
                                            {/* 👈 AQUÍ LLAMAS A LA NUEVA CONSTANTE */}
                                            <button 
                                                onClick={() => handleOpenEditModal(matter)}
                                                className={styles.editBtn}
                                                disabled={isPreparingEdit}
                                            >
                                                {isPreparingEdit ? <Loader mini={true} /> : "Editar"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>No se encontraron materias registradas.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Modales independientes */}
            {modalMode === 'create' && (
                <Modal titleElm="Crear Nueva Materia" onClickElm={handleCloseModal}>
                    <FormCreateMatter onSuccess={handleSuccessAction} />
                </Modal>
            )}

            {modalMode === 'edit' && selectedMatter && (
                <Modal titleElm="Editar Materia" onClickElm={handleCloseModal}>
                    <FormUpdateMatter matterData={selectedMatter} onSuccess={handleSuccessAction} />
                </Modal>
            )}
        </div>
    );
}

export default ManageMatters