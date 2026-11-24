import { useEffect, useState } from "react";
import styles from "./css/ContainerWrapper.module.css";

function ContainerWrapper({ children, images = [] }) {
  const imageList = Array.isArray(images) ? images : images ? [images] : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 3000); // cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [imageList.length]);

  return (
    <section className={styles.fullWidthSection}>
      {/* Contenido interior */}
      <div className={styles.innerContainer}>
        {children}
      </div>

      {/* Contenedor de las imágenes de fondo */}
      <div className={styles.bgSliderContainer}>
        <div className={styles.opacityOverlay} />
        {imageList.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={`bgSlide-${index + 1}`}
            className={`${styles.bgSlide} ${
              index === currentIndex ? styles.activeSlide : ""
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default ContainerWrapper;