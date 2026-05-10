import { useState, useEffect } from "react";
import { updateUserProfile, getUserProfile } from "../services/userServices";
import "./security.css";

const Security = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // 🔄 cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getUserProfile({ token });
        setUser(data);
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    };

    loadUser();
  }, []);

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!password || !confirmPassword) {
      setMessage("Debes completar ambos campos");
      setError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setError(true);
      return;
    }

    try {
      await updateUserProfile(
        { password, confirmPassword },
        token
      );

      setMessage("Contraseña actualizada con éxito");
      setError(false);

      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      setMessage(err.message || "Error al actualizar");
      setError(true);
    }
  };

  return (
    <div className="app">

      {/* SIDEBAR (reutilizado) */}
      {/* 👉 aquí deberías usar tu componente Sidebar */}
      {/* <Sidebar /> */}

      <main className="update-content">

        <header className="update-header">
          <h2>Cambiar contraseña</h2>

          {user && (
            <div>
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.email}</p>
            </div>
          )}
        </header>

        <div className="password-main">

          <form className="update-form" onSubmit={handleSubmit}>

            {message && (
              <div style={{ color: error ? "red" : "green" }}>
                {message}
              </div>
            )}

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit">
              Actualizar
            </button>

          </form>

        </div>

      </main>
    </div>
  );
};

export default Security;