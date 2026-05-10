import { useEffect, useState } from "react";
import { getUserLists } from "../services/listService";
import { getUserProfile } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);
  const [openLists, setOpenLists] = useState(false);

  const navigate = useNavigate();

  // 🚀 cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await getUserProfile({ token });
        const listsData = await getUserLists(token);

        setUser(userData);
        setLists(listsData);

      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  // 👉 seleccionar lista
  const handleSelectList = (list) => {
    localStorage.setItem("currentListId", list._id);
    localStorage.setItem("currentListTitle", list.title);
    navigate("/dashboard");
  };

  return (
    <aside className="sidebar">

      {/* 👤 usuario */}
      <div className="user-block">
        <div className="user-info">
          <div>Bienvenido/a,</div>
          <div>{user ? `${user.firstName} ${user.lastName}` : "..."}</div>

          <div style={{ marginTop: "1rem" }}>Última actividad:</div>
          <div>
            {new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* 📋 kanban */}
      <div className="lists-title">Kanban</div>
      <ul>
        <li><button onClick={() => navigate("/dashboard")}>Por hacer</button></li>
        <li><button onClick={() => navigate("/dashboard")}>Haciendo</button></li>
        <li><button onClick={() => navigate("/dashboard")}>Completadas</button></li>
      </ul>

      {/* 📂 listas */}
      <button onClick={() => setOpenLists(!openLists)}>
        Listas
      </button>

      {openLists && (
        <ul>
          {lists.length === 0 ? (
            <li>No hay listas</li>
          ) : (
            lists.map((list) => (
              <li key={list._id}>
                <button onClick={() => handleSelectList(list)}>
                  {list.title}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {/* ➕ crear lista */}
      <button onClick={() => navigate("/create-list")}>
        Crear nueva lista
      </button>

    </aside>
  );
};

export default Sidebar;