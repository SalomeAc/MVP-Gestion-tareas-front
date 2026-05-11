import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createList } from "../services/listServices";
import "./CreateList.css";

const CreateList = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título no puede estar vacío");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await createList(title, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error creando lista");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-list-wrapper">
      <div className="create-list-card">
        <div className="create-list-header">
          <div className="create-list-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1>Nueva Lista</h1>
          <p>Crea una nueva lista de tareas</p>
        </div>

        <form onSubmit={handleSubmit} className="create-list-form">
          <div className="form-group">
            <label htmlFor="title">Nombre de la lista</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Trabajo, Personal, Compras"
              disabled={loading}
              maxLength="50"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Lista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateList;