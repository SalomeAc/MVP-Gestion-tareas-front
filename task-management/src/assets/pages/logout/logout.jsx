import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logout.css"; // opcional

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {

    
    localStorage.removeItem("token");

    
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 800);

    return () => clearTimeout(timer);

  }, [navigate]);

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