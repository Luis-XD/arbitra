import { useState } from 'react';
import Button from './Button';
import { CONFIG_BACKEND } from '../config/config';

export default function DeleteCommissionModal({ commission, onSuccess, onCancel }) {
    const [confirmName, setConfirmName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Habilitar el botón solo si el texto escrito coincide exactamente con el nombre de la comisión
    const isMatch = confirmName.trim() === commission.name.trim();

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!isMatch) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`${CONFIG_BACKEND.API_DIR}/deleteCommission`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_commissions: commission.id_commissions })
            });

            const data = await res.json();

            if (data.success) {
                alert("Comisión eliminada correctamente.");
                onSuccess(commission.id_commissions);
            } else {
                alert(data.error || "No se pudo eliminar la comisión.");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error de red al intentar eliminar la comisión.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <form onSubmit={handleDelete} style={{ padding: '15px', color: '#000' }}>
            <p style={{ fontSize: '14px', marginBottom: '10px', color:'#333' }}>
                Estás a punto de eliminar la comisión: <strong>{commission.name}</strong> (Turno: {commission.shift}).
            </p>
            <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '15px' }}>
                ⚠️ Esta acción borrará el código de la comisión y desvinculará sus inscripciones. Para confirmar, escribe el nombre exacto de la comisión abajo:
            </p>

            <input 
                type="text"
                placeholder={`Escribe "${commission.name}" para confirmar`}
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
                required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button type="button" styleBtn={2} onClick={onCancel} disabled={isDeleting}>
                    Cancelar
                </Button>
                <Button 
                    type="submit" 
                    styleBtn={1} 
                    disabled={!isMatch || isDeleting}
                    style={{ background: isMatch && !isDeleting ? '#ef4444' : '#9ca3af', color: '#fff', cursor: isMatch ? 'pointer' : 'not-allowed' }}
                >
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar comisión'}
                </Button>
            </div>
        </form>
    );
}