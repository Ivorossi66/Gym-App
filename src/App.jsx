import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login }  from "./pages/Login";
import { AdminPage } from "./pages/AdminPage";
import { ClientPage } from "./pages/ClientPage";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rutas Públicas (Cualquiera puede entrar) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas (Solo si hay usuario logueado) */}
        <Route element={<ProtectedRoute />}>
           <Route path="/admin" element={<AdminPage />} />
           <Route path="/client" element={<ClientPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App