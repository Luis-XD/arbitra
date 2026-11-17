import React, { useState } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import styles from './css/FormDeleteExam.module.css';

const FormDeleteExam = ({ exam, onExamDeleted, onCancel }) => {
    const [confirmTitle, setConfirmTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();
        if (confirmTitle !== exam.title_exam) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id_exam', exam.id_exam);

            const res = await fetch(`${CONFIG_BACKEND.API_DIR}/exam/delete`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();

            if (data.success) {
                onExamDeleted();
            } else {
                alert("Error al eliminar el examen: " + data.message);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error al intentar conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleDelete} className={styles.form}>
            <h3 className={styles.title}>⚠️ Eliminar Examen</h3>
            <p className={styles.description}>
                Esta acción no se puede deshacer. Escribe exactamente el nombre del examen para confirmar: 
                <strong className={styles.examTitleHighlight}>{exam.title_exam}</strong>
            </p>
            
            <input 
                type="text" 
                placeholder="Escribe el nombre aquí..." 
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
                required
                className={styles.input}
            />
            
            <div className={styles.buttonGroup}>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className={styles.cancelBtn}
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={confirmTitle !== exam.title_exam || loading}
                    className={styles.deleteBtn}
                    style={{ opacity: confirmTitle !== exam.title_exam ? 0.5 : 1 }}
                >
                    {loading ? 'Eliminando...' : 'Eliminar examen'}
                </button>
            </div>
        </form>
    );
};

export default FormDeleteExam;