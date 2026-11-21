import styles from "./css/ContactCta.module.css";

export default function ContactCta() {
  return (
    <section className={styles.cta} id="contacto">
      <div className={`wrap ${styles.ctaInner}`}>
        <div>
          <div className="eyebrow">Tu próximo paso</div>
          <h2>
            ¿Querés formarte para <span className="green">dirigir el juego?</span>
          </h2>
          <p>Escribinos para recibir información sobre los programas.</p>
        </div>
        <a
          className="button"
          href="mailto:info@arbitra.com?subject=Informaci%C3%B3n%20sobre%20formaciones"
        >
          Solicitá información ↗
        </a>
      </div>
    </section>
  );
}
