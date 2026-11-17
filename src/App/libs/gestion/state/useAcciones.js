// Acciones que comparten vistas y ventanas.
import { useCallback } from 'react';
import { datosCertificado, filaCertificado } from '../lib/business';
import { copyText, downloadBlob } from '../lib/files';
import { fullName, slug, today } from '../lib/format';
import { pdfCertificados } from '../lib/pdf/certificado';
import ConfirmModal from '../modals/ConfirmModal/ConfirmModal';
import CopiarModal from '../modals/CopiarModal/CopiarModal';
import { useData } from './DataProvider';
import { useUi } from './UiProvider';

export function useAcciones() {
  const { db, guardar, siguienteNumero } = useData();
  const { abrirModal, toast } = useUi();

  /** Pide confirmación en una ventana propia. */
  const confirmar = useCallback((mensaje, okLabel, onOk, { peligro = true } = {}) => {
    abrirModal(ConfirmModal, { mensaje, okLabel, onOk, peligro });
  }, [abrirModal]);

  const copiar = useCallback(async (texto) => {
    if (await copyText(texto)) toast('Texto copiado');
    else abrirModal(CopiarModal, { texto });
  }, [abrirModal, toast]);

  const descargar = useCallback((nombre, data, type) => {
    if (downloadBlob(nombre, data, type)) toast('Archivo descargado');
    else toast('No se pudo descargar el archivo.');
  }, [toast]);

  /** Registra que se abrió WhatsApp para avisar una cuota. */
  const marcarAviso = useCallback(async (insId, idx) => {
    const ins = db.get('inscripciones', insId); if (!ins) return;
    const cuotas = ins.cuotas.map((q, i) => (i === idx ? { ...q, ultimoAviso: today(), avisos: (q.avisos || 0) + 1 } : q));
    await guardar('inscripciones', { ...ins, cuotas });
  }, [db, guardar]);

  /**
   * Numera (si hace falta), guarda y descarga los certificados de las inscripciones indicadas.
   * textosPor: { [insId]: textos editados en la vista previa }
   */
  const emitirCertificados = useCallback(async (ids, textosPor = {}) => {
    const filas = ids.map((id) => filaCertificado(db, id)).filter((r) => r && (r.aprueba || r.cert));
    if (!filas.length) { toast('No hay alumnos en condición de recibir el certificado.'); return; }
    const lista = [];
    try {
      for (const r of filas) { // eslint-disable-line no-restricted-syntax
        const tx = textosPor[r.ins.id];
        let cert = r.cert;
        if (!cert) {
          const numero = await siguienteNumero('certificados'); // eslint-disable-line no-await-in-loop
          const fecha = (tx && tx.fecha) || today();
          const { numero: _n, provisorio, qr, mayus, ...textos } = datosCertificado(db, r, { numero, fecha }, tx);
          cert = await guardar('certificados', { id: r.ins.id, insId: r.ins.id, alumnoId: r.ins.alumnoId, cursoId: r.ins.cursoId, numero, fecha, asistenciaPct: r.pct, notaFinal: r.prom, textos }); // eslint-disable-line no-await-in-loop
        } else if (tx) {
          cert = await guardar('certificados', { ...cert, fecha: tx.fecha || cert.fecha, textos: { ...(cert.textos || {}), ...tx } }); // eslint-disable-line no-await-in-loop
        }
        lista.push(datosCertificado(db, r, cert));
      }
    } catch (e) {
      toast('No se pudo numerar el certificado. Probá de nuevo en unos segundos.'); return;
    }
    try {
      const blob = await pdfCertificados(lista);
      const curso = db.get('cursos', filas[0].ins.cursoId);
      descargar(filas.length === 1 ? `certificado-${slug(fullName(filas[0].a))}.pdf` : `certificados-${slug(curso && curso.nombre)}.pdf`, blob);
    } catch (e) {
      toast('No se pudo generar el PDF del certificado.');
    }
  }, [db, guardar, siguienteNumero, toast, descargar]);

  return { confirmar, copiar, descargar, marcarAviso, emitirCertificados };
}
