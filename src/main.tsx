import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Importamos el contexto real
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import './index.css';

// Componente de Ruta Protegida Corregido
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // Usamos el usuario real de Supabase

  // Mientras verifica si hay sesión, mostramos un cargando para evitar saltos
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no hay usuario, mandamos al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Envolvemos todo en AuthProvider para que useAuth funcione */}
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route
              path="settings"
              element={
                <div className="glass p-8 text-center text-gray-500 rounded-xl">
                  ⚙️ Settings Dashboard Placeholder
                </div>
              }
            />
          </Route>

          {/* Redirección por defecto si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);