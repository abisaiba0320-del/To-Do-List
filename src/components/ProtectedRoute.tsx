import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    // Mientras Supabase verifica si hay una sesión activa...
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                        Verificando acceso...
                    </p>
                </div>
            </div>
        );
    }

    // Si la carga terminó y no hay usuario, mandamos al Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si hay usuario, permitimos el paso a la ruta protegida
    return <>{children}</>;
};