import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getUserLists,
  deleteList,
  updateList
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
  const [viewMode, setViewMode] = useState("list");
  const [modal, setModal] = useState({ isOpen: false, type: null, id: null, name: "", mode: null, editInputValue: "" });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "finalizada").length;
  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const kanbanColumns = [
    { key: "pendiente", label: "Por hacer", hint: "Tareas pendientes" },
    { key: "en curso", label: "En progreso", hint: "Tareas en ejecución" },
    { key: "finalizada", label: "Completadas", hint: "Tareas terminadas" },
  ];

  const tasksByStatus = kanbanColumns.reduce((accumulator, column) => {
    accumulator[column.key] = tasks.filter(
      (task) => (task.status || "pendiente") === column.key,
    );
    return accumulator;
  }, {});

  const selectList = useCallback(async (list) => {
    const token = localStorage.getItem("token");
    setCurrentList(list);
    try {
      const data = await getTasks(token, list._id || list.id);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadLists = useCallback(async (token) => {
    try {
      const data = await getUserLists(token);
      setLists(data);
      if (data.length > 0) {
        selectList(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectList]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    loadLists(token);
  }, [navigate, loadLists]);

  const handleDeleteList = (id, name) => {
    setModal({ isOpen: true, type: "list", id, name, mode: "delete", editInputValue: "" });
  };

  const handleEditList = (id, name) => {
    setModal({ isOpen: true, type: "list", id, name, mode: "edit", editInputValue: name });
  };

  const handleDeleteTask = (id, name) => {
    setModal({ isOpen: true, type: "task", id, name, mode: "delete", editInputValue: "" });
  };

  const confirmDelete = async () => {
    const { type, id } = modal;
    const token = localStorage.getItem("token");
    
    try {
      if (type === "list") {
        await deleteList(token, id);
        loadLists(token);
      } else if (type === "task") {
        await deleteTask(token, id);
        setTasks(tasks.filter(t => t._id !== id));
      }
      setModal({ isOpen: false, type: null, id: null, name: "", mode: null, editInputValue: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const confirmEdit = async () => {
    const { type, id, editInputValue } = modal;
    const token = localStorage.getItem("token");
    
    if (!editInputValue.trim()) {
      console.error("El nombre de la lista no puede estar vacío");
      return;
    }
    
    try {
      if (type === "list") {
        await updateList(token, id, editInputValue);
        loadLists(token);
      }
      setModal({ isOpen: false, type: null, id: null, name: "", mode: null, editInputValue: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, id: null, name: "", mode: null, editInputValue: "" });
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
                    <li key={listId} className="lists-li">
                      <button
                        type="button"
                        className={`lists-item ${isActive ? "is-active" : ""}`}
                        onClick={() => selectList(list)}
                      >
                        <span className="lists-item-name">{list.title}</span>
                      </button>
                      <div className="lists-item-buttons">
                        <button
                          type="button"
                          className="lists-item-edit"
                          onClick={() => handleEditList(listId, list.title)}
                          aria-label={`Editar ${list.title}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="lists-item-delete"
                          onClick={() => handleDeleteList(listId, list.title)}
                          aria-label={`Eliminar ${list.title}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
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
                  />
                </div>
              </div>

              <div className="main-actions">
                <Link
                  to={`/create-task?listId=${currentList._id || currentList.id}`}
                  className="dashboard-btn-secondary"
                >
                  + Nueva tarea
                </Link>
                <div className="view-mode-toggle">
                  <button
                    type="button"
                    className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="Vista de lista"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`view-mode-btn ${viewMode === "kanban" ? "active" : ""}`}
                    onClick={() => setViewMode("kanban")}
                    title="Vista kanban"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="9" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="15" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="tasks-container">
                {viewMode === "list" ? (
                  <div className="tasks-list-container">
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
                      tasks.map((task) => (
                        <div key={task._id} className={`task-row task-status-${task.status.replace(" ", "-")}`}>
                          <span className={`status-dot dot-${task.status.replace(" ", "-")}`} />

                          <div className="task-info">
                            <p className="task-name">{task.title}</p>
                            {task.description && (
                              <p className="task-description">{task.description}</p>
                            )}
                          </div>

                          <select
                            className={`task-status-badge badge-${task.status.replace(" ", "-")}`}
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          >
                            <option value="pendiente">Por hacer</option>
                            <option value="en curso">En curso</option>
                            <option value="finalizada">Completada</option>
                          </select>

                          <div className="task-actions">
                            <Link
                              to={`/edit-task/${task._id}`}
                              className="task-icon-btn task-edit-btn"
                              aria-label={`Editar ${task.title}`}
                            >
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Link>
                            <button
                              type="button"
                              className="task-icon-btn task-delete-btn"
                              onClick={() => handleDeleteTask(task._id, task.title)}
                              aria-label={`Eliminar ${task.title}`}
                            >
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="kanban-board">
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
                      kanbanColumns.map((column) => (
                        <div key={column.key} className="kanban-column">
                          <div className="kanban-column-header">
                            <div className="kanban-column-info">
                              <span className="kanban-column-label">{column.label}</span>
                              <p className="kanban-column-hint">{column.hint}</p>
                            </div>
                            <strong className="kanban-column-count">{tasksByStatus[column.key].length}</strong>
                          </div>

                          <div className="kanban-cards">
                            {tasksByStatus[column.key].length === 0 ? (
                              <div className="kanban-empty-column">Sin tareas</div>
                            ) : (
                              tasksByStatus[column.key].map((task) => (
                                <div key={task._id} className={`kanban-card kanban-card-${task.status.replace(" ", "-")}`}>
                                  <div className="kanban-card-header">
                                    <h4 className="kanban-card-title">{task.title}</h4>
                                    <div className="kanban-card-actions">
                                      <Link
                                        to={`/edit-task/${task._id}`}
                                        className="kanban-action-btn kanban-edit"
                                        aria-label={`Editar ${task.title}`}
                                      >
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </Link>
                                      <button
                                        type="button"
                                        className="kanban-action-btn kanban-delete"
                                        onClick={() => handleDeleteTask(task._id, task.title)}
                                        aria-label={`Eliminar ${task.title}`}
                                      >
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  {task.description && (
                                    <p className="kanban-card-description">{task.description}</p>
                                  )}
                                  <div className="kanban-card-status">
                                    <span className={`kanban-status-badge badge-${task.status.replace(" ", "-")}`}>
                                      {task.status === "pendiente" && "Por hacer"}
                                      {task.status === "en curso" && "En progreso"}
                                      {task.status === "finalizada" && "Completada"}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))
                    )}
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
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal.mode === "edit" ? (
              <>
                <div className="modal-icon edit-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="modal-title">Editar nombre de lista</h2>
                <div className="modal-form">
                  <input
                    type="text"
                    className="modal-input"
                    value={modal.editInputValue}
                    onChange={(e) => setModal({ ...modal, editInputValue: e.target.value })}
                    placeholder="Nuevo nombre de la lista"
                  />
                </div>
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
                    className="modal-btn modal-btn-save"
                    onClick={confirmEdit}
                  >
                    Guardar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h12zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="modal-title">
                  ¿Eliminar {modal.type === "list" ? "lista" : "tarea"}?
                </h2>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
    
  );
};

export default Dashboard;
