import { CheckCircle2, Circle, Clock, Trash2, Play, Edit2 } from 'lucide-react';
import { type Task } from '../store/taskStore';
import { deleteTask, updateTask } from '../services/api';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore'; // Importamos el store de puntos

interface TaskItemProps {
    task: Task;
    onEdit: () => void;
    onStartPomodoro?: () => void;
    onRefresh: () => Promise<void>;
}

export function TaskItem({ task, onEdit, onStartPomodoro, onRefresh }: TaskItemProps) {
    const addPoints = useAuthStore((state) => state.addPoints);

    const handleToggle = async () => {
        try {
            const isNowCompleted = !task.completed;

            // --- LÓGICA ANTI-TRAMPA ---
            // Solo damos puntos si se marca como completada Y nunca ha dado puntos antes
            const shouldAwardPoints = isNowCompleted && !task.xp_awarded;

            // Preparamos los cambios para Supabase
            const updates = {
                completed: isNowCompleted,
                // Si ya era true, se queda en true. Si ganamos puntos ahora, pasa a true.
                xp_awarded: task.xp_awarded || isNowCompleted,
                // Actualizamos la fecha para el Dashboard
                completed_at: isNowCompleted ? new Date().toISOString() : null
            };

            // 1. Guardamos en la Base de Datos
            await updateTask(task.id, updates);

            // 2. Si corresponde, sumamos puntos en el Store de Zustand
            if (shouldAwardPoints) {
                addPoints(10);
            }

            // 3. Refrescamos la lista para que el componente tenga los datos reales de la DB
            await onRefresh();

        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    const handleDelete = async () => {
        if (confirm('¿Eliminar esta tarea definitivamente?')) {
            try {
                await deleteTask(task.id);
                await onRefresh();
            } catch (error) {
                console.error("Error al eliminar la tarea:", error);
            }
        }
    };

    return (
        <div className="glass p-4 group hover:border-indigo-500/50 transition-all">
            <div className="flex items-start justify-between gap-3">
                <button
                    onClick={handleToggle}
                    className="mt-1 transition-transform active:scale-90"
                >
                    {task.completed ?
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                        <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-500" />
                    }
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate transition-colors ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                        {task.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {task.category}
                        </span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {/* Corregido: pomodoro_sessions para coincidir con la DB */}
                            {task.pomodoro_sessions || 0} sessions
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onStartPomodoro}
                        className="h-8 w-8 p-0"
                        title="Focus with Pomodoro"
                    >
                        <Play className="w-4 h-4 text-indigo-400" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-500"
                        title="Edit Task"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}