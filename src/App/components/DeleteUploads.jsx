import { useState, useEffect } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import Button from './Button';

function DeleteUploads() {
    const [stats, setStats] = useState({ totalFiles: 0, lastDownload: null });
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${CONFIG_BACKEND.API_DIR}/getUploadsStatus`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setStats({
                    totalFiles: data.totalFiles,
                    lastDownload: data.lastDownload
                });
            }
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDeleteUploads = async () => {
        if (!stats.lastDownload) {
            alert("⚠️ Debes descargar el respaldo ZIP antes de poder eliminar los archivos.");
            return;
        }

        const confirmDelete = window.confirm("¿Estás seguro de eliminar todo el contenido dentro de uploads? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;

        setDeleting(true);
        try {
            const res = await fetch(`${CONFIG_BACKEND.API_DIR}/deleteUploadsContents`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();

            if (data.success) {
                alert("🗑️ Contenido de uploads eliminado correctamente.");
                await fetchStats();
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            alert("No se pudo conectar con el servidor para eliminar.");
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return null;

    // Bloquear si nunca se descargó o si no hay archivos
    const canDelete = stats.lastDownload !== null && stats.totalFiles > 0;

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #ef4444',
            borderRadius: '2.5rem',
            padding: '20px',
            color: '#000',
            maxWidth: '480px',
            margin: '15px 0'
        }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#b91c1c' }}>
                🗑️ Limpiar Carpeta Uploads
            </h3>

            <p style={{ fontSize: '14px', marginBottom: '15px', color: '#4b5563' }}>
                {!stats.lastDownload 
                    ? "🔒 Bloqueado: Debes realizar la descarga del ZIP antes de habilitar el borrado."
                    : "✅ Respaldo verificado. Puedes proceder a limpiar el servidor si lo deseas."}
            </p>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button
                    onClick={handleDeleteUploads}
                    disabled={deleting || !canDelete}
                    styleBtn={2}
                >
                    {deleting ? '⏳ Vaciando carpeta...' : '🗑️ Eliminar contenido de Uploads'}
                </Button>
            </div>
        </div>
    );
}

export default DeleteUploads;