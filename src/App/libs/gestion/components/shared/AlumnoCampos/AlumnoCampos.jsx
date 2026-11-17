import { TextInput } from '../../ui/Field/Field';

export const ALUMNO_VACIO = { nombre: '', apellido: '', dni: '', nacimiento: '', telefono: '', email: '', direccion: '', localidad: '' };

/** Campos de datos personales del alumno (dentro de un FormGrid). */
export default function AlumnoCampos({ valor, onCambio }) {
  const set = (k) => (v) => onCambio({ ...valor, [k]: v });
  return (
    <>
      <TextInput label="Nombre *" value={valor.nombre} onChange={set('nombre')} required />
      <TextInput label="Apellido *" value={valor.apellido} onChange={set('apellido')} required />
      <TextInput label="DNI *" inputMode="numeric" value={valor.dni} onChange={set('dni')} required />
      <TextInput label="Fecha de nacimiento" type="date" value={valor.nacimiento} onChange={set('nacimiento')} />
      <TextInput label="Teléfono" type="tel" value={valor.telefono} onChange={set('telefono')} />
      <TextInput label="Email" type="email" value={valor.email} onChange={set('email')} />
      <TextInput label="Domicilio" value={valor.direccion} onChange={set('direccion')} />
      <TextInput label="Localidad" value={valor.localidad} onChange={set('localidad')} />
    </>
  );
}
