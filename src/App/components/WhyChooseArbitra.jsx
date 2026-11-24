import styles from "./css/WhyChooseArbitra.module.css";

const icons = {
  list: (
    <>
      <rect x="6" y="4" width="16" height="20" rx="2" />
      <path d="M10 4h8v3h-8z" />
      <path d="m10 12 1.5 1.5L14 11M17 12.5h2M10 17l1.5 1.5L14 16M17 17.5h2" />
    </>
  ),
  run: (
    <>
      <path d="M14 22V16.9612C14 16.3537 13.7238 15.7791 13.2494 15.3995L11.5 14M11.5 14L13 7.5M11.5 14L10 13M13 7.5L11 7M13 7.5L15.0426 10.7681C15.3345 11.2352 15.8062 11.5612 16.3463 11.6693L18 12M10 13L11 7M10 13L9.40011 16.2994C9.18673 17.473 8.00015 18.2 6.85767 17.8573L4 17M11 7L8.10557 8.44721C7.428 8.786 7 9.47852 7 10.2361V12M14.5 3.5C14.5 4.05228 14.0523 4.5 13.5 4.5C12.9477 4.5 12.5 4.05228 12.5 3.5C12.5 2.94772 12.9477 2.5 13.5 2.5C14.0523 2.5 14.5 2.94772 14.5 3.5Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </>
  ),
  stock: (
    <>
      <path d="M6 22v-6M12 22v-9.5M18 22V9" />
      <path d="M5.5 14.5l6.5-5.5 4.5 3 6-6" />
      <path d="M18.5 6H22v3.5" />
    </>
  ),
  book: (
    <>
      <path d="M14 7.5c0-1.5-2.5-2.5-5.5-2.5H4v14h4.5c3 0 5.5 1 5.5 2.5" />
      <path d="M14 7.5c0-1.5 2.5-2.5 5.5-2.5H24v14h-4.5c-3 0-5.5 1-5.5 2.5" />
      <path d="M14 7.5v14" />
    </>
  ),
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
  { key: "list", title: "Contenido actualizado" },
  { key: "run", title: "Preparación física y arbitral" },
  { key: "book", title: "Reglamentación oficial (IFAB)" },
  { key: "stock", title: "Desarrollo de competencias" },
  { key: "paid", title: "Prácticas rentadas", note: "Según modalidad" },
  { key: "shirt", title: "Equipo incluido", note: "Según modalidad" },
  { key: "shield", title: "Seguro personal", note: "Según modalidad" },
  { key: "field", title: "Prácticas en canchas", note: "Según modalidad" },
  { key: "laptop", title: "4 modalidades", note: "Según modalidad" },
  { key: "certificate", title: "Certificado" },
];

export default function WhyChooseArbitra({comp=""}) {
  return (
    <>
      {comp}
      <div className={styles.grid}>
        {benefits.map((benefit) => (
          <article className={`${styles.item} ${ benefit.key === "list" && styles.itemInit}`} key={benefit.key}>
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
    </>
  );
}