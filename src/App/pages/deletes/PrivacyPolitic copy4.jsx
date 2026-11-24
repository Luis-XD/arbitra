import styles from './css/PrivacyPolitic.module.css'
import PageHero from '../components/PageHero'
import React, { useState } from "react";
import {
  ShieldCheck,
  Database,
  Share2,
  LockKeyhole,
  UserRound,
  RefreshCw,
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
  Minus,
} from "lucide-react";
import { ARBITRA_LEGAL_SECTIONS } from "../data/content";

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
};

const sections = [
  [
    ShieldCheck,
    "Información que recopilamos",
    "La información que el usuario facilite voluntariamente mediante formularios o procesos de inscripción.",
  ],
  [
    Database,
    "Uso de la información",
    "La información podrá utilizarse para responder consultas y gestionar servicios educativos, conforme a las finalidades informadas.",
  ],
  [
    Share2,
    "Compartición de datos",
    "Las condiciones de comunicación de datos a terceros deben detallarse según los proveedores reales del sitio.",
  ],
  [
    LockKeyhole,
    "Seguridad de la información",
    "Las medidas técnicas y organizativas deben documentarse de acuerdo con la implementación real.",
  ],
  [
    UserRound,
    "Tus derechos",
    "Las personas usuarias pueden consultar sobre el acceso, actualización o eliminación de sus datos conforme a la legislación aplicable.",
  ],
  [
    RefreshCw,
    "Cambios en la política",
    "Las actualizaciones de esta política deberán publicarse con su fecha de vigencia.",
  ],
];

function PrivacyPolitic() {
 const [active, setActive] = useState(-1);
  return (
    <>
      <PageHero title="Política de privacidad" image="/assets/campus.jpg" />
      <section className="section light">
        <div className={`container ${styles.wrap}`}>
          <p className="lead">
            ARBITRA® — Centro de Formación Profesional. Marco institucional,
            condiciones operativas y protección de datos personales.
          </p>

          <div className={styles.notice}>
            <strong>Aviso previo a publicación:</strong> Revisar y completar los
            campos pendientes como <code>[POLÍTICA COMERCIAL DE CADA CURSO]</code>{" "}
            y <code>[INVENTARIO DE COOKIES Y PROVEEDORES]</code>, además de
            verificar la validez legal de los textos antes de pasar a producción.
          </div>

          {ARBITRA_LEGAL_SECTIONS.map((sec, i) => {
            const Icon = iconsBySectionId[sec.id] || ShieldCheck;
            const isOpen = active === i;

            return (
              <article key={sec.id} className={styles.item}>
                <button
                  type="button"
                  onClick={() => setActive(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <Icon size={20} />
                  <span>
                    {sec.number}. {sec.title}
                  </span>
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </button>

                {isOpen && (
                  <div className={styles.panel}>
                    {sec.paragraphs.map((text, idx) => (
                      <p key={idx}>{text}</p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  )
}

export default PrivacyPolitic