import React, { useState, useEffect } from 'react';
import styles from './css/Form.module.css';
import ContFormInput from './ContFormInput';
import Loader from './Loader';
import { CONFIG_BACKEND } from '../config/config';
import Button from './Button';

function FormUpdateMatter({ matterData, onSuccess }) {
    const [cargando, setCargando] = useState(false);
    const [cargandoDisciplinas, setCargandoDisciplinas] = useState(true);
    const [sports, setSports] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // 👈 Nuevo estado para cartel de éxito
    
    const [form, setForm] = useState({
        id_matter: matterData?.id_matter || '',
        id_sport: matterData?.id_sport || '',
        id_discip: matterData?.id_discip || '',
        name_matter: matterData?.name_matter || '',
        descript_matter: matterData?.descript_matter || '',
        total_classes: matterData?.total_classes || '',
        id_group: matterData?.id_group || '0'
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const resSports = await fetch(`${CONFIG_BACKEND.API_DIR}/loadSports`, { method: 'POST', credentials: 'include' });
                const dataSports = await resSports.json();
                if (dataSports.success) setSports(dataSports.result || dataSports.deportes || []);

                if (matterData?.id_sport) {
                    const resDisc = await fetch(`${CONFIG_BACKEND.API_DIR}/loadDisciplines?value=${matterData.id_sport}`, { method: 'GET', credentials: 'include' });
                    const dataDisc = await resDisc.json();
                    if (dataDisc.success) setDisciplines(dataDisc.result || dataDisc.disciplinas || []);
                }
            } catch (err) {
                setErrorMessage("Error al cargar los datos de configuración");
            } finally {
                setCargandoDisciplinas(false);
            }
        };

        loadInitialData();
    }, [matterData]);

    useEffect(() => {
        if (!form.id_sport || cargandoDisciplinas) return;

        fetch(`${CONFIG_BACKEND.API_DIR}/loadDisciplines?value=${form.id_sport}`, { method: 'GET', credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setDisciplines(data.result || data.disciplinas || []);
                } else {
                    setDisciplines([]);
                }
            })
            .catch(err => console.error(err));
    }, [form.id_sport]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'id_sport' ? { id_discip: '' } : {})
        }));
    };

    const handleUpdate = async () => {
        setCargando(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/updateMatter?id=${matterData.id_matter}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await response.json();

            if (data.success) {
                setSuccessMessage("¡Materia actualizada con éxito!"); // 👈 Mostramos el cartel verde
                
                setTimeout(() => {
                    if (typeof onSuccess === 'function') onSuccess();
                }, 3000);
            } else {
                setErrorMessage(data.error || "No se pudo actualizar la materia");
                setCargando(false);
            }
        } catch (error) {
            setErrorMessage("Error de conexión");
            setCargando(false);
        }
    };

    return (
        <div className={styles.contForm}>
            <div className={styles.form}>
                {/* 👈 Cartel de error */}
                {errorMessage && (
                    <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #fecaca', fontSize: '14px', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                {/* 👈 Cartel de éxito */}
                {successMessage && (
                    <div style={{ background: '#ecfdf5', color: '#065f46', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #a7f3d0', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>
                        {successMessage}
                    </div>
                )}

                <ContFormInput nameElm="Deporte :">
                    <select name="id_sport" value={form.id_sport} onChange={handleChange}>
                        <option value="">Seleccione un deporte</option>
                        {sports.map(s => <option key={s.id_sport || s.id} value={s.id_sport || s.id}>{s.name_sport || s.nombre}</option>)}
                    </select>
                </ContFormInput>

                <ContFormInput nameElm="Disciplina :">
                    <select name="id_discip" value={form.id_discip} onChange={handleChange} disabled={!form.id_sport}>
                        <option value="">Seleccione una disciplina</option>
                        {disciplines.map(d => <option key={d.id_discip || d.id} value={d.id_discip || d.id}>{d.name_discip || d.nombre}</option>)}
                    </select>
                </ContFormInput>

                <ContFormInput nameElm="Nombre de la Materia :">
                    <input type="text" name="name_matter" value={form.name_matter} onChange={handleChange} />
                </ContFormInput>

                <ContFormInput nameElm="Cantidad Total de Clases (100%) :">
                    <input type="number" name="total_classes" value={form.total_classes} onChange={handleChange} min="1" />
                </ContFormInput>

                <ContFormInput nameElm="Descripción :">
                    <textarea name="descript_matter" value={form.descript_matter} onChange={handleChange} />
                </ContFormInput>

                <ContFormInput>
                    <Button 
                        typeBtn="button" 
                        onClick={handleUpdate} 
                        disabled={cargando || successMessage}
                        styleBtn={2}
                    >
                        {cargando ? <Loader mini={true} /> : successMessage ? "¡Actualizado!" : "Actualizar Materia"}
                    </Button>
                </ContFormInput>
            </div>
        </div>
    );
}

export default FormUpdateMatter;