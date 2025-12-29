import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importamos los iconos
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Nuevo estado para el menú móvil
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  // Cerrar el menú si cambiamos de ruta (por si acaso)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/client') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsOpen(false); // Cerrar menú al ir a login
  };

  const handleLogoutClick = () => {
    setIsLogged(false);
    navigate('/');
    setIsOpen(false);
  };

  // Función modificada para cerrar el menú al hacer click
  const handleScrollAndClose = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // ¡Aquí se cierra el menú!
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
           {/* Asegúrate que la ruta de la imagen sea correcta en tu proyecto */}
           <img src="./src/assets/img/image.png" alt="Logo" width="110px" />
        </div>

        {/* ICONO HAMBURGUESA (Solo visible en móvil) */}
        {isHomePage && (
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        )}

        {/* ENLACES (Clase dinámica: si isOpen es true, agrega 'active') */}
        {isHomePage && (
          <ul className={isOpen ? "nav-links active" : "nav-links"}>
            <li onClick={() => handleScrollAndClose('inicio')}>Inicio</li>
            <li onClick={() => handleScrollAndClose('planes')}>Planes</li>
            <li onClick={() => handleScrollAndClose('ubicacion')}>Ubicación</li>
            <li onClick={() => handleScrollAndClose('gimnasio')}>Gimnasio</li>
            <li onClick={() => handleScrollAndClose('contacto')}>Contacto</li>
            
            {/* En móvil, a veces queda mejor poner el botón de Login DENTRO del menú 
               para que no ocupe espacio arriba. Lo agregamos aquí solo para móvil.
            */}
            <li className="mobile-login-btn">
               {!isLogged ? (
                  location.pathname !== '/login' && (
                    <button onClick={handleLoginClick} className="btn-nav-mobile">Iniciar Sesión</button>
                  )
                ) : (
                  <button onClick={handleLogoutClick} className="btn-nav-mobile">Cerrar Sesión</button>
                )}
            </li>
          </ul>
        )}

        {/* BOTONES DESKTOP (Ocultos en móvil para limpiar la barra) */}
        <div className="nav-buttons desktop-only">
          {!isLogged ? (
            location.pathname !== '/login' && (
              <button onClick={handleLoginClick}>Iniciar Sesión</button>
            )
          ) : (
            <button onClick={handleLogoutClick}>Cerrar Sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;