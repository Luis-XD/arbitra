import { useState, useEffect } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import Button from './Button';

export default function FormEditClassDetail({ idTabs, initialBlocks = [], onSaved }) {
    const [blocks, setBlocks] = useState(initialBlocks);
    const [commissions, setCommissions] = useState([]); // 👈 Estado para guardar las comisiones disponibles
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // 👈 Cargamos las comisiones al montar el componente para mostrarlas en el selector
    useEffect(() => {
        const fetchCommissions = async () => {
            try {
                const res = await fetch(`${CONFIG_BACKEND.API_DIR}/getCommissions`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                const data = await res.json();
                if (data.success) {
                    setCommissions(data.result || []);
                }
            } catch (error) {
                console.error("Error al cargar comisiones:", error);
            }
        };
        fetchCommissions();
    }, []);

    const handleBlockChange = (index, field, value) => {
        const updated = [...blocks];
        updated[index][field] = value;
        setBlocks(updated);
    };

    const handleAddNewBlock = () => {
        setBlocks([
            ...blocks,
            {
                id_content_blocks: null,
                id_commission: '', // 👈 Por defecto vacío (General)
                content_type: 'text',
                content_value: '',
                file: null
            }
        ]);
    };

    // 🗑️ Función para eliminar un bloque nuevo (que aún no está guardado)
    const handleRemoveBlock = (index) => {
        const updated = blocks.filter((_, i) => i !== index);
        setBlocks(updated);
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const updated = [...blocks];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;
        setBlocks(updated);
    };

    const handleMoveDown = (index) => {
        if (index === blocks.length - 1) return;
        const updated = [...blocks];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;
        setBlocks(updated);
    };

    // Función interna para subir el video directamente a Bunny
    const uploadVideoToBunny = async (fileObject, title) => {
        const createRes = await fetch(`${CONFIG_BACKEND.API_DIR}/createVideo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title: title || 'Clase de Video' })
        });

        const responseText = await createRes.text();
        let videoData;
        try {
            videoData = JSON.parse(responseText);
        } catch (e) {
            console.error("Respuesta del servidor no es JSON:", responseText);
            throw new Error("El servidor no devolvió una respuesta JSON válida.");
        }

        if (!createRes.ok || !videoData.guid) {
            throw new Error(videoData.error || 'No se pudo crear la instancia del video en Bunny');
        }

        const videoId = videoData.guid;
        const libraryId = videoData.libraryId || '791786';

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, true);
            xhr.setRequestHeader('AccessKey', '415a56af-40f0-418d-b1b73b1b5c6c-990d-4412');
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    resolve(videoId);
                } else {
                    reject(new Error(`Error al subir el binario a Bunny (Status ${xhr.status})`));
                }
            };

            xhr.onerror = () => reject(new Error('Error de red al intentar conectar con Bunny para la subida.'));
            xhr.send(fileObject);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const processedBlocks = [...blocks];

            for (let i = 0; i < processedBlocks.length; i++) {
                const block = processedBlocks[i];
                if (block.content_type === 'video' && block.file && !block.id_content_blocks) {
                    const videoGuid = await uploadVideoToBunny(block.file, `Clase - Pestaña ${idTabs}`);
                    block.content_value = videoGuid; 
                }
            }

            const formData = new FormData();
            formData.append('id_tabs', idTabs);

            processedBlocks.forEach((block, index) => {
                formData.append(`blocks[${index}][id_content_blocks]`, block.id_content_blocks || '');
                formData.append(`blocks[${index}][id_commission]`, block.id_commission || ''); 
                formData.append(`blocks[${index}][content_type]`, block.content_type);
                formData.append(`blocks[${index}][content_value]`, block.content_value || '');
                formData.append(`blocks[${index}][order_block]`, index); 

                if ((block.content_type === 'file' || block.content_type === 'video') && block.file) {
                    formData.append(`blocks[${index}][file]`, block.file);
                }
            });

            const res = await fetch(`${CONFIG_BACKEND.API_DIR}/saveClassDetails`, {
                method: 'POST',
                body: formData, 
                credentials: 'include'
            });

            const responseText = await res.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (err) {
                console.error("Respuesta no válida del servidor:", responseText);
                alert("Error crítico en el servidor. Revisa la consola.");
                setIsSubmitting(false);
                return;
            }

            if (data.success) {
                onSaved(data.blocks || []); 
            } else {
                alert("Error al guardar: " + (data.message || "Desconocido"));
            }
        } catch (error) {
            console.error("Error en el proceso:", error);
            alert("Ocurrió un error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', color: '#000', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
            <h3>Agregar contenido a esta pestaña</h3>
            <p style={{ padding: '10px', borderLeft: '4px solid #f59e0b', borderRadius: '4px', background:'#333', fontSize:'0.8rem' }}>
                🔒 Por seguridad, los archivos subidos no se pueden eliminar ni reemplazar.<br/>
                👁‍🗨 Los nombres de las imagenes, videos y archivos serán visibles.
            </p>

            {blocks.map((block, index) => {
                const isExisting = block.id_content_blocks !== null && block.id_content_blocks !== undefined;

                return (
                    <div key={block.id_content_blocks || index} style={{ marginBottom: '20px', padding: '15px', color: '#2a2a2e', borderRadius: '6px', position: 'relative', border: '1px solid #ddd' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#333' }}>Bloque #{index + 1}</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => handleMoveUp(index)} 
                                    disabled={index === 0}
                                    style={{color: '#333', border: 'none', padding: '2px 8px', borderRadius: '3px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}
                                >
                                    ⬆️
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => handleMoveDown(index)} 
                                    disabled={index === blocks.length - 1}
                                    style={{color: '#333', border: 'none', padding: '2px 8px', borderRadius: '3px', cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer', opacity: index === blocks.length - 1 ? 0.5 : 1 }}
                                >
                                    ⬇️
                                </button>
                                {/* 🗑️ Botón para eliminar bloque si es nuevo (vacío/no guardado aún) */}
                                {!isExisting && (
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveBlock(index)} 
                                        title="Eliminar bloque"
                                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
                                    >
                                        ❌ Eliminar bloque
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Selector de Comisión */}
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#000' }}>
                                Destinatario del contenido:
                            </label>
                            <select 
                                value={block.id_commission || ''} 
                                onChange={(e) => handleBlockChange(index, 'id_commission', e.target.value)}
                            >
                                <option value="0">General (Todas las comisiones)</option>
                                {commissionsList.map(comm => (
                                    <option key={comm.id_commissions} value={comm.id_commissions}>
                                        {comm.name} ({comm.shift})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {isExisting ? (
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                Tipo de contenido: <strong>{block.content_type}</strong>
                            </label>
                        ) : (
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#9ca3af' }}>
                                    Seleccionar tipo de contenido:
                                </label>
                                <select 
                                    value={block.content_type || 'text'} 
                                    onChange={(e) => {
                                        const updated = [...blocks];
                                        updated[index].content_type = e.target.value;
                                        updated[index].content_value = ''; 
                                        updated[index].file = null;
                                        setBlocks(updated);
                                    }}
                                    style={{ width: '100%', padding: '8px', color: '#000', border: '1px solid #444', borderRadius: '4px' }}
                                >
                                    <option value="text">Texto corto</option>
                                    <option value="textarea">Texto largo (Párrafo)</option>
                                    <option value="file">Archivo (PDF, etc.)</option>
                                    <option value="video">🎥 Video (Bunny Stream)</option>
                                </select>
                            </div>
                        )}

                        {(block.content_type === 'text' || block.content_type === 'textarea') && (
                            <textarea
                                value={block.content_value || ''}
                                onChange={(e) => handleBlockChange(index, 'content_value', e.target.value)}
                                placeholder="Escribe el contenido aquí..."
                                style={{ width: '100%', padding: '8px', color: '#000', border: '1px solid #444', borderRadius: '4px' }}
                                rows="3"
                                required
                            />
                        )}

                        {block.content_type === 'file' && (
                            <div style={{ marginTop: '10px' }}>
                                {isExisting && block.content_value ? (
                                    <div style={{ padding: '10px', borderLeft: '4px solid #f59e0b', borderRadius: '4px', background:'#333' }}>
                                        <p style={{ margin: 0, fontSize: '14px', color:'#fff' }}>📁 Archivo adjunto actual:</p>
                                        <a href={`${CONFIG_BACKEND.BASE_URL}/${block.content_value}`} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontSize: '13px' }}>
                                            {block.content_value}
                                        </a>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#ccc' }}>
                                            🔒 Por seguridad, los archivos subidos no se pueden eliminar ni reemplazar.
                                        </p>
                                    </div>
                                ) : block.file ? (
                                    // 📁 Vista cuando ya se seleccionó un archivo pero aún no se guarda (permite quitarlo)
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: '#333', borderRadius: '4px' }}>
                                        <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                                            📎 {block.file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleBlockChange(index, 'file', null)}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Quitar archivo
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const updated = [...blocks];
                                            updated[index].file = e.target.files[0];
                                            setBlocks(updated);
                                        }}
                                        style={{ color: '#000', width: '100%', border:'0.1rem solid #ccc', borderRadius:'0.4rem' }}
                                        required
                                    />
                                )}
                            </div>
                        )}

                        {block.content_type === 'video' && (
                            <div style={{ marginTop: '10px' }}>
                                {isExisting && block.content_value ? (
                                    <div style={{ padding: '10px', background: '#333', borderLeft: '4px solid #34d399', borderRadius: '4px' }}>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#34d399' }}>✅ Video vinculado en Bunny (GUID: {block.content_value})</p>
                                    </div>
                                ) : block.file ? (
                                    // 🎥 Vista cuando ya se seleccionó un video pero aún no se guarda (permite quitarlo)
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                                        <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                                            🎥 {block.file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleBlockChange(index, 'file', null)}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Quitar video
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const updated = [...blocks];
                                            updated[index].file = e.target.files[0];
                                            setBlocks(updated);
                                        }}
                                        style={{ color: '#000', width: '100%' }}
                                        required
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {isSubmitting && (
                <div style={{ margin: '15px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#38bdf8' }}>Subiendo video a Bunny Stream... {uploadProgress}%</p>
                    <div style={{ width: '100%', background: '#444', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${uploadProgress}%`, background: '#3b82f6', height: '100%', transition: 'width 0.2s' }} />
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button styleBtn={2} type="button" onClick={handleAddNewBlock} disabled={isSubmitting} style={{ padding: '10px 15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    + Agregar otro bloque
                </Button>
                <Button styleBtn={1} type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', background: isSubmitting ? '#555' : '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    );
}