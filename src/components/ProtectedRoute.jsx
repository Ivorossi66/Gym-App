import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/client"; // Asegurate que la ruta a tu cliente sea correcta

export const ProtectedRoute = ({ roleRequired }) => {
  const { user, loading } = useAuth();
  const [isAllowed, setIsAllowed] = useState(null); // null = "verificando"

  useEffect(() => {
    const checkUserRole = async () => {
      // 1. Si auth todavía carga o no hay usuario, esperamos o salimos
      if (loading || !user) {
        if (!loading && !user) setIsAllowed(false);
        return;
      }

      try {
        // 2. Buscamos el rol en la tabla profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        // 3. Comparamos el rol de la BD con el que pide la ruta
        if (data && data.role === roleRequired) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Error verificando rol:", error);
        setIsAllowed(false);
      }
    };

    checkUserRole();
  }, [user, loading, roleRequired]);

  // Mientras Auth carga o estamos consultando a la BD
  if (loading || isAllowed === null) {
    return <div style={{color:'white', padding:'2rem'}}>Verificando permisos...</div>;
  }

  // Si no hay usuario, al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario pero no tiene el rol correcto (ej: Cliente queriendo entrar a Admin), al home
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  // Si todo ok, mostramos la página
  return <Outlet />;
};