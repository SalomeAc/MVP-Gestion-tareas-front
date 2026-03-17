import { useEffect, useState } from "react";
import { getUserProfile, deleteUserProfile } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // 🚀 cargar perfil
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const data = await getUserProfile({ token });
        setUser(data);

      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    loadUser();
  }, []);

  // 🗑 eliminar perfil
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar tu perfil?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await deleteUserProfile({ token });

      localStorage.removeItem("token");

      alert("Perfil eliminado");
      navigate("/");

    } catch (err) {
      alert("Error al eliminar perfil");
    }
  };

  return (
    <div className="profile-main">

      <h1>Configuración de mi perfil</h1>

      {error && <p>Error cargando perfil</p>}

      {user && (
        <div className="profile-content">

          <div>
            <strong>Nombre:</strong>
            <p>{user.firstName} {user.lastName}</p>
          </div>

          <div>
            <strong>Edad:</strong>
            <p>{user.age}</p>
          </div>

          <div>
            <strong>Correo:</strong>
            <p>{user.email}</p>
          </div>

          <hr />

          <button onClick={() => navigate("/edit-profile")}>
            Editar perfil
          </button>

          <button onClick={handleDelete} style={{ color: "red" }}>
            Eliminar perfil
          </button>

        </div>
      )}
    </div>
  );
};

export default UserProfile;