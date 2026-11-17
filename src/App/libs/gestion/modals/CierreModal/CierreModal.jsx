import { useState } from 'react';
import { difLabel, fondoInicial, resumenDia } from '../../lib/business';
import { fdate, money, today } from '../../lib/format';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { Field, TextInput } from '../../components/ui/Field/Field';
import FormGrid from '../../components/ui/FormGrid/FormGrid';
import Modal from '../../components/ui/Modal/Modal';
import Pill from '../../components/ui/Pill/Pill';
import SectionLabel from '../../components/ui/SectionLabel/SectionLabel';
import Summary from '../../components/ui/Summary/Summary';
import Table, { FullRow, Td, Th } from '../../components/ui/Table/Table';
import styles from './CierreModal.module.css';

const FORM_ID = 'arbitra-cierre';

const valoresDe = (db, fecha) => {
  const p = db.get('cierres', fecha);
  return { saldoInicial: fondoInicial(db, fecha), contado: p ? p.contado : '', retiro: p ? p.retiro || 0 : 0, notas: p ? p.notas || '' : '' };
};

/** Arqueo diario: fondo + cobros − gastos en efectivo contra lo contado, y totales por medio de pago. */
export default function CierreModal({ fecha: fechaInicial, onClose }) {
  const { db, me, guardar, nombreUsuario } = useData();
  const { toast } = useUi();
  const [fecha, setFecha] = useState(fechaInicial || today());
  const [v, setV] = useState(() => valoresDe(db, fechaInicial || today()));
  const prev = db.get('cierres', fecha);
  const bloqueado = !!prev && !me.admin;
  const PM = resumenDia(db, fecha);
  const ef = PM.Efectivo || { ing: 0, egr: 0 };
  const ini = Math.round(+v.saldoInicial || 0);
  const cont = v.contado === '' ? null : Math.round(+v.contado || 0);
  const esperado = ini + ef.ing - ef.egr;
  const [difTxt, difTono] = cont == null ? ['Contá el efectivo', ''] : difLabel(cont - esperado);
  const set = (k) => (x) => setV((s) => ({ ...s, [k]: x }));

  const cambiarFecha = (f) => { setFecha(f); if (f) setV(valoresDe(db, f)); };

  const enviar = async () => {
    if (cont == null) { toast('Ingresá el efectivo contado.'); return; }
    if (prev && !me.admin) { toast('Ese día ya está cerrado. Solo un Editor puede corregirlo.'); return; }
    try {
      await guardar('cierres', {
        ...(prev || {}), id: fecha, fecha, saldoInicial: ini, ingresosEfectivo: ef.ing, egresosEfectivo: ef.egr, esperado, contado: cont,
        diferencia: cont - esperado, retiro: Math.round(+v.retiro || 0), notas: (v.notas || '').trim(), porMedio: PM,
      });
      onClose(); toast(`Caja del ${fdate(fecha)} cerrada · ${difLabel(cont - esperado)[0]}`);
    } catch (e) { /* aviso */ }
  };

  return (
    <Modal wide title="Cierre de caja" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancelar</Button>
      {!bloqueado && <Button variant="primary" type="submit" form={FORM_ID}>{prev ? 'Guardar corrección' : 'Cerrar caja'}</Button>}
    </>}>
      <FormGrid id={FORM_ID} onSubmit={enviar}>
        <TextInput label="Día" type="date" value={fecha} onChange={cambiarFecha} />
        <TextInput label="Efectivo al abrir (fondo de caja)" type="number" min="0" value={v.saldoInicial} onChange={set('saldoInicial')} disabled={bloqueado} hint="Se toma del cierre anterior menos lo retirado." />
      </FormGrid>
      <Summary items={[
        { label: 'Fondo al abrir', value: money(ini) }, { label: '+ Cobros en efectivo', value: money(ef.ing) },
        { label: '− Gastos en efectivo', value: money(ef.egr) }, { label: '= Debería haber', value: money(esperado), big: true },
      ]} />
      <FormGrid>
        <TextInput label="Efectivo contado ($) *" type="number" min="0" value={v.contado} onChange={set('contado')} disabled={bloqueado} placeholder="Lo que hay en la caja" form={FORM_ID} />
        <Field label="Diferencia"><div className={styles.dif}><Pill tono={difTono}>{difTxt}</Pill></div></Field>
        <TextInput label="Retiro o depósito al cerrar ($)" type="number" min="0" value={v.retiro} onChange={set('retiro')} disabled={bloqueado} form={FORM_ID}
          hint="Efectivo que se lleva al banco o a dirección. Lo que queda es el fondo de mañana." />
        <TextInput label="Observaciones" value={v.notas} onChange={set('notas')} disabled={bloqueado} placeholder="Ej.: faltante por vuelto mal dado" form={FORM_ID} />
      </FormGrid>
      <div className={styles.bloque}>
        <SectionLabel>Movimientos del día por medio de pago</SectionLabel>
        <Table compact head={<><Th>Medio</Th><Th num>Mov.</Th><Th num>Ingresos</Th><Th num>Egresos</Th><Th num>Neto</Th></>}>
          {Object.keys(PM).length ? Object.entries(PM).map(([k, x]) => (
            <tr key={k}><Td>{k}</Td><Td num>{x.n}</Td><Td num>{money(x.ing)}</Td><Td num>{money(x.egr)}</Td><Td num><b>{money(x.ing - x.egr)}</b></Td></tr>
          )) : <FullRow cols={5}><EmptyState>Sin movimientos ese día</EmptyState></FullRow>}
        </Table>
        <p className={styles.ayuda}>Usá los totales de transferencia y Mercado Pago para controlar contra el banco y la billetera.</p>
      </div>
      {prev && (
        <p className={styles.ayuda}>
          Cerrada por {nombreUsuario(prev.creadoPor)}{prev.modificadoPor && prev.modificadoPor !== prev.creadoPor ? ` · corregida por ${nombreUsuario(prev.modificadoPor)}` : ''}.
          {bloqueado && ' Solo un Editor puede corregir un cierre ya guardado.'}
        </p>
      )}
    </Modal>
  );
}
