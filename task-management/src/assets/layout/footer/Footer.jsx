import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Columna 1: Marca */}
        <div className="footer-col">
          <h3 className="footer-logo">Gestión Tareas</h3>
          <p className="footer-tagline">
            Organiza tu trabajo de forma simple y eficiente
          </p>
        </div>

        {/* Columna 2: Páginas */}
        <div className="footer-col">
          <h4>Páginas</h4>
          <ul className="footer-links">
            <li>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/about" style={{ color: "inherit", textDecoration: "none" }}>
                Acerca de
              </Link>
            </li>
            <li>
              <Link to="/contact" style={{ color: "inherit", textDecoration: "none" }}>
                Contacto
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer bottom: copyright */}
      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} Gestión de Tareas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;