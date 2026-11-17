import { useState } from 'react';
import { CAT_EGRESO, CAT_INGRESO, MEDIOS } from '../../config/constants';
import { today } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useForm } from '../../state/useForm';
import { useUi } from '../../state/UiProvider';
import LinkComprobante from '../../components/shared/LinkComprobante/LinkComprobante';
import Button from '../../components/ui/Button/Button';
import { FileInput, SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal, { FooterSpacer } from '../../components/ui/Modal/Modal';
import styles from './MovimientoModal.module.css';

const FORM_ID = 'arbitra-movimiento';

/** Gasto u otro ingreso de caja (los cobros de cuotas se registran desde Cobranzas). */
export default function MovimientoModal({ tipo = 'egreso', id, onClose }) {
  const { db, guardar, eliminar, subirComprobante, puedeSubirArchivos } = useData();
  const { toast } = useUi();
  const { confirmar } = useAcciones();
  const original = id ? db.get('caja', id) : null;
  const esNuevo = !original;
  const m = original || { tipo, fecha: today(), medio: 'Efectivo', categoria: tipo === 'egreso' ? CAT_EGRESO[0] : CAT_INGRESO[1] };
  const cats = m.tipo === 'egreso' ? CAT_EGRESO : CAT_INGRESO;
  const [f, set] = useForm({
    concepto: m.concepto || '', categoria: m.categoria, importe: m.importe ?? '', medio: m.medio || 'Efectivo',
    fecha: m.fecha || today(), proveedor: m.proveedor || '', comprobante: m.comprobante || '',
  });
  const [archivo, setArchivo] = useState(null);

  const enviar = async () => {
    if (!f.concepto.trim() || !(+f.importe > 0)) { toast('Completá concepto e importe'); return; }
    try {
      const comp = await subirComprobante(archivo);
      await guardar('caja', { ...m, ...f, concepto: f.concepto.trim(), importe: Math.round(+f.importe), ...comp });
      onClose(); toast('Movimiento guardado');
    } catch (e) { /* aviso */ }
  };
  const borrar = () => confirmar('¿Eliminar este movimiento de caja?', 'Eliminar', async () => { await eliminar('caja', m.id); toast('Movimiento eliminado'); });

  return (
    <Modal title={esNuevo ? (m.tipo === 'egreso' ? 'Registrar gasto' : 'Registrar otro ingreso') : 'Editar movimiento'} onClose={onClose} footer={<>
      {!esNuevo && <><Button variant="danger" onClick={borrar}>Eliminar</Button><FooterSpacer /></>}
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Guardar</Button>
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput full label="Concepto *" value={f.concepto} onChange={set('concepto')} required
          placeholder={m.tipo === 'egreso' ? 'Ej.: Factura de luz octubre' : 'Ej.: Venta de kits de herramientas'} />
        <SelectInput label="Categoría" value={f.categoria} onChange={set('categoria')} options={cats} />
        <TextInput label="Importe ($) *" type="number" min="0" value={f.importe} onChange={set('importe')} required />
        <SelectInput label="Medio" value={f.medio} onChange={set('medio')} options={MEDIOS} />
        <TextInput label="Fecha" type="date" value={f.fecha} onChange={set('fecha')} />
        <TextInput label="Proveedor / origen" value={f.proveedor} onChange={set('proveedor')} />
        <TextInput label="N° de comprobante" value={f.comprobante} onChange={set('comprobante')} />
        {puedeSubirArchivos && (
          <FileInput label="Comprobante (foto o PDF)" onChange={setArchivo}
            hint={m.comprobanteUrl ? `Ya tiene uno cargado${m.comprobanteNombre ? `: ${m.comprobanteNombre}` : ''}. Subí otro solo para reemplazarlo.` : 'Opcional: foto de la factura o ticket.'} />
        )}
      </FormGrid>
      {m.comprobanteUrl && <p className={styles.link}><LinkComprobante mov={m} /></p>}
    </Modal>
  );
}
