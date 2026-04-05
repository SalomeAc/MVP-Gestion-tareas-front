import "./Header.css"
import { Link } from "react-router-dom"
import { useState } from "react"

function Navbar() {
  const token = localStorage.getItem("token")
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
            <span className="logo-text">Lumo</span>
          </Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        {token ? (
          <div className={`navbar-nav authenticated ${menuOpen ? "open" : ""}`}>
            <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/tasks" className="nav-link" onClick={() => setMenuOpen(false)}>
              Tareas
            </Link>
            <Link to="/user-profile" className="nav-link" onClick={() => setMenuOpen(false)}>
              Perfil
            </Link>
            <Link to="/logout" className="nav-link logout-btn" onClick={() => setMenuOpen(false)}>
              Cerrar sesion
            </Link>
          </div>
        ) : (
          <div className={`navbar-nav unauthenticated ${menuOpen ? "open" : ""}`}>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              Iniciar sesion
            </Link>
            <Link to="/register" className="nav-link register" onClick={() => setMenuOpen(false)}>
              Registro
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
