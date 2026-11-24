import styles from './css/PrivacyPolitic.module.css'
import PageHero from '../components/PageHero'
import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  CreditCard,
  ShieldAlert,
  RotateCcw,
  Cookie,
  Copyright,
  Users,
  LifeBuoy,
  Plus,
} from "lucide-react";
import { ARBITRA_LEGAL_SECTIONS } from "../data/legales";

const iconsBySectionId = {
  identificacion: Building2,
  "alcance-formacion": GraduationCap,
  "inscripcion-precios": CreditCard,
  "prestacion-cambios-seguridad": ShieldAlert,
  "arrepentimiento-bajas": RotateCcw,
  "privacidad-datos": ShieldCheck,
  "cookies-comunicaciones": Cookie,
  "propiedad-intelectual": Copyright,
  "convivencia-menores-imagen": Users,
  "accesibilidad-consultas-reclamos": LifeBuoy,
}

function PrivacyPolitic() {
  const [active, setActive] = useState(-1);

  return (
    <>
      <PageHero title="Política de privacidad" image="/assets/banners/privacy.png" />
      <section className="section light">
        <div className={`container ${styles.wrap}`}>
          <p className="lead">
            ARBITRA® — Centro de Formación Profesional. Marco institucional,
            condiciones operativas y protección de datos personales.
          </p>

          {ARBITRA_LEGAL_SECTIONS.map((sec, i) => {
            const Icon = iconsBySectionId[sec.id] || ShieldCheck;
            const isOpen = active === i;

            return (
              <article
                key={sec.id}
                className={`${styles.item} ${isOpen ? styles.open : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setActive(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <Icon size={20} />
                  <span>
                    {sec.number}. {sec.title}
                  </span>
                  <Plus
                    size={18}
                    className={styles.toggleIcon}
                    aria-hidden="true"
                  />
                </button>

                <div className={styles.panel}>
                  <div className={styles.panelInner}>
                    <div className={styles.panelContent}>
                      {sec.paragraphs.map((text, idx) => (
                        <p key={idx}>{text}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default PrivacyPolitic