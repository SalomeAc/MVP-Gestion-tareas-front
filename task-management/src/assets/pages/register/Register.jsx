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
    <div className="register-screen">

      <button
        type="button"
        className="register-back-btn"
        onClick={() => navigate("/")}
        aria-label="Volver"
      >
        ↩ 
      </button>

      {loading && (
        <div className="spinner-overlay">
          <p>Registrando...</p>
        </div>
      )}

      <section className="register-mobile-card">

        <div className="register-header">
          <div className="register-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 8C15 10.2091 13.2091 12 11 12C8.79086 12 7 10.2091 7 8C7 5.79086 8.79086 4 11 4C13.2091 4 15 5.79086 15 8Z" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20C4 16.6863 6.68629 14 10 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 10V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 13H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2>Crea una cuenta</h2>
          <p>Regístrate para comenzar</p>
        </div>

        {message && <div className={`register-message ${error ? "is-error" : "is-success"}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="register-form">

          <input className="register-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

          <div className="register-grid-2">
            <input className="register-input" name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} />
            <input className="register-input" name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} />
          </div>

          <input className="register-input" name="age" type="number" placeholder="Edad" value={form.age} onChange={handleChange} />
          <input className="register-input" name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
          <input className="register-input" name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} />

          <button className="register-submit-btn" type="submit">Register</button>

        </form>

      </section>
    </div>
  );
};

export default Register;