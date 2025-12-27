import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import '../styles/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Copyright del Gym */}
        <p className="copyright">
          © {currentYear} Entrenamiento Personal MF. Todos los derechos reservados.
        </p>

        {/* Tu firma de Desarrollador */}
        <div className="developer-credit">
          <p>Desarrollado por <span className="dev-name">Ivo Rossi</span></p>
          
          {/* Opcional: Tus iconos para que te contacten como Dev */}
          <div className="dev-socials">
             <a href="https://github.com/Ivorossi66" target="_blank" rel="noreferrer">
                <FaGithub />
             </a>
             <a href="https://linkedin.com/in/ivorossi" target="_blank" rel="noreferrer">
                <FaLinkedin />
             </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer