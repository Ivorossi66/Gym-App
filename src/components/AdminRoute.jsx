import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/client";

export const AdminRoute = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        console.log("🔍 Verificando usuario:", user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        console.log("📄 Data recibida de Supabase:", data);
        console.log("❌ Errores (si hay):", error);

        if (data?.role === 'admin') {
            console.log("✅ Es Admin. Acceso concedido.");
            setIsAdmin(true);
        } else {
            console.log("⛔ No es Admin o el campo está vacío.");
            setIsAdmin(false);
        }
      }
      setLoadingRole(false);
    };

    checkRole();
  }, [user]);

  if (loadingRole) return <h1>Verificando permisos...</h1>;

  return isAdmin ? <Outlet /> : <Navigate to="/client" replace />;
};