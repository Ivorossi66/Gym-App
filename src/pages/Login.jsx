import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Para navegar
import { supabase } from '../supabase/client'; // Importamos tu cliente
import '../styles/Login.css'

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Para deshabilitar botón mientras carga
  const [errorMsg, setErrorMsg] = useState(null); // Para mostrar errores en pantalla

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Intentamos iniciar sesión con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Si el login es correcto, consultamos la tabla 'profiles' para saber el rol
      const userId = authData.user.id;
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single(); // .single() porque esperamos un solo resultado

      if (profileError) throw profileError;

      // 3. Redirigimos según el rol
      if (profileData.role === 'admin') {
        navigate('/admin');
      } else if (profileData.role === 'client') {
        navigate('/cliente');
      } else {
        // Por seguridad, si no tiene rol definido
        setErrorMsg('Usuario sin rol asignado. Contacte al gimnasio.');
      }

    } catch (error) {
      console.error("Error de login:", error.message);
      setErrorMsg('Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Bienvenido</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="ejemplo@gym.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span 
                className="password-icon" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Mensaje de error si falla */}
          {errorMsg && <p style={{color: 'red', marginBottom: '10px'}}>{errorMsg}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}