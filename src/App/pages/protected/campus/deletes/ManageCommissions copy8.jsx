import { useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import styles from './css/ManageCommissions.module.css'
import Button from '../../../components/Button'
import ContFormInput from '../../../components/ContFormInput'
import Loader from '../../../components/Loader'
import { CONFIG_BACKEND } from '../../../config/config'

function ManageCommissions() {
    const { commissions, disciplines, cargando, refreshCampusData } = useOutletContext();
    
    const [copiedId, setCopiedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [form, setForm] = useState({ id: null, id_discipline: '', name: '', shift: 'Mañana', status: 'active' })
    const [isEditing, setIsEditing] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const formRef = useRef(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleEditClick = (comm) => {
        setForm({ 
            id: comm.id_commissions, 
            id_discipline: comm.id_discipline || comm.id_discip || '', 
            name: comm.name, 
            shift: comm.shift, 
            status: comm.status || 'active' 
        })
        setIsEditing(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        setIsAnimating(false)
        setTimeout(() => {
            setIsAnimating(true)
        }, 100)
    }

    const handleCancelEdit = () => {
        setForm({ id: null, id_discipline: '', name: '', shift: 'Mañana', status: 'active' })
        setIsEditing(false)
        setIsAnimating(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.id_discipline) {
            alert("Debes seleccionar una disciplina obligatoriamente antes de crear o editar la comisión.")
            return
        }

        const endpoint = isEditing ? `${CONFIG_BACKEND.API_DIR}/updateCommission` : `${CONFIG_BACKEND.API_DIR}/createCommission`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()

            if (data.success) {
                alert(isEditing ? "Comisión actualizada con éxito." : `Comisión creada con éxito. Código: ${data.code}`)
                handleCancelEdit()
                await refreshCampusData()
            } else {
                alert(data.error || "Ocurrió un error")
            }
        } catch (error) {
            console.error(error)
            alert("Error de red al procesar la solicitud")
        }
    }

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    const filteredCommissions = commissions.filter(comm => {
        const query = searchTerm.toLowerCase();
        const commName = (comm.name || '').toLowerCase();
        const discName = (comm.name_discip || comm.discipline_name || '').toLowerCase(); 
        
        return commName.includes(query) || discName.includes(query);
    })

    if (cargando && commissions.length === 0) return <Loader />

    return (
        <div className={styles.container}>
            <h2>{isEditing ? 'Editar Comisión' : 'Gestión de Comisiones'}</h2>
            
            <form 
                ref={formRef}
                onSubmit={handleSubmit} 
                className={`${styles.form} ${isAnimating ? styles.pulseHighlight : ''}`}
            >
                <ContFormInput nameElm="Disciplina / Materia:">
                    <select 
                        name="id_discipline" 
                        value={form.id_discipline} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">-- Disciplinas activas --</option>
                        {disciplines
                            .filter(disc => Number(disc.status) === 1)
                            .map(disc => (
                                <option key={disc.id_discip} value={disc.id_discip}>
                                    {disc.name_discip}
                                </option>
                            ))}
                    </select>
                </ContFormInput>

                <ContFormInput nameElm="Nombre de la Comisión:">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Ej: Comisión A" 
                        value={form.name} 
                        onChange={handleChange} 
                        required 
                    />
                </ContFormInput>

                <ContFormInput nameElm="Turno:">
                    <select name="shift" value={form.shift} onChange={handleChange}>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noche">Noche</option>
                    </select>
                </ContFormInput>

                {isEditing && (
                    <ContFormInput nameElm="Estado:">
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="active">Activa</option>
                            <option value="inactive">Inactiva</option>
                        </select>
                    </ContFormInput>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                    <Button typeBtn="submit" styleBtn={2}>
                        {isEditing ? 'Guardar Cambios' : 'Crear Comisión y Generar Código'}
                    </Button>
                    {isEditing && (
                        <Button type="button" styleBtn={2} onClick={handleCancelEdit} className={styles.cancelButton}>
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>

            <div className={styles.listContainer}>
                <div className={styles.cont}>
                    <h3 style={{ margin: 0 }}>Comisiones Registradas</h3>
                    <input 
                        type="text"
                        placeholder="🔍 Buscar comisión o disciplina..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #4b5563',
                            background: '#1f2937',
                            color: '#fff',
                            outline: 'none',
                            width: '260px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                
                <div className={styles.gridHeader} style={{ gridTemplateColumns: '0.6fr 1.6fr 1fr 0.7fr 1fr 0.8fr 0.7fr 1fr' }}>
                    <div className={styles.colId}>ID</div>
                    <div className={styles.colDiscipline}>Disciplina</div>
                    <div className={styles.colName}>Nombre</div>
                    <div className={styles.colShift}>Turno</div>
                    <div className={styles.colCode}>Código</div>
                    <div className={styles.colStudents}>Alumnos</div>
                    <div className={styles.colStatus}>Estado</div>
                    <div className={styles.colAction}>Acción</div>
                </div>

                <div className={styles.gridBody}>
                    {cargando ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <Loader />
                        </div>
                    ) : filteredCommissions.length > 0 ? (
                        filteredCommissions.map(comm => (
                            <div key={comm.id_commissions} className={styles.gridRow} style={{ gridTemplateColumns: '0.6fr 1.6fr 1fr 0.7fr 1fr 0.8fr 0.7fr 1fr' }}>
                                <div className={styles.colId} data-label="ID">{comm.id_commissions}</div>
                                <div className={styles.colDiscipline} data-label="Disciplina">
                                    {comm.name_discip || comm.discipline_name || 'Sin asignar'}
                                </div>
                                <div className={styles.colName} data-label="Nombre">{comm.name}</div>
                                <div className={styles.colShift} data-label="Turno">{comm.shift}</div>
                                <div className={styles.colCode} data-label="Código">
                                    <code>{comm.code || 'N/A'}</code>
                                    {comm.code && (
                                        <button 
                                            type="button"
                                            onClick={() => handleCopy(comm.code, comm.id_commissions)}
                                            className={styles.copyBtn}
                                            title='Copiar código'
                                        >
                                            {copiedId === comm.id_commissions ? "✅" : "📋"}
                                        </button>
                                    )}
                                </div>
                                <div className={styles.colStudents} data-label="Alumnos">{comm.total_students}</div>
                                <div className={styles.colStatus} data-label="Estado">{comm.status}</div>
                                <div className={styles.colAction} data-label="Acción" style={{ display: 'flex', gap: '5px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => handleEditClick(comm)}
                                        style={{ padding: '5px 8px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyMessage}>No se encontraron comisiones que coincidan con la búsqueda.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageCommissions