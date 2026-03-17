import { useState, useEffect } from "react";
import { registerUser } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🚫 evitar registro si ya está logeado
  useEffect(() => {
    if (localStorage.getItem("token")) {
      alert("Ya tienes una sesión activa.");
      navigate("/dashboard");
    }
  }, []);

  // ✏️ manejar cambios
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ validaciones
  const validateFields = () => {
    const { firstName, lastName, age, email, password, confirmPassword } = form;

    if (!firstName) return "El nombre es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(firstName))
      return "El nombre solo puede contener letras.";
    if (firstName.length > 10) return "Máximo 10 caracteres.";

    if (!lastName) return "El apellido es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(lastName))
      return "El apellido solo letras.";
    if (lastName.length > 10) return "Máximo 10 caracteres.";

    if (!age) return "La edad es obligatoria.";
    if (age < 13 || age > 112) return "Edad entre 13 y 112.";

    if (!email) return "Correo obligatorio.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return "Correo inválido.";

    if (!password) return "Contraseña obligatoria.";

    let errores = [];
    if (password.length < 8) errores.push("8 caracteres");
    if (!/[A-Z]/.test(password)) errores.push("mayúscula");
    if (!/[a-z]/.test(password)) errores.push("minúscula");
    if (!/\d/.test(password)) errores.push("número");
    if (!/[^\w\s]/.test(password)) errores.push("especial");

    if (errores.length)
      return "La contraseña debe tener: " + errores.join(", ");

    if (password !== confirmPassword)
      return "Las contraseñas no coinciden.";

    return null;
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateFields();
    if (errorMsg) {
      setMessage(errorMsg);
      setError(true);
      return;
    }

    setLoading(true);

    try {
      await registerUser(form);

      setMessage("¡Registrado exitosamente!");
      setError(false);

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (err) {
      setMessage(err.message || "Error del servidor");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-layout">

      {loading && (
        <div className="spinner-overlay">
          <p>Registrando...</p>
        </div>
      )}

      <section className="card register-card">

        <h2>Crea una cuenta</h2>

        {message && (
          <div style={{ color: error ? "red" : "green" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input name="firstName" placeholder="Nombre" onChange={handleChange} />
          <input name="lastName" placeholder="Apellido" onChange={handleChange} />
          <input name="age" type="number" placeholder="Edad" onChange={handleChange} />
          <input name="email" type="email" placeholder="Correo" onChange={handleChange} />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" onChange={handleChange} />

          <button type="submit">Registrarse</button>

        </form>

      </section>
    </div>
  );
};

export default Register;