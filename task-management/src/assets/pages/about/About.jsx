import "./About.css";

const About = () => {
  return (
    <>
      <section className="hero">
        <h1>Somos más que un simple planificador</h1>

        <div className="hero-content">
          <div className="hero-img">
            <img
              src="/LumixAnimal.png"
              alt="Mascota GestionTarea"
              style={{ maxWidth: "220px", width: "100%", height: "auto" }}
            />
          </div>

          <div className="hero-text">
            <h2 className="hero-subtitle">
              Simplifica la forma en que gestionas tus tareas o actividades pendientes
            </h2>
          </div>
        </div>
      </section>

      <section className="why">
        <h2>
          ¿Por qué elegir <span className="highlight">Gestión de Tareas</span>?
        </h2>

        <div className="why-content">
          <div className="why-item">
            <strong>Automatización total:</strong>
            <ul>
              <li>Despídete de las listas de tareas manuales.</li>
            </ul>
          </div>

          <div className="why-item">
            <strong>Interactividad:</strong>
            <ul>
              <li>Edita tus actividades y tareas a tu gusto.</li>
            </ul>
          </div>

          <div className="why-item">
            <strong>Mantente al día:</strong>
            <ul>
              <li>
                Recibe recordatorios e información sobre tus tareas pendientes.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;