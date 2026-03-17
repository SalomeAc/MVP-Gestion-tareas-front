import "./Navbar.css"
import { Link } from "react-router-dom"

function Navbar() {

  const token = localStorage.getItem("token")

  return (
    <header>
      <nav id="menu">

        <div className="logo">
          <Link to="/">
            <img src="/lumo-dashboard.png" alt="Logo de Lumo" style={{ width: "12rem" }} />
          </Link>
        </div>

        <ul className="links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Sobre nosotros</Link></li>
          <li><Link to="/contact">Contáctanos</Link></li>
        </ul>

        <div className="login-btn" style={{ display: "flex", gap: "0.7em", alignItems: "center" }}>
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/user-profile">Ver perfil</Link>
              <Link to="/logout">Cerrar sesión</Link>
            </>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}
        </div>

      </nav>
    </header>
  )
}

export default Navbar