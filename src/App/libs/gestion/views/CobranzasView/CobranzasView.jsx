import { useMemo, useState } from 'react';
import { allCuotas } from '../../lib/business';
import { csvExportacion } from '../../lib/exportar';
import { fdate, fshort, fullName, money, today, ym } from '../../lib/format';
import { opcionesCuota } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ExampleBanner from '../../components/shared/ExampleBanner/ExampleBanner';
import Button from '../../components/ui/Button/Button';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ExampleTag from '../../components/ui/ExampleTag/ExampleTag';
import Panel from '../../components/ui/Panel/Panel';
import Pill from '../../components/ui/Pill/Pill';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Table, { FullRow, Sub, Td, Th } from '../../components/ui/Table/Table';
import Toolbar from '../../components/ui/Toolbar/Toolbar';
import AvisosMasivosModal from '../../modals/AvisosMasivosModal/AvisosMasivosModal';
import PagoModal from '../../modals/PagoModal/PagoModal';
import ReciboModal from '../../modals/ReciboModal/ReciboModal';
import SelectorCobroModal from '../../modals/SelectorCobroModal/SelectorCobroModal';
import WhatsAppModal from '../../modals/WhatsAppModal/WhatsAppModal';
import styles from './CobranzasView.module.css';

const FILTROS = [['vencida', 'Vencidas'], ['porvencer', 'Vencen en 7 días'], ['mes', 'Vencen este mes'], ['pendiente', 'Todas las pendientes'], ['pagada', 'Pagadas']];

export default function CobranzasView() {
  const { db, nombreUsuario } = useData();
  const { abrirModal } = useUi();
  const { descargar, marcarAviso } = useAcciones();
  const [filtro, setFiltro] = useState('vencida');
  const [q, setQ] = useState('');
  const cfg = db.config;
  const mk = ym(today());

  const todas = useMemo(() => allCuotas(db), [db]);
  const cuentas = useMemo(() => ({
    vencida: todas.filter((r) => r.st.k === 'vencida').length,
    porvencer: todas.filter((r) => r.st.k === 'porvencer').length,
    mes: todas.filter((r) => ym(r.q.vence) === mk).length,
    pendiente: todas.filter((r) => r.st.k !== 'pagada').length,
  }), [todas, mk]);

  const filas = useMemo(() => {
    const qq = q.toLowerCase();
    const pasa = {
      vencida: (r) => r.st.k === 'vencida', porvencer: (r) => r.st.k === 'porvencer', mes: (r) => ym(r.q.vence) === mk,
      pendiente: (r) => r.st.k !== 'pagada', pagada: (r) => r.st.k === 'pagada',
    }[filtro];
    return todas.filter(pasa)
      .filter((r) => !qq || [fullName(r.alumno), r.alumno && r.alumno.dni, r.curso && r.curso.nombre].join(' ').toLowerCase().includes(qq))
      .sort((a, b) => (filtro === 'pagada' ? (b.q.fechaPago || '').localeCompare(a.q.fechaPago || '') : a.q.vence.localeCompare(b.q.vence)));
  }, [todas, filtro, q, mk]);

  const saldoTotal = filas.reduce((s, r) => s + r.st.saldo, 0);
  const pendientes = filas.filter((r) => r.st.k !== 'pagada');

  const avisar = (r) => abrirModal(WhatsAppModal, {
    tel: r.alumno && r.alumno.telefono, nombre: fullName(r.alumno),
    opciones: opcionesCuota(cfg, r.alumno, r.curso, r.q),
    onOpen: () => marcarAviso(r.ins.id, r.i),
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title="Cobranzas"
        description={`Cuotas y matrículas de todas las inscripciones. Recargo por mora: ${cfg.recargoMoraPct || 0}% después de ${cfg.diasGracia || 0} días de gracia.`}
        actions={<>
          <Button onClick={() => descargar(`arbitra-deudores-${today()}.csv`, csvExportacion(db, 'morosos', nombreUsuario), 'text/csv')}>Exportar deudores</Button>
          <Button variant="wa" disabled={!pendientes.length} onClick={() => abrirModal(AvisosMasivosModal, { filas: pendientes })}>Avisos por WhatsApp</Button>
          <Button variant="primary" onClick={() => abrirModal(SelectorCobroModal, {})}>Registrar cobro</Button>
        </>}
      />
      <ExampleBanner />
      <Toolbar>
        <SegmentedControl ariaLabel="Filtro de cuotas" value={filtro} onChange={setFiltro}
          options={FILTROS.map(([k, l]) => [k, cuentas[k] != null ? `${l} (${cuentas[k]})` : l])} />
        <SearchInput value={q} onChange={setQ} placeholder="Buscar alumno, DNI o curso" />
      </Toolbar>
      <Panel flush title={`${filas.length} cuotas`} actions={filtro !== 'pagada' && <span className={styles.saldo}>Saldo total {money(saldoTotal)}</span>}>
        <Table head={<><Th>Alumno</Th><Th>Curso</Th><Th>Concepto</Th><Th>Vence</Th><Th num>Importe</Th><Th num>{filtro === 'pagada' ? 'Cobrado' : 'Saldo'}</Th><Th>Estado</Th><Th /></>}>
          {filas.length ? filas.map((r) => {
            const pagada = r.st.k === 'pagada';
            const pagos = r.q.pagos || [];
            return (
              <tr key={`${r.ins.id}|${r.i}`}>
                <Td><b>{fullName(r.alumno)}</b><ExampleTag item={r.ins} /><Sub>{r.alumno && r.alumno.telefono}</Sub></Td>
                <Td>{r.curso ? r.curso.nombre : '—'}</Td>
                <Td>{r.q.concepto}{r.q.ultimoAviso && !pagada && <Sub>Avisado por WhatsApp {fshort(r.q.ultimoAviso)}</Sub>}</Td>
                <Td mono>{fdate(r.q.vence)}</Td>
                <Td num>{money(r.q.importe)}</Td>
                <Td num>{money(filtro === 'pagada' ? r.q.pagado : r.st.saldo)}</Td>
                <Td><Pill tono={r.st.tono}>{pagada && r.q.fechaPago ? `Pagada ${fshort(r.q.fechaPago)}` : r.st.lbl}</Pill></Td>
                <Td>
                  <span className={styles.acciones}>
                    {!pagada ? <>
                      <Button size="sm" variant="waGhost" aria-label={`Avisar por WhatsApp a ${fullName(r.alumno)}`} onClick={() => avisar(r)}>WhatsApp</Button>
                      <Button size="sm" variant="primary" onClick={() => abrirModal(PagoModal, { insId: r.ins.id, idx: r.i })}>Cobrar</Button>
                    </> : pagos.length > 0 && (
                      <Button size="sm" onClick={() => abrirModal(ReciboModal, { numero: pagos[pagos.length - 1].recibo })}>Recibo</Button>
                    )}
                  </span>
                </Td>
              </tr>
            );
          }) : (
            <FullRow cols={8}>
              <EmptyState title="Nada para mostrar con este filtro">{filtro === 'vencida' ? 'No hay cuotas vencidas. Buen trabajo.' : 'Probá con otro filtro.'}</EmptyState>
            </FullRow>
          )}
        </Table>
      </Panel>
    </div>
  );
}
