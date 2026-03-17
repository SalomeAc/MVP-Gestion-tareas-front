import { useEffect, useState } from "react";
import {
  getUserLists,
  deleteList
} from "../services/listService";
import {
  getTasks,
  deleteTask
} from "../services/taskService";
import "./dashboard.css";

const Dashboard = () => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentList, setCurrentList] = useState(null);

  // 🔐 cargar todo al inicio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login/";
      return;
    }

    loadLists(token);
  }, []);

  // 📦 cargar listas
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

  // 📦 seleccionar lista
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

  // ❌ eliminar lista
  const handleDeleteList = async (id) => {
    const token = localStorage.getItem("token");

    if (!confirm("¿Eliminar lista?")) return;

    try {
      await deleteList(token, id);
      loadLists(token);
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ eliminar tarea
  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    if (!confirm("¿Eliminar tarea?")) return;

    try {
      await deleteTask(token, id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
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

        <button onClick={() => window.location.href = "/create-list/"}>
          + Nueva lista
        </button>

      </aside>

      {/* MAIN */}
      <main>

        <h1>
          {currentList ? currentList.title : "Selecciona una lista"}
        </h1>

        <button
          onClick={() => {
            if (!currentList) {
              alert("Selecciona una lista primero");
              return;
            }
            window.location.href = `/create-task/?listId=${currentList._id}`;
          }}
        >
          + Nueva tarea
        </button>

        <div className="tasks-grid">
          {tasks.length === 0 ? (
            <p>No hay tareas</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="task">

                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <button onClick={() => handleDeleteTask(task._id)}>
                  🗑️
                </button>

              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;