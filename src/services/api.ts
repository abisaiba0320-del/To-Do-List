import { supabase } from './supabaseClient';

export const fetchTasks = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const createTask = async (task: { title: string; description?: string; category?: string }) => {
    const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select();

    if (error) throw error;
    return data[0];
};

// Suscripción en Tiempo Real (Requisito indispensable del proyecto)
export const subscribeToTasks = (callback: () => void) => {
    return supabase
        .channel('custom-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
        .subscribe();
};

// En src/services/api.ts añade estas funciones:

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