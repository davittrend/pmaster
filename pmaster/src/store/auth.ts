import create from 'zustand';
import { persist } from 'zustand/middleware';
import { PinterestAuth } from '../types/pinterest';

interface AuthState {
  auth: PinterestAuth | null;
  setAuth: (auth: PinterestAuth | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      setAuth: (auth) => set({ auth }),
    }),
    {
      name: 'pin-master-auth',
    }
  )
);