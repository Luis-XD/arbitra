import { useEffect, useRef, useState } from 'react';
import { COLECCIONES } from '../../config/constants';
import { CONFIG_INICIAL, PLANTILLAS, VARIABLES_CERTIFICADO, VARIABLES_PLANTILLA } from '../../config/defaults';
import { cantidadEjemplos, fmtNumero } from '../../lib/business';
import { today } from '../../lib/format';
import { waLink, waPhone } from '../../lib/whatsapp';
import { useAcciones } from '../../state/useAcciones';
import { useData } from '../../state/DataProvider';
import { useUi } from '../../state/UiProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Banner from '../../components/ui/Banner/Banner';
import Button from '../../components/ui/Button/Button';
import { Checkbox, TextArea, TextInput } from '../../components/ui/Field/Field';
import FormGrid, { FormSection } from '../../components/ui/FormGrid/FormGrid';
import Panel from '../../components/ui/Panel/Panel';
import CertificadoModal from '../../modals/CertificadoModal/CertificadoModal';
import styles from './AjustesView.module.css';

const NUMERICOS = ['diaVencimiento', 'diasGracia', 'recargoMoraPct', 'puntoVenta', 'notaMinima', 'asistenciaMinima'];
const CAMPOS = Object.keys(CONFIG_INICIAL);
const MENSAJE_REDES = 'Hola, quiero información sobre los cursos de Arbitra';

export default function AjustesView() {
  const { db, me, guardarConfig, fijarContador, eliminarEjemplos, guardarLote, descripcionDatos } = useData();
  const { abrirModal, toast } = useUi();
  const { confirmar, copiar, descargar } = useAcciones();
  const ultimoRecibo = +db.counters.recibos || 0;
  const inicial = () => ({ ...Object.fromEntries(CAMPOS.map((k) => [k, db.config[k] ?? ''])), proximoRecibo: ultimoRecibo + 1 });
  const [f, setF] = useState(inicial);
  const [sucio, setSucio] = useState(false);
  const archivo = useRef(null);

  // Si los datos cambian desde otro lado y no hay cambios pendientes, refrescar el formulario.
  useEffect(() => { if (!sucio) setF(inicial()); }, [db.config, ultimoRecibo]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (v) => { setF((x) => ({ ...x, [k]: v })); setSucio(true); };
  const nEj = cantidadEjemplos(db, COLECCIONES);
  const wa = waPhone(f.waNumero, f.waArea);
  const enlaceRedes = waPhone(db.config.waNumero, db.config.waArea) ? waLink(waPhone(db.config.waNumero, db.config.waArea), MENSAJE_REDES) : '';

  const guardarAjustes = async () => {
    if (!me.admin) return;
    const o = { ...f };
    NUMERICOS.forEach((k) => { o[k] = +o[k] || 0; });
    o.diaVencimiento = Math.min(28, Math.max(1, o.diaVencimiento));
    o.puntoVenta = Math.max(1, o.puntoVenta);
    o.certMayus = !!o.certMayus;
    const prox = Math.max(1, parseInt(o.proximoRecibo, 10) || 1);
    delete o.proximoRecibo;
    try {
      await guardarConfig(o);
      if (prox !== ultimoRecibo + 1) await fijarContador('recibos', prox - 1);
      setSucio(false); toast('Ajustes guardados');
    } catch (e) { /* el aviso lo muestra el proveedor de datos */ }
  };

  const respaldo = () => descargar(`arbitra-respaldo-${today()}.json`, JSON.stringify({
    version: 1, exportado: new Date().toISOString(), ...Object.fromEntries(COLECCIONES.map((c) => [c, db[c]])), config: db.config, contadores: db.counters,
  }, null, 2), 'application/json');

  const importar = async (file) => {
    if (!file) return;
    let data;
    try { data = JSON.parse(await file.text()); } catch (e) { toast('El archivo no es un respaldo válido (JSON).'); return; }
    if (!COLECCIONES.some((c) => Array.isArray(data[c]))) { toast('El archivo no contiene datos de Arbitra Gestión.'); return; }
    const items = [];
    COLECCIONES.forEach((c) => (data[c] || []).forEach((x) => { if (x && x.id) items.push([c, x]); }));
    confirmar(<>Se importarán <b>{items.length}</b> registros. Los que tengan el mismo identificador se reemplazan; el resto se agrega.</>, 'Importar', async () => {
      try {
        await guardarLote(items);
        if (data.config) await guardarConfig(data.config);
        if (data.contadores) await Promise.all(Object.entries(data.contadores).map(([k, v]) => fijarContador(k, +v || 0)));
        toast('Respaldo importado');
      } catch (e) { /* aviso en el proveedor */ }
    }, { peligro: false });
  };

  const borrarEjemplos = () => confirmar(
    'Se eliminarán todos los registros marcados como Ejemplo (cursos, alumnos, prospectos, inscripciones, docentes y movimientos). Tus datos reales no se tocan.',
    'Borrar ejemplos',
    async () => { const n = await eliminarEjemplos(); toast(`${n} registros de ejemplo eliminados`); },
  );

  const hintWa = !f.waNumero ? 'Con código de área, sin 0 ni 15.'
    : wa ? `Formato correcto: +${wa}` : <span className={styles.err}>Revisá el número: código de área sin 0 y sin 15.</span>;

  return (
    <div className={styles.page}>
      <PageHeader title="Ajustes" description="Datos de la institución, reglas de cobranza y respaldo de la información." />
      {!me.admin && <Banner>Solo los <b>Editores</b> pueden cambiar los ajustes, restaurar respaldos o borrar datos. Podés consultarlos y descargar un respaldo.</Banner>}

      <Panel title="Institución y cobranza">
        <FormGrid onSubmit={guardarAjustes}>
          <fieldset className={styles.campos} disabled={!me.admin}>
            <TextInput full label="Nombre de la institución" value={f.institucion} onChange={set('institucion')} />
            <TextInput label="CUIT" value={f.cuit} onChange={set('cuit')} placeholder="30-00000000-0" />
            <TextInput label="Teléfono" value={f.telefono} onChange={set('telefono')} />
            <TextInput label="Email" type="email" value={f.email} onChange={set('email')} />
            <TextInput label="Dirección" value={f.direccion} onChange={set('direccion')} />
            <TextInput label="Día de vencimiento de cuotas" type="number" min="1" max="28" value={f.diaVencimiento} onChange={set('diaVencimiento')} hint="Se usa al generar planes nuevos." />
            <TextInput label="Días de gracia" type="number" min="0" max="30" value={f.diasGracia} onChange={set('diasGracia')} />
            <TextInput label="Recargo por mora (%)" type="number" min="0" max="100" step="0.5" value={f.recargoMoraPct} onChange={set('recargoMoraPct')} hint="Se sugiere al cobrar una cuota vencida después de los días de gracia." />

            <FormSection title="Recibos, aprobación y certificados" />
            <TextInput label="Punto de venta del recibo" type="number" min="1" max="9999" value={f.puntoVenta} onChange={set('puntoVenta')} hint={`Primer tramo del número: ${String(f.puntoVenta || 1).padStart(4, '0')}-…`} />
            <TextInput label="Próximo número de recibo" type="number" min="1" value={f.proximoRecibo} onChange={set('proximoRecibo')}
              hint={`Siguiente: ${fmtNumero('recibos', +f.proximoRecibo || 1, f)}. Cambialo solo para continuar una numeración anterior.`} />
            <TextInput label="Nota mínima para aprobar" type="number" min="1" max="10" step="0.5" value={f.notaMinima} onChange={set('notaMinima')} />
            <TextInput label="Asistencia mínima (%)" type="number" min="0" max="100" value={f.asistenciaMinima} onChange={set('asistenciaMinima')} />
            <TextInput label="Director/a (variable {director})" value={f.directorNombre} onChange={set('directorNombre')} placeholder="Nombre y apellido" />
            <TextInput label="Ciudad (lugar de emisión)" value={f.ciudad} onChange={set('ciudad')} />

            <div className={styles.cert}>
              <b>Certificado de egreso</b>
              <Button size="sm" disabled={false} onClick={() => abrirModal(CertificadoModal, { muestra: true })}>Ver vista previa</Button>
            </div>
            <TextArea label="Frase del certificado" rows={2} value={f.certTexto} onChange={set('certTexto')} hint="Cada curso puede tener su propia frase y título (en la ficha del curso)." />
            <TextInput label="Título que recibe" value={f.certTitulo} onChange={set('certTitulo')} />
            <div className={styles.check}><Checkbox label="Nombre y título en mayúsculas" checked={f.certMayus !== false} onChange={set('certMayus')} /></div>
            <TextInput label="Firma izquierda: cargo" value={f.certFirma1Rol} onChange={set('certFirma1Rol')} />
            <TextInput label="Firma izquierda: nombre" value={f.certFirma1Nombre} onChange={set('certFirma1Nombre')} />
            <TextInput label="Firma derecha: cargo" value={f.certFirma2Rol} onChange={set('certFirma2Rol')} />
            <TextInput label="Firma derecha: nombre" value={f.certFirma2Nombre} onChange={set('certFirma2Nombre')} />
            <TextArea label="Contenido del QR" rows={4} value={f.certQR} onChange={set('certQR')} hint="Lo que muestra el celular al escanearlo. Podés agregar una dirección web de verificación." />
            <div className={styles.vars}>Variables: {VARIABLES_CERTIFICADO}</div>

            <FormSection title="WhatsApp Business">
              Los mensajes se abren en el WhatsApp del equipo donde estés trabajando. Para que salgan con el número del centro, usá WhatsApp Business (app o WhatsApp Web) con ese número en esa computadora o celular.
            </FormSection>
            <TextInput label="Número de WhatsApp Business del centro" value={f.waNumero} onChange={set('waNumero')} placeholder="11 5555-1234" hint={hintWa} />
            <TextInput label="Código de área por defecto" inputMode="numeric" value={f.waArea} onChange={set('waArea')} hint="Se agrega a los teléfonos cargados sin característica." />
            <TextInput full label="Alias o CBU para pagos" value={f.aliasPago} onChange={set('aliasPago')} placeholder="arbitra.cursos" hint="Se usa en la variable {alias} de los recordatorios." />
            {PLANTILLAS.map(([k, l]) => (
              <TextArea key={k} label={l} rows={3} value={f[k] || CONFIG_INICIAL[k]} onChange={set(k)} />
            ))}
            <div className={styles.vars}>Variables: {VARIABLES_PLANTILLA}</div>
            <div className={styles.acciones}>
              {sucio && <Button onClick={() => { setF(inicial()); setSucio(false); }}>Descartar cambios</Button>}
              <Button variant="primary" type="submit">Guardar ajustes</Button>
            </div>
          </fieldset>
        </FormGrid>
      </Panel>

      {enlaceRedes && (
        <Panel title="Enlace de WhatsApp para redes y sitio web">
          <div className={styles.col}>
            <p className={styles.texto}>Pegalo en la biografía de Instagram, en Facebook o en el sitio. Quien lo toque abre un chat con el centro y un mensaje inicial ya escrito.</p>
            <div className={styles.fila}>
              <code className={styles.codigo}>{enlaceRedes}</code>
              <Button onClick={() => copiar(enlaceRedes)}>Copiar enlace</Button>
            </div>
          </div>
        </Panel>
      )}

      <Panel title="Respaldo y datos">
        <div className={styles.col}>
          <p className={styles.texto}>{descripcionDatos ? `${descripcionDatos}. ` : ''}Descargá un respaldo completo con frecuencia y guardalo en un lugar seguro.</p>
          <div className={styles.fila}>
            <Button onClick={respaldo}>Descargar respaldo completo (JSON)</Button>
            {me.admin && <Button onClick={() => archivo.current && archivo.current.click()}>Restaurar desde respaldo…</Button>}
            <input ref={archivo} className={styles.oculto} type="file" accept="application/json,.json"
              onChange={(e) => { importar(e.target.files && e.target.files[0]); e.target.value = ''; }} />
          </div>
          {nEj > 0 && me.admin && (
            <Banner action={<Button size="sm" variant="danger" onClick={borrarEjemplos}>Borrar datos de ejemplo</Button>}>
              Hay <b>{nEj}</b> registros de ejemplo cargados.
            </Banner>
          )}
        </div>
      </Panel>
    </div>
  );
}
