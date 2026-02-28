import { supabase } from './supabaseClient';

export const fetchTasks = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// 1. Actualiza createTask para aceptar xp_awarded
export const createTask = async (task: {
    title: string;
    description?: string;
    category?: string;
    completed?: boolean;
    xp_awarded?: boolean; // <-- Añadido
}) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No hay sesión de usuario activa");

    const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: user.id }])
        .select();

    if (error) throw error;
    return data[0];
};

// 2. Actualiza updateTask para permitir guardar xp_awarded
export const updateTask = async (id: string, updates: Partial<{
    title: string;
    description: string;
    category: string;
    completed: boolean;
    pomodoro_sessions: number;
    xp_awarded: boolean; // <-- Añadido
}>) => {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data ? data[0] : null;
};

export const deleteTask = async (id: string) => {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Sincronización en tiempo real
export const subscribeToTasks = (callback: () => void) => {
    return supabase
        .channel('tasks-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
        .subscribe();
};

// --- Autenticación ---

export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};