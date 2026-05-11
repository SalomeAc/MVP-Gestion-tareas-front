import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTasks, deleteTask, updateTask } from "../services/taskService";
import "./Tasks.css";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [modal, setModal] = useState({ isOpen: false, id: null, name: "" });

  const statusLabels = {
    all: "Todas",
    pendiente: "Pendientes",
    "en curso": "En Progreso",
    finalizada: "Completadas"
  };

  const statusClass = (status) => `status-${status.replace(/ /g, "-")}`;

  
  useEffect(() => {
    const loadTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        // Obtener tareas del usuario
        const data = await getAllTasks(token);
        setTasks(data || []);
      } catch (err) {
        console.error("Error cargando tareas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [navigate]);

 
  const filteredTasks = filterStatus === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

 
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pendiente").length,
    inProgress: tasks.filter(t => t.status === "en curso").length,
    completed: tasks.filter(t => t.status === "finalizada").length
  };

  const handleDeleteTask = (id, name) => {
    setModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await deleteTask(token, modal.id);
      setTasks(tasks.filter(t => t._id !== modal.id));
      setModal({ isOpen: false, id: null, name: "" });
    } catch (err) {
      console.error("Error eliminando tarea:", err);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, id: null, name: "" });
  };

  return (
    <div className="tasks-container">
      {/* HEADER */}
      <div className="tasks-header">
        <div className="tasks-title">
          <h1> Mis Tareas</h1>
          <p>Gestiona y organiza tus tareas de forma eficiente</p>
        </div>
        <button 
          className="btn-create-task"
          onClick={() => navigate("/create-task")}
        >
          + Nueva Tarea
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="tasks-stats">
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Total</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Pendientes</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">En Progreso</p>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-content">
            <p className="stat-label">Completadas</p>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="tasks-filters">
        {['all', 'pendiente', 'en curso', 'finalizada'].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filterStatus === status ? "active" : ""}`}
            onClick={() => setFilterStatus(status)}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      {isLoading ? (
        <div className="tasks-loading">
          <div className="spinner"></div>
          <p>Cargando tareas...</p>
        </div>
      ) : (
        <>
          {filteredTasks.length === 0 ? (
            <div className="tasks-empty">
              <div className="empty-icon">📭</div>
              <h3>No hay tareas</h3>
              <p>
                {filterStatus === "all"
                  ? "Comienza creando tu primera tarea"
                  : `No hay tareas ${filterStatus === "finalizada" ? "finalizadas" : "en este estado"}`}
              </p>
              <button 
                className="btn-create-primary"
                onClick={() => navigate("/create-task")}
              >
                Crear Primera Tarea
              </button>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <div key={task._id || task.id} className="task-card">
                  <div className="task-header">
                    <h4 className="task-title">{task.title}</h4>
                    <span className={`task-status ${statusClass(task.status)}`}>
                      {task.status === "pendiente" && "Pendiente"}
                      {task.status === "en curso" && "En Progreso"}
                      {task.status === "finalizada" && "Completada"}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  
                  {task.dueDate && (
                    <p className="task-due-date">
                      Vence: {new Date(task.dueDate).toLocaleDateString("es-ES")}
                    </p>
                  )}
                  
                  <div className="task-actions">
                    <button 
                      className="task-btn edit-btn"
                      onClick={() => navigate(`/edit-task/${task._id || task.id}`)}
                    >
                      Editar
                    </button>
                    <button 
                      className="task-btn delete-btn"
                      onClick={() => handleDeleteTask(task._id, task.title)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="modal-title">¿Eliminar tarea?</h2>
            <p className="modal-text">
              ¿Realmente quieres eliminar <strong>"{modal.name}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-delete"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
