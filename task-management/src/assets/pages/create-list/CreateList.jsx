import { useEffect, useState } from "react";
import { createList } from "../services/listService";
import "./create-list.css";

const CreateList = () => {
  const [title, setTitle] = useState("");

  // 🔐 Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login first.");
      window.location.href = "/login/";
    }
  }, []);

  // 📩 Manejar submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!title.trim()) return;

    try {
      await createList(title, token);
      window.location.href = "/dashboard/";
    } catch (error) {
      alert("Error creando lista.");
      console.error(error);
    }
  };

  return (
    <div id="modal-overlay" className="modal-overlay">
      <div className="box">
        <div className="modal-window">
          
          <a href="/dashboard/" id="previous">
            <img src="/previous.png" alt="Previous Page" />
          </a>

          <h2>Crear nueva lista</h2>

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

            <button type="submit">Crear</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateList;