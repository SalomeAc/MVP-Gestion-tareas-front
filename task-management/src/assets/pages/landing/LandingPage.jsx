import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/userServices";
import "./LandingPage.css";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        await getUserProfile({ token });
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="mobile-wrapper">
      <div className="mobile-card">
            <img
                src="./public/favicon.svg"
                alt="Task Manager Illustration"
                className="landing-image"
            />

        <h1>Bienvenido a Task Manager</h1>

        {!isLoggedIn ? (
          <>
            <button
              className="landing-btn landing-btn-primary"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>

            <button
              className="landing-btn landing-btn-secondary"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

            
          </>
        ) : (
          <button
            className="landing-btn landing-btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            Ir al Dashboard
          </button>
        )}
      </div>
    </div>
  );
}