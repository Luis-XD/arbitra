import { COLECCIONES } from '../../../config/constants';
import { cantidadEjemplos } from '../../../lib/business';
import { useData } from '../../../state/DataProvider';
import { useUi } from '../../../state/UiProvider';
import Banner from '../../ui/Banner/Banner';
import Button from '../../ui/Button/Button';
import styles from './ExampleBanner.module.css';

/** Avisos generales de cada vista: acceso de solo lectura y datos de ejemplo cargados. */
export default function ExampleBanner() {
  const { db, me } = useData();
  const { ir } = useUi();
  const n = cantidadEjemplos(db, COLECCIONES);
  if (me.puedeEscribir && !n) return null;
  return (
    <div className={styles.stack}>
      {!me.puedeEscribir && (
        <Banner>Tenés acceso de <b>solo lectura</b>: podés consultar todo, pero no cargar ni modificar datos.</Banner>
      )}
      {n > 0 && (
        <Banner action={<Button size="sm" onClick={() => ir('ajustes')}>Ir a Ajustes</Button>}>
          Estás viendo <b>{n} registros de ejemplo</b> (marcados “Ejemplo”) para conocer el sistema. Cuando empieces a cargar datos reales podés borrarlos desde Ajustes.
        </Banner>
      )}
    </div>
  );
}
