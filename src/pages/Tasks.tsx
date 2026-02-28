import { useState, useEffect } from 'react';
import { fetchTasks, updateTask, getProfile } from '../services/api';
import { type Task, type Category } from '../store/taskStore';
import { Button } from '../components/ui/Button';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import { Plus, Filter, Loader2, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { useAuthStore } from '../store/authStore';

export function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [activePomodoroTask, setActivePomodoroTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState<'Todas' | 'Activas' | 'Completadas'>('Todas');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'Todas'>('Todas');
    const setProfile = useAuthStore((state) => state.setProfile);

    // Función para cargar tareas desde Supabase
    const loadTasks = async () => {
        try {
            const data = await fetchTasks();
            setTasks(data || []);
        } catch (error) {
            console.error("Error al cargar tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Sync Profile Data from Supabase
        const loadProfile = async () => {
            try {
                const profileData = await getProfile();
                if (profileData) {
                    setProfile({ points: profileData.points, level: profileData.level });
                }
            } catch (error) {
                console.error("Error sincronizando perfil:", error);
            }
        };

        loadProfile();
        loadTasks();

        // OPCIONAL: Escuchar cambios en tiempo real (Puntos extra en la rúbrica)
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
                loadTasks();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'Activas' && task.completed) return false;
        if (filter === 'Completadas' && !task.completed) return false;
        if (categoryFilter !== 'Todas' && task.category !== categoryFilter) return false;
        return true;
    });

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handlePomodoroComplete = async () => {
        if (!activePomodoroTask) return;
        try {
            const currentSessions = activePomodoroTask.pomodoro_sessions || 0;
            // The XP logic is inside PomodoroTimer, so we just increment the sessions here.
            await updateTask(activePomodoroTask.id, {
                pomodoro_sessions: currentSessions + 1
            });
            await loadTasks();
        } catch (error) {
            console.error("Error updating pomodoro sessions:", error);
        } finally {
            setActivePomodoroTask(null);
        }
    };

    const categories: (Category | 'Todas')[] = ['Todas', 'Work', 'Personal', 'Study', 'Health', 'Other'];

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Mis Tareas
                </h1>
                <Button onClick={() => { setEditingTask(null); setIsFormOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Tarea
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="glass p-1 flex rounded-lg">
                    {['Todas', 'Activas', 'Completadas'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-white dark:bg-gray-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="glass p-1 flex items-center gap-2 px-3 rounded-lg overflow-x-auto">
                    <Filter className="w-4 h-4 text-gray-500 min-w-4" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 text-gray-700 dark:text-gray-300 outline-none"
                    >
                        {categories.map(c => <option key={c} value={c} className="dark:bg-gray-800">{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={() => handleEdit(task)}
                            onStartPomodoro={() => setActivePomodoroTask(task)}
                            onRefresh={loadTasks} // Para que TaskItem avise si algo cambió
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 glass rounded-xl">
                        No se encontraron tareas. ¡Crea una para comenzar!
                    </div>
                )}
            </div>

            {isFormOpen && (
                <TaskForm
                    task={editingTask || undefined}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingTask(null);
                        loadTasks(); // Recargar al cerrar el form
                    }}
                />
            )}

            {/* Pomodoro Timer Floating Widget */}
            {activePomodoroTask && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <div className="glass p-1 rounded-2xl relative shadow-2xl border border-indigo-500/20">
                        <button
                            onClick={() => setActivePomodoroTask(null)}
                            className="absolute -top-3 -right-3 p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full shadow-md border border-gray-200 dark:border-gray-700 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="px-4 pt-3 pb-1 text-center">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Enfocado en:</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] mx-auto">
                                {activePomodoroTask.title}
                            </p>
                        </div>
                        <PomodoroTimer
                            onComplete={handlePomodoroComplete}
                            onCancel={() => setActivePomodoroTask(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}