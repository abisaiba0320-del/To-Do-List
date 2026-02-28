import { Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../contexts/AuthContext'; // Importamos el usuario real
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
    // Obtenemos el progreso (XP) del store de Zustand
    const profile = useAuthStore((state) => state.profile);
    // Obtenemos el email del contexto de Supabase
    const { user } = useAuth();

    return (
        <header className="glass sticky top-4 z-30 h-16 flex items-center justify-between px-6 mb-8 mt-4 mx-4 md:mx-0 md:mr-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex items-center gap-6">
                {/* Barra de progreso de Gamificación */}
                <div className="hidden sm:flex items-center gap-4 bg-white/20 dark:bg-black/20 px-4 py-1.5 rounded-full border border-white/20">
                    <div className="text-sm font-medium">Lvl {profile.level}</div>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${(profile.points % 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{profile.points} XP</div>
                </div>

                <ThemeToggle />

                {/* Avatar con la inicial del email real de Supabase */}
                {user && (
                    <div className="flex items-center gap-3">
                        <span className="hidden lg:block text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.email}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}