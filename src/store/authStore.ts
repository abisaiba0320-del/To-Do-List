import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { updateProfile } from '../services/api'; // Importa la nueva función

export type UserProfile = {
  points: number;
  level: number;
};

type AuthState = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  addPoints: (points: number) => Promise<void>;
  resetProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      profile: { points: 0, level: 1 },

      setProfile: (profile) => set({ profile }),

      addPoints: async (pointsToAdd) => {
        const currentProfile = get().profile;
        const newPoints = currentProfile.points + pointsToAdd;
        const newLevel = Math.floor(newPoints / 100) + 1;

        // Actualizamos localmente
        set({ profile: { points: newPoints, level: newLevel } });

        // Guardamos en Supabase
        try {
          await updateProfile(newPoints, newLevel);
        } catch (error) {
          console.error("Error sincronizando perfil:", error);
        }
      },

      resetProfile: async () => {
        set({ profile: { points: 0, level: 1 } });
        try {
          await updateProfile(0, 1);
        } catch (error) {
          console.error("Error al resetear perfil:", error);
        }
      },
    }),
    { name: 'taskflow-auth-storage' }
  )
);