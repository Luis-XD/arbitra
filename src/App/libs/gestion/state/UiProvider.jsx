'use client';
// Estado de interfaz: vista actual, ventana modal abierta y avisos (toasts).
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ vistaInicial = 'panel', onNavegar, children }) {
  const [vista, setVista] = useState(vistaInicial);
  const [modal, setModal] = useState(null);
  const [aviso, setAviso] = useState(null);
  const timer = useRef(null);

  const ir = useCallback((id) => { setVista(id); if (onNavegar) onNavegar(id); }, [onNavegar]);
  const toast = useCallback((mensaje) => {
    setAviso({ mensaje, key: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(null), 3400);
  }, []);
  /** Abre una ventana. Reemplaza a la que esté abierta. */
  const abrirModal = useCallback((Componente, props = {}) => setModal({ Componente, props, key: Date.now() + Math.random() }), []);
  const cerrarModal = useCallback(() => setModal(null), []);

  const value = useMemo(() => ({ vista, ir, toast, aviso, modal, abrirModal, cerrarModal }), [vista, ir, toast, aviso, modal, abrirModal, cerrarModal]);
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi debe usarse dentro de <ArbitraGestion>');
  return ctx;
}
