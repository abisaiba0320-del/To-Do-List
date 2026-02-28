import { LayoutDashboard, CheckSquare, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { cn } from './ui/Button';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ className }: { className?: string }) {
    const logout = useAuthStore((state) => state.logout);

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

            <div className="p-4 border-t border-gray-200/20 dark:border-gray-700/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
