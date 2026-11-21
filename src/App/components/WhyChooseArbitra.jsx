import styles from "./css/WhyChooseArbitra.module.css";

const icons = {
  paid: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v5c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 11v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" />
    </>
  ),
  shirt: <path d="m8 3-5 4 3 5 3-2v11h10V10l3 2 3-5-5-4-3 2h-6z" />,
  shield: (
    <>
      <path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5z" />
      <path d="M12 7v9M7.5 11.5h9" />
    </>
  ),
  field: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="1" />
      <path d="M12 5v14" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 9h3v6H2m20-6h-3v6h3" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="3" width="16" height="13" rx="1" />
      <path d="M2 20h20M9 20l1-2h4l1 2" />
    </>
  ),
  certificate: (
    <>
      <rect x="4" y="2" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h6" />
      <circle cx="16" cy="17" r="3" />
      <path d="m14 19-1 4 3-2 3 2-1-4" />
    </>
  ),
};

function BenefitIcon({ name }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

const benefits = [
  { key: "paid", title: "Prácticas rentadas", note: "Según modalidad" },
  { key: "shirt", title: "Equipo incluido", note: "Según modalidad" },
  { key: "shield", title: "Seguro personal", note: "Según modalidad" },
  { key: "field", title: "Prácticas en canchas", note: "Según modalidad" },
  { key: "laptop", title: "4 modalidades", note: "Según modalidad"},
  { key: "certificate", title: "Certificado" },
];

export default function WhyChooseArbitra() {
  return (
    <section
      className={styles.section}
      id="por-que-arbitra"
      aria-labelledby="why-arbitra-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.slash} aria-hidden="true" />
          <h2 id="why-arbitra-title">
            ¿Por qué elegir <strong>ARBITRA?</strong>
          </h2>
        </div>
        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article className={styles.item} key={benefit.key}>
              <BenefitIcon name={benefit.key} />
              <h3>{benefit.title}</h3>
              {benefit.note && <p className={styles.note}>{benefit.note}</p>}
              {benefit.modes && (
                <ul className={styles.modes}>
                  {benefit.modes.map((mode) => (
                    <li key={mode}>{mode}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
