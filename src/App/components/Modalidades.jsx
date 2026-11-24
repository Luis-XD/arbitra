import CardVertical from "./CardVertical";
import { MODALIDADES_ARBITRAJE } from "../data/content";
import styles from "./css/Modalidades.module.css";

const accents = {
  presencial: "ambar",
  distanciaPresencial: "turquoise",
  distanciaIntensiva: "purple",
  online: "green",
};

export default function Modalidades({comp=""}) {
  return (
    <>
        {comp}
        <div className={styles.grid}>
          {Object.entries(MODALIDADES_ARBITRAJE).map(([key, mode]) => (
            <CardVertical
              key={key}
              nameImg={mode.nameImg}
              typeTitle={mode.mode}
              title={mode.title}
              descrip={mode.descrip}
              items={mode.items}
              accent={accents[key]}
              sale={mode.investment}
              to={mode.to}
            />
          ))}
        </div>
    </>
  );
}
