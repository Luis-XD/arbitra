import { useState } from 'react';
import { today, uid } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import styles from './EvaluacionModal.module.css';

const FORM_ID = 'arbitra-evaluacion';

/** Agrega una instancia de evaluación (parcial, TP, final) a un curso. */
export default function EvaluacionModal({ cursoId, onClose }) {
  const { db, guardar } = useData();
  const { toast } = useUi();
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState(today());

  const enviar = async () => {
    if (!nombre.trim()) { toast('Poné un nombre a la evaluación'); return; }
    const ev = db.get('evaluaciones', cursoId) || { id: cursoId, cursoId, instancias: [], notas: {} };
    try {
      await guardar('evaluaciones', { ...ev, instancias: [...(ev.instancias || []), { id: uid(), nombre: nombre.trim(), fecha }] });
      onClose(); toast('Evaluación agregada');
    } catch (e) { /* aviso */ }
  };

  return (
    <Modal title="Nueva evaluación" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Agregar evaluación</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput full label="Nombre *" value={nombre} onChange={setNombre} placeholder="Ej.: Parcial 1, Trabajo práctico, Examen final" />
        <TextInput label="Fecha" type="date" value={fecha} onChange={setFecha} />
      </FormGrid>
      <p className={styles.ayuda}>Las notas van de 1 a 10. La nota final es el promedio de todas las evaluaciones cargadas.</p>
    </Modal>
  );
}
