import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateTask, getAllTasks } from "../services/taskService";
import "./EditTask.css";

const EditTask = () => {
  const location = useLocation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    status: "unassigned"
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const taskId = new URLSearchParams(location.search).get("id");

  // 🔐 validaciones iniciales
  useEffect(() => {
    if (!token) {
      window.location.href = "/login/";
      return;
    }

    if (!taskId) {
      alert("Error: tarea o lista no encontrada");
      window.location.href = "/dashboard/";
      return;
    }

    loadTask();
  }, []);

  // 📦 cargar tarea
  const loadTask = async () => {
    try {
      const tasks = await getAllTasks(token);
      const task = tasks.find(t => (t._id || t.id) === taskId);

      if (!task) {
        alert("No se encontró la tarea");
        window.location.href = "/dashboard/";
        return;
      }

      let date = "";
      let time = "";

      if (task.dueDate) {
        const d = new Date(task.dueDate);
        date = d.toISOString().split("T")[0];
        time = d.toISOString().split("T")[1].substring(0, 5);
      }

      setForm({
        title: task.title || "",
        description: task.description || "",
        date,
        time,
        status: task.status || "por hacer"
      });

      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("Error cargando tarea");
    }
  };

  // ✏️ manejar cambios
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateTask(token, taskId, {
        title: form.title,
        description: form.description,
        dueDate:
          form.date && form.time
            ? `${form.date}T${form.time}`
            : null,
        status: form.status
      });

      alert("Tarea actualizada ✅");

      window.location.href = "/dashboard/";

    } catch (err) {
      console.error(err);
      alert("Error actualizando tarea ❌");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="modal-overlay">
      <div className="box">
        <div className="modal-window">

          <h2>Editar tarea</h2>

          <form onSubmit={handleSubmit}>

            <div className="row">
              <label>Título:</label>
              <input
                id="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Descripción:</label>
              <textarea
                id="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Fecha:</label>
              <input
                type="date"
                id="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <label>Hora:</label>
              <input
                type="time"
                id="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <label>Estado:</label>
              <select
                id="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pendiente">Por hacer</option>
                <option value="en curso">Haciendo</option>
                <option value="finalizada">Completada</option>
              </select>
            </div>

            <button type="submit">Guardar</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;