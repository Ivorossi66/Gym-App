import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const location = useLocation(); // Nos dice la ruta actual
  const navigate = useNavigate(); 

  // Verificamos si estamos en la home
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/client') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [location]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setIsLogged(false);
    navigate('/');
  };

  // Función para scrollear
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src="./src/assets/img/image.png" alt="Logo" width="110px" />
      </div>

      {isHomePage && (
        <ul className="nav-links">
          <li onClick={() => scrollToSection('inicio')}>Inicio</li>
          <li onClick={() => scrollToSection('planes')}>Planes</li>
          <li onClick={() => scrollToSection('ubicacion')}>Ubicación</li>
          <li onClick={() => scrollToSection('gimnasio')}>Gimnasio</li>
          <li onClick={() => scrollToSection('contacto')}>Contacto</li>
        </ul>
      )}

      <div className="nav-buttons">
        {!isLogged ? (
          location.pathname !== '/login' && (
            <button onClick={handleLoginClick}>Iniciar Sesión</button>
          )
        ) : (
          <button onClick={handleLogoutClick}>Cerrar Sesión</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;