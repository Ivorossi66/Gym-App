import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import '../styles/Login.css';
<img src="/img/image.png" alt="Logo Gym" className="brand-logo" />

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // --- NUEVO ESTADO: Controla si el usuario está creando su contraseña ---
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegistering) {
        // === MODO REGISTRO (CREAR CONTRASEÑA) ===
        // Aquí el usuario pone su email (que el admin cargó) y elige su password.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Si tuvo éxito, le avisamos y lo mandamos al login normal
        alert("¡Cuenta activada con éxito! Ahora inicia sesión.");
        setIsRegistering(false); // Vuelve al modo login

      } else {
        // === MODO LOGIN (TU CÓDIGO ORIGINAL) ===
        // 1. Iniciar sesión
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        // 2. Consultar rol en 'profiles'
        const userId = authData.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profileError) {
          throw new Error("No se pudo obtener el perfil del usuario.");
        }

        // 3. Redirección
        if (profileData.role === 'admin') {
          navigate('/admin');
        } else if (profileData.role === 'client' || profileData.role === 'cliente') {
          navigate('/client');
        } else {
          setErrorMsg('Usuario sin rol asignado o rol desconocido.');
          await supabase.auth.signOut();
        }
      }

    } catch (error) {
      console.error("Error:", error.message);
      // Mensajes amigables
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg('El correo o la contraseña son incorrectos.');
      } else if (error.message.includes("User already registered")) {
        setErrorMsg('Este usuario ya tiene contraseña creada. Inicia sesión.');
      } else {
        setErrorMsg(error.message || 'Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      {/* --- COLUMNA IZQUIERDA (IMAGEN Y TEXTO) --- */}
      <div className="left-pane-banner">
        <div className="banner-content overlay-dark">
          <div className="brand-tagline">
            <img src={logoGym} alt="Logo Gym" className="brand-logo" />
            ENTRENAMIENTO PERSONAL MF
          </div>

          <h1 className="main-headline">
            {isRegistering 
              ? <>CREA TU ACCESO<br />Y EMPIEZA HOY.</>
              : <>TRANSFORMA TU ESFUERZO<br />EN RESULTADOS REALES.</>
            }
          </h1>
          <p className="sub-headline">
            {isRegistering
              ? "Usa el correo electrónico que te proporcionó tu entrenador para activar tu cuenta."
              : "Accede a tus rutinas personalizadas, sigue tu progreso y gestiona tus planes en un solo lugar."
            }
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
            <h2>{isRegistering ? 'ACTIVAR CUENTA' : 'BIENVENIDO'}</h2>
            <p className="login-subtitle">
              {isRegistering 
                ? 'Ingresa tu email y crea una contraseña nueva.' 
                : 'Ingresa tus credenciales para acceder a tu panel.'}
            </p>
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
                <label htmlFor="password">
                  {isRegistering ? 'Crear Contraseña' : 'Contraseña'}
                </label>
                {/* Solo mostramos "Olvidaste" en modo login */}
                {!isRegistering && (
                  <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
                )}
              </div>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="styled-input password-input"
                  placeholder={isRegistering ? "Crea una clave segura" : "******"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6} // Validación básica de longitud
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

            {/* Checkbox solo visible en login */}
            {!isRegistering && (
              <div 
                className="form-group checkbox-group" 
                onClick={() => setRememberMe(!rememberMe)}
                style={{ cursor: 'pointer' }}
              >
                {rememberMe ? <MdCheckBox className="cb-icon checked" /> : <MdCheckBoxOutlineBlank className="cb-icon" />}
                <span>Recordar mi dispositivo</span>
              </div>
            )}

            {errorMsg && <div className="error-banner" style={{ color: '#E5383B', marginBottom: '1rem', fontWeight: 'bold' }}>{errorMsg}</div>}

            <button type="submit" className="login-button-large" disabled={loading}>
              {loading ? 'CARGANDO...' : (isRegistering ? 'CREAR MI CONTRASEÑA' : 'INICIAR SESIÓN')}
            </button>
            
            {/* --- TOGGLE PARA CAMBIAR ENTRE LOGIN Y REGISTRO --- */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#B1A7A6' }}>
              {isRegistering ? (
                <>
                  ¿Ya tienes tu contraseña?{' '}
                  <span 
                    onClick={() => setIsRegistering(false)} 
                    style={{ color: '#BA181B', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    Inicia Sesión aquí
                  </span>
                </>
              ) : (
                <>
                  ¿Primera vez aquí?{' '}
                  <span 
                    onClick={() => setIsRegistering(true)} 
                    style={{ color: '#BA181B', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    Crea tu contraseña
                  </span>
                </>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};