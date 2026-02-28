import { useState } from 'react';
import { type Task, type Category } from '../store/taskStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, Loader2 } from 'lucide-react';
import { createTask, updateTask } from '../services/api'; // Importamos las funciones reales

interface TaskFormProps {
    task?: Task;
    onClose: () => void;
}

const categories: Category[] = ['Work', 'Personal', 'Study', 'Health', 'Other'];

export function TaskForm({ task, onClose }: TaskFormProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [category, setCategory] = useState<Category>(task?.category || 'Work');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            if (task) {
                // Al editar, NO tocamos xp_awarded para no resetearlo
                await updateTask(task.id, { title, description, category });
            } else {
                // AL CREAR: Aseguramos que xp_awarded nazca en false
                await createTask({
                    title,
                    description,
                    category,
                    completed: false,
                    xp_awarded: false // <-- AÑADE ESTA LÍNEA
                });
            }
            onClose();
        } catch (error) {
            alert("Error al guardar la tarea");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    {task ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        required
                        autoFocus
                    />

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            className="flex w-full rounded-lg border border-gray-300/50 bg-white/50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100 transition-colors resize-none h-24"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            className="flex h-10 w-full rounded-lg border border-gray-300/50 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100 transition-colors"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                        >
                            {categories.map(c => (
                                <option key={c} value={c} className="dark:bg-gray-800">{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end mt-8">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {task ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}