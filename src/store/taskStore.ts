import { create } from 'zustand';
import { useAuthStore } from './authStore';

export type Category = 'Work' | 'Personal' | 'Study' | 'Health' | 'Other';

export type Task = {
    id: string;
    title: string;
    description: string;
    category: Category;
    completed: boolean;
    created_at: string;
    completed_at?: string;
    pomodoro_sessions: number;
    user_id?: string;
    xp_awarded?: boolean;
};

type TaskState = {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (taskData: Omit<Task, 'id' | 'created_at' | 'pomodoro_sessions' | 'completed'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;
    addPomodoroSession: (id: string) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],

    setTasks: (tasks) => set({ tasks }),

    addTask: (taskData) => set((state) => ({
        tasks: [
            {
                ...taskData,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
                completed: false,
                pomodoro_sessions: 0,
            },
            ...state.tasks
        ]
    })),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === id ? { ...task, ...updates } : task)
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
    })),

    toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map((task) => {
            if (task.id === id) {
                const isNowCompleted = !task.completed;
                const auth = useAuthStore.getState();

                // LÓGICA ANTI-TRAMPA DEFINITIVA
                // Solo damos puntos si: se está completando AHORA Y nunca ha dado puntos antes
                if (isNowCompleted && !task.xp_awarded) {
                    auth.addPoints(10);
                }

                return {
                    ...task,
                    completed: isNowCompleted,
                    // Marcamos que ya dio puntos para siempre, aunque la desmarque después
                    xp_awarded: task.xp_awarded || isNowCompleted,
                    completed_at: isNowCompleted ? new Date().toISOString() : undefined
                };
            }
            return task;
        })
    })),

    addPomodoroSession: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, pomodoro_sessions: (task.pomodoro_sessions || 0) + 1 } : task
        )
    })),
}));