import { ASSETS } from '../../config/assets';
import { reciboData } from '../../lib/business';
import { fdate, fullName, money } from '../../lib/format';
import { pdfRecibo, textoRecibo } from '../../lib/pdf/recibo';
import { waLink, waPhone } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import LinkComprobante from '../../components/shared/LinkComprobante/LinkComprobante';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Modal from '../../components/ui/Modal/Modal';
import Summary from '../../components/ui/Summary/Summary';
import Table, { Sub, Td } from '../../components/ui/Table/Table';
import styles from './ReciboModal.module.css';

/** Recibo de pago por número: vista, copia en texto, PDF y envío por WhatsApp. */
export default function ReciboModal({ numero, onClose }) {
  const { db, nombreUsuario } = useData();
  const { toast } = useUi();
  const { copiar, descargar } = useAcciones();
  const R = numero ? reciboData(db, numero) : null;
  if (!R) {
    return <Modal title="Recibo de pago" onClose={onClose} footer={<Button onClick={onClose}>Cerrar</Button>}><EmptyState>Este recibo no existe o fue anulado.</EmptyState></Modal>;
  }
  const cfg = db.config; const a = R.alumno;
  const texto = textoRecibo(R, cfg, nombreUsuario);
  const tel = a && waPhone(a.telefono, cfg.waArea);

  const pdf = async () => {
    try { descargar(`recibo-${R.numero}.pdf`, await pdfRecibo(R, cfg, nombreUsuario)); } catch (e) { toast('No se pudo generar el PDF.'); }
  };

  return (
    <Modal title="Recibo de pago" onClose={onClose} footer={<>
      <Button onClick={() => copiar(texto)}>Copiar texto</Button>
      <Button onClick={pdf}>Descargar PDF</Button>
      {tel && <Button variant="wa" href={waLink(tel, texto)}>Enviar por WhatsApp</Button>}
      <Button variant="primary" onClick={onClose}>Listo</Button>
    </>}>
      <div className={styles.recibo}>
        <div className={styles.cabecera}>
          <div className={styles.marca}>
            <img className={styles.logo} src={ASSETS.logo} alt="" />
            <div>
              <b className={styles.institucion}>{cfg.institucion}</b>
              <span className={styles.datos}>{[cfg.cuit && `CUIT ${cfg.cuit}`, cfg.direccion, cfg.telefono].filter(Boolean).join(' · ')}</span>
            </div>
          </div>
          <div className={styles.numero}><span className={styles.mono}>{R.numero}</span><span className={styles.datos}>{fdate(R.fecha)}</span></div>
        </div>
        <div>Recibimos de <b>{fullName(a)}</b> (DNI {a ? a.dni : ''}) en concepto de:</div>
        <Table compact>
          {R.lines.map((l, i) => (
            <tr key={i}>
              <Td>{l.concepto}<Sub>{l.curso}</Sub></Td>
              <Td num>{money(l.importe)}{l.recargo > 0 && <Sub>+ recargo {money(l.recargo)}</Sub>}</Td>
            </tr>
          ))}
        </Table>
        <Summary transparent items={[
          { label: 'Medio', value: R.medio, plain: true },
          R.referencia && { label: 'Referencia', value: R.referencia },
          { label: 'Saldo pendiente', value: money(R.saldo) },
          R.por && { label: 'Registró', value: nombreUsuario(R.por), plain: true },
        ]} />
        <div className={styles.total}>{money(R.importe + R.recargo)}</div>
        <small className={styles.datos}>Comprobante interno no válido como factura. <LinkComprobante mov={R.comprobante} /></small>
      </div>
    </Modal>
  );
}
