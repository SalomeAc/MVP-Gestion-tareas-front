import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getUserProfile, 
  updateUserProfile, 
  deactivateUser
} from "../services/userServices";
import "./Profile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: ""
  });

  const handleAuthError = (err) => {
    const errorMessage = String(err?.message || "").toLowerCase();
    const isTokenError =
      errorMessage.includes("invalid token") ||
      errorMessage.includes("token") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403") ||
      errorMessage.includes("forbidden");

    if (!isTokenError) return false;

    localStorage.removeItem("token");
    navigate("/login", { replace: true });
    return true;
  };

  // Load user data on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const loadUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const data = await getUserProfile({ token });
        setUser(data);
        setEditForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          age: data.age || "",
          email: data.email || ""
        });
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Error cargando perfil:", err);
        setMessage("Error al cargar el perfil");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(() => setMessage(""), 3300);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!isDeactivateModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDeactivateModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeactivateModalOpen]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Basic validations
    if (!editForm.firstName.trim()) {
      setMessage("El nombre es requerido");
      setMessageType("error");
      return;
    }
    if (!editForm.lastName.trim()) {
      setMessage("El apellido es requerido");
      setMessageType("error");
      return;
    }
    if (!editForm.email.trim()) {
      setMessage("El email es requerido");
      setMessageType("error");
      return;
    }
    if (editForm.age && (editForm.age < 13 || editForm.age > 120)) {
      setMessage("La edad debe estar entre 13 y 120 años");
      setMessageType("error");
      return;
    }

    try {
      setIsLoading(true);
      const body = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        age: parseInt(editForm.age) || null,
        email: editForm.email
      };

      await updateUserProfile(body, token);
      
      // Update local state
      setUser({ ...user, ...body });
      setIsEditing(false);
      setMessage("Perfil actualizado con éxito");
      setMessageType("success");

    } catch (err) {
      if (handleAuthError(err)) return;
      console.error("Error al actualizar:", err);
      setMessage(err.message || "Error al actualizar el perfil");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Deactivate account (logical deletion)
  const handleDeactivateAccount = async () => {
    setIsDeactivateModalOpen(false);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const data = await getUserProfile({ token });
      const userId = data._id;

      await deactivateUser(userId, token);
      
      setMessage("Cuenta desactivada exitosamente");
      setMessageType("success");

      // Redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
      }, 2000);
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error("Error al desactivar cuenta:", err);
      setMessage(err.message || "Error al desactivar la cuenta");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <p>Error al cargar el perfil. Por favor, intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-shell">
        {/* HEADER DE PERFIL */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">U</span>
          </div>
          <div className="profile-header-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-member">Miembro desde 2025</p>
          </div>
        </div>

        {/* MENSAJES */}
        {message && (
          <div className="toast-container" role="status" aria-live="polite">
            <div className={`toast ${messageType === "success" ? "success" : "error"}`}>
              {message}
            </div>
          </div>
        )}

        {/* TABS DE PERFIL */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${!isEditing ? "active" : ""}`}
            onClick={() => setIsEditing(false)}
          >
            Ver Información
          </button>
          <button
            className={`tab-btn ${isEditing ? "active" : ""}`}
            onClick={() => setIsEditing(true)}
          >
            Editar Perfil
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {!isEditing ? (
        // VER INFORMACIÓN
          <div className="profile-view">
            <div className="info-list" role="list" aria-label="Informacion del usuario">
              <div className="info-row" role="listitem">
                <p className="info-label">Nombre</p>
                <p className="info-value">{user.firstName}</p>
              </div>
              <div className="info-row" role="listitem">
                <p className="info-label">Apellido</p>
                <p className="info-value">{user.lastName}</p>
              </div>
              <div className="info-row" role="listitem">
                <p className="info-label">Edad</p>
                <p className="info-value">{user.age || "No especificada"}</p>
              </div>
              <div className="info-row" role="listitem">
                <p className="info-label">Correo Electronico</p>
                <p className="info-value email-value">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
        // EDITAR INFORMACIÓN
          <form onSubmit={handleUpdateProfile} className="profile-edit">
          <div className="form-group">
            <label htmlFor="firstName">Nombre *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={editForm.firstName}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellido *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={editForm.lastName}
              onChange={handleChange}
              placeholder="Ingresa tu apellido"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Edad</label>
            <input
              type="number"
              id="age"
              name="age"
              value={editForm.age}
              onChange={handleChange}
              placeholder="Tu edad"
              min="13"
              max="120"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editForm.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  age: user.age,
                  email: user.email
                });
              }}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
          </form>
        )}

        {/* DANGER ZONE - DEACTIVATE ACCOUNT */}
        <div className="profile-danger-zone">
          <div className="danger-info">
            <h4>Desactivar cuenta</h4>
            <p>Una vez desactivada, tu cuenta no será visible pero tus datos se mantendrán en nuestro sistema.</p>
          </div>
          <button 
            className="btn-danger"
            onClick={() => setIsDeactivateModalOpen(true)}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Desactivar cuenta"}
          </button>
        </div>
      </div>

      {isDeactivateModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsDeactivateModalOpen(false)}
          role="presentation"
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-account-title"
            aria-describedby="deactivate-account-description"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="deactivate-account-title">Confirmar desactivacion de cuenta</h3>
            <p id="deactivate-account-description">
              Esta accion cerrara tu acceso a la plataforma y tu cuenta dejara de estar visible.
              Tus datos permaneceran almacenados segun la politica del sistema.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsDeactivateModalOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeactivateAccount}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Confirmar desactivacion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;