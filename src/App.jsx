import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login }  from "./pages/Login";
import { AdminPage } from "./pages/AdminPage";
import { ClientPage } from "./pages/ClientPage";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute"; // <--- Importamos el nuevo
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* NIVEL 1: Rutas para usuarios logueados (Cualquiera) */}
        <Route element={<ProtectedRoute />}>
           
           {/* El panel de cliente es para cualquier logueado */}
           <Route path="/client" element={<ClientPage />} />

           {/* NIVEL 2: Rutas SOLO para Admins */}
           {/* Anidamos AdminRoute DENTRO de ProtectedRoute */}
           <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
           </Route>

        </Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
