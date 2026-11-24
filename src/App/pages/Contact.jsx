import { useState } from "react"
import PageHero from "../components/PageHero"
import styles from "./css/Contact.module.css"
import { CONFIG_BACKEND } from "../config/config"

const INITIAL_FORM = {
  name: "",
  email: "",
  program: "",
  message: "",
  website: "",
};

function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({ type: "", text: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanProgram = formData.program.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName || !cleanEmail || !cleanProgram || !cleanMessage) {
      setStatus({
        type: "error",
        text: "Completá todos los campos obligatorios antes de enviar.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch(`${CONFIG_BACKEND.API_DIR}/contact`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          program: cleanProgram,
          message: cleanMessage,
          website: formData.website,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "No se pudo enviar la consulta. Intentá nuevamente."
        );
      }

      setStatus({
        type: "success",
        text: "Consulta enviada correctamente. Te responderemos a la brevedad.",
      });
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("Error al enviar consulta:", err);
      setStatus({
        type: "error",
        text: err?.message || "Ocurrió un error al enviar el formulario.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHero title="Contacto e inscripciones" image="/assets/referee.jpg" />
      <section className="section light">
        <div className={`container ${styles.wrap}`}>
          <div className="sectionTitle">
            <div className="cursoTituloDestacado">
              <h2>
                <span className="slash"></span>Nuestras capacitaciones
              </h2>
            </div>
            <p>
              Contanos qué disciplina te interesa y te orientaremos sobre las
              propuestas disponibles.
            </p>
            <p>
              La información sobre fechas, vacantes, modalidades y aranceles se
              confirmará por los canales oficiales.
            </p>
          </div>

          <form onSubmit={submit} className={styles.contactForm} noValidate>
            {/* Honeypot anti-bots: no mostrar visualmente a humanos */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ display: "none" }}
            />

            <label>
              Nombre y apellido
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                maxLength={120}
              />
            </label>

            <label>
              Correo electrónico
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                maxLength={160}
              />
            </label>

            <label>
              Formación de interés
              <select
                required
                name="program"
                value={formData.program}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Seleccioná una opción
                </option>
                <option value="Fútbol 11">Fútbol 11</option>
                <option value="Fútbol 8 y 5">Fútbol 8 y 5</option>
                <option value="Futsal">Futsal</option>
                <option value="Fútbol playa">Fútbol playa</option>
                <option value="Otros cursos">Otros cursos</option>
              </select>
            </label>

            <label>
              Mensaje
              <textarea
                required
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tu consulta"
                maxLength={2500}
              />
            </label>

            <button
              className="button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar consulta →"}
            </button>

            {status.text && (
              <p
                role="status"
                className={styles.message}
                data-status={status.type}
              >
                {status.text}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;