import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    // Mientras se verifica la sesión, puedes mostrar un spinner o nada
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    }

    // Si no hay usuario, redirigir al Login 
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};