import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getUserLists,
  deleteList
} from "../services/listServices";
import {
  getTasks,
  deleteTask,
  updateTask
} from "../services/taskService";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "finalizada").length;
  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    loadLists(token);
  }, [navigate]);

  const loadLists = async (token) => {
    try {
      const data = await getUserLists(token);
      setLists(data);
      if (data.length > 0) {
        selectList(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectList = async (list) => {
    const token = localStorage.getItem("token");
    setCurrentList(list);
    try {
      const data = await getTasks(token, list._id || list.id);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteList = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("¿Eliminar esta lista?")) return;
    try {
      await deleteList(token, id);
      loadLists(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await deleteTask(token, id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await updateTask(token, taskId, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Sidebar con listas */}
        <aside className="dashboard-lists-panel">
          <div className="lists-header">
            <div className="lists-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Listas</h2>
          </div>

          <nav className="lists-nav">
            {lists.length === 0 ? (
              <div className="lists-empty">
                <p>No hay listas aún</p>
              </div>
            ) : (
              <ul className="lists-ul">
                {lists.map((list) => {
                  const listId = list._id || list.id;
                  const isActive = currentList && listId === (currentList._id || currentList.id);
                  return (
                    <li key={listId}>
                      <button
                        type="button"
                        className={`lists-item ${isActive ? "is-active" : ""}`}
                        onClick={() => selectList(list)}
                      >
                        <span className="lists-item-name">{list.title}</span>
                      </button>
                      <button
                        type="button"
                        className="lists-item-delete"
                        onClick={() => handleDeleteList(listId)}
                        aria-label={`Eliminar ${list.title}`}
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>

          <Link to="/create-list" className="dashboard-btn-primary">
            + Nueva lista
          </Link>
        </aside>

        {/* Main content */}
        <main className="dashboard-main-panel">
          {currentList ? (
            <>
              <div className="main-header">
                <div className="header-content">
                  <h1>{currentList.title}</h1>
                  <p className="header-subtitle">
                    {completedTasks} de {totalTasks} tareas completadas
                  </p>
                </div>
                <div className="progress-badge">
                  <div className="progress-circle">
                    <span className="progress-percent">{progressPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="main-actions">
                <Link
                  to={`/create-task?listId=${currentList._id || currentList.id}`}
                  className="dashboard-btn-secondary"
                >
                  + Nueva tarea
                </Link>
              </div>

              <div className="tasks-container">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3>No hay tareas</h3>
                    <p>Crea una nueva tarea para empezar</p>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {tasks.map((task) => (
                      <article key={task._id} className={`task-item task-status-${task.status}`}>
                        <div className="task-header">
                          <h3>{task.title}</h3>
                          <button
                            type="button"
                            className="task-delete-btn"
                            onClick={() => handleDeleteTask(task._id)}
                            aria-label={`Eliminar ${task.title}`}
                          >
                            ✕
                          </button>
                        </div>

                        <p className="task-description">{task.description}</p>

                        <label className="task-status-select">
                          <span>Estado</span>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          >
                            <option value="pendiente">Por hacer</option>
                            <option value="en curso">Haciendo</option>
                            <option value="finalizada">Completada</option>
                          </select>
                        </label>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h2>Selecciona una lista</h2>
              <p>Elige una lista para ver y editar sus tareas</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;