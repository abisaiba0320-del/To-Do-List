import { create } from 'zustand';

export type Category = 'Work' | 'Personal' | 'Study' | 'Health' | 'Other';

export type Task = {
    id: string;
    title: string;
    description: string;
    category: Category;
    completed: boolean;
    created_at: string;        // Cambiado de createdAt a created_at
    completed_at?: string;     // ¡IMPORTANTE! Agregado para el Dashboard
    pomodoro_sessions: number; // Cambiado de pomodoroSessions a pomodoro_sessions
    user_id?: string;          // Agregado para el filtro de seguridad
};

type TaskState = {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void; // Agregamos esto para llenar el store desde la DB
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'pomodoro_sessions' | 'completed'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;
    addPomodoroSession: (id: string) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [], // Empezamos vacío para cargar desde Supabase

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
                return {
                    ...task,
                    completed: isNowCompleted,
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