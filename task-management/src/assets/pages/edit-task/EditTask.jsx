import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateTask, getAllTasks } from "../services/taskService";
import "./EditTask.css";

const EditTask = () => {
  const location = useLocation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pendiente"
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const taskId = new URLSearchParams(location.search).get("id");

  // 🔐 validaciones iniciales
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login/";
      return;
    }

    if (!taskId) {
      alert("Error: tarea o lista no encontrada");
      window.location.href = "/dashboard/";
      return;
    }

    loadData(token);
  }, [navigate, taskId]);

  const loadData = async (token) => {
    try {
      const tasks = await getAllTasks(token);
      const task = tasks.find(t => (t._id || t.id) === taskId);

      if (!task) {
        console.error("Tarea no encontrada. ID buscado:", taskId);
        console.error("Tareas disponibles:", allTasks);
        setError("Tarea no encontrada");
        return;
      }

      // Formatear la fecha si existe
      let dueDate = "";
      if (task.dueDate) {
        const d = new Date(task.dueDate);
        dueDate = d.toISOString().split("T")[0];
      }

      setForm({
        title: task.title || "",
        description: task.description || "",
        dueDate,
        status: task.status || "pendiente"
      });
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error cargando la tarea: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      setError("El título es requerido");
      return;
    }

    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    setError("");

    try {
      const taskData = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status
      };

      alert("Tarea actualizada ✅");

      window.location.href = "/dashboard/";

      await updateTask(token, taskId, taskData);
      navigate("/tasks", { replace: true });
    } catch (err) {
      console.error("Error actualizando tarea:", err);
      setError(err.message || "Error actualizando la tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-task-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando tarea...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-task-container">
      <div className="edit-task-wrapper">
        <div className="edit-task-header">
          <h1>Editar Tarea</h1>
          <p>Modifica los detalles de tu tarea</p>
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ingresa el título de la tarea"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Añade una descripción detallada (opcional)"
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Fecha de vencimiento</label>
              <input
                type="date"
                id="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en curso">En Progreso</option>
                <option value="finalizada">Completada</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;