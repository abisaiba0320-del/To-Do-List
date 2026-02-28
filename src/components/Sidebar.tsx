import { LayoutDashboard, CheckSquare, Settings, LogOut, Trophy } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { signOut } from '../services/api';
import { cn } from './ui/Button';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ className }: { className?: string }) {
    // Obtenemos el perfil (puntos y nivel) y la función para resetear al salir
    const profile = useAuthStore((state) => state.profile);
    const resetProfile = useAuthStore((state) => state.resetProfile);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            resetProfile(); // Limpiamos XP local al salir
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <aside className={cn("glass w-64 h-[calc(100vh-2rem)] sticky top-4 flex flex-col m-4 mt-0 shrink-0 hidden md:flex", className)}>
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    TaskFlow
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                            isActive
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* --- SECCIÓN DE GAMIFICACIÓN (Añadido para la rúbrica) --- */}
            <div className="mx-4 mb-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Trophy className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Level {profile.level}</p>
                        <p className="text-sm font-bold">{profile.points} XP</p>
                    </div>
                </div>
                {/* Barra de progreso visual hacia el siguiente nivel */}
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${profile.points % 100}%` }}
                    />
                </div>
            </div>
            {/* ------------------------------------------------------- */}

            <div className="p-4 border-t border-gray-200/20 dark:border-gray-700/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}