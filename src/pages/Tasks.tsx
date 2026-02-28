import { useState, useEffect } from 'react';
import { fetchTasks } from '../services/api';
import { type Task, type Category } from '../store/taskStore';
import { Button } from '../components/ui/Button';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

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
        if (filter === 'Active' && task.completed) return false;
        if (filter === 'Completed' && !task.completed) return false;
        if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;
        return true;
    });

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const categories: (Category | 'All')[] = ['All', 'Work', 'Personal', 'Study', 'Health', 'Other'];

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
                    My Tasks
                </h1>
                <Button onClick={() => { setEditingTask(null); setIsFormOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Task
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="glass p-1 flex rounded-lg">
                    {['All', 'Active', 'Completed'].map(f => (
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
                            onRefresh={loadTasks} // Para que TaskItem avise si algo cambió
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 glass rounded-xl">
                        No tasks found. Create one to get started!
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
        </div>
    );
}