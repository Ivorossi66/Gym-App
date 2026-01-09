import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css'; // Importamos el CSS nuevo

export const ForgotPassword = () => {
  const [username, setUsername] = useState('');

  // --- CONFIGURACIÓN ---
  const PHONE_NUMBER = "5493531234567"; // <--- ¡PON TU NÚMERO ACÁ! (Ej: 549...)

  const handleWhatsApp = (e) => {
    e.preventDefault();
    
    // Si no escribieron nada, ponemos "un usuario" genérico
    const usuario = username.trim() || "un usuario";
    
    // Mensaje pre-armado
    const text = `Hola Soporte, soy "${usuario}" y me olvidé mi contraseña. ¿Me podrías generar una nueva?`;
    
    // Crear link de WhatsApp
    const url = `https://wa.me/${5493533459814}?text=${encodeURIComponent(text)}`;
    
    // Abrir en nueva pestaña
    window.open(url, '_blank');
  };

  return (
    <div className="forgot-simple-container">
      <div className="forgot-card">
        
        {/* Icono de candado o logo */}
        <span className="forgot-icon">🔒</span>
        
        <h2 className="forgot-title">Recuperar Clave</h2>
        <p className="forgot-subtitle">
            Como las cuentas son gestionadas por el administrador, 
            solicita el restablecimiento directo por WhatsApp.
        </p>

        <form onSubmit={handleWhatsApp}>
            <div className="simple-input-group">
                <label>Tu Usuario</label>
                <input 
                    type="text" 
                    placeholder="Ej: Juan@gym.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn-whatsapp-big">
                {/* Icono SVG de WhatsApp simple */}
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                </svg>
                SOLICITAR POR WHATSAPP
            </button>
        </form>

        <Link to="/login" className="back-link">
            ← Volver a Iniciar Sesión
        </Link>

      </div>
    </div>
  );
};