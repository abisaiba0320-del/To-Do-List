import { create } from 'zustand';

export type User = {
    id: string;
    email: string;
    points: number;
    level: number;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    addPoints: (points: number) => void;
    // Supabase Async handlers (ready for real implementation)
    // supabaseLogin: (email: string, password: string) => Promise<void>;
    // supabaseRegister: (email: string, password: string) => Promise<void>;
    // supabaseLogout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: { id: '1', email: 'demo@user.com', points: 150, level: 2 }, // Initial mock user
    isAuthenticated: true,
    login: (email) => set({ user: { id: Date.now().toString(), email, points: 0, level: 1 }, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    addPoints: (points) => set((state) => {
        if (!state.user) return state;
        const newPoints = state.user.points + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        return {
            user: { ...state.user, points: newPoints, level: newLevel }
        };
    }),

    /*
    // --- Supabase Async Implementation Example ---
    supabaseLogin: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Fetch user profile stats/points
        set({ user: { id: data.user.id, email: data.user.email!, points: 0, level: 1 }, isAuthenticated: true });
      } catch (err) {
        console.error("Login failed:", err);
        throw err;
      }
    },
    supabaseRegister: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Insert new profile record in DB
        set({ user: { id: data.user!.id, email: data.user!.email!, points: 0, level: 1 }, isAuthenticated: true });
      } catch (err) {
        console.error("Registration failed:", err);
        throw err;
      }
    },
    supabaseLogout: async () => {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    }
    */
}));
