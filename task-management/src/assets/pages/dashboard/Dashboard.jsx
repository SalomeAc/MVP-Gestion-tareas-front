import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getUserLists,
  deleteList,
  updateList
} from "../services/listServices";
import {
  getAllTasks,
  deleteTask,
  updateTask
} from "../services/taskService";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentList, setCurrentList] = useState(null);
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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "finalizada").length;
  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // cargar listas
  const loadLists = async (token) => {
    try {
      const data = await getUserLists(token);
      setLists(data);
      if (data.length > 0) {
        setCurrentList(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectList = async (list) => {
    setCurrentList(list);
  };

  //cargar todo al inicio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadInitialData = async () => {
      try {
        const [listData, taskData] = await Promise.all([
          getUserLists(token),
          getAllTasks(token),
        ]);

        setLists(listData);
        setTasks(taskData || []);

        if (listData.length > 0) {
          setCurrentList(listData[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadInitialData();
  }, [navigate]);

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

  const statusLabel = {
    pendiente: "Por hacer",
    "en curso": "En curso",
    finalizada: "Completada",
  };

  return (
    <div className="app">
      
      {/* SIDEBAR */}
      <aside className="sidebar">

        <h3>Listas</h3>

        <ul>
          {lists.map((list) => (
            <li key={list._id || list.id}>
              <button onClick={() => selectList(list)}>
                {list.title}
              </button>

              <button onClick={() => handleDeleteList(list._id)}>
                🗑️
              </button>
            </li>
          ))}
        </ul>

        <button onClick={() => navigate("/create-list")}>
          + Nueva lista
        </button>

      </aside>

      {/* MAIN */}
      <main>

        <h1>
          {currentList ? currentList.title : "Selecciona una lista"}
        </h1>

        {currentList && (
          <p>
            Progreso: {completedTasks}/{totalTasks} tareas completadas ({progressPercent}%)
          </p>
        )}

        <button
          onClick={() => {
            navigate(currentList ? `/create-task?listId=${currentList._id}` : "/create-task");
          }}
        >
          + Nueva tarea
        </button>

        {tasks.length === 0 ? (
          <div className="kanban-empty-state">
            <p>No hay tareas</p>
          </div>
        ) : (
          <section className="kanban-board" aria-label="Tablero kanban de tareas">
            {kanbanColumns.map((column) => (
              <article key={column.key} className="kanban-column">
                <header className="kanban-column-header">
                  <div>
                    <span>{column.label}</span>
                    <p>{column.hint}</p>
                  </div>
                  <strong>{tasksByStatus[column.key].length}</strong>
                </header>

                <div className="kanban-cards">
                  {tasksByStatus[column.key].length === 0 ? (
                    <div className="kanban-empty-column">Sin tareas</div>
                  ) : (
                    tasksByStatus[column.key].map((task) => (
                      <div key={task._id || task.id} className="kanban-card">
                        <div className="kanban-card-actions">
                          <button
                            className="kanban-edit"
                            onClick={() => navigate(`/edit-task?id=${task._id || task.id}`)}
                          >
                            ✏️
                          </button>
                          <button
                            className="kanban-delete"
                            onClick={() => handleDeleteTask(task._id || task.id)}
                          >
                            🗑️
                          </button>
                        </div>

                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                        {task.dueDate && (
                          <div className="kanban-meta">
                            📅 {new Date(task.dueDate).toLocaleDateString("es-ES")}
                          </div>
                        )}

                        <label className="kanban-status-picker">
                          <span>Estado</span>
                          <select
                            value={task.status || "pendiente"}
                            onChange={(e) => handleStatusChange(task._id || task.id, e.target.value)}
                          >
                            <option value="pendiente">Por hacer</option>
                            <option value="en curso">En progreso</option>
                            <option value="finalizada">Completada</option>
                          </select>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
