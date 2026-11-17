import { useMemo, useState } from 'react';
import { datosCertificado, filaCertificado, resumenCurso } from '../../lib/business';
import { fdate, fullName, today } from '../../lib/format';
import { pdfCertificados } from '../../lib/pdf/certificado';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import CertificadoPreview from '../../components/shared/CertificadoPreview/CertificadoPreview';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { TextArea, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import styles from './CertificadoModal.module.css';

const CAMPOS = [
  ['nombre', 'Nombre como figura'], ['texto', 'Frase'], ['titulo', 'Título que recibe'], ['fecha', 'Fecha de emisión'],
  ['firma1Rol', 'Firma izquierda: cargo'], ['firma1Nombre', 'Firma izquierda: nombre'],
  ['firma2Rol', 'Firma derecha: cargo'], ['firma2Nombre', 'Firma derecha: nombre'],
];
const textosDe = (D) => Object.fromEntries(CAMPOS.map(([k]) => [k, D[k] || '']));

/**
 * Vista previa editable del certificado. Con insId emite (o vuelve a descargar) el certificado del alumno;
 * con muestra=true usa el primer alumno aprobado (o un nombre de ejemplo) y no guarda nada.
 */
export default function CertificadoModal({ insId, muestra = !insId, onClose }) {
  const { db } = useData();
  const { toast } = useUi();
  const { descargar, emitirCertificados } = useAcciones();
  const r = useMemo(() => (muestra
    ? db.cursos.map((c) => resumenCurso(db, c.id).rows.find((x) => x.aprueba)).find(Boolean) || null
    : filaCertificado(db, insId)), [db, insId, muestra]);
  const cert = r && !muestra ? r.cert : null;
  const [textos, setTextos] = useState(() => {
    const t = textosDe(datosCertificado(db, r, cert));
    if (!r) t.nombre = 'Nombre Apellido';
    return t;
  });
  const [ocupado, setOcupado] = useState(false);

  if (!muestra && !r) {
    return <Modal title="Certificado" onClose={onClose} footer={<Button onClick={onClose}>Cerrar</Button>}><EmptyState>No se encontró la inscripción.</EmptyState></Modal>;
  }

  const datos = datosCertificado(db, r, cert, textos);
  const set = (k) => (v) => setTextos((t) => ({ ...t, [k]: v }));
  const restablecer = () => {
    const t = textosDe(datosCertificado(db, r, null));
    t.fecha = (cert && cert.fecha) || today();
    if (!r) t.nombre = 'Nombre Apellido';
    setTextos(t);
  };

  const descargarPdf = async () => {
    const tx = { ...textos, fecha: textos.fecha || today() };
    setOcupado(true);
    try {
      if (muestra) descargar('certificado-prueba.pdf', await pdfCertificados([datosCertificado(db, r, null, tx)]));
      else { await emitirCertificados([r.ins.id], { [r.ins.id]: tx }); onClose(); return; }
    } catch (e) { toast('No se pudo generar el PDF del certificado.'); }
    setOcupado(false);
  };

  const ayuda = muestra ? 'Así se ve con los textos de Ajustes. Los cambios de esta ventana no se guardan.'
    : cert ? `Certificado ${cert.numero} emitido el ${fdate(cert.fecha)}. Si cambiás textos, se guardan con el certificado y se mantiene el número.`
      : 'Revisá los textos. Al descargar se asigna el número correlativo y los textos quedan guardados con el certificado.';

  return (
    <Modal wide title={muestra ? 'Vista previa del certificado' : `Certificado · ${fullName(r.a)}`} onClose={onClose} footer={<>
      <Button onClick={restablecer}>Restablecer textos</Button>
      <Button onClick={onClose}>Cerrar</Button>
      <Button variant="primary" disabled={ocupado} onClick={descargarPdf}>{muestra ? 'Descargar PDF de prueba' : 'Descargar PDF'}</Button>
    </>}>
      <div className={styles.grid}>
        <div className={styles.preview}><CertificadoPreview datos={datos} /></div>
        <FormGrid columns={1}>
          {CAMPOS.map(([k, l]) => (k === 'texto'
            ? <TextArea key={k} label={l} rows={3} value={textos[k]} onChange={set(k)} />
            : <TextInput key={k} full label={l} type={k === 'fecha' ? 'date' : 'text'} value={textos[k]} onChange={set(k)} />))}
          <p className={styles.ayuda}>{ayuda}</p>
        </FormGrid>
      </div>
    </Modal>
  );
}
