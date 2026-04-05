import { useEffect, useState } from "react";
import {
  updateUserProfile,
  getUserProfile
} from "../services/userServices";
import "./EditProfile.css";

const EditProfile = () => {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: ""
  });

  const [user, setUser] = useState(null);

  // 🔐 cargar datos al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login/";
        return;
      }

      try {
        const data = await getUserProfile({ token });

        setUser(data);

        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          age: data.age || "",
          email: data.email || ""
        });

      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

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

    const token = localStorage.getItem("token");

    const body = {};
    if (form.firstName) body.firstName = form.firstName;
    if (form.lastName) body.lastName = form.lastName;
    if (form.age) body.age = parseInt(form.age);
    if (form.email) body.email = form.email;

    try {
      await updateUserProfile(body, token);
      alert("Perfil actualizado con éxito ✅");
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar perfil");
    }
  };

  return (
    <div className="update-content">

      {/* HEADER */}
      <header className="update-header">
        <h2>Cambie su información de perfil</h2>

        <div className="header-info">
          <p className="header-name">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="header-email">
            {user?.email}
          </p>
        </div>
      </header>

      {/* FORM */}
      <form className="update-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Nombre</label>
          <input
            id="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Apellidos</label>
          <input
            id="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Edad</label>
          <input
            type="number"
            id="age"
            value={form.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="update-btn">
          Actualizar
        </button>

      </form>
    </div>
  );
};

export default EditProfile;