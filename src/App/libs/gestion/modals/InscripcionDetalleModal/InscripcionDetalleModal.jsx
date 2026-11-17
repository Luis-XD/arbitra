import { useState } from 'react';
import { ESTADOS_INSCRIPCION } from '../../config/constants';
import { cuotaEstado, totalPagado, totalPlan } from '../../lib/business';
import { fdate, fullName, money } from '../../lib/format';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import { SelectInput, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal, { FooterSpacer } from '../../components/ui/Modal/Modal';
import Pill from '../../components/ui/Pill/Pill';
import Summary from '../../components/ui/Summary/Summary';
import Table, { Td, Th } from '../../components/ui/Table/Table';
import AnularModal from '../AnularModal/AnularModal';
import PagoModal from '../PagoModal/PagoModal';
import ReciboModal from '../ReciboModal/ReciboModal';
import styles from './InscripcionDetalleModal.module.css';

const FORM_ID = 'arbitra-inscripcion-detalle';

/** Plan de cuotas de una inscripción: cobrar, ver recibos, anular y ajustar vencimientos o importes. */
export default function InscripcionDetalleModal({ id, onClose }) {
  const { db, me, guardar, eliminar } = useData();
  const { abrirModal, toast } = useUi();
  const { confirmar } = useAcciones();
  const ins = db.get('inscripciones', id);
  const [cambios, setCambios] = useState({});
  const [estado, setEstado] = useState(ins ? ins.estado : 'Activa');
  const [obs, setObs] = useState(ins ? ins.obs || '' : '');
  if (!ins) return null;
  const a = db.get('alumnos', ins.alumnoId); const c = db.get('cursos', ins.cursoId);
  const tot = totalPlan(ins); const pag = totalPagado(ins);

  const valor = (i, campo) => (cambios[i] && cambios[i][campo] != null ? cambios[i][campo] : ins.cuotas[i][campo]);
  const cambiar = (i, campo, v) => setCambios((x) => ({ ...x, [i]: { ...(x[i] || {}), [campo]: v } }));

  const enviar = async () => {
    const cuotas = ins.cuotas.map((q, i) => {
      const ch = cambios[i]; if (!ch) return q;
      return { ...q, vence: ch.vence || q.vence, importe: ch.importe != null ? Math.max(0, Math.round(+ch.importe || 0)) : q.importe };
    });
    try { await guardar('inscripciones', { ...ins, estado, obs, cuotas }); onClose(); toast('Inscripción actualizada'); } catch (e) { /* aviso */ }
  };

  const anular = (q) => {
    const p = (q.pagos || []).at(-1); if (!p) return;
    const mov = db.get('caja', p.movId) || db.caja.find((m) => m.recibo === p.recibo && m.refTipo === 'cuota');
    if (mov) abrirModal(AnularModal, { movId: mov.id });
  };

  const borrar = () => {
    if (ins.cuotas.some((q) => q.pagado > 0)) { toast('Tiene pagos registrados: usá el estado Baja en lugar de eliminar.'); return; }
    confirmar('¿Eliminar esta inscripción y su plan de cuotas?', 'Eliminar', async () => { await eliminar('inscripciones', id); toast('Inscripción eliminada'); });
  };

  return (
    <Modal wide title={`${fullName(a)} · ${c ? c.nombre : ''}`} onClose={onClose} footer={<>
      <Button variant="danger" onClick={borrar}>Eliminar</Button><FooterSpacer />
      <Button onClick={onClose}>Cerrar</Button>
      <Button variant="primary" type="submit" form={FORM_ID}>Guardar cambios</Button>
    </>}>
      <Summary items={[
        { label: 'Inscripción', value: fdate(ins.fecha) }, { label: 'Beca', value: `${ins.becaPct || 0}%` },
        { label: 'Total plan', value: money(tot) }, { label: 'Pagado', value: money(pag) }, { label: 'Saldo', value: money(tot - pag) },
      ]} />
      <Table compact head={<><Th>Concepto</Th><Th>Vence</Th><Th num>Importe</Th><Th num>Pagado</Th><Th>Estado</Th><Th /></>}>
        {ins.cuotas.map((q, i) => {
          const st = cuotaEstado(q);
          return (
            <tr key={i}>
              <Td>{q.concepto}</Td>
              <Td><input type="date" className={styles.celda} value={valor(i, 'vence')} disabled={q.pagado > 0} aria-label={`Vencimiento ${q.concepto}`} onChange={(e) => cambiar(i, 'vence', e.target.value)} /></Td>
              <Td num><input type="number" className={`${styles.celda} ${styles.importe}`} value={valor(i, 'importe')} disabled={st.k === 'pagada'} aria-label={`Importe ${q.concepto}`} onChange={(e) => cambiar(i, 'importe', e.target.value)} /></Td>
              <Td num>{money(q.pagado)}</Td>
              <Td><Pill tono={st.tono}>{st.lbl}</Pill></Td>
              <Td>
                <span className={styles.acciones}>
                  {st.k !== 'pagada' && ins.estado !== 'Baja' && <Button size="sm" variant="primary" onClick={() => abrirModal(PagoModal, { insId: id, idx: i })}>Cobrar</Button>}
                  {(q.pagos || []).length > 0 && <>
                    <Button size="sm" onClick={() => abrirModal(ReciboModal, { numero: q.pagos[q.pagos.length - 1].recibo })}>Recibo</Button>
                    {me.admin && <Button size="sm" variant="danger" onClick={() => anular(q)}>Anular cobro</Button>}
                  </>}
                </span>
              </Td>
            </tr>
          );
        })}
      </Table>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <SelectInput label="Estado de la inscripción" value={estado} onChange={setEstado} options={ESTADOS_INSCRIPCION} />
        <TextInput label="Observaciones" value={obs} onChange={setObs} />
      </FormGrid>
      <p className={styles.ayuda}>Podés ajustar vencimientos e importes de las cuotas no pagadas (por ejemplo, para un acuerdo de pago). Una baja deja de generar deuda en las cuotas impagas.</p>
    </Modal>
  );
}
