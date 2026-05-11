import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://lumo-back-1.onrender.com";

  
  const token = searchParams.get("token");

  
  useEffect(() => {
    if (!token) {
      setMessage("Enlace inválido o vencido.");
      setError(true);
    }
  }, [token]);

  
  const validatePassword = (pw) => {
    const errors = [];
    if (pw.length < 8) errors.push("8 caracteres");
    if (!/[a-z]/.test(pw)) errors.push("minúscula");
    if (!/[A-Z]/.test(pw)) errors.push("mayúscula");
    if (!/[0-9]/.test(pw)) errors.push("número");
    if (!/[^\w\s]/.test(pw)) errors.push("símbolo");
    return errors;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    const errors = validatePassword(password);

    if (errors.length) {
      setMessage("La contraseña necesita: " + errors.join(", "));
      setError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setError(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password,
            confirmPassword
          })
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.message || "No se pudo restablecer."
        );
      }

      setMessage("Contraseña actualizada correctamente");
      setError(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage(err.message || "Error inesperado");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-layout">

      <section className="card reset-card">

        <h2>Restablecer contraseña</h2>

        <p>
          Ingresa tu nueva contraseña.
        </p>

        {/* mensaje */}
        {message && (
          <div style={{ color: error ? "red" : "green" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
            disabled={!token}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setMessage("");
            }}
            disabled={!token}
          />

          <button type="submit" disabled={loading || !token}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>

        </form>

      </section>
    </div>
  );
};

export default ResetPassword;