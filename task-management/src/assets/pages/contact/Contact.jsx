import "./contact.css";

const Contact = () => {
  return (
    <main className="contact-main">
      <div className="contact-wrap">

        <div className="decor-blob" aria-hidden="true"></div>

        <section className="card contact-card">
          <div className="card-top"></div>

          <h1 className="contact-title">Contáctanos</h1>

          <p className="contact-sub">
            ¿Tienes una duda, sugerencia o quieres trabajar con nosotros?
            Escríbenos y te respondemos pronto.
          </p>

          <form className="contact-form" noValidate>

            <div className="two-col">
              <label className="field">
                <span className="label">Nombre</span>
                <input type="text" placeholder="Tu nombre" required />
              </label>

              <label className="field">
                <span className="label">Apellido</span>
                <input type="text" placeholder="Tu apellido" required />
              </label>
            </div>

            <label className="field">
              <span className="label">Correo electrónico</span>
              <input
                type="email"
                placeholder="tucorreo@dominio.com"
                required
              />
            </label>

            <label className="field">
              <span className="label">Asunto</span>
              <input
                type="text"
                placeholder="¿Sobre qué quieres escribir?"
              />
            </label>

            <label className="field">
              <span className="label">Mensaje</span>
              <textarea
                rows="6"
                placeholder="Escribe tu mensaje..."
                maxLength="200"
              ></textarea>
              <small className="hint">Máx. 200 caracteres</small>
            </label>

            <div className="form-actions">
              <button type="submit" className="btn submit">
                Enviar mensaje
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={() => window.location.href = "/"}
              >
                Volver
              </button>
            </div>

            <div className="micro-note">
              También puedes escribirnos directamente a{" "}
              <a href="mailto:lumo.notreplay@gmail.com">
                lumo.notreplay@gmail.com
              </a>
            </div>
          </form>
        </section>

        <aside className="contact-side contact-side-responsive">

          <button
            className="previous"
            onClick={() => window.history.back()}
          >
            <img src="/previous_black.png" alt="Volver" />
          </button>

          <div className="side-logo">
            <img
              src="/Lumo3.png"
              alt="Lumo logo"
              className="side-logo-img-big"
            />
            <div className="side-contact-label">O contáctanos a:</div>
          </div>

          <div className="contact-cards">
            <div className="info-card">
              <div className="ic">📞</div>
              <div className="info">
                <div className="info-title">Teléfono</div>
                <div className="info-text">+57 300 000 0000</div>
              </div>
            </div>

            <div className="info-card">
              <div className="ic">✉️</div>
              <div className="info">
                <div className="info-title">Correo electrónico</div>
                <div className="info-text">support@lumo.example</div>
              </div>
            </div>

            <div className="info-card">
              <div className="ic">📍</div>
              <div className="info">
                <div className="info-title">Oficina</div>
                <div className="info-text">Cali, Colombia</div>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
};

export default Contact;