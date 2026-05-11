import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTask } from "../services/taskService";
import "./CreateTask.css";

const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const listId = new URLSearchParams(location.search).get("listId");

  // 🔐 Validación de token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 📝 Validar formulario
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "El título es obligatorio.";
    } else if (title.length > 100) {
      newErrors.title = "El título no puede exceder 100 caracteres.";
    }
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = "La fecha límite no puede ser en el pasado.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📩 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    setLoading(true);
    setErrors({});

    try {
      await createTask(token, listId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        status,
      });
      navigate(listId ? "/dashboard" : "/tasks");
    } catch (err) {
      setErrors({ submit: "Error creando la tarea. Inténtalo de nuevo." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <div className="create-task-wrapper">
        <div className="create-task-header">
          <h1>+ Crear Tarea</h1>
          <button 
            type="button"
            className="btn-back"
            onClick={() => navigate("/tasks")}
          >
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-task-form">
          {/* Título */}
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="100"
              placeholder="Ingresa el título de la tarea"
              className={errors.title ? "input-error" : ""}
            />
            <div className="char-count">{title.length}/100</div>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los detalles de la tarea (opcional)"
            />
          </div>

          {/* Fecha Límite */}
          <div className="form-group">
            <label htmlFor="dueDate">Fecha Límite</label>
            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className={errors.dueDate ? "input-error" : ""}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          {/* Estado */}
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en curso">En Progreso</option>
              <option value="finalizada">Completada</option>
            </select>
          </div>

          {/* Errores */}
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          {/* Botones */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creando..." : "Crear Tarea"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;