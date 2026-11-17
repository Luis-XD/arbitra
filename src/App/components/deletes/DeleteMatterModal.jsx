import React, { useState } from 'react';
import Loader from './Loader';
import { CONFIG_BACKEND } from '../config/config';

function DeleteMatterModal({ matter, onSuccess, onCancel }) {
    const [inputValue, setInputValue] = useState('');
    const [hasDownloaded, setHasDownloaded] = useState(false); // 👈 Nuevo estado para controlar la descarga
    const [cargando, setCargando] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const isNameMatching = inputValue.trim().toLowerCase() === matter.name_matter.trim().toLowerCase();
    
    // El botón se habilita solo si coincide el nombre Y ya se descargaron los archivos
    const isReadyToDelete = isNameMatching && hasDownloaded;

    const handleDownloadFiles = () => {
        window.location.href = `${CONFIG_BACKEND.API_DIR}/exportMatterFiles?id=${matter.id_matter}`;
        setHasDownloaded(true); // 👈 Marcamos como descargado al hacer clic
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!isReadyToDelete) return;

        setCargando(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/deleteMatter?id=${matter.id_matter}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_matter: matter.id_matter })
            });
            const data = await response.json();

            if (data.success) {
                if (typeof onSuccess === 'function') onSuccess(matter.id_matter);
            } else {
                setErrorMessage(data.error || "No se pudo eliminar la materia");
            }
        } catch (error) {
            setErrorMessage("Error de conexión al intentar eliminar");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '450px', padding: '10px' }}>
            <p style={{ marginBottom: '15px', color: '#334155', fontSize: '15px', lineHeight: '1.5' }}>
                Estás a punto de eliminar la materia: <strong>{matter.name_matter}</strong> 
            </p>
            <p style={{backgroundColor:'rgb(255, 176, 176)', color:'rgb(90, 25, 25)', fontWeight:'regular', marginBottom:'1rem', padding:'1rem', borderRadius:'1rem'}}>
                SE ELIMINARÁ: <br />{matter.name_matter} (PESTAÑAS, ARCHIVOS, REG. PROGRESO, INSCRIPCIONES). <br />Esta acción no se puede deshacer.<br />
            </p>

            <div style={{ marginBottom: '15px' }}>
                <button 
                    type="button" 
                    onClick={handleDownloadFiles}
                    style={{ 
                        padding: '8px 12px', 
                        background: hasDownloaded ? '#059669' : '#3b82f6', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontWeight: '600', 
                        fontSize: '13px' 
                    }}
                >
                    {hasDownloaded ? '✅ Archivos descargados (.zip)' : '📦 Descargar archivos de esta materia (.zip)'}
                </button>
            </div>

            <p style={{ marginBottom: '8px', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>
                Para confirmar, es necesario descargar la carpeta y escribir el nombre exacto de la materia abajo:
            </p>

            {errorMessage && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleDelete}>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={matter.name_matter}
                    style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: '6px', 
                        border: '1px solid #cbd5e1', 
                        marginBottom: '20px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                    autoFocus
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        style={{ padding: '8px 16px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Cancelar
                    </button>
                    
                    <button 
                        type="submit" 
                        disabled={!isReadyToDelete || cargando}
                        style={{ 
                            padding: '8px 16px', 
                            background: isReadyToDelete ? '#ef4444' : '#fca5a5', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: isReadyToDelete ? 'pointer' : 'not-allowed', 
                            fontWeight: '600',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {cargando ? <Loader mini={true} /> : "Sí, eliminar materia"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DeleteMatterModal;