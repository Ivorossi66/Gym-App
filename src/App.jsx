import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login }  from "./pages/Login";
import { AdminPage } from "./pages/AdminPage";
import { ClientPage } from "./pages/ClientPage";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ForgotPassword } from "./pages/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rutas Protegidas ADMIN */}
          <Route element={<ProtectedRoute roleRequired="admin" />}>
             <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Rutas Protegidas CLIENTE */}
          {/* Nota: Asegúrate que en tu BD el rol sea 'cliente' (o 'client') y pon el mismo texto aquí */}
          <Route element={<ProtectedRoute roleRequired="cliente" />}>
             <Route path="/client" element={<ClientPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App