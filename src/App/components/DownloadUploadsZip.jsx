    import { useState, useEffect } from 'react';
    import { CONFIG_BACKEND } from '../config/config';
    import Button from './Button';

    function DownloadUploadsZip() {
        const [stats, setStats] = useState({ totalFiles: 0, typesCount: {}, lastDownload: null });
        const [loading, setLoading] = useState(true);
        const [downloading, setDownloading] = useState(false);

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
                        typesCount: data.typesCount || {},
                        lastDownload: data.lastDownload
                    });
                }
            } catch (error) {
                console.error("Error al obtener estadísticas de archivos:", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchStats();
        }, []);

        const handleDownloadZip = async () => {
            setDownloading(true);
            try {
                const res = await fetch(`${CONFIG_BACKEND.API_DIR}/downloadUploadsZip`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) throw new Error("Error en la descarga");

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `uploads_backup_${new Date().toISOString().slice(0, 10)}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                // Actualizar estadísticas tras la descarga
                await fetchStats();
            } catch (error) {
                alert("No se pudo descargar el archivo ZIP.");
                console.error(error);
            } finally {
                setDownloading(false);
            }
        };

        if (loading) {
            return <div style={{ color: '#a1a1aa', padding: '15px' }}>Cargando información de archivos...</div>;
        }

        return (
            <div style={{
                background: '#fff',
                border: '1px solid #27272a',
                borderRadius: '2.5rem',
                padding: '20px',
                color: '#000',
                maxWidth: '480px',
                margin: '15px 0'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#131b2e' }}>
                    📦 Respaldo de Archivos Adjutados (Uploads)
                </h3>

                <div style={{ fontSize: '14px', marginBottom: '15px'}}>
                    <p style={{ margin: '4px 0', color: '#222222' }}>
                        📄 <strong>Total de archivos:</strong> {stats.totalFiles}
                    </p>
                    <p style={{ margin: '4px 0', color: '#222222' }}>
                        🕒 <strong>Última descarga:</strong> {stats.lastDownload ? stats.lastDownload : 'Nunca descaragado'}
                    </p>
                </div>

                {Object.keys(stats.typesCount).length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                        <span style={{ fontSize: '12px', color: '#747474', display: 'block', marginBottom: '6px' }}>
                            Desglose por formato:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {Object.entries(stats.typesCount).map(([ext, count]) => (
                                <span 
                                    key={ext}
                                    style={{
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#e4e4e7'
                                    }}
                                >
                                    .{ext.toUpperCase()}: <strong>{count}</strong>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                    <Button
                        onClick={handleDownloadZip}
                        disabled={downloading || stats.totalFiles === 0}
                        styleBtn={2}
                    >
                        {downloading ? '🗜️ Generando ZIP...' : '⬇️ Descargar carpeta completa (ZIP)'}
                    </Button>
                </div>
            </div>
        );
    }

    export default DownloadUploadsZip;