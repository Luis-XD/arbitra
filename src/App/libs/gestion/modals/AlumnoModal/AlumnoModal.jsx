import { useEffect, useState } from 'react';
import { money, today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { SelectInput, TextArea, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import styles from './AlumnoModal.module.css';
import { CONFIG_BACKEND } from '../../../../config/config';

const FORM_ID = 'arbitra-alumno-editar';

export default function AlumnoModal({ id, alumnoObj, onClose, onSuccess }) {
  const { guardar } = useData();
  const { toast } = useUi();
  
  const original = alumnoObj || (id ? { id } : null);
  if (!original) return null;

  // 1. Declarar los estados primero
  const [importePagado, setImportePagado] = useState('');
  const [medioPago, setMedioPago] = useState(original.payment_method || 'Efectivo');
  const [esEgresado, setEsEgresado] = useState(original.is_graduated || 'No');
  
  const [habilitarFechaPago, setHabilitarFechaPago] = useState(false);
  const [fechaPago, setFechaPago] = useState(original.payment_date || today());

  const [habilitarFechaEgreso, setHabilitarFechaEgreso] = useState(false);
  const [fechaEgreso, setFechaEgreso] = useState(original.graduation_date || today());

  const [notas, setNotas] = useState(original.notas || '');

  // 2. Definir los cálculos después de los estados
  const costoTotal = Number(original.course_cost || original.disciplina_precio || 0); 
  const pagadoAnterior = Number(original.amount_paid || 0);
  const nuevoPagoIngresado = parseFloat(importePagado) || 0;
  
  const totalAbonado = pagadoAnterior + nuevoPagoIngresado;
  const deudaRestante = Math.max(0, costoTotal - totalAbonado);
  // Estado para guardar el historial de pagos de este alumno
  const [historialPagos, setHistorialPagos] = useState([]);

  // Cargar transacciones al abrir el modal
  useEffect(() => {
    async function cargarHistorial() {
      try {
        const res = await fetch(`${CONFIG_BACKEND.API_DIR}/getPagosAlumno?user_id=${original.id}&id_discipline=${original.id_discipline || original.id_discip}`, {
          credentials: 'include'
        });
        
        const text = await res.text(); // 👈 Leemos como texto primero para evitar que explote
        if (!text || text.trim() === '') {
          console.warn("La respuesta de getPagosAlumno vino vacía.");
          return;
        }

        const data = JSON.parse(text);
        if (data.success) {
          setHistorialPagos(data.result);
        }
      } catch (e) {
        console.error("Error al cargar historial:", e);
      }
    }
    cargarHistorial();
  }, [original.id]);

  const enviar = async (e) => {
    e.preventDefault();
    try {
      // 👈 Declarar el número del pago aquí dentro o usar la variable correcta
      const pagoNum = parseFloat(importePagado) || 0;

      const res = await fetch(`${CONFIG_BACKEND.API_DIR}/saveAlumnoPago`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: original.id,
          id_discipline: original.id_discipline || original.id_discip,
          amount_paid: pagoNum, // 👈 Ahora ya está definida
          payment_method: medioPago,
          is_graduated: esEgresado,
          payment_date: fechaPago,
          notas: notas
        })
      });

      const textResponse = await res.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        console.error("Error PHP / HTML recibido:", textResponse);
        toast("Error interno en el servidor (ver consola)");
        return;
      }

      if (data.success) {
        if (onSuccess) onSuccess();
        onClose();
        toast('Datos de pago actualizados correctamente');
      } else {
        toast(data.message || 'Error al guardar');
      }
    } catch (e) {
      console.error("Error de red:", e);
      toast('Error de conexión con el servidor');
    }
  };

  return (
    <Modal 
      title={`Legajo de ${original.nombre || ''} ${original.apellido || ''}`} 
      onClose={onClose} 
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form={FORM_ID}>Guardar</Button>
        </>
      }
    >
      <div className={styles.infoContainer}>
        <div className={styles.infoRow}>
          <span className={styles.label}>DNI:</span>
          <span className={styles.value}>{original.dni || '—'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Contacto / Email:</span>
          <span className={styles.value}>{original.email || original.telefono || '—'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Curso Inscrito:</span>
          <span className={styles.value}>{original.disciplina_nombre || 'Sin curso asignado'}</span>
        </div>
      </div>
      {/* Historial de transacciones */}
      <div className={styles.historialContainer}>
        <h4 className={styles.historialTitle}>Historial de Pagos Realizados</h4>
        {historialPagos.length > 0 ? (
          <ul className={styles.historialList}>
            {historialPagos.map((p, index) => (
              <li key={index} className={styles.historialItem}>
                <span>📅 {p.payment_date}</span>
                <span>💵 ${p.amount_paid} ({p.payment_method})</span>
                {p.notes && <span className={styles.historialNotas}>"{p.notes}"</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.sinPagos}>No hay pagos registrados aún para este curso.</p>
        )}
      </div>

      <hr className={styles.divider} />

      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <div className={styles.pagoRow}>
          <TextInput 
            label="Importe Abonado ($)" 
            type="number" 
            value={importePagado} 
            onChange={(e) => setImportePagado(e && e.target ? e.target.value : e)} 
            placeholder="Ej: 150000"
          />
          <div className={styles.deudaEnVivo}>
            <span className={styles.deudaLabel}>Deuda resultante:</span>
            <span className={styles.deudaValor}>{money(deudaRestante)}</span>
          </div>
        </div>

        {/* Fecha de pago con restricción mínima de hoy */}
        <div className={styles.dateControlRow}>
          <TextInput 
            label="Fecha de Pago" 
            type="date" 
            value={fechaPago} 
            min={today()} // 👈 Bloquea fechas anteriores a hoy
            disabled={!habilitarFechaPago}
            onChange={(e) => setFechaPago(e && e.target ? e.target.value : e)} 
          />
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={habilitarFechaPago} 
              onChange={(e) => setHabilitarFechaPago(e.target.checked)} 
            />
            Modificar fecha
          </label>
        </div>

        <SelectInput 
          label="Medio de Pago" 
          value={medioPago} 
          onChange={(val) => setMedioPago(val && typeof val === 'object' ? (val.value || val.label) : val)} 
          options={['Efectivo', 'Transferencia']} 
        />

        {/* Estado de egreso y su fecha opcional con restricción mínima de hoy */}
        <div className={styles.egresoGrid}>
          <SelectInput 
            label="Estado de Egreso" 
            value={esEgresado} 
            onChange={(val) => setEsEgresado(val && typeof val === 'object' ? (val.value || val.label) : val)} 
            options={['No', 'Sí']} 
          />
          
          {esEgresado === 'Sí' && (
            <div className={styles.dateControlRow}>
              <TextInput 
                label="Fecha de Egreso" 
                type="date" 
                value={fechaEgreso} 
                min={today()} // 👈 Bloquea fechas anteriores a hoy
                disabled={!habilitarFechaEgreso}
                onChange={(e) => setFechaEgreso(e && e.target ? e.target.value : e)} 
              />
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={habilitarFechaEgreso} 
                  onChange={(e) => setHabilitarFechaEgreso(e.target.checked)} 
                />
                Modificar fecha
              </label>
            </div>
          )}
        </div>

        <TextArea 
          label="Observaciones" 
          value={notas} 
          onChange={setNotas} 
          placeholder="Notas adicionales sobre el alumno..."
        />
      </FormGrid>
    </Modal>
  );
}