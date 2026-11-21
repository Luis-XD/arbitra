import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/PageHero.module.css";
export default function PageHero({ title, subtitle, image }) {
  return (
    <section
      className={styles.hero}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(90deg,#07121BEF,#07121B65),url("${image}")`,
            }
          : {}
      }
    >
      <div className={styles.container}>
        <span className={styles.eyebrow}>
          ARBITRA · Centro de Formación Profesional
        </span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className={styles.crumb}>
          <Link to="/">Inicio</Link> / {title}
        </div>
      </div>
    </section>
  );
}
