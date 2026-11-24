import { useState } from "react"
import styles from "./css/PartnerSlider.module.css"
import { PARTNERS_DATA } from "../data/partnersData"

function PartnerSlider({ items = PARTNERS_DATA }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items || items.length === 0) return null

  const hasMultiple = items.length > 1
  const currentItem = items[currentIndex] || items[0]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={styles.sliderWrapper}>
      {hasMultiple && (
        <button
          type="button"
          onClick={handlePrev}
          className={`${styles.navButton} ${styles.prevButton}`}
          aria-label="Partner anterior"
        >
          &#8249;
        </button>
      )}

      <article key={currentItem.id || currentIndex} className={styles.card}>
        <div className={styles.imageColumn}>
          <img
            src={currentItem.image}
            alt={currentItem.subtitle || "PARTNER"}
            className={styles.partnerImage}
          />
        </div>

        <div className={styles.contentColumn}>
          {currentItem.eyebrow && (
            <span className={styles.eyebrow}>{currentItem.eyebrow}</span>
          )}
{/*
          {currentItem.logo && (
            <div className={styles.logoWrapper}>
              <img
                src={currentItem.logo}
                alt={`Logo ${currentItem.subtitle || "Partner"}`}
                className={styles.partnerLogo}
              />
            </div>
          )}
*/}
          {currentItem.subtitle && (
            <h3 className={styles.subtitle}>{currentItem.subtitle}</h3>
          )}

          {currentItem.text && (
            <p className={styles.text}>{currentItem.text}</p>
          )}
        <a href="https://fechalista.netlify.app/" target="_blank">Visitar ↗</a>
        </div>
      </article>

      {hasMultiple && (
        <button
          type="button"
          onClick={handleNext}
          className={`${styles.navButton} ${styles.nextButton}`}
          aria-label="Siguiente partner"
        >
          &#8250;
        </button>
      )}

      {hasMultiple && (
        <div className={styles.dots} role="tablist" aria-label="Seleccionar partner">
          {items.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ""}`}
              aria-label={`Ir al partner ${idx + 1}`}
              aria-selected={idx === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PartnerSlider;
