import React, { useState } from 'react'
import { CONFIG_BACKEND } from '../config/config'
import Button from './Button';
import LeftTopButton from './LeftTopButton';
import TopButtons from './TopButtons';

const ChangePassword = () => {
  // Paso 1: 'current' (ingresar contraseña actual), Paso 2: 'new' (crear nueva contraseña)
  const [step, setStep] = useState(1);

  // Estados para los campos
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Paso 1: Validar contraseña actual con el backend
  const handleVerifyCurrentPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!currentPassword.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingresa tu contraseña actual.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${CONFIG_BACKEND.API_DIR}/changePassword`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify_current',
          currentPassword: currentPassword,
        }),
      })

      const data = await response.json();

      if (data.success) {
        setStep(2); // Avanzar al paso 2
        setMessage({ type: 'success', text: 'Contraseña verificada. Ahora ingresa la nueva contraseña.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'La contraseña actual es incorrecta.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al conectar con el servidor. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  }

  // Paso 2: Enviar la nueva contraseña
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Todos los campos son obligatorios.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${CONFIG_BACKEND.API_DIR}/changePassword`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_password',
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      })

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
        // Limpiar campos y reiniciar al paso 1 después de unos segundos
        setTimeout(() => {
          setStep(1);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage({ type: '', text: '' });
        }, 2500);
      } else {
        setMessage({ type: 'error', text: data.message || 'No se pudo actualizar la contraseña.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar en el servidor.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <TopButtons>
          <LeftTopButton text="Editar perfil" locationElm="/campus/perfil/editar-perfil" typeElm='expand'/>
      </TopButtons>
      <h2 style={styles.title}>Cambiar Contraseña</h2>

      {/* Mensajes de Alerta */}
      {message.text && (
        <div style={message.type === 'error' ? styles.alertError : styles.alertSuccess}>
          {message.text}
        </div>
      )}

      {/* PASO 1: Validar contraseña actual */}
      {step === 1 && (
        <form onSubmit={handleVerifyCurrentPassword} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña Actual:</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <Button type="submit" disabled={loading} style={styles.button} styleBtn={2}>
            {loading ? 'Verificando...' : 'Verificar contraseña'}
          </Button>
        </form>
      )}

      {/* PASO 2: Ingresar y confirmar nueva contraseña */}
      {step === 2 && (
        <form onSubmit={handleSaveNewPassword} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nueva Contraseña:</label>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <Button
              type="button"
              onClick={() => {
                setStep(1);
                setMessage({ type: '', text: '' });
              }}
              style={styles.buttonSecondary}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

// Estilos integrados (ajustables a tus módulos CSS o Tailwind)
const styles = {
  container: {
    maxWidth: '40rem',
    minWidth:'30rem',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '2.5rem',
    color: '#000',
    border: '0.1rem solid #ccc',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '1.4rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.9rem',
    color: '#1d1d1d',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#ddd',
    color: '#000',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontSize: '1rem',
    cursor: 'pointer',
    flex: '1',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  alertError: {
    padding: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '16px',
  },
  alertSuccess: {
    padding: '10px',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid #22c55e',
    color: '#86efac',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '16px',
  },
}

export default ChangePassword