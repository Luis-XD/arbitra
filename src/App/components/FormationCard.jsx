import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, BarChart3 } from "lucide-react";
import styles from "./css/FormationCard.module.css";
export default function FormationCard({ item, index }) {
  return (
    <article
      className={styles.card}
      style={{
        backgroundImage: `linear-gradient(180deg,transparent 25%,#03121c 100%),url('${item.image}')`,
      }}
    >
      <div className={styles.content}>
        <h3>{item.title}</h3>
        <p>
          <CalendarDays size={15} />
          {item.duration}
        </p>
        <p>
          <BarChart3 size={15} />
          {item.level}
        </p>
        <Link
          to={`/formacion#programa-${index + 1}`}
          aria-label={`Conocer ${item.title}`}
        >
          <ArrowRight size={21} />
        </Link>
      </div>
    </article>
  );
}
