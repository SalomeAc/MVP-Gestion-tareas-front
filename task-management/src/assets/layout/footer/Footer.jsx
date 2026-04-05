import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* COLUMNA 1: INFORMACIÓN DE LA EMPRESA */}
        <div className="footer-col">
          <div className="footer-brand">
            <h3 className="footer-logo">Lumo</h3>
          </div>
          <p className="footer-tagline">Simplifica tu vida, gestiona tus tareas</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook" className="social-link">f</a>
            <a href="#" aria-label="Twitter" className="social-link">𝕏</a>
            <a href="#" aria-label="LinkedIn" className="social-link">in</a>
          </div>
        </div>

        {/* COLUMNA 2: NAVEGACIÓN */}
        <div className="footer-col">
          <h4>Navegación</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">Sobre nosotros</Link></li>
            <li><Link to="/contact">Contáctanos</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: SOPORTE */}
        <div className="footer-col">
          <h4>Soporte</h4>
          <ul className="footer-links">
            <li><a href="mailto:support@lumo.com">Ayuda</a></li>
            <li><a href="#faq">Preguntas frecuentes</a></li>
            <li><a href="#docs">Documentación</a></li>
            <li><a href="#status">Estado del servicio</a></li>
          </ul>
        </div>

        {/* COLUMNA 4: LEGAL */}
        <div className="footer-col">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy">Política de privacidad</a></li>
            <li><a href="#terms">Términos de servicio</a></li>
            <li><a href="#cookies">Política de cookies</a></li>
            <li><a href="#sitemap">Mapa del sitio</a></li>
          </ul>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} Lumo. Todos los derechos reservados.
          </p>
          <p className="footer-credit">
            Creado por <strong>JSquad</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;