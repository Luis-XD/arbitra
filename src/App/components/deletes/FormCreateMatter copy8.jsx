import React, { useState, useEffect } from 'react';
import styles from './css/Form.module.css';
import Button from './Button';
import ContFormInput from './ContFormInput';
import Loader from './Loader';
import { CONFIG_BACKEND } from '../config/config';

function FormCreateMatter({ onSuccess }) {
    const [cargando, setCargando] = useState(false);
    const [sports, setSports] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [form, setForm] = useState({
        id_sport: '',
        id_discip: '',
        name_matter: '',
        descript_matter: '',
        total_classes: '',
        id_group: '0'
    });

    useEffect(() => {
        fetch(`${CONFIG_BACKEND.API_DIR}/loadSports`, { method: 'POST', credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) setSports(data.result || data.deportes || []);
            })
            .catch(err => console.error("Error al cargar deportes:", err));
    }, []);

    useEffect(() => {
        if (!form.id_sport) {
            setDisciplines([]);
            return;
        }
        fetch(`${CONFIG_BACKEND.API_DIR}/loadDisciplines?value=${form.id_sport}`, { method: 'GET', credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) setDisciplines(data.result || data.disciplinas || []);
            })
            .catch(err => console.error("Error al cargar disciplinas:", err));
    }, [form.id_sport]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'id_sport' ? { id_discip: '' } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/createMatter`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await response.json();

            if (data.success) {
                if (typeof onSuccess === 'function') onSuccess();
            } else {
                setErrorMessage(data.error || "No se pudo crear la materia");
            }
        } catch (error) {
            setErrorMessage("Error de conexión");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.contForm} style={{ width: '100%', maxWidth: '500px' }}>
            <form className={styles.form} onSubmit={handleSubmit}>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                <ContFormInput nameElm="Deporte :">
                    <select name="id_sport" value={form.id_sport} onChange={handleChange} required>
                        <option value="">Seleccione un deporte</option>
                        {sports.map(s => <option key={s.id_sport || s.id} value={s.id_sport || s.id}>{s.name_sport || s.nombre}</option>)}
                    </select>
                </ContFormInput>

                <ContFormInput nameElm="Disciplina :">
                    <select name="id_discip" value={form.id_discip} onChange={handleChange} required disabled={!form.id_sport}>
                        <option value="">Seleccione una disciplina</option>
                        {disciplines.map(d => <option key={d.id_discip || d.id} value={d.id_discip || d.id}>{d.name_discip || d.nombre}</option>)}
                    </select>
                </ContFormInput>

                <ContFormInput nameElm="Nombre de la Materia :">
                    <input type="text" name="name_matter" value={form.name_matter} onChange={handleChange} placeholder="Ej: Reglas de Juego" required />
                </ContFormInput>

                <ContFormInput nameElm="Cantidad Total de Clases (100%) :">
                    <input type="number" name="total_classes" value={form.total_classes} onChange={handleChange} placeholder="Ej: 10" min="1" required />
                </ContFormInput>

                <ContFormInput nameElm="Descripción :">
                    <textarea name="descript_matter" value={form.descript_matter} onChange={handleChange} placeholder="Descripción..." />
                </ContFormInput>

                <ContFormInput>
                    <Button typeBtn='submit' disabled={cargando} styleBtn={2}>
                        {cargando ? <Loader mini={true} /> : "Guardar Materia"}
                    </Button>
                </ContFormInput>
            </form>
        </div>
    );
}

export default FormCreateMatter;