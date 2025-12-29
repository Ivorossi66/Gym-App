import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client'; // Asegúrate que esta ruta sea correcta
import '../styles/Login.css';
import logoGym from '../assets/img/image.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Iniciar sesión en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Consultar la tabla 'profiles' para saber si es admin o cliente
      // NOTA: Esto asume que tienes una tabla 'profiles' vinculada al usuario
      const userId = authData.user.id;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error("No se pudo obtener el perfil del usuario.");
      }

      // 3. Redirección basada en el rol (Coincidiendo con App.jsx)
      if (profileData.role === 'admin') {
        navigate('/admin');
      } else if (profileData.role === 'client') {
        navigate('/client');
      } else {
        setErrorMsg('Usuario sin rol asignado o rol desconocido.');
        // Opcional: Desloguear si no tiene rol válido
        await supabase.auth.signOut();
      }

    } catch (error) {
      console.error("Error de login:", error.message);
      // Mensaje amigable para el usuario
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg('El correo o la contraseña son incorrectos.');
      } else {
        setErrorMsg(error.message || 'Ocurrió un error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      {/* --- COLUMNA IZQUIERDA (IMAGEN Y TEXTO GRANDE) --- */}
      <div className="left-pane-banner">
        <div className="banner-content overlay-dark">
          <div className="brand-tagline">
            {/* Asegúrate que la imagen exista en esa ruta */}
            <img src={logoGym} alt="Logo Gym" className="brand-logo" />
            ENTRENAMIENTO PERSONAL MF
          </div>

          <h1 className="main-headline">
            TRANSFORMA TU ESFUERZO<br />EN RESULTADOS REALES.
          </h1>
          <p className="sub-headline">
            Accede a tus rutinas personalizadas, sigue tu progreso y gestiona tus planes en un solo lugar.
          </p>
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO) --- */}
      <div className="right-pane-form">
        <div className="form-wrapper">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Volver al inicio
          </Link>

          <div className="login-header">
            <h2>BIENVENIDO</h2>
            <p className="login-subtitle">Ingresa tus credenciales para acceder a tu panel.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className="styled-input"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-split">
                <label htmlFor="password">Contraseña</label>
                {/* Esta ruta '/forgot-password' aún no existe en App.jsx, la dejamos pendiente */}
                <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
              </div>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="styled-input password-input"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }} 
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Checkbox "Recordar" (Supabase persiste sesión por defecto, esto es visual por ahora) */}
            <div 
              className="form-group checkbox-group" 
              onClick={() => setRememberMe(!rememberMe)}
              style={{ cursor: 'pointer' }}
            >
              {rememberMe ? <MdCheckBox className="cb-icon checked" /> : <MdCheckBoxOutlineBlank className="cb-icon" />}
              <span>Recordar mi dispositivo</span>
            </div>

            {/* Mensaje de error */}
            {errorMsg && <div className="error-banner" style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}

            <button type="submit" className="login-button-large" disabled={loading}>
              {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};