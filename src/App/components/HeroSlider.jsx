import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './css/HeroSlider.module.css';

export default function HeroSlider({ slides = [], autoPlay = true, interval = 6500 }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (!autoPlay || paused || count < 2) return;
    const timer = window.setInterval(() => setActive((n) => (n + 1) % count), interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, count, interval]);

  useEffect(() => {
    setActive((n) => (count ? Math.min(n, count - 1) : 0));
  }, [count]);

  if (!count) return null;

  return (
    <section
      className={styles.slider}
      aria-label="Presentación de ARBITRA"
      aria-roledescription="carrusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {slides.map((slide, index) => {
        const institutional = slide.variant === 'institutional';
        const visible = index === active;
        return (
          <article
            key={slide.id ?? index}
            className={`${styles.slide} ${visible ? styles.active : ''} ${institutional ? styles.institutional : styles.editorial}`}
            aria-hidden={!visible}
            inert={!visible}
          >
            <div className={styles.visual}>
              <img
                className={styles.image}
                src={slide.image}
                alt={slide.imageAlt ?? ''}
                fetchPriority={index === 0 ? 'high' : undefined}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>

            {institutional ? (
              <div className={styles.brandContent}>
                {slide.image2 && (
                  <img
                    className={styles.brandLogo}
                    src={slide.image2}
                    alt={slide.logoIncludesText ? 'ARBITRA, Centro de Formación Profesional' : 'Símbolo de ARBITRA'}
                  />
                )}
                {!slide.logoIncludesText && (
                  <>
                    <h1 className={styles.brandTitle}>{slide.title || 'ARBITRA'}</h1>
                    <p className={styles.brandSubtitle}>{slide.subtitle || 'Centro de Formación Profesional'}</p>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.content}>
                {slide.eyebrow && <span className={styles.eyebrow}>{slide.eyebrow}</span>}
                {slide.title && (
                  <h2 className={styles.title}>
                    {slide.title}
                    {slide.highlight && <><br /><span>{slide.highlight}</span></>}
                  </h2>
                )}
                {slide.description && <p className={styles.description}>{slide.description}</p>}
                {slide.button?.label && slide.button?.to && (
                  <Link className={styles.cta} to={slide.button.to} tabIndex={visible ? 0 : -1}>
                    {slide.button.label} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            )}
          </article>
        );
      })}

      {count > 1 && (
        <div className={styles.controls} aria-label="Seleccionar diapositiva">
          {slides.map((slide, index) => (
            <button
              key={slide.id ?? index}
              type="button"
              className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
              onClick={() => setActive(index)}
              aria-label={`Mostrar diapositiva ${index + 1}: ${slide.title || 'ARBITRA'}`}
              aria-current={index === active ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
