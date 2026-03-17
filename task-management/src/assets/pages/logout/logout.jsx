import { useEffect } from "react";
import "./logout.css"; // opcional

const Logout = () => {

  useEffect(() => {

    // 🧹 eliminar token
    localStorage.removeItem("token");

    // ⏳ esperar y redirigir
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  }, []);

  return (
    <div className="spinner-overlay">
      <div className="spinner-center">

        <img
          src="/spinner.gif"
          alt="Loading..."
          className="spinner-img"
        />

        <div className="spinner-msg">
          ¡Sesión cerrada exitosamente!
        </div>

      </div>
    </div>
  );
};

export default Logout;