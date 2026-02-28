import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Mejora: Cerrar el sidebar automáticamente cuando cambiamos de ruta (en móviles)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    return (
        <div className="flex min-h-screen pt-4 pb-4 bg-gray-50/50 dark:bg-gray-950/50 transition-colors duration-500">
            {/* Mobile Sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar con transiciones suaves */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar className="flex" />
            </div>

            <main className="flex-1 flex flex-col min-w-0 md:mr-4">
                {/* Header que controla la apertura del menú */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="px-4 md:px-0 flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto pb-12">
                        {/* Aquí es donde se renderizan las páginas (Dashboard, Tasks, etc.) */}
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}