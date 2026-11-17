import { useUi } from '../../../state/UiProvider';

/** Renderiza la ventana abierta con abrirModal(Componente, props). */
export default function ModalHost() {
  const { modal, cerrarModal } = useUi();
  if (!modal) return null;
  const { Componente, props, key } = modal;
  return <Componente key={key} {...props} onClose={cerrarModal} />;
}
