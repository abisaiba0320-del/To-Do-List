import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfile = {
  points: number;
  level: number;
};

type AuthState = {
  profile: UserProfile;
  addPoints: (points: number) => void;
  resetProfile: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: { points: 0, level: 1 },

      addPoints: (points) => set((state) => {
        const newPoints = state.profile.points + points;
        // Lógica: Cada 100 puntos subes de nivel
        const newLevel = Math.floor(newPoints / 100) + 1;

        // Opcional: Podrías disparar una notificación de "Level Up" aquí
        return {
          profile: { points: newPoints, level: newLevel }
        };
      }),

      resetProfile: () => set({ profile: { points: 0, level: 1 } }),
    }),
    {
      name: 'taskflow-auth-storage', // Nombre un poco más específico para el localStorage
    }
  )
);