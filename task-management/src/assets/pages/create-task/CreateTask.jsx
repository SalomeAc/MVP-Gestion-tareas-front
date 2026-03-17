import { useEffect, useState } from "react";
import { createTask, getTasks } from "../services/taskService";
import "./create-task.css";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("unassigned");

  const [listId, setListId] = useState(null);

  // 🔐 Validaciones iniciales + obtener listId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login first.");
      window.location.href = "/login/";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id =
      params.get("listId") || localStorage.getItem("currentListId");

    if (!id) {
      alert("No se encontró la lista seleccionada.");
      window.location.href = "/dashboard/";
      return;
    }

    setListId(id);

    // 📦 cargar tareas (opcional)
    loadTasks(token, id);
  }, []);

  // 📦 función para cargar tareas
  const loadTasks = async (token, listId) => {
    try {
      await getTasks(token, listId);
    } catch (err) {
      console.error("Error cargando tareas:", err);
    }
  };

  // 📩 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await createTask(token, listId, {
        title,
        description,
        dueDate: date && time ? `${date}T${time}` : null,
        status,
      });

      window.location.href = "/dashboard/";
    } catch (err) {
      alert("Error creando tarea.");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="box">
        <div className="modal-window">
          
          <a href="/dashboard/" id="previous">
            <img src="/previous.png" alt="Previous Page" />
          </a>

          <h2>Crear nueva tarea</h2>

          <form onSubmit={handleSubmit}>
            
            <div className="row">
              <label>Título:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <label>Descripción:</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <label>Fecha:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <label>Hora:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <label>Estado:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="unassigned">Por hacer</option>
                <option value="ongoing">Haciendo</option>
                <option value="done">Completada</option>
              </select>
            </div>

            <button type="submit">Crear</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateTask;