import { useState } from 'react';
import { waLink, waPhone } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Banner from '../../components/ui/Banner/Banner';
import Button from '../../components/ui/Button/Button';
import { SelectInput, TextArea } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import Summary from '../../components/ui/Summary/Summary';
import styles from './WhatsAppModal.module.css';

/**
 * Prepara un mensaje y lo abre en WhatsApp (wa.me).
 * opciones: { key, label, text }[]; onOpen(key, texto) se llama después de abrirlo.
 */
export default function WhatsAppModal({ tel, nombre, opciones, onOpen, onClose }) {
  const { db } = useData();
  const { toast } = useUi();
  const { copiar } = useAcciones();
  const num = waPhone(tel, db.config.waArea);
  const [clave, setClave] = useState(opciones[0].key);
  const [texto, setTexto] = useState(opciones[0].text);

  const elegir = (k) => { setClave(k); setTexto(opciones.find((o) => o.key === k).text); };
  const abierto = () => {
    setTimeout(async () => {
      onClose();
      try { if (onOpen) await onOpen(clave, texto); } catch (e) { /* sin aviso */ }
      toast('Mensaje preparado en WhatsApp: revisalo y tocá Enviar');
    }, 60);
  };

  return (
    <Modal title={`WhatsApp · ${nombre}`} onClose={onClose} footer={<>
      <Button onClick={() => copiar(texto)}>Copiar texto</Button>
      <Button onClick={onClose}>Cerrar</Button>
      {num && <Button variant="wa" href={waLink(num, texto)} onClick={abierto}>Abrir en WhatsApp</Button>}
    </>}>
      {num ? (
        <Summary items={[
          { label: 'Destinatario', value: `+${num}` },
          { label: 'Se envía desde', value: db.config.waNumero ? `WhatsApp Business ${db.config.waNumero}` : 'El WhatsApp abierto en este equipo', plain: true },
        ]} />
      ) : (
        <Banner>El teléfono <b>{tel || '(vacío)'}</b> no es un celular válido para WhatsApp. Cargalo con código de área, sin 0 ni 15 (ej.: 11 5555-1234).</Banner>
      )}
      <div className={styles.form}><FormGrid columns={1}>
        <SelectInput full label="Plantilla" value={clave} onChange={elegir} options={opciones.map((o) => [o.key, o.label])} />
        <TextArea label="Mensaje" rows={7} value={texto} onChange={setTexto} hint="Podés editarlo antes de abrir WhatsApp. Las plantillas se cambian en Ajustes." />
      </FormGrid></div>
    </Modal>
  );
}
