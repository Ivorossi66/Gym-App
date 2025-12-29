import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import '../styles/Footer.css'

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            {/* Lado Izquierdo: Copyright */}
            <div className="footer-section left">
                <p>© {currentYear} Entrenamiento Personal MF. Todos los derechos reservados.</p>
            </div>

            {/* Lado Derecho: Texto + Iconos debajo */}
            <div className="footer-section right">
                <p className="developer-text">Desarrollado por <strong>Ivo Rossi</strong></p>
                
                <div className="social-icons">
                    <a href="https://github.com/Ivorossi66" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={22} />
                    </a>
                    <a href="https://www.linkedin.com/in/ivorossi" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={22} />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer