import React, { useState } from 'react';
import { CONFIG_BACKEND } from '../config/config';
import styles from './css/FormCreateExam.module.css';

const FormCreateExam = ({ courseId, onExamSaved, onCancel }) => {
    const [examData, setExamData] = useState({
        title_exam: '',
        time_limit: 30,
        start_time: '',
        end_time: ''
    });

    const [questions, setQuestions] = useState([
        {
            question_text: '',
            question_order: 1,
            options: [
                { option_text: '', is_correct: 1 },
                { option_text: '', is_correct: 0 }
            ]
        }
    ]);

    const handleExamChange = (e) => {
        setExamData({ ...examData, [e.target.name]: e.target.value });
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                question_order: questions.length + 1,
                options: [
                    { option_text: '', is_correct: 1 },
                    { option_text: '', is_correct: 0 }
                ]
            }
        ]);
    };

    const handleQuestionChange = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].question_text = text;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ option_text: '', is_correct: 0 });
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].option_text = text;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.forEach((opt, idx) => {
            opt.is_correct = idx === oIndex ? 1 : 0;
        });
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...examData,
            course_id: courseId,
            questions: questions
        };

        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/exam/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                alert('¡Examen creado con éxito!');
                if (onExamSaved) onExamSaved();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (err) {
            console.error('Error de red al crear el examen', err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Crear Nuevo Examen</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className={styles.examCard}>
                    <label className={styles.label}>Título del Examen</label>
                    <input
                        type="text"
                        name="title_exam"
                        value={examData.title_exam}
                        onChange={handleExamChange}
                        required
                        placeholder="Ej: Examen Parcial - Mes 2"
                        className={styles.input}
                    />

                    <div className={styles.gridContainer}>
                        <div>
                            <label className={styles.smallLabel}>Límite (min)</label>
                            <input
                                type="number"
                                name="time_limit"
                                value={examData.time_limit}
                                onChange={handleExamChange}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <label className={styles.smallLabel}>Inicio</label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                value={examData.start_time}
                                onChange={handleExamChange}
                                required
                                className={styles.datetimeInput}
                            />
                        </div>
                        <div>
                            <label className={styles.smallLabel}>Cierre Global</label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                value={examData.end_time}
                                onChange={handleExamChange}
                                required
                                className={styles.datetimeInput}
                            />
                        </div>
                    </div>
                </div>

                {/* Preguntas */}
                <div className="space-y-4">
                    <h3 className={styles.subtitle}>Preguntas</h3>
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className={styles.questionCard}>
                            <label className={styles.questionLabel}>Pregunta {qIndex + 1}</label>
                            <input
                                type="text"
                                value={q.question_text}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                required
                                placeholder="Escribe la pregunta..."
                                className={styles.questionInput}
                            />

                            <div className={styles.optionsContainer}>
                                <span className={styles.optionsHint}>Opciones (selecciona el punto de la correcta):</span>
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className={styles.optionRow}>
                                        <input
                                            type="radio"
                                            name={`correct_${qIndex}`}
                                            checked={opt.is_correct === 1}
                                            onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                            className={styles.radioInput}
                                        />
                                        <input
                                            type="text"
                                            value={opt.option_text}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            required
                                            placeholder={`Opción ${oIndex + 1}`}
                                            className={styles.optionInput}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addOption(qIndex)}
                                    className={styles.addOptionBtn}
                                >
                                    + Agregar otra opción
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className={styles.addQuestionBtn}
                    >
                        + Agregar otra pregunta
                    </button>
                </div>

                <div className={styles.footerActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelBtn}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                    >
                        Guardar Examen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormCreateExam;