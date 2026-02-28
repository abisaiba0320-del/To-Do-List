import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Verificamos preferencia guardada o del sistema
        const theme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (theme === 'dark' || (!theme && systemTheme)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        // Añadimos una transición temporal al cambiar para que sea suave
        document.documentElement.classList.add('transition-colors', 'duration-500');

        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }

        // Limpiamos las clases de transición después de que termine para no afectar otros cambios
        setTimeout(() => {
            document.documentElement.classList.remove('transition-colors', 'duration-500');
        }, 500);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full p-0 hover:bg-indigo-500/10 transition-transform active:scale-90"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 animate-in zoom-in duration-300" />
            ) : (
                <Moon className="w-5 h-5 text-indigo-600 animate-in zoom-in duration-300" />
            )}
        </Button>
    );
}