import { create } from 'zustand';

export type Category = 'Work' | 'Personal' | 'Study' | 'Health' | 'Other';

export type Task = {
    id: string;
    title: string;
    description: string;
    category: Category;
    completed: boolean;
    createdAt: string;
    pomodoroSessions: number; // number of 25m sessions completed
};

type TaskState = {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'pomodoroSessions' | 'completed'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;
    addPomodoroSession: (id: string) => void;
    // Supabase Async handlers
    // fetchTasks: () => Promise<void>;
    // createTaskInDb: (task: Omit<Task, ...>) => Promise<void>;
    // updateTaskInDb: (id: string, updates: Partial<Task>) => Promise<void>;
    // deleteTaskInDb: (id: string) => Promise<void>;
};

// Dummy initial data
const initialTasks: Task[] = [
    { id: '1', title: 'Complete React project setup', description: 'Initialize Vite, install Tailwind and Zustand', category: 'Work', completed: true, createdAt: new Date().toISOString(), pomodoroSessions: 2 },
    { id: '2', title: 'Plan database schema', description: 'Draft the Supabase tables for Users and Tasks', category: 'Work', completed: false, createdAt: new Date().toISOString(), pomodoroSessions: 0 },
    { id: '3', title: 'Workout', description: '30 mins of cardio', category: 'Health', completed: false, createdAt: new Date().toISOString(), pomodoroSessions: 0 },
];

export const useTaskStore = create<TaskState>((set) => ({
    tasks: initialTasks,

    addTask: (taskData) => set((state) => ({
        tasks: [
            {
                ...taskData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                completed: false,
                pomodoroSessions: 0,
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
        tasks: state.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
    })),

    addPomodoroSession: (id) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === id ? { ...task, pomodoroSessions: task.pomodoroSessions + 1 } : task)
    })),

    /*
    // --- Supabase Async Implementation Example ---
    fetchTasks: async () => {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (!error && data) set({ tasks: data });
    },
    createTaskInDb: async (taskData) => {
      const { data, error } = await supabase.from('tasks').insert([taskData]).select();
      if (!error && data) set((state) => ({ tasks: [data[0], ...state.tasks] }));
    },
    updateTaskInDb: async (id, updates) => {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (!error) set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      }));
    },
    deleteTaskInDb: async (id) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (!error) set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    }
    */
}));
