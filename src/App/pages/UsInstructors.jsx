import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { X, ArrowRight, Award } from "lucide-react"
import styles from "./css/UsInstructors.module.css"
import { INSTRUCTORS_DATA } from "../data/instructors"
import PageHero from "../components/PageHero"
import TopTitle from "../components/TopTitle"


function UsInstructors() {
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    useEffect(() => {
        if (!selectedInstructor) return

        const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setSelectedInstructor(null)
        }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedInstructor])

  const closeModal = () => setSelectedInstructor(null);
    return (<>
        <PageHero title="Instructores" image="/assets/banners/instructores-multidisciplinario.png" />
        <section className={`section ${styles.darkBg}`}>
            <div className={`container ${styles.wrap}`}>
                <TopTitle 
                    header="STAFF"
                    wordOne="Nuestro"
                    wordTwo="STAFF"
                    paragraph="Conocé al equipo de profesionales que te acompañará en tu formación arbitral."
                />
                

                <div className={styles.grid}>
                {INSTRUCTORS_DATA.map((ins) => (
                    <article key={ins.id} className={styles.card}>
                    <div className={styles.imageContainer}>
                        <img
                        src={ins.image}
                        alt={`Instructor ${ins.name}`}
                        loading="lazy"
                        />
                    </div>

                    <div className={styles.cardBody}>
                        {ins.badge && <span className={styles.badgePill}>{ins.badge}</span>}
                        <h3>{ins.name}</h3>
                        {ins.role && <h4>{ins.role}</h4>}
                        <p className={styles.cardSummary}>{ins.bio}</p>

                        <button
                            type="button"
                            className={`button ${styles.verPerfilBtn}`}
                            onClick={() => setSelectedInstructor(ins)}
                        >
                            Ver perfil
                        </button>
                    </div>
                    </article>
                ))}
                </div>

                {selectedInstructor && (
                    <div
                    className={styles.modalBackdrop}
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="instructor-modal-title"
                    >
                    <div
                        className={styles.modalCard}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={closeModal}
                        title="Cerrar"
                        aria-label="Cerrar perfil del instructor"
                        >
                        <X size={18} aria-hidden="true" />
                        </button>

                        <div className={styles.modalHeaderFixed}>
                        <div className={styles.modalImageWrap}>
                            <img
                            src={selectedInstructor.image}
                            alt={`Instructor ${selectedInstructor.name}`}
                            />
                        </div>

                        {selectedInstructor.badge && (
                            <span className={styles.modalBadge}>
                            {selectedInstructor.badge}
                            </span>
                        )}

                        <h3 id="instructor-modal-title">{selectedInstructor.name}</h3>
                        {selectedInstructor.role && (
                            <p className={styles.modalRole}>{selectedInstructor.role}</p>
                        )}
                        </div>

                        <div className={styles.modalScrollArea}>
                        <p className={styles.modalBio}>
                            {selectedInstructor.fullBio || selectedInstructor.bio}
                        </p>

                        {Array.isArray(selectedInstructor.specialties) &&
                            selectedInstructor.specialties.length > 0 && (
                            <div className={styles.specialtiesBlock}>
                                <h4>ESPECIALIDADES</h4>
                                <ul className={styles.specialtiesList}>
                                {selectedInstructor.specialties.map((item) => {
                                    const label =
                                    typeof item === "string" ? item : item.label;
                                    return (
                                    <li key={label} className={styles.specialtyItem}>
                                        <Award size={16} aria-hidden="true" />
                                        <span>{label}</span>
                                    </li>
                                    );
                                })}
                                </ul>
                            </div>
                            )}

                        {selectedInstructor.link && (
                            <div className={styles.modalActions}>
                            {selectedInstructor.link.startsWith("/") ? (
                                <Link
                                to={selectedInstructor.link}
                                className="button"
                                onClick={closeModal}
                                >
                                Consultar <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <a href={selectedInstructor.link} className="button">
                                Consultar <ArrowRight size={16} />
                                </a>
                            )}
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                )}
            </div>
        </section>
        </>
    );
}

export default UsInstructors;