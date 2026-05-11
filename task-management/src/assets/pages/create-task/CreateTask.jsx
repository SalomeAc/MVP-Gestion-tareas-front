import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createTask } from "../services/taskService";
import { getUserLists } from "../services/listServices";
import "./CreateTask.css";

const CreateTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [listId, setListId] = useState(() => {
    // Obtener listId de parámetros de URL si viene del Dashboard
    return searchParams.get("listId") || "";
  });
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔐 Validación de token y cargar listas
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Cargar listas disponibles
    const loadLists = async () => {
      try {
        const userLists = await getUserLists(token);
        setLists(userLists || []);
      } catch (err) {
        console.error("Error cargando listas:", err);
      }
    };

    loadLists();
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
      await createTask(token, listId || null, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        status,
      });
      navigate("/tasks");
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

          {/* Lista */}
          <div className="form-group">
            <label htmlFor="listId">Lista (Opcional)</label>
            <select
              id="listId"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
            >
              <option value="">Sin asignar</option>
              {lists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.title}
                </option>
              ))}
            </select>
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