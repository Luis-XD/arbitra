import React from "react"
import styles from "./css/Brand.module.css"

export default function Brand({ large = false }) {
  return (
    <span className={`${styles.brand} ${large ? styles.large : ""}`}>
      <img
        src="/assets/logo-oficial.png"
        alt="ARBITRA — Centro de Formación Profesional"
      />
    </span>
  );
}
