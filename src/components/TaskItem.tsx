import { type Task, useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, Circle, Clock, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { PomodoroTimer } from './PomodoroTimer';
import { useState } from 'react';

const categoryColors: Record<string, string> = {
    Work: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    Personal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    Study: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    Health: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    Other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function TaskItem({ task, onEdit }: { task: Task; onEdit: () => void }) {
    const { toggleTaskCompletion, deleteTask, addPomodoroSession } = useTaskStore();
    const { addPoints } = useAuthStore();
    const [showTimer, setShowTimer] = useState(false);

    const handleToggle = () => {
        toggleTaskCompletion(task.id);
        if (!task.completed) {
            // Award points for completing a task
            addPoints(10);
        }
    };

    const handlePomodoroComplete = () => {
        addPomodoroSession(task.id);
        // Award more points for completing a focus session
        addPoints(25);
    };

    return (
        <div className={`glass p-5 rounded-xl transition-all duration-300 ${task.completed ? 'opacity-75 bg-gray-50/50 dark:bg-gray-900/50' : 'hover:shadow-lg hover:-translate-y-1'}`}>
            <div className="flex items-start gap-4">
                <button
                    onClick={handleToggle}
                    className="mt-1 flex-shrink-0 focus:outline-none"
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-500 transition-colors" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-lg truncate ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                        </h3>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${categoryColors[task.category]}`}>
                            {task.category}
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {task.pomodoroSessions} Sessions
                        </span>
                        <span>Created {formatDistanceToNow(parseISO(task.createdAt))} ago</span>
                    </div>

                    {/* Pomodoro Timer Toggle */}
                    {!task.completed && (
                        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            {showTimer ? (
                                <PomodoroTimer
                                    onComplete={handlePomodoroComplete}
                                    onCancel={() => setShowTimer(false)}
                                />
                            ) : (
                                <button
                                    onClick={() => setShowTimer(true)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-2"
                                >
                                    <Clock className="w-4 h-4" /> Start Focus Session
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
