// Estado simple de formulario: const [f, set, setF] = useForm({ nombre: '' }); set('nombre')(valor)
import { useCallback, useState } from 'react';

export function useForm(inicial) {
  const [f, setF] = useState(inicial);
  const set = useCallback((k) => (v) => setF((x) => ({ ...x, [k]: v })), []);
  return [f, set, setF];
}
