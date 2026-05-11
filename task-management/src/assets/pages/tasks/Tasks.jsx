import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTasks } from "../services/taskService";
import "./Tasks.css";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const statusLabels = {
    all: "Todas",
    pendiente: "Pendientes",
    "en curso": "En Progreso",
    finalizada: "Completadas"
  };

  const statusClass = (status) => `status-${status.replace(/ /g, "-")}`;

  // 🔐 Cargar tareas al montarse el componente
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

  // 🔍 Filtrar tareas por estado
  const filteredTasks = filterStatus === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  // 📊 Estadísticas
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pendiente").length,
    inProgress: tasks.filter(t => t.status === "en curso").length,
    completed: tasks.filter(t => t.status === "finalizada").length
  };

  return (
    <div className="tasks-container">
      {/* HEADER */}
      <div className="tasks-header">
        <div className="tasks-title">
          <h1>✓ Mis Tareas</h1>
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
          <span className="stat-icon">📋</span>
          <div className="stat-content">
            <p className="stat-label">Total</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <p className="stat-label">Pendientes</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔄</span>
          <div className="stat-content">
            <p className="stat-label">En Progreso</p>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-card completed">
          <span className="stat-icon">✅</span>
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
                      📅 Vence: {new Date(task.dueDate).toLocaleDateString("es-ES")}
                    </p>
                  )}
                  
                  <div className="task-actions">
                    <button 
                      className="task-btn edit-btn"
                      onClick={() => navigate(`/edit-task?id=${task._id || task.id}`)}
                    >
                      ✏️ Editar
                    </button>
                    <button className="task-btn delete-btn">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tasks;
