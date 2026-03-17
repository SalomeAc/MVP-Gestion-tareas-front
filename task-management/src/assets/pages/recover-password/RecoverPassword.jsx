import { useState } from "react";
import "./RecoverPassword.css";

const RecoverPassword = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const API_BASE_URL = "https://lumo-back-1.onrender.com";

  // 📧 validar email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage("Por favor ingresa un correo válido.");
      setError(true);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/recover-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      if (response.ok) {
        setMessage(`Se ha enviado un enlace a ${email}`);
        setError(false);
        setEmail("");
      } else {
        const data = await response.json().catch(() => ({}));
        setMessage(
          data.message || "Error al enviar el correo."
        );
        setError(true);
      }

    } catch (err) {
      setMessage("No se pudo conectar con el servidor.");
      setError(true);
    }
  };

  return (
    <div className="recover-layout">

      <section className="card recover-card">

        <h2>Recuperar contraseña</h2>

        <p>
          Ingresa tu correo y te enviaremos un enlace.
        </p>

        {/* mensaje */}
        {message && (
          <div style={{ color: error ? "red" : "green" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </label>

          <button type="submit">
            Enviar enlace
          </button>

        </form>

      </section>
    </div>
  );
};

export default RecoverPassword;